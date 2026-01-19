import { useMemo } from "react";
import { isEmpty } from "lodash-es";

import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { CACHE_KEY } from "next-common/utils/constants";

import useStakingBalance from "next-common/components/staking/overview/accountNomination/useStakingBalance";
import { MyStakingLedgerProvider } from "next-common/context/staking/myStakingLedger";
import { ActiveEraProvider } from "next-common/context/staking/activeEra";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import WithPallet from "next-common/components/common/withPallet";
import ValueDisplay from "next-common/components/valueDisplay";
import Link from "next-common/components/link";

function useNominatorWithdrawUnbondedPrompt() {
  const { decimals, symbol } = useChainSettings();

  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.nominatorWithdrawUnbondedPrompt,
    true,
  );
  const { loading, unlocked } = useStakingBalance();

  return useMemo(() => {
    if (!visible || loading || !unlocked || unlocked <= 0n) {
      return {};
    }

    return {
      key: CACHE_KEY.nominatorWithdrawUnbondedPrompt,
      type: PromptTypes.INFO,
      message: (
        <div className="flex items-center gap-2">
          <span>
            Staking: there is{" "}
            {
              <ValueDisplay
                className="text14Bold"
                value={toPrecision(unlocked.toString(), decimals)}
                decimals={decimals}
              />
            }{" "}
            {symbol} nomination unbonded balance available to withdraw. Check it{" "}
            <Link className="underline" href={"/staking"}>
              here
            </Link>
          </span>
        </div>
      ),
      close: () => setVisible(false, { expires: 1 }),
    };
  }, [loading, setVisible, unlocked, visible, decimals, symbol]);
}

function NominatorWithdrawUnbondedPromptImpl({ onClose }) {
  const prompt = useNominatorWithdrawUnbondedPrompt();
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

export default function NominatorWithdrawUnbondedPrompt({ onClose }) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

  return (
    <WithPallet pallet="staking">
      <MyStakingLedgerProvider>
        <ActiveEraProvider>
          <NominatorWithdrawUnbondedPromptImpl onClose={onClose} />
        </ActiveEraProvider>
      </MyStakingLedgerProvider>
    </WithPallet>
  );
}
