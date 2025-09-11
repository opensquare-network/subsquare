import { includes } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import AddressDVTag from "next-common/components/user/dvTag";
import { useChain } from "next-common/context/chain";
import getDvAddresses from "next-common/utils/dv";

function Address({ data }) {
  const chain = useChain();
  const dvAddresses = getDvAddresses(chain);
  const isDV = includes(dvAddresses, data.address);

  let maxWidth = 160;
  if (isDV) {
    // 160 - icon(20) - gap(8)
    maxWidth = 132;
  }

  return (
    <div className="flex items-center gap-x-2">
      <AddressUser maxWidth={maxWidth} link="/votes" add={data.address} />
      {isDV && <AddressDVTag />}
    </div>
  );
}

export const addressCol = {
  name: "Address",
  className: "min-w-[160px]",
  cellRender(data) {
    return <Address data={data} />;
  },
};
