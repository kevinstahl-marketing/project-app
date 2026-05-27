export function DashboardPartnerTable({ partners = [] }) {
  return (
    <s-table>
      <s-table-header-row>
        <s-table-header listSlot="primary">Partner</s-table-header>
        <s-table-header listSlot="inline">Status</s-table-header>
        <s-table-header listSlot="secondary">Stripe</s-table-header>
      </s-table-header-row>

      <s-table-body>
        {partners.map((partner) => (
          <s-table-row key={partner.id}>
            <s-table-cell>
              <s-inline-stack gap="small" alignItems="center">
                <s-thumbnail
                  src={partner.profile_image}
                  alt={partner.full_name}
                  size="small"
                />

                <s-stack gap="none">
                  <s-text fontWeight="medium">{partner.full_name}</s-text>
                  <s-text tone="subdued">{partner.email}</s-text>
                </s-stack>
              </s-inline-stack>
            </s-table-cell>

            <s-table-cell>
              <s-badge tone={partner.active ? "success" : "critical"}>
                {partner.active ? "Active" : "Inactive"}
              </s-badge>
            </s-table-cell>

            <s-table-cell>
              <s-badge tone={partner.stripe_connected ? "success" : "warning"}>
                {partner.stripe_connected ? "Connected" : "Pending"}
              </s-badge>
            </s-table-cell>
          </s-table-row>
        ))}
      </s-table-body>
    </s-table>
  );
}