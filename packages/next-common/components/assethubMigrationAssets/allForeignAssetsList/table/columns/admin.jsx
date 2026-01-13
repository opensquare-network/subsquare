import { useState } from "react";
import AddressUser from "next-common/components/user/addressUser";

function InfoAddressItem({ name, address }) {
  return (
    <div className="flex">
      <span className="text14Medium text-textTertiary min-w-[80px]">
        {name}
      </span>
      <AddressUser add={address} maxWidth={160} link="/assets" />
    </div>
  );
}

export function useInfoCol() {
  const [showAllAdmin, setShowAllAdmin] = useState(false);

  return {
    name: (
      <div
        className="cursor-pointer text14Medium text-theme500"
        onClick={() => setShowAllAdmin(!showAllAdmin)}
      >
        {showAllAdmin ? "All admins" : "Admin"}
      </div>
    ),
    style: { textAlign: "left", width: "240px", minWidth: "240px" },
    render: (item) => (
      <div key="info" className="flex flex-col">
        {showAllAdmin ? (
          <>
            <InfoAddressItem name="Admin" address={item.admin} />
            <InfoAddressItem name="Owner" address={item.owner} />
            <InfoAddressItem name="Issuer" address={item.issuer} />
            <InfoAddressItem name="Freezer" address={item.freezer} />
          </>
        ) : (
          <AddressUser add={item.admin} maxWidth={160} link="/assets" />
        )}
      </div>
    ),
  };
}

export const colAdmin = {
  name: "Admin",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <AddressUser key="admin" add={item.admin} link="/assets" />,
};

export const colIssuer = {
  name: "Issuer",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => (
    <AddressUser key="issuer" add={item.issuer} link="/assets" />
  ),
};

export const colOwner = {
  name: "Owner",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <AddressUser key="owner" add={item.owner} link="/assets" />,
};

export const colFreezer = {
  name: "Freezer",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => (
    <AddressUser key="freezer" add={item.freezer} link="/assets" />
  ),
};
