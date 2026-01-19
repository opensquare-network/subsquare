import { useMemo } from "react";
import { isEmpty } from "lodash-es";

import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { CACHE_KEY } from "next-common/utils/constants";

import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";
import PoolWithdrawUnbondedButton from "next-common/components/staking/overview/accountStaking/withdrawUnbondedButton";
import { MyPoolProvider } from "next-common/context/staking/myPool";
import { ActiveEraProvider } from "next-common/context/staking/activeEra";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

function usePoolWithdrawUnbondedPrompt() {
  const { decimals, symbol } = useChainSettings();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.poolWithdrawUnbondedPrompt,
    true,
  );

  const { balances, loading } = useMyPoolInfo();
  const unlocked = balances?.unlocked;

  return useMemo(() => {
    if (!visible) {
      return {};
    }

    if (loading || !unlocked || unlocked <= 0n) {
      return {};
    }

    return {
      key: CACHE_KEY.poolWithdrawUnbondedPrompt,
      type: PromptTypes.INFO,
      message: (
        <div className="flex items-center gap-2">
          <span>
            Unlocked pool balance <b>{toPrecision(unlocked, decimals)}</b>{" "}
            {symbol} available to withdraw.
          </span>
          <PoolWithdrawUnbondedButton className="underline" />
        </div>
      ),
      close: () => setVisible(false, { expires: 1 }),
    };
  }, [loading, setVisible, unlocked, visible, decimals, symbol]);
}

function PoolWithdrawUnbondedPromptImpl({ onClose }) {
  const prompt = usePoolWithdrawUnbondedPrompt();
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

export default function PoolWithdrawUnbondedPrompt({ onClose }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return (
    <MyPoolProvider>
      <ActiveEraProvider>
        <PoolWithdrawUnbondedPromptImpl onClose={onClose} />
      </ActiveEraProvider>
    </MyPoolProvider>
  );
}
