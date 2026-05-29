export function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export const EmptyPartnerState = () => (
  <s-section accessibilityLabel="Empty state section">
    <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
      <s-box maxInlineSize="200px" maxBlockSize="200px">
        <s-image
          aspectRatio="1/0.5"
          src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          alt="A stylized graphic of a document"
        />
      </s-box>
      <s-grid justifyItems="center" maxBlockSize="450px" maxInlineSize="450px">
        <s-heading>Create your first partner for payouts.</s-heading>
        <s-paragraph>
          Pay your vendors, freelancers, employees, and other entities using
          Stripe.
        </s-paragraph>
        <s-stack
          gap="small-200"
          justifyContent="center"
          padding="base"
          paddingBlockEnd="none"
          direction="inline"
        >
          <s-button href="/app/partners/new" variant="primary">
            Create a Partner
          </s-button>
        </s-stack>
      </s-grid>
    </s-grid>
  </s-section>
);

const PartnerTableRow = ({ partner }) => (
  <s-table-row id={partner.handle}>
    <s-table-cell>
      <s-stack direction="inline" gap="small" alignItems="center">
        <s-clickable
          href={`/app/partners/${partner.handle}`}
          accessibilityLabel={`Go to the partner page for ${partner.full_name}`}
          border="base"
          borderRadius="base"
          overflow="hidden"
          inlineSize="20px"
          blockSize="20px"
        >
          {partner.profile_image ? (
            <s-image objectFit="cover" src={partner.profile_image}></s-image>
          ) : (
            <s-icon size="large" type="image" />
          )}
        </s-clickable>
        <s-link href={`/app/partners/${partner.handle}`}>
          {truncate(partner.fullName)}
        </s-link>
        <s-text tone="subdued">{partner.email}</s-text>
      </s-stack>
    </s-table-cell>

    <s-table-cell>
      <s-badge tone={partner.active ? "success" : "critical"}>
        {partner.active ? "Active" : "Inactive"}
      </s-badge>
    </s-table-cell>

    <s-table-cell>
      <s-badge tone={partner.approved ? "success" : "warning"}>
        {partner.approved ? "Connected" : "Pending"}
      </s-badge>
    </s-table-cell>

    <s-table-cell>{new Date(partner.createdAt).toDateString()}</s-table-cell>
  </s-table-row>
);

export function RecentPartnerTable({ partners }) {
  return (
    <s-section padding="none" accessibilityLabel="Partner table">
      <s-table>
        <s-table-header-row>
          <s-table-header listSlot="primary">Partner</s-table-header>
          <s-table-header>Status</s-table-header>
          <s-table-header>Stripe</s-table-header>
          <s-table-header>Edit</s-table-header>
        </s-table-header-row>
        <s-table-body>
          {partners.map((partner) => (
            <PartnerTableRow key={partner.handle} partner={partner} />
          ))}
        </s-table-body>
      </s-table>
    </s-section>
  );
}
