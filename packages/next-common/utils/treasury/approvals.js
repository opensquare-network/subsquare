// The AssetHub migration is not live yet, so every chain keeps the default of
// `approvals: true`. Set `modules.treasury.approvals` to false on a chain to
// switch it to the new AssetHub spend flow.
export function hasTreasuryApprovals(settings) {
  return settings?.modules?.treasury?.approvals !== false;
}
