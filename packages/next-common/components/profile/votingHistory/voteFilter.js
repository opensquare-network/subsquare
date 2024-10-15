import Select from "next-common/components/select";
import { createStateContext } from "react-use";

export const [useVoteFilterState, VoteFilterStateProvider] =
  createStateContext("all");

export function VoteFilter() {
  const [voteFilter, setVoteFilter] = useVoteFilterState();
  return (
    <div>
      <Select
        className="w-[80px]"
        value={voteFilter}
        options={[
          { value: "all", label: "All" },
          { value: "aye", label: "Aye" },
          { value: "nay", label: "Nay" },
        ]}
        onChange={({ value }) => setVoteFilter(value)}
      />
    </div>
  );
}
