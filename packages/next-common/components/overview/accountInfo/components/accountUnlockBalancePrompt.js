import useVoteBalance from "next-common/hooks/account/useVoteBalance";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";
import { createGlobalState } from "react-use";
import { PromptTypes } from "next-common/components/scrollPrompt";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSelector } from "react-redux";
import { isLoadingReferendaSummarySelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import WithPallet from "next-common/components/common/withPallet";
import { isEmpty } from "lodash-es";
import { ScrollPromptItemWrapper } from "next-common/components/scrollPrompt";

const useMode = createGlobalState(true);

export default function AccountUnlockBalancePrompt({ onClose }) {
  return (
    <WithPallet pallet="referenda">
      <AccountUnlockBalancePromptImpl onClose={onClose} />
    </WithPallet>
  );
}

function useAccountUnlockBalancePrompt() {
  const [visible, setVisible] = useMode(true);
  useFetchMyReferendaVoting();
  const { unlockBalance } = useVoteBalance();
  const { symbol, decimals } = useChainSettings();
  const isLoading = useSelector(isLoadingReferendaSummarySelector);

  if (isLoading || unlockBalance.isZero() || !visible) {
    return {};
  }
  return {
    key: "AccountUnlockBalancePromptImpl",
    message: (
      <div>
        You have&nbsp;
        {
          <ValueDisplay
            className="text14Bold"
            value={toPrecision(unlockBalance.toString(), decimals)}
            decimals={decimals}
          />
        }
        &nbsp;{symbol} votes expired available to unlock, check it&nbsp;
        <Link className="underline text14Bold " href="/account/votes">
          here
        </Link>
      </div>
    ),
    type: PromptTypes.INFO,
    close: () => setVisible(false),
  };
}

function AccountUnlockBalancePromptImpl({ onClose }) {
  const prompt = useAccountUnlockBalancePrompt();
  if (isEmpty(prompt)) {
    return null;
  }
  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close();
        },
      }}
    />
  );
}
