import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { nestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { cn, toPrecision } from "next-common/utils";
import { bnSumBy, bnToPercentage } from "next-common/utils/bn";
import { useSelector } from "react-redux";

function Container({ children, className = "" }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2",
        "max-sm:grid-cols-1 max-sm:gap-y-2",
        "text14Medium",
        "w-full rounded-lg",
        "py-2.5 px-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function DVDelegateCard({ data }) {
  const { decimals, symbol } = useChainSettings();

  const nestedVotes = useSelector(nestedVotesSelector);
  const nestedTotalVotesValue = bnSumBy(nestedVotes, "totalVotes");

  const aye = data?.aye;
  const nay = data?.aye === false;
  const abstain = data?.isAbstain;
  const totalVotes = data?.totalVotes;
  const unvoted = isNil(totalVotes);
  const delegators = data?.directVoterDelegations;

  const user = (
    <AddressUser linkToVotesPage add={data.account} maxWidth={220} />
  );

  const percentage = `${bnToPercentage(
    totalVotes,
    nestedTotalVotesValue,
  ).toFixed(2)}%`;

  let voteStats;
  if (aye) {
    voteStats = `aye (${percentage})`;
  } else if (nay) {
    voteStats = `nay (${percentage})`;
  } else if (abstain) {
    voteStats = `abstain (${percentage})`;
  } else if (unvoted) {
    voteStats = "unvote";
  }

  return (
    <Container
      className={cn(
        aye && "bg-green100 text-green500",
        nay && "bg-red100 text-red500",
        abstain && "bg-neutral200 text-textSecondary",
        unvoted && "bg-neutral200 text-textDisabled",
      )}
    >
      {user}

      <div className="flex justify-between">
        <div className="capitalize">{voteStats}</div>

        {!isNil(totalVotes) && (
          <Tooltip
            content={
              !!delegators?.length && `Delegators: ${delegators?.length}`
            }
          >
            <ValueDisplay
              className="text-inherit"
              showTooltip={false}
              value={toPrecision(totalVotes, decimals)}
              symbol={symbol}
            />
          </Tooltip>
        )}
      </div>
    </Container>
  );
}
