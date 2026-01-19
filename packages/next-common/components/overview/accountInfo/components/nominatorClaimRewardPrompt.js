import { useMemo } from "react";
import { isEmpty } from "lodash-es";

import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { CACHE_KEY } from "next-common/utils/constants";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

import { NominatorUnClaimedRewardsProvider } from "next-common/components/staking/overview/accountNomination/context/nominatorUnClaimedRewardsContext";
import { useNominatorUnClaimedRewardsContext } from "next-common/components/staking/overview/accountNomination/context/nominatorUnClaimedRewardsContext";
import ClaimNominatorRewardButton from "next-common/components/staking/overview/accountNomination/quickActions/claimButton";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import WithPallet from "next-common/components/common/withPallet";

function useNominatorClaimRewardPrompt() {
  const { decimals, symbol } = useChainSettings();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.nominatorClaimRewardPrompt,
    true,
  );

  const context = useNominatorUnClaimedRewardsContext();
  const { result, loading } = context || {};
  const totalRewards = result?.totalRewards || "0";
  const totalRewardsFormatted = toPrecision(totalRewards, decimals, 2);

  return useMemo(() => {
    if (!visible || loading || Number(totalRewardsFormatted) <= 0) {
      return {};
    }

    return {
      key: CACHE_KEY.nominatorClaimRewardPrompt,
      type: PromptTypes.INFO,
      message: (
        <div className="flex items-center gap-2">
          <span>
            Nomination rewards <b>{totalRewardsFormatted}</b> {symbol} available
            to claim.
          </span>
          <ClaimNominatorRewardButton className="underline" />
        </div>
      ),
      close: () => setVisible(false, { expires: 1 }),
    };
  }, [loading, setVisible, totalRewardsFormatted, visible, symbol]);
}

function NominatorClaimRewardPromptImpl({ onClose }) {
  const prompt = useNominatorClaimRewardPrompt();
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

export default function NominatorClaimRewardPrompt({ onClose }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return (
    <WithPallet pallet="staking">
      <NominatorUnClaimedRewardsProvider nominatorAddress={realAddress}>
        <NominatorClaimRewardPromptImpl onClose={onClose} />
      </NominatorUnClaimedRewardsProvider>
    </WithPallet>
  );
}
