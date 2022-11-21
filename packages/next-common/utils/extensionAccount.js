export async function polkadotWeb3Accounts() {
  const { web3Accounts } = await import("@polkadot/extension-dapp");
  const extensionAccounts = await web3Accounts();
  return extensionAccounts.filter((acc) => acc.type !== "ethereum");
}
