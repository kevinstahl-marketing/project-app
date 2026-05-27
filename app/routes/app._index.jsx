import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

import { getPartners } from "../models/partners.server";

import { useLoaderData } from "react-router";


import {
  WelcomePanel,
  StatsGrid,
  SetupChecklist,
  DashboardPartnerTable,
} from "../components/dashboard/index";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const partners = await getPartners(admin.graphql, session.shop);
  return {
    partners: partners,
  }

};

export const action = async ({ request }) => {
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const { partners } = useLoaderData();

  return (
    <s-page heading="Partner Manager">
      <s-section heading="Welcome">
        <WelcomePanel></WelcomePanel>
      </s-section>

      <s-section heading="Partner Status">
        <StatsGrid></StatsGrid>
      </s-section>

      <s-section heading="Partners">
        <DashboardPartnerTable partners={partners}></DashboardPartnerTable>
      </s-section>

      <s-section slot="aside" heading="Setup Checklist">
        <SetupChecklist></SetupChecklist>
      </s-section>

      <s-section slot="aside" heading="Quick Actions" gap="base">
        <s-button variant="primary">Create Partner</s-button>
        <s-button>View Partners</s-button>
      </s-section>
    </s-page>
  );
}
