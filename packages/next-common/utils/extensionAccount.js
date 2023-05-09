export async function polkadotWeb3Accounts(chainType) {
  const { web3Accounts } = await import("@polkadot/extension-dapp");
  const allAccounts = await web3Accounts();
  if (chainType === "ethereum") {
    return allAccounts.filter((acc) => acc.type === "ethereum");
  }

  return allAccounts.filter((acc) => acc.type !== "ethereum");
}
