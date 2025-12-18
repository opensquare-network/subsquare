import AddressUser from "next-common/components/user/addressUser";

export const desktopColumns = [
  {
    name: "Proxies",
    className: "text-left",
    render: (item) => (
      <AddressUser key={`account-${item.address}`} add={item.address} />
    ),
  },
  {
    name: "Sub Identities",
    width: 160,
    render: (item) =>
      item.subIdentities ? (
        <div
          key={`subsCount-${item.address}`}
          className="text-textPrimary text14Medium"
        >
          {item.subIdentities.length}
        </div>
      ) : null,
  },
];

export const mobileColumns = [
  {
    name: "Proxies",
    className: "text-left",
    render: (item) => (
      <>
        <AddressUser key={`account-${item.address}`} add={item.address} />
        {item.subIdentities ? (
          <div
            key={`subsCount-${item.address}`}
            className="text-textPrimary text14Medium"
          >
            {item.subIdentities.length}
          </div>
        ) : null}
      </>
    ),
  },
];
