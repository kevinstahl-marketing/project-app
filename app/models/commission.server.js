import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }
  }`,
    {
      variables: {
        metafields: [
          {
            key: "example_key",
            namespace: "example_namespace",
            ownerId: "gid://shopify/Product/20995642",
            type: "single_line_text_field",
            value: "Example Value",
          },
        ],
      },
    },
  );
  const json = await response.json();
  return json.data;
};

export async function saveProductCommissionRule(data, graphql) {
  const response = await graphql(
    `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            jsonValue
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            key: "commission",
            namespace: "$app",
            ownerId: data.ownerId,
            type: "json",
            value: JSON.stringify(data.commission),
          },
        ],
      },
    },
  );

  const json = await response.json();
  const errors = json.data.metafieldsSet.userErrors;

  if (errors.length) {
    throw new Error(errors[0].message);
  }

  return json.data.metafieldsSet.metafields[0];
}
