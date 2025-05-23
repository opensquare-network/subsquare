import useVoteBalance from "next-common/hooks/account/useVoteBalance";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";
import { createGlobalState } from "react-use";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { PromptTypes, colorStyle } from "next-common/components/scrollPrompt";
import { SystemClose } from "@osn/icons/subsquare";

const useMode = createGlobalState(true);
export default function AccountUnlockBalancePrompt() {
  const [visible, setVisible] = useMode(true);
  useFetchMyReferendaVoting();
  const { unlockBalance } = useVoteBalance();
  const { symbol, decimals } = useChainSettings();
  if (unlockBalance === "0" || visible) return null;

  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes]}
    >
      <div className="text-textSecondary">
        You have {toPrecision(unlockBalance, decimals)} expired {symbol}{" "}
        available to unlock, manage{" "}
        <Link
          className="underline text14Medium font-[700]"
          href={"/account/votes"}
        >
          here
        </Link>
        .
      </div>
      <SystemClose
        className="w-5 h-5 text-textSecondary"
        role="button"
        onClick={() => {
          setVisible(false);
        }}
      />
    </GreyPanel>
  );
}
