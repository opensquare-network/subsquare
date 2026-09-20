import { AccountNftsSection } from "next-common/components/profile/nfts";
import { NftItemActionsProvider } from "next-common/components/profile/nfts/nftItemActions";
import NftTransferButton from "next-common/components/profile/nfts/nftTransferButton";

export default function AccountNfts({ address }) {
  return (
    <NftItemActionsProvider actions={NftTransferButton}>
      <AccountNftsSection address={address} />
    </NftItemActionsProvider>
  );
}
