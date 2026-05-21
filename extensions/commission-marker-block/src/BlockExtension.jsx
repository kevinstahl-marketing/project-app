

import { render } from "preact";
import { useEffect, useMemo, useState, useCallback } from "preact/hooks";

import "@shopify/ui-extensions";
import { updateIssues, getIssues } from "./utils";

import CreatePartnerInline from "./components/createPartnerInline.jsx";

export default async () => {
  {
    render(<Extension />, document.body);
  }
};

function Extension() {
  const { data, i18n, navigation, intents } = shopify;

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
console.log(shopify.intents);
console.log(shopify.intents.invoke);
  return (
    <s-admin-block heading={i18n.translate("name")}>
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
7
          <s-stack direction="inline">
            <s-button
              onClick={() => {
                const url = `extension:create-partner-action`;
                navigation?.navigate(url);
              }}
              variant="primary"
            >
              Create Partner
            </s-button>
            <s-button variant="secondary">Poop</s-button>
          </s-stack>
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}
