import Identity from "next-common/components/Identity";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { addressEllipsis } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function IdentityInfo({ address }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const addressHint = addressEllipsis(maybeEvmAddress);

  return (
    <div className="flex flex-col h-[40px] justify-center truncate">
      {hasIdentity ? (
        <>
          <Identity identity={identity} />
          <div className="text12Medium text-textTertiary truncate">
            {address}
          </div>
        </>
      ) : (
        <>
          <div className="text14Medium text-textPrimary">{addressHint}</div>
          <div className="text12Medium text-textTertiary truncate">
            {address}
          </div>
        </>
      )}
    </div>
  );
}
