import DVTag from "next-common/components/detail/common/DVTag";
import AddressUser from "next-common/components/user/addressUser";

export default function AccountCell({ item }) {
  return (
    <div className="flex items-center gap-x-2">
      <AddressUser
        key={item.account}
        add={"13UVJyLnbVp9RBZYFwHZ1tRtfLttPUTpgj8rCiiJaN4P2TMQ"}
        maxWidth={296}
        link="/votes"
      />
      <DVTag address={item.account} showTooltip={false} />
    </div>
  );
}
