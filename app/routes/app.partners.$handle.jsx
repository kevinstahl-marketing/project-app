// app/routes/app.partners.$handle.jsx

import { useLoaderData } from "react-router";

export async function loader({ params }) {
  const partner = {
    id: "1",
    handle: params.handle,
    full_name: "La Concheria Cafe",
    email: "contact@laconcheria.com",
    status: "active",
    stripe_status: "verified",
    profile_image: null,
    created_at: "2026-05-27",
  };

  return { partner };
}

export default function PartnerProfilePage() {
  const { partner } = useLoaderData();

  return (
    <s-page heading={partner.full_name}>
      <s-section heading="Partner Information">
        <s-stack gap="base">
          <s-text>
            <strong>Handle:</strong> {partner.handle}
          </s-text>

          <s-text>
            <strong>Email:</strong> {partner.email}
          </s-text>

          <s-text>
            <strong>Status:</strong> {partner.status}
          </s-text>

          <s-text>
            <strong>Stripe:</strong> {partner.stripe_status}
          </s-text>
        </s-stack>
      </s-section>
    </s-page>
  );
}