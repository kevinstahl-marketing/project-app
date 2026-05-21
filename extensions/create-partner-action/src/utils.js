const METAOBJECT_TYPE = "$app:partner";
export async function savePartner(data, handle) {
  console.log("before query", handle, data);
  const response = await makeGraphQLQuery(
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
          code
        }
      }
    }
  `,
  {
    handle: {
      type: METAOBJECT_TYPE,
      handle,
    },
    metaobject: {
      fields: [
        { key: "full_name", value: data.full_name ?? "" },
        { key: "email", value: data.email ?? "" },
        { key: "active", value: data.active ?? false },
        { key: "notes", value: data.notes ?? "" },
        { key: "type", value: data.type ?? "" },
      ],
    },
  },
);

  console.log("FULL RESPONSE:", response);

  console.log("USER ERRORS:", response?.data?.metaobjectUpsert?.userErrors);

  console.log("METAOBJECT:", response?.data?.metaobjectUpsert?.metaobject);

  return response;
}

export function generateHandle(name) {
  return `${slugify(name)}-${Date.now().toString(36)}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


async function makeGraphQLQuery(query, variables) {
  const graphQLQuery = {
    query,
    variables,
  };

  const res = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify(graphQLQuery),
  });

  if (!res.ok) {
    console.error("Network error");
  }

  return await res.json();
}