import AddressUser from "next-common/components/user/addressUser";
import { MapDataList } from "next-common/components/dataList";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import useNftItemNames from "next-common/components/profile/nfts/useNftItemNames";
import { useChainSettings } from "next-common/context/chain";
import useNftCollectionItems from "next-common/components/profile/nfts/useNftCollectionItems";
import {
  getSubscanNftItemLink,
  NftLink,
  NftName,
} from "next-common/components/profile/nfts/nftCollectionsTree";

const PAGE_SIZE = 10;

export default function CollectionItemsPopup({ collection, onClose }) {
  const { assethubMigration } = useChainSettings();
  const domain = assethubMigration?.subscanAssethubDomain;
  const { itemIds, itemOwners } = useNftCollectionItems(
    collection.collectionId,
    true,
  );
  const { pagedItems, component: pagination } = useListPagination(
    itemIds,
    PAGE_SIZE,
    { buttonMode: true },
  );
  const names = useNftItemNames(collection.collectionId, pagedItems);
  const columnsDef = [
    {
      name: "Item",
      width: 120,
      className: "text-textTertiary",
      render: (itemId) => (
        <NftLink
          link={getSubscanNftItemLink(domain, collection.collectionId, itemId)}
        >
          #{itemId}
        </NftLink>
      ),
    },
    {
      name: "Name",
      className: "min-w-0 pr-4",
      render: (itemId) => (
        <div className="flex h-5 min-w-0 items-center truncate">
          <NftName name={names[itemId]} />
        </div>
      ),
    },
    {
      name: "Owner",
      width: 180,
      className: "text-right",
      render: (itemId) => (
        <div className="flex justify-end">
          <AddressUser add={itemOwners[itemId]} maxWidth={180} />
        </div>
      ),
    },
  ];

  return (
    <Popup
      title={`Collection #${collection.collectionId} items`}
      onClose={onClose}
      size={PopupSize.MIDDLE}
    >
      <MapDataList
        className="max-h-[60vh]"
        columnsDef={columnsDef}
        data={pagedItems}
        getRowKey={(itemId) => itemId}
        loading={itemIds === null}
        noDataText="No items"
      />
      {itemIds !== null && pagination}
    </Popup>
  );
}
