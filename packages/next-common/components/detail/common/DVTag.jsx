import AddressDVTag from "next-common/components/user/dvTag";
import { useIsDVAddress } from "next-common/hooks/useIsDVAddress";

export default function DVTag({ address, showTooltip }) {
  const isDV = useIsDVAddress(address);

  if (isDV) {
    return <AddressDVTag showTooltip={showTooltip} />;
  }

  return null;
}
