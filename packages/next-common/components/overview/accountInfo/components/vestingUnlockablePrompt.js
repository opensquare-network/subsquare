import { useChainSettings } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAddressVestingData from "next-common/hooks/useAddressVestingData";
import { toPrecision } from "next-common/utils";
import { CACHE_KEY } from "next-common/utils/constants";
import { PromptTypes } from "next-common/components/scrollPrompt";
import Prompt from "./prompt";
import Link from "next-common/components/link";

function PromptContent({ unlockable, address }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <div>
      You have {toPrecision(unlockable, decimals)} {symbol} unlockable from
      vesting, vest it{" "}
      <Link className="underline" href={`/user/${address}/vesting`}>
        here
      </Link>
    </div>
  );
}

function VestingUnlockablePromptImpl() {
  const realAddress = useRealAddress();
  const { data, isLoading } = useAddressVestingData(realAddress);
  if (isLoading || !data || !data.unlockable || BigInt(data.unlockable) <= 0n) {
    return null;
  }

  return (
    <Prompt
      cacheKey={CACHE_KEY.vestingUnlockablePrompt}
      type={PromptTypes.INFO}
    >
      <PromptContent unlockable={data.unlockable} address={realAddress} />
    </Prompt>
  );
}

export default function VestingUnlockablePrompt() {
  const { modules } = useChainSettings();
  if (!modules?.vesting) {
    return null;
  }

  return <VestingUnlockablePromptImpl />;
}
