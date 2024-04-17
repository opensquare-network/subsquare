import SystemUser from "./systemUser";
import { includes } from "lodash-es";
import { useChain } from "next-common/context/chain";
import getDvAddresses from "next-common/utils/dv";
import AddressDVTag from "./dvTag";

/**
 * @param {Parameters<typeof SystemUser>[0]} props
 */
export default function SystemUserWithDVTag(props) {
  const chain = useChain();
  const dvAddresses = getDvAddresses(chain);
  const isDV = includes(dvAddresses, props.user?.address);

  let { maxWidth } = props;
  if (isDV) {
    if (maxWidth) {
      // icon(20) + gap(8)
      maxWidth -= 28;
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <SystemUser {...props} maxWidth={maxWidth} />
      {isDV && <AddressDVTag />}
    </div>
  );
}
