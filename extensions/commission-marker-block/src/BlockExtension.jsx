import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import PartnerCreatePopover from "./components/PartnerCreatePopover.jsx";

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

  if (loading) {
    return (
      <s-stack direction="inline">
        <s-spinner />
      </s-stack>
    );
  }

  const onReset = () => {};

  return (
    <s-admin-block heading={i18n.translate("name")}>
                <s-button
            type="button"
            variant="secondary"
            commandFor="table-settings-popover"
            icon="settings"
          >
            + New Partner
          </s-button>

          <s-popover id="table-settings-popover">
            <s-box padding="base">
              <s-stack gap="small-200">
                <s-stack gap="small">
                  <s-heading>Choose columns to display</s-heading>
                  <s-choice-list label="Select columns to display">
                    <s-choice value="sku" selected>
                      Sku
                    </s-choice>
                    <s-choice value="inventory" selected>
                      Inventory
                    </s-choice>
                    <s-choice value="price" selected>
                      Price
                    </s-choice>
                    <s-choice value="vendor">Vendor</s-choice>
                    <s-choice value="type">Product type</s-choice>
                  </s-choice-list>
                </s-stack>
                <s-button variant="primary">Apply changes</s-button>
              </s-stack>
            </s-box>
          </s-popover>
      <s-form id={`commission-form`} onSubmit={onSubmit} onReset={onReset}>
        <s-stack gap="base">
          <s-text>Product ID: {productId}</s-text>
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
