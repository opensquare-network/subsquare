import { includes } from "lodash-es";
import { useChain } from "next-common/context/chain";
import getDvAddresses from "next-common/utils/dv";
import AddressUser from "./addressUser";
import AddressDVTag from "./dvTag";

/**
 * @param {{showDVTooltip?: boolean} & Parameters<typeof AddressUser>[0]} props
 */
export default function AddressUserWithDVTag({
  showDVTooltip = true,
  ...props
}) {
  const chain = useChain();
  const dvAddresses = getDvAddresses(chain);
  const isDV = includes(dvAddresses, props?.add);

  let maxWidth = props?.maxWidth;
  if (isDV) {
    if (maxWidth) {
      // icon(20) + gap(8)
      maxWidth -= 28;
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <AddressUser {...props} maxWidth={maxWidth} />
      {isDV && <AddressDVTag showTooltip={showDVTooltip} />}
    </div>
  );
}
