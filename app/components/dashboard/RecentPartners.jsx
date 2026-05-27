export function RecentPartners() {
  return (
    <s-stack direction="block" gap="base">
      <s-stack justifyContent="space-between" alignItems="center"></s-stack>
      <s-table>
        <s-table-header>
          <s-table-row>
            <s-table-cell>Name</s-table-cell>
            <s-table-cell>Status</s-table-cell>
            <s-table-cell>Stripe</s-table-cell>
            <s-table-cell>Commission</s-table-cell>
          </s-table-row>
        </s-table-header>

        <s-table-body>
          <PartnerRow
            name="La Concheria"
            status="Active"
            stripe="Connected"
            commission="20%"
          />

          <PartnerRow
            name="Vendor Two"
            status="Pending"
            stripe="Pending"
            commission="15%"
          />
        </s-table-body>
      </s-table>
      <s-button>Manage Partners</s-button>
    </s-stack>
  );
}

function PartnerRow({ name, status, stripe, commission }) {
  return (
    <s-table-row>
      <s-table-cell>{name}</s-table-cell>

      <s-table-cell>
        <s-badge tone={status==="Active" ? "success" : "neutral"}>
          {status==="Active" ? "Active" : "Pending"}
        </s-badge>
      </s-table-cell>

      <s-table-cell>{stripe}</s-table-cell>

      <s-table-cell>{commission}</s-table-cell>
    </s-table-row>
  );
}
