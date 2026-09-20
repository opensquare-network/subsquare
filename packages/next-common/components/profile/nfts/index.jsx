import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { usePageProps } from "next-common/context/page";
import Loading from "next-common/components/loading";
import NoData from "next-common/components/noData";
import useAccountNftCollections from "./useAccountNftCollections";
import NftCollectionsTree from "./nftCollectionsTree";

function NftCollectionsContent({ isLoading, collections }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-[24px]">
        <Loading size="20" />
      </div>
    );
  }

  if (!collections?.length) {
    return <NoData showIcon={false} text="No NFTs" />;
  }

  return <NftCollectionsTree collections={collections} />;
}

export default function ProfileNfts() {
  const { id } = usePageProps();
  const { collections, isLoading, totalItems } = useAccountNftCollections(id);

  return (
    <>
      <TitleContainer className="justify-start gap-x-1">
        NFT
        <span className="text16Medium text-textTertiary">{totalItems}</span>
      </TitleContainer>
      <SecondaryCard>
        <NftCollectionsContent
          isLoading={isLoading}
          collections={collections}
        />
      </SecondaryCard>
    </>
  );
}
