import { authenticate } from "../shopify.server";

const METAOBJECT_TYPE = "$app:partner";

export async function getPartner(handle, graphql, shop) {
  const response = await graphql(
    `
      query GetPartner($handle: MetaobjectHandleInput!) {
        metaobjectByHandle(handle: $handle) {
          id
          handle
          updatedAt

          fullName: field(key: "full_name") {
            jsonValue
          }

          email: field(key: "email") {
            jsonValue
          }

          status: field(key: "status") {
            jsonValue
          }

          active: field(key: "active") {
            jsonValue
          }

          phone: field(key: "phone") {
            jsonValue
          }
          type: field(key: "type") {
            jsonValue
          }
          bio: field(key: "bio") {
            jsonValue
          }

          profileImage: field(key: "profile_image") {
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }

          stripeAccountId: field(key: "stripe_account_id") {
            jsonValue
          }

          stripeOnboardingComplete: field(key: "stripe_onboarding_complete") {
            jsonValue
          }

          stripeChargesEnabled: field(key: "stripe_charges_enabled") {
            jsonValue
          }

          stripePayoutsEnabled: field(key: "stripe_payouts_enabled") {
            jsonValue
          }

          notes: field(key: "notes") {
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

  return transformPartnerMetaobject(metaobject, shop);
}

export async function getPartners(graphql, shop) {
  const response = await graphql(
    `
      query GetPartners($type: String!) {
        metaobjects(
          type: $type
          first: 50
          sortKey: "updated_at"
          reverse: true
        ) {
          nodes {
            id
            handle
            updatedAt

            fullName: field(key: "full_name") {
              jsonValue
            }

            email: field(key: "email") {
              jsonValue
            }
            phone: field(key: "phone") {
              jsonValue
            }
            type: field(key: "type") {
              jsonValue
            }

            bio: field(key: "bio") {
              jsonValue
            }
            status: field(key: "status") {
              jsonValue
            }

            active: field(key: "active") {
              jsonValue
            }

            profileImage: field(key: "profile_image") {
              reference {
                ... on MediaImage {
                  image {
                    url
                    altText
                  }
                }
              }
            }

            stripeAccountId: field(key: "stripe_account_id") {
              jsonValue
            }

            stripeOnboardingComplete: field(key: "stripe_onboarding_complete") {
              jsonValue
            }

            stripeChargesEnabled: field(key: "stripe_charges_enabled") {
              jsonValue
            }

            stripePayoutsEnabled: field(key: "stripe_payouts_enabled") {
              jsonValue
            }

            notes: field(key: "notes") {
              jsonValue
            }
          }
        }
      }
    `,

    {
      variables: { type: METAOBJECT_TYPE },
    },
  );

  const { data } = await response.json();
  const metaobjects = data?.metaobjects?.nodes ?? [];

  return Promise.all(metaobjects.map((mo) => transformPartnerMetaobject(mo)));
}

export async function savePartner(handle, data, graphql) {
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
          handle: handle,
        },
        metaobject: {
          fields: [
            { key: "full_name", value: data.fullName },
            { key: "email", value: data.email },
            { key: "active", value: data.active },
            { key: "notes", value: data.notes },
            { key: "type", value: data.type },
            { key: "profileImage", value: data.profileImage },
            { key: "businessName", value: data.businessName },
            { key: "phone", value: data.phone },
          ],
        },
      },
    },
  );

  const { data: responseData } = await response.json();
  const { metaobjectUpsert } = responseData;

  if (metaobjectUpsert.userErrors.length) {
    throw new Error(metaobjectUpsert.userErrors[0].message);
  }

  return metaobjectUpsert.metaobject;
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

function readJsonField(field, fallback = "") {
  return field?.jsonValue ?? fallback;
}

function readImageField(field) {
  return field?.reference?.image ?? null;
}

async function transformPartnerMetaobject(metaobject, shop) {
  return {
    id: metaobject.id,
    handle: metaobject.handle,
    updatedAt: metaobject.updatedAt,

    fullName: readJsonField(metaobject.fullName),
    email: readJsonField(metaobject.email),
    phone: readJsonField(metaobject.phone),
    status: readJsonField(metaobject.status, "pending"),
    active: readJsonField(metaobject.active, false),
    type: readJsonField(metaobject.type, "partner"),

    profileImage: readImageField(metaobject.profileImage),

    stripeAccountId: readJsonField(metaobject.stripeAccountId, null),
    stripeOnboardingComplete: readJsonField(
      metaobject.stripeOnboardingComplete,
      false,
    ),
    stripeChargesEnabled: readJsonField(metaobject.stripeChargesEnabled, false),
    stripePayoutsEnabled: readJsonField(metaobject.stripePayoutsEnabled, false),

    notes: readJsonField(metaobject.notes),
  };
}

export async function archivePartner(id, graphql, shop) {
  const response = await graphql(
    `
      mutation ArchivePartner($id: ID!) {
        metaobjectUpdate(
          id: $id
          metaobject: { fields: [{ key: "status", value: "archived" }] }
        ) {
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
      variables: { id },
    },
  );

  const { data } = await response.json();

  if (data.metaobjectUpdate.userErrors.length) {
    throw new Error(data.metaobjectUpdate.userErrors[0].message);
  }

  return data.metaobjectUpdate.metaobject;
}
