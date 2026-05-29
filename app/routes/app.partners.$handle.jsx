import { useState, useEffect, useRef } from "react";
import {
  useActionData,
  useLoaderData,
  useSubmit,
  useParams,
} from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { RecentPartnerTable } from "../components/partners/RecentPartnerTable";

import {
  getPartner,
  getPartners,
  savePartner,
  archivePartner,
  validatePartner,
} from "../models/partners.server";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const partners = await getPartners(admin.graphql, session.shop);

  if (params.handle === "new") {
    return {
      partner: {
        profileImage: "",
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        notes: "",
        bio: "",

        stripeAccountId: "",
        stripeOnboardingComplete: false,
        stripePayoutsEnabled: false,
        stripeChargesEnabled: false,
        status: "not_connected",
      },

      partners: partners,
      shop: session.shop,
    };
  }

  const partner = await getPartner(params.handle, admin.graphql, session.shop);
  return { partner: partner, shop: session.shop, partners: partners };
  console.log("params.handle:", params.handle);
  console.log("partner from getPartner:", partner);
}

export async function action({ request, params }) {
  const { admin, redirect, session } = await authenticate.admin(request);
  const data = Object.fromEntries(await request.formData());

  if (data.action === "archive") {
    await archivePartner(data.id, admin.graphql, session.shop);
    return redirect("/app");
  }

  const errors = validatePartner(data);

  if (errors) {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const handle =
    params.handle === "new"
      ? generateHandle(data.businessName || data.fullName)
      : params.handle;

  const metaobject = await savePartner(handle, data, admin.graphql);

  return redirect(`/app/partners/${metaobject.handle}`);
}

export default function createPartnerForm() {
  const { handle } = useParams();
  const loaderData = useLoaderData();
  console.log("loaderData:", loaderData);

  const { partner, partners, shop } = loaderData;

  console.log("partner:", partner);
  const [initialFormState, setInitialFormState] = useState(partner);
  const [formState, setFormState] = useState(partner);
  const errors = useActionData()?.errors || {};
  const isDirty =
    JSON.stringify(formState) !== JSON.stringify(initialFormState);

  const submit = useSubmit();

  function handleSave(e) {
    e.preventDefault();
    const data = {
      fullName: formState.fullName,
      businessName: formState.businessName || "",
      email: formState.email || "",
      phone: formState.phone || "",
      notes: formState.notes || "",
      profileImage: formState.profileImage || null,
      bio: formState.bio || "",
      type: formState.type || "",
    };

    submit(data, { method: "post" });
  }

  const saveBarRef = useRef(null);

  function handleReset() {
    setFormState(initialFormState);
    saveBarRef.current?.hide();
  }

  function handleArchive(e) {
    e.preventDefault();

    submit(
      {
        action: "archive",
        id: initialFormState.id,
      },
      {
        method: "post",
      },
    );
  }

  useEffect(() => {
    const saveBar = saveBarRef.current;
    if (!saveBar) return;

    if (isDirty) {
      saveBar.show();
    } else {
      saveBar.hide();
    }
  }, [isDirty]);

  useEffect(() => {
    setInitialFormState(partner);
    setFormState(partner);
  }, [handle, partner]);

  return (
    <>
      <ui-save-bar ref={saveBarRef} id="qr-code-form">
        <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleReset}></button>
      </ui-save-bar>
      <form onSubmit={handleSave} onReset={handleReset}>
        <s-page heading={initialFormState.fullName || "Create a new Partner"}>
          <s-link href="/app" slot="breadcrumb-actions">
            Partners
          </s-link>
          {initialFormState.handle && (
            <s-button slot="secondary-actions" onClick={handleArchive}>
              Archive
            </s-button>
          )}
          <s-section heading="Partner Information">
            <s-stack gap="base">
              <s-text-field
                label="Name"
                details="Enter the full name"
                error={errors.fullName}
                autoComplete="off"
                name="Full Name"
                value={formState.fullName}
                onInput={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
              ></s-text-field>
            </s-stack>
          </s-section>
          <s-box slot="aside">
            <RecentPartnerTable partners={partners}></RecentPartnerTable>
          </s-box>
        </s-page>
      </form>
    </>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
