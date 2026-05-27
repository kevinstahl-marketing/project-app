import { authenticate } from "../shopify.server";

const METAOBJECT_TYPE = "$app:partner";

export async function getPartner(handle, graphql, shop) {}

export async function getPartners(graphql, shop) {
  const response = await graphql(
    `
      query GetPartners($type: String!) {
        metaobjects(
          type: $type
          first: 50
          sortKey: "updated_at"
          reverse: true
        ) {
          nodes {
            id
            handle
            updatedAt
            full_name: field(key: "full_name") {
              jsonValue
            }
            email: field(key: "email") {
              jsonValue
            }
            status: field(key: "status") {
              jsonValue
            }
            active: field(key: "active") {
              jsonValue
            }

            profileImage: field(key: "profile_image") {
              reference {
                ... on MediaImage {
                  image {
                    url
                    altText
                  }
                }
              }
            }

            stripeAccountId: field(key: "stripe_account_id") {
              jsonValue
            }
            stripeOnboardingComplete: field(key: "stripe_onboarding_complete") {
              jsonValue
            }
            stripeChargesEnabled: field(key: "stripe_charges_enabled") {
              jsonValue
            }
            stripePayoutsEnabled: field(key: "stripe_payouts_enabled") {
              jsonValue
            }
            notes: field(key: "notes") {
              jsonValue
            }
          }
        }
      }
    `,

    {
      variables: { type: METAOBJECT_TYPE },
    },
  );

  const { data } = await response.json();
  const metaobjects = data?.metaobjects?.nodes ?? [];

  return Promise.all(metaobjects.map((mo) => transformPartnerMetaobject(mo)));

}

export async function savePartner(data, graphql) {
  const response = await graphql(
    `
      mutation UpsertPartner(
        $handle: MetaobjectHandleInput!
        $metaobject: MetaobjectUpsertInput!
      ) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `,

    {
      variables: {
        handle: {
          type: METAOBJECT_TYPE,
          handle: data.handle,
        },
        metaobject: {
          fields: [
            { key: "full_name", value: data.full_name },
            { key: "email", value: data.email },
            { key: "active", value: data.active },
            { key: "notes", value: data.notes },
            { key: "type", value: data.type },
          ],
        },
      },
    },
  );

  const json = await response.json();
  const errors = json.data.metafieldsSet.userErrors;

  if (errors.length) {
    throw new Error(errors[0].message);
  }

  return json.data.metafieldsSet.metafields[0];
}

export function generateHandle(title) {
  return `${slugify(title)}-${Date.now().toString(36)}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


async function transformPartnerMetaobject(metaobject) {
  return {
    id: metaobject.id,
    handle: metaobject.handle,
    updated_at: metaobject.updated_at,

    full_name: metaobject.full_name?.jsonValue ?? "",
    email: metaobject.email?.jsonValue ?? "",
    phone: metaobject.phone?.jsonValue ?? "",
    status: metaobject.status?.jsonValue ?? "pending",
    active: metaobject.active?.jsonValue ?? false,

    stripeAccountId: metaobject.stripeAccountId?.jsonValue ?? null,
    stripeOnboardingComplete:
      metaobject.stripeOnboardingComplete?.jsonValue ?? false,
    stripeChargesEnabled: metaobject.stripeChargesEnabled?.jsonValue ?? false,
    stripePayoutsEnabled: metaobject.stripePayoutsEnabled?.jsonValue ?? false,

    notes: metaobject.notes?.jsonValue ?? "",
  };
};