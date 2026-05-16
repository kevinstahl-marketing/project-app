import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { updateIssues, getIssues } from "./utils";

export default async () => {
  {
    render(<Extension />, document.body);
  }
};

function Extension() {
  const { data, i18n } = shopify;

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

  const onReset = () => {};

  return (
    <s-admin-block heading={i18n.translate("name")}>
      <s-form id={`commission-form`} onSubmit={onSubmit} onReset={onReset}>
        <s-stack gap="base">
          <s-text>Product ID: {productId}</s-text>
          <s-text-field
            label="Partner"
            value={commissionRate}
            onInput={(event) => setCommissionRate(event.target.value)}
          ></s-text-field>
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
