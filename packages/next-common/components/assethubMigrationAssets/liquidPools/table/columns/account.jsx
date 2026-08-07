import Link from "next-common/components/link";
import AddressUser from "next-common/components/user/addressUser";

export const colAccount = {
  name: "Account",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  render: (item) => (
    <Link href={`/user/${item.owner}`} className="text14Medium">
      <AddressUser add={item.owner} />
    </Link>
  ),
};
