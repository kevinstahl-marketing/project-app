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

export async function getQRCode(handle, graphql, shop) {
  const response = await graphql(
    `
      query GetQRCode($handle: MetaobjectHandleInput!) {
        metaobjectByHandle(handle: $handle) {
          id
          handle
          updatedAt
          title: field(key: "title") {
            jsonValue
          }
          product: field(key: "product") {
            jsonValue
            reference {
              ... on Product {
                handle
                title
                media(first: 1) {
                  nodes {
                    preview {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          productVariant: field(key: "product_variant") {
            reference {
              ... on ProductVariant {
                id
                legacyResourceId
              }
            }
          }
          destination: field(key: "destination") {
            jsonValue
          }
          scans: field(key: "scans") {
            jsonValue
          }
        }
      }
    `,
    {
      variables: {
        handle: { type: METAOBJECT_TYPE, handle },
      },
    },
  );

  const { data } = await response.json();
  const metaobject = data?.metaobjectByHandle;

  if (!metaobject) {
    return null;
  }

  return transformMetaobject(metaobject, shop);
}

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
