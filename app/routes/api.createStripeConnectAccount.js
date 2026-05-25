import { authenticate } from "../shopify.server";
import { stripe } from "../services/stripe.server";

export async function loader({ request }) {
  const { cors } = await authenticate.admin(request);
  // 1. Manually catch the browser's OPTIONS preflight request
  if (request.method === "OPTIONS") {
    return cors(request, json({ status: 200 }));
  }

  // 2. Your actual logic
  const data = { message: "Hello from backend" };
  
  // 3. Wrap your final response in the cors() wrapper
  return cors(request, json(data));
}

export async function action({ request }) {
  const { cors, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const appUrl = url.origin;
  const refreshUrl = `${appUrl}/app`;
  const returnUrl = `${appUrl}/app`;
  const body = await request.json();

  try {
    const account = await stripe.v2.core.accounts.create({
      display_name: body.full_name,
      contact_email: body.email,
      configuration: {
        recipient: {
          capabilities: {
            stripe_balance: {
              stripe_transfers: {
                requested: true,
              },
            },
          },
        },
      },
      defaults: {
        responsibilities: {
          losses_collector: "application",
          fees_collector: "application",
        },
      },
      dashboard: "express",
      include: [
        "configuration.merchant",
        "configuration.recipient",
        "identity",
        "defaults",
        "configuration.customer",
      ],
      identity: {
        country: "us",
      },
    });

    const accountLink = await stripe.v2.core.accountLinks.create({
      account: account.id,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["recipient"],
          refresh_url: refreshUrl,
          return_url: returnUrl,
        },
      },
    });

    return cors(
      Response.json({
        accountId: account.id,
        onboardingUrl: accountLink.url,
      }),
    );
  } catch (err) {
    console.error(err);
    return cors(Response.json({ error: err.message }, { status: 500 }));
  }
}
