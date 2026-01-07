import { useChainSettings } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAddressVestingData from "next-common/hooks/useAddressVestingData";
import { toPrecision } from "next-common/utils";
import { CACHE_KEY } from "next-common/utils/constants";
import { PromptTypes } from "next-common/components/scrollPrompt";
import Prompt from "./prompt";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import Link from "next-common/components/link";

function PromptContent({ unlockable, symbol, decimals, address }) {
  return (
    <div>
      You have {toPrecision(unlockable, decimals)} {symbol} unlockable from
      vesting. Vest{" "}
      <Link className="underline" href={`/user/${address}/vesting`}>
        here
      </Link>
    </div>
  );
}

function VestingUnlockablePromptImpl({ isWithCache = true }) {
  const realAddress = useRealAddress();
  const { decimals, symbol } = useChainSettings();
  const { data, isLoading } = useAddressVestingData(realAddress);
  if (isLoading || !data || !data.unlockable || BigInt(data.unlockable) <= 0n) {
    return null;
  }

  if (isWithCache) {
    return (
      <Prompt
        cacheKey={CACHE_KEY.vestingUnlockablePrompt}
        type={PromptTypes.INFO}
      >
        <PromptContent
          unlockable={data.unlockable}
          symbol={symbol}
          decimals={decimals}
          address={realAddress}
        />
      </Prompt>
    );
  }

  return (
    <GreyPanel className="w-[calc(100%+50px)] right-[25px] relative rounded-none bg-blue100 text-blue500 px-6 py-4 text14Medium mb-4">
      <PromptContent
        unlockable={data.unlockable}
        symbol={symbol}
        decimals={decimals}
        address={realAddress}
      />
    </GreyPanel>
  );
}

export default function VestingUnlockablePrompt({ isWithCache = true }) {
  const { modules } = useChainSettings();
  if (!modules?.vesting) {
    return null;
  }

  return <VestingUnlockablePromptImpl isWithCache={isWithCache} />;
}
