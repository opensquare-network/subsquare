import AddressUser from "next-common/components/user/addressUser";
import { StoreAddress, WebIdName } from "./common";

function labelStoreViewHandler(item, onViewLabelStore) {
  if (!item.labelStore || !onViewLabelStore) {
    return undefined;
  }
  return () => onViewLabelStore(item.labelStore);
}

export function getDesktopColumns({ onViewLabelStore } = {}) {
  return [
    {
      name: "Web ID",
      className: "min-w-[160px] text-left",
      render: (item) => <WebIdName label={item.label} />,
    },
    {
      name: "Owner",
      className: "min-w-[180px] text-left",
      render: (item) => <AddressUser add={item.owner} />,
    },
    {
      name: "Label Store",
      className: "min-w-[180px] text-left",
      render: (item) => (
        <StoreAddress
          address={item.labelStore}
          onView={labelStoreViewHandler(item, onViewLabelStore)}
        />
      ),
    },
    {
      name: "User Store",
      className: "min-w-[160px] text-right",
      render: (item) => (
        <StoreAddress address={item.userStore} className="justify-end" />
      ),
    },
  ];
}

export function getMobileColumns({ onViewLabelStore } = {}) {
  return [
    {
      name: "Web ID",
      className: "text-left",
      render: (item) => <WebIdName label={item.label} />,
    },
    {
      name: "Owner",
      className: "text-right",
      render: (item) => <AddressUser add={item.owner} />,
    },
    {
      name: "Label Store",
      className: "text-right",
      render: (item) => (
        <StoreAddress
          address={item.labelStore}
          className="justify-end"
          onView={labelStoreViewHandler(item, onViewLabelStore)}
          compact
        />
      ),
    },
    {
      name: "User Store",
      className: "text-right",
      render: (item) => (
        <StoreAddress address={item.userStore} className="justify-end" />
      ),
    },
  ];
}
