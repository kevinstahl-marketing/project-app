import { render } from "preact";
import { useEffect, useState, useCallback } from "preact/hooks";
import { savePartner, generateHandle, createConnectedAccount } from "./utils";

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
  }, [partner, close]);

  const handleCreateStripeAccount = useCallback(async () => {
    const { isValid, errors } = validateForm(partner);
    console.log("here")

    if (isValid) {
      console.log('is going?')
      const json = await createConnectedAccount(partner);
      window.open(json.onboardingUrl, "_top");
    }
  }, [partner.email]);

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
          name="type"
          value={partner.type}
          onChange={(event) =>
            setPartner((prev) => ({
              ...prev,
              type: event.target.value,
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
      <s-button onClick={handleCreateStripeAccount}>Connect Stripe Account</s-button>
      
    </s-admin-action>
  );
}
