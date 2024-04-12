import { has, partition } from "lodash-es";
import { useDecentralizedVoicesVotes } from "next-common/hooks/referenda/useDecentralizedVoicesVotes";
import DVDelegateCard from "./card";

export default function DVDetailDelegates() {
  const dvVotes = useDecentralizedVoicesVotes();

  const [voted, unvoted] = partition(dvVotes, (v) => {
    return has(v, "totalVotes") || has(v, "votes");
  });

  return (
    <div className="space-y-4 text-textPrimary">
      <div className="text14Bold mt-6 mb-4">
        Delegates
        {!!dvVotes.length && (
          <span className="text14Medium text-textTertiary ml-1">
            {dvVotes.length}
          </span>
        )}
      </div>

      <div className="max-h-[400px] scrollbar-pretty overflow-y-scroll space-y-2">
        {voted.map((data) => (
          <DVDelegateCard key={data.account} data={data} />
        ))}

        {!!voted.length && !!unvoted.length && <hr className="!my-4" />}

        {unvoted.map((data) => (
          <DVDelegateCard key={data.account} data={data} />
        ))}
      </div>
    </div>
  );
}
