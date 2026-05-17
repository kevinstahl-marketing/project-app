import { authenticate } from "../shopify.server";

const METAOBJECT_TYPE = "$app:partner";

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

export async function savePartner(data, graphql) {
  const response = await graphql(
    `
      mutation UpsertPartner(
        $handle: MetaobjectHandleInput!
        $metaobject: MetaobjectUpsertInput!
      ) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `,

    {
      variables: {
        handle: {
          type: METAOBJECT_TYPE,
          handle: data.handle,
        },
        metaobject: {
          fields: [
            { key: "full_name", value: data.full_name },
            { key: "email", value: data.email },
            { key: "active", value: data.active },
            { key: "notes", value: data.notes },
          ],
        },
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

export function generateHandle(title) {
  return `${slugify(title)}-${Date.now().toString(36)}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
