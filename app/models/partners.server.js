import { authenticate } from "../shopify.server";

const METAOBJECT_TYPE = "$app:partner";
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
            { key: "type", value: data.type},
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
