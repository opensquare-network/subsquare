import { useMemo } from "react";
import { isEmpty } from "lodash-es";

import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { CACHE_KEY } from "next-common/utils/constants";

import {
  MyPoolRewardProvider,
  useMyPoolRewardContext,
} from "next-common/context/staking/poolReward";
import ClaimPoolRewardButton from "next-common/components/staking/overview/accountStaking/claimRewardButton";
import CompoundPoolRewardButton from "next-common/components/staking/overview/accountStaking/compoundRewardButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import WithPallet from "next-common/components/common/withPallet";
import ValueDisplay from "next-common/components/valueDisplay";

function usePoolClaimRewardPrompt() {
  const { decimals, symbol } = useChainSettings();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.poolClaimRewardPrompt,
    true,
  );

  const { claimable, loading } = useMyPoolRewardContext();

  return useMemo(() => {
    if (!visible) {
      return {};
    }

    if ((loading && claimable === 0n) || !claimable || claimable <= 0n) {
      return {};
    }

    return {
      key: CACHE_KEY.poolClaimRewardPrompt,
      type: PromptTypes.INFO,
      message: (
        <div className="flex items-center gap-2">
          <span>
            Pool rewards{" "}
            {
              <ValueDisplay
                className="text14Bold"
                value={toPrecision(claimable.toString(), decimals)}
                decimals={decimals}
              />
            }{" "}
            {symbol} available.
          </span>
          <ClaimPoolRewardButton className="underline" />
          <CompoundPoolRewardButton className="underline" />
        </div>
      ),
      close: () => setVisible(false, { expires: 1 }),
    };
  }, [claimable, loading, setVisible, visible, decimals, symbol]);
}

function PoolClaimRewardPromptImpl({ onClose }) {
  const prompt = usePoolClaimRewardPrompt();
  if (isEmpty(prompt)) {
    return null;
  }

  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close?.();
        },
      }}
    />
  );
}

export default function PoolClaimRewardPrompt({ onClose }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return (
    <WithPallet pallet="staking">
      <MyPoolRewardProvider>
        <PoolClaimRewardPromptImpl onClose={onClose} />
      </MyPoolRewardProvider>
    </WithPallet>
  );
}
