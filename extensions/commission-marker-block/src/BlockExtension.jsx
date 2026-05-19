import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import "@shopify/ui-extensions";
import { updateIssues, getIssues } from "./utils";

import CreatePartnerInline from "./components/createPartnerInline.jsx";

export default async () => {
  {
    render(<Extension />, document.body);
  }
};

function Extension() {
  const { data, i18n, navigation } = shopify;

  const [loading, setLoading] = useState(true);
  const [_, setInitialValues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commissionRate, setCommissionRate] = useState();

  const productId = data.selected[0].id;

  console.log(productId);
  useEffect(() => {
    (async function getProductInfo() {
      setLoading(false);
    })();
  }, [productId]);

  const onSubmit = (event) => {
    event.waitUntil(updateIssues());
  };

  if (loading) {
    return (
      <s-stack direction="inline">
        <s-spinner />
      </s-stack>
    );
  }

  const onReset = () => {};
  const [showCreate, setShowCreate] = useState(false);

  return (
    <s-admin-block heading={i18n.translate("name")}>
      <s-text-field
        label="Partner Name"
      />
      <s-button
        onClick={() => {
          const url = `extension:create-partner-action`;
          navigation?.navigate(url);
        }}
      >
        Create Partner
      </s-button>

      <s-form id={`commission-form`} onSubmit={onSubmit} onReset={onReset}>
        <s-stack gap="base">
          <s-select label="Partner" value="" name="partner">
            <s-option value="">Select a Partner</s-option>
          </s-select>
          <s-number-field
            label="Rate"
            name="Rate"
            min="0"
            max="100"
            prefix="%"
          ></s-number-field>
          <s-button variant="primary" type="submit">
            Save Commission Rule
          </s-button>
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}
