import AddressUser from "next-common/components/user/addressUser";

function DestCell({ dest, who, bonded }) {
  if (!dest) {
    return <span className="text-textTertiary">-</span>;
  }

  let account = null;
  if (dest.account) {
    account = dest.account;
  } else if ("staked" in dest || "stash" in dest) {
    account = who;
  } else if ("controller" in dest) {
    account = bonded;
  }

  if (!account) {
    return <span className="text-textTertiary">-</span>;
  }

  return <AddressUser add={account} />;
}

export function useStakingRewardsDestColumn() {
  return {
    name: "Dest",
    style: { textAlign: "left", minWidth: "212px" },
    render: (item) => (
      <DestCell
        key="dest"
        dest={item.dest}
        who={item.who}
        bonded={item.bonded}
      />
    ),
  };
}
