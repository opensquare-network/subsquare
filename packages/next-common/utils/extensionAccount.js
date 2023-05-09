export async function polkadotWeb3Accounts() {
  const { web3Accounts } = await import("@polkadot/extension-dapp");
  return await web3Accounts();
}
