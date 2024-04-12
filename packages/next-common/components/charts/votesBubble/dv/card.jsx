import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";

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

  const aye = data?.aye;
  const nay = data?.aye === false;
  const abstain = data?.isAbstain;
  const votes = data?.votes;
  const unvoted = isNil(votes);

  const user = <AddressUser add={data.account} maxWidth={220} />;

  let ratio;
  if (aye) {
    ratio = "aye";
  } else if (nay) {
    ratio = "nay";
  } else if (abstain) {
    ratio = "abstain";
  } else if (unvoted) {
    ratio = "unvote";
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
        <div className="capitalize">{ratio}(TODO)</div>

        {!isNil(votes) && (
          <Tooltip
            content={
              !!data?.directVoterDelegations?.length &&
              `Delegators: ${data?.directVoterDelegations?.length}`
            }
          >
            <ValueDisplay
              className="text-inherit"
              showTooltip={false}
              value={toPrecision(data.totalVotes, decimals)}
              symbol={symbol}
            />
          </Tooltip>
        )}
      </div>
    </Container>
  );
}
