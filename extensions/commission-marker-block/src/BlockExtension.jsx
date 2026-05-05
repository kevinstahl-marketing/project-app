import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { updateIssues, getIssues } from "./utils";

export default async () => {
  {
    render(<Extension />, document.body);
  }
};

function Extension() {
  console.log("Extension component hit");
  const { data, i18n } = shopify;
  return (
    <s-admin-block heading={i18n.translate("name")}>
      <s-text>Hello. The block is rendering.</s-text>
    </s-admin-block>
  );
}