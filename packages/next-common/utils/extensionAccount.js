import { getWallets } from "./consts/connect";

export async function polkadotWeb3Accounts(chainType) {
  const { web3Accounts } = await import("@polkadot/extension-dapp");
  const allAccounts = await web3Accounts();
  const wallets = getWallets()?.map((w) => w.extensionName);
  const accountsBySupportedExtension = allAccounts.filter((item) =>
    wallets.includes(item.meta.source),
  );

  if (chainType === "ethereum") {
    return accountsBySupportedExtension.filter(
      (acc) => acc.type === "ethereum",
    );
  }

  return accountsBySupportedExtension.filter((acc) => acc.type !== "ethereum");
}
