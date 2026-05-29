import { useState, useEffect, useRef } from "react";
import {
  useActionData,
  useLoaderData,
  useSubmit,
  useParams,
} from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { getPartners } from "../models/partners.server";

import {
  getQRCode,
  validateQRCode,
  saveQRCode,
  deleteQRCode,
  generateHandle,
} from "../models/partners.server";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);

  if (params.handle === "new") {
    return {
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
    };
    const partner = await getPartners(
      params.handle,
      admin.graphql,
      session.shop,
    );

    return { ...partner, shop: session.shop };
  }

  const partner = await getPartner(params.handle, admin.graphql, session.shop);
  return { ...partner, shop: session.shop };
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

  const handle = params.handle === "new" ? generateHandle(data.fullName) : params.handle;

  const metaobject = await saveQRCode(handle, data, admin.graphql);

  return redirect(`/app/qrcodes/${metaobject.handle}`);
}

export default function createPartnerForm() {
  const { handle } = useParams();
  const loaderData = useLoaderData();
  const partner = loaderData;

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
    setInitialFormState(qrCode);
    setFormState(qrCode);
  }, [id, qrCode]);

  return (
    <>
      <ui-save-bar ref={saveBarRef} id="qr-code-form">
        <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleReset}></button>
      </ui-save-bar>
      <form onSubmit={handleSave} onReset={handleReset}>
        <s-page heading={initialFormState.title || "Create QR code"}>
          <s-link href="/app" slot="breadcrumb-actions">
            QR Codes
          </s-link>
          {initialFormState.handle && (
            <s-button slot="secondary-actions" onClick={handleDelete}>
              Delete
            </s-button>
          )}
          <s-section heading="QR Code information">
            <s-stack gap="base">
              <s-text-field
                label="Title"
                details="Only store staff can see this title"
                error={errors.title}
                autoComplete="off"
                name="title"
                value={formState.title}
                onInput={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
              ></s-text-field>
              <s-stack gap="500" align="space-between" blockAlign="start">
                <s-select
                  name="destination"
                  label="Scan destination"
                  value={formState.destination}
                  onChange={(e) =>
                    setFormState({ ...formState, destination: e.target.value })
                  }
                >
                  <s-option
                    value="product"
                    selected={formState.destination === "product"}
                  >
                    Link to product page
                  </s-option>
                  <s-option
                    value="cart"
                    selected={formState.destination === "cart"}
                  >
                    Link to checkout page with product in the cart
                  </s-option>
                </s-select>
                {initialFormState.destinationUrl ? (
                  <s-link
                    variant="plain"
                    href={initialFormState.destinationUrl}
                    target="_blank"
                  >
                    Go to destination URL
                  </s-link>
                ) : null}
              </s-stack>
              <s-stack gap="small-400">
                <s-stack
                  direction="inline"
                  gap="small-100"
                  justifyContent="space-between"
                >
                  <s-text color="subdued">Product</s-text>
                  {formState.productId ? (
                    <s-link
                      onClick={removeProduct}
                      accessibilityLabel="Remove the product from this QR Code"
                      variant="tertiary"
                      tone="neutral"
                    >
                      Clear
                    </s-link>
                  ) : null}
                </s-stack>
                {formState.productId ? (
                  <s-stack
                    direction="inline"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <s-stack
                      direction="inline"
                      gap="small-100"
                      alignItems="center"
                    >
                      <s-clickable
                        href={productUrl}
                        target="_blank"
                        accessibilityLabel={`Go to the product page for ${formState.productTitle}`}
                        borderRadius="base"
                      >
                        <s-box
                          padding="small-200"
                          border="base"
                          borderRadius="base"
                          background="subdued"
                          inlineSize="38px"
                          blockSize="38px"
                        >
                          {formState.productImage ? (
                            <s-image src={formState.productImage}></s-image>
                          ) : (
                            <s-icon size="large" type="product" />
                          )}
                        </s-box>
                      </s-clickable>
                      <s-link href={productUrl} target="_blank">
                        {formState.productTitle}
                      </s-link>
                    </s-stack>
                    <s-stack direction="inline" gap="small">
                      <s-button
                        onClick={selectProduct}
                        accessibilityLabel="Change the product the QR code should be for"
                      >
                        Change
                      </s-button>
                    </s-stack>
                  </s-stack>
                ) : (
                  <s-button
                    onClick={selectProduct}
                    accessibilityLabel="Select the product the QR code should be for"
                  >
                    Select product
                  </s-button>
                )}
                {errors.productId ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <s-icon type="alert-circle" tone="critical" size="small" />
                    <s-text tone="critical" variant="bodySm">
                      {errors.productId}
                    </s-text>
                  </div>
                ) : null}
              </s-stack>
            </s-stack>
          </s-section>
          <s-box slot="aside">
            <s-section heading="Preview">
              <s-stack gap="base">
                <s-box
                  padding="base"
                  border="none"
                  borderRadius="base"
                  background="subdued"
                >
                  {initialFormState.image ? (
                    <s-image
                      aspectRatio="1/0.8"
                      src={initialFormState.image}
                      alt="The QR Code for the current form"
                    />
                  ) : (
                    <s-stack
                      direction="inline"
                      alignItems="center"
                      justifyContent="center"
                      blockSize="198px"
                    >
                      <s-text color="subdued">
                        See a preview once you save
                      </s-text>
                    </s-stack>
                  )}
                </s-box>
                <s-stack
                  gap="small"
                  direction="inline"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <s-button
                    disabled={!initialFormState.handle}
                    href={`/qrcodes/${initialFormState.handle}?shop=${loaderData.shop}`}
                    target="_blank"
                  >
                    Go to public URL
                  </s-button>
                  <s-button
                    disabled={!initialFormState?.image}
                    href={initialFormState?.image}
                    download
                    variant="primary"
                  >
                    Download
                  </s-button>
                </s-stack>
              </s-stack>
            </s-section>
          </s-box>
        </s-page>
      </form>
    </>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
