export function WelcomePanel() {
  return (
      <s-card>
        <s-stack direction="block" gap="base">
          <s-stack direction="block" gap="tight">
            <s-heading>Welcome back</s-heading>

            <s-text tone="subdued">
              Manage partners, commissions, and payouts.
            </s-text>
          </s-stack>
        </s-stack>
      </s-card>
  );
}
