export function StatsGrid() {
  return (
    <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
      <s-grid-item gridColumn="span 4">
        <StatBox label="Total Partners" value="12" />
      </s-grid-item>

      <s-grid-item gridColumn="span 4">
        <StatBox label="Stripe Connected" value="8" />
      </s-grid-item>

      <s-grid-item gridColumn="span 4">
        <StatBox label="Pending Onboarding" value="4" />
      </s-grid-item>
    </s-grid>
  );
}

function StatBox({ label, value }) {
  return (
    <s-section>
      <s-stack direction="block" gap="tight">
        <s-text tone="subdued">{label}</s-text>
        <s-heading>{value}</s-heading>
      </s-stack>
    </s-section>
  );
}