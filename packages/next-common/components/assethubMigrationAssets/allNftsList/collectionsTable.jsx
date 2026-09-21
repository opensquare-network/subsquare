import { useState } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { MapDataList } from "next-common/components/dataList";
import DetailButton from "next-common/components/detailButton";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  getSubscanCollectionLink,
  NftLink,
  NftName,
} from "next-common/components/profile/nfts/nftCollectionsTree";
import { useChainSettings } from "next-common/context/chain";

const CollectionItemsPopup = dynamicPopup(() =>
  import("./collectionItemsPopup"),
);

export default function CollectionsTable({ collections, loading }) {
  const { assethubMigration } = useChainSettings();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const columnsDef = [
    {
      name: "Collection",
      width: 120,
      className: "text-textTertiary",
      render: ({ collectionId }) => (
        <NftLink
          link={getSubscanCollectionLink(
            assethubMigration?.subscanAssethubDomain,
            collectionId,
          )}
        >
          #{collectionId}
        </NftLink>
      ),
    },
    {
      name: "Name",
      className: "min-w-0 pr-4",
      render: ({ name }) => (
        <div className="flex h-5 min-w-0 items-center truncate">
          <NftName name={name} />
        </div>
      ),
    },
    {
      name: "Total",
      width: 80,
      className: "text-right text-textTertiary",
      render: ({ itemCount }) => itemCount,
    },
    {
      name: "Owner",
      width: 180,
      className: "text-right",
      render: ({ owner }) => (
        <div className="flex justify-end">
          <AddressUser add={owner} maxWidth={180} />
        </div>
      ),
    },
    {
      name: "",
      width: 80,
      className: "text-right",
      render: (collection) => (
        <Tooltip content="View items">
          <DetailButton
            as="button"
            type="button"
            aria-label={`View items in collection #${collection.collectionId}`}
            onClick={() => setSelectedCollection(collection)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <MapDataList
        columnsDef={columnsDef}
        data={collections}
        getRowKey={({ collectionId }) => collectionId}
        loading={loading}
        noDataText="No NFTs"
      />
      {selectedCollection && (
        <CollectionItemsPopup
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}
    </>
  );
}
