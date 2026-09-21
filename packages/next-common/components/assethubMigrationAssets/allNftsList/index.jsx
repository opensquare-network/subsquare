import CollectionsTable from "./collectionsTable";
import { useMemo } from "react";
import useAllNftCollections from "next-common/components/profile/nfts/useAllNftCollections";
import useNftCollectionMetadata from "next-common/components/profile/nfts/useNftCollectionMetadata";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

const PAGE_SIZE = 25;

function NftsTitle({ collectionsCount, itemsCount, isLoading }) {
  return (
    <TitleContainer className="justify-start gap-x-1">
      NFT
      {!isLoading && (
        <>
          {" "}
          <span className="text16Medium text-textTertiary">
            {itemsCount.toLocaleString()}
          </span>
          <span className="text14Medium text-textTertiary">
            ({collectionsCount.toLocaleString()} collections)
          </span>
        </>
      )}
    </TitleContainer>
  );
}

export default function AllNftsList() {
  const { collections, isLoading, totalCollections, totalItems } =
    useAllNftCollections();
  const { pagedItems: pagedCollections, component: pagination } =
    useListPagination(collections, PAGE_SIZE);
  const collectionNames = useNftCollectionMetadata(pagedCollections);
  const displayCollections = useMemo(
    () =>
      pagedCollections?.map((collection) => ({
        ...collection,
        name: collectionNames[collection.collectionId],
      })),
    [pagedCollections, collectionNames],
  );

  return (
    <div className="flex flex-col gap-[16px]">
      <NftsTitle
        collectionsCount={totalCollections}
        itemsCount={totalItems}
        isLoading={isLoading}
      />
      <SecondaryCard>
        <CollectionsTable
          collections={displayCollections}
          loading={isLoading}
        />
        {!isLoading && totalCollections > 0 && pagination}
      </SecondaryCard>
    </div>
  );
}
