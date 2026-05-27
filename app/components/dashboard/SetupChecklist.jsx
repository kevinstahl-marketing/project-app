export function SetupChecklist() {
  return (
      <s-stack direction="block" gap="base">

        <ChecklistItem
          complete
          label="Create first partner"
        />

        <ChecklistItem
          label="Connect Stripe account"
        />

        <ChecklistItem
          label="Assign products"
        />

        <ChecklistItem
          label="Review payout ledger"
        />
      </s-stack>
  );
}

function ChecklistItem({ complete = false, label }) {
  return (
    <s-stack gap="tight" alignItems="center">
      <s-badge tone={complete ? "success" : "neutral"}>
        {complete ? "Done" : "Pending"}
      </s-badge>

      <s-text>{label}</s-text>
    </s-stack>
  );
}