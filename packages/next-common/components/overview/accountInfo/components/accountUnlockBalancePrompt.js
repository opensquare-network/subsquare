import useVoteBalance from "next-common/hooks/account/useVoteBalance";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Prompt from "./prompt";
import Link from "next/link";
import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";

export default function AccountUnlockBalancePrompt() {
  useFetchMyReferendaVoting();
  const { unlockBalance } = useVoteBalance();
  const { symbol, decimals } = useChainSettings();
  return (
    unlockBalance !== "0" && (
      <Prompt>
        <div className="text-textSecondary">
          You have {toPrecision(unlockBalance, decimals)} {symbol} expired votes
          available to unlock, manage{" "}
          <Link
            className="underline text14Medium font-[700]"
            href={"/account/votes"}
          >
            here
          </Link>
          .
        </div>
      </Prompt>
    )
  );
}
