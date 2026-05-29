export const emptyPartner = {
  handle: "",
  full_name: "",
  email: "",
  notes: "",
};

export const emptyStripe = {
  stripe_account_id: "",
  stripe_onboarding_complete: false,
  stripe_payouts_enabled: false,
  stripe_charges_enabled: false,
  status: "not_connected",
};

export function normalizePartner(partner = {}) {
  return {
    handle: partner.handle ?? "",
    full_name: partner.full_name ?? "",
    email: partner.email ?? "",
    notes: partner.notes ?? "",
  };
}

export function normalizeStripe(source = {}) {
  return {
    stripe_account_id: source.stripe_account_id ?? source.account_id ?? "",
    stripe_onboarding_complete: Boolean(source.onboarding_complete),
    stripe_payouts_enabled: Boolean(source.payouts_enabled),
    stripe_charges_enabled: Boolean(source.charges_enabled),
    status: source.status ?? "not_connected",
  };
}