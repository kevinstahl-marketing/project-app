import { render } from "preact";
import { useEffect, useState, useCallback } from "preact/hooks";
import { savePartner, generateHandle } from "./utils";

export default async () => {
  render(<Extension />, document.body);
};
function validateForm({ full_name, email }) {
  return {
    isValid: Boolean(full_name) && Boolean(email),
    errors: {
      full_name: !full_name,
      email: !email,
    },
  };
}

function Extension() {
  const {
    i18n,
    close,
    intents,
    data,
    extension: { target },
  } = shopify;

  const [partner, setPartner] = useState({
    full_name: "",
    email: "",
    active: "true",
    partner_type: "",
    notes: "",
    type: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [editing, setIsEditing] = useState(false);

  const onSubmit = useCallback(async () => {
    const { isValid, errors } = validateForm(partner);
    const handle = generateHandle(partner.full_name);
    setFormErrors(errors);
    console.log(errors);
    if (isValid) {
      console.log(handle);
      await savePartner(partner, handle);
      close();
    }
  });

  return (
    <s-admin-action heading="Create partner">
      <s-button slot="primary-action" onClick={onSubmit}>
        Save
      </s-button>
      <s-stack gap="base">
        <s-text-field
          label="Partner name"
          name="full_name"
          placeholder="Jane Doe"
          value={partner.full_name}
          onChange={(event) =>
            setPartner((prev) => ({
              ...prev,
              full_name: event.target.value,
            }))
          }
        />

        <s-text-field
          label="Email"
          name="email"
          type="email"
          value={partner.email}
          placeholder="jane@example.com"
          onChange={(event) =>
            setPartner((prev) => ({
              ...prev,
              email: event.target.value,
            }))
          }
        />

        <s-select
          label="Partner type"
          name="partner_type"
          value={partner.type}
          onChange={(event) =>
            setPartner((prev) => ({
              ...prev,
              partner_type: event.target.value,
            }))
          }
        >
          <s-option value="creator">Creator</s-option>
          <s-option value="affiliate">Affiliate</s-option>
          <s-option value="sales_rep">Sales rep</s-option>
          <s-option value="other">Other</s-option>
        </s-select>

        <s-text-area
          label="Notes"
          name="notes"
          value={partner.notes}
          placeholder="Optional notes about this partner"
          onChange={(event) =>
            setPartner((prev) => ({
              ...prev,
              notes: event.target.value,
            }))
          }
        />
      </s-stack>
    </s-admin-action>
  );
}
