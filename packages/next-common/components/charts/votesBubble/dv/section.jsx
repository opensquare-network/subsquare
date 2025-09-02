import { isNil, partition } from "lodash-es";
import DVDelegateCard from "./card";

export default function DVDetailSection({ title, votes = [] }) {
  const [voted, noVoted] = partition(votes, (v) => !isNil(v?.totalVotes));

  return (
    <div className="space-y-4 text-textPrimary">
      <div className="text14Bold mt-6 mb-4">
        {title}
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
