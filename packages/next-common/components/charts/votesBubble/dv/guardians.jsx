import { isNil, partition } from "lodash-es";
import DVDelegateCard from "./card";

export default function DVDetailGuardians({ votes = [] }) {
  const [voted, noVoted] = partition(votes, (v) => !isNil(v?.totalVotes));
  if (votes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-textPrimary">
      <div className="text14Bold mt-6 mb-4">
        Guardians
        {!!votes.length && (
          <span className="text14Medium text-textTertiary ml-1">
            {votes.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {voted.map((data) => (
          <DVDelegateCard key={data.account} data={data} />
        ))}

        {!!voted.length && !!noVoted.length && <hr className="!my-4" />}

        {noVoted.map((data) => (
          <DVDelegateCard key={data.account} data={data} />
        ))}
      </div>
    </div>
  );
}
