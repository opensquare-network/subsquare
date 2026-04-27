const MOCK_ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_MOCK_ACCOUNT || "";

export function getMockAccountAddress() {
  return MOCK_ACCOUNT_ADDRESS || null;
}

export function isMockAccountAddress(address) {
  if (!MOCK_ACCOUNT_ADDRESS) return false;
  return address === MOCK_ACCOUNT_ADDRESS;
}
