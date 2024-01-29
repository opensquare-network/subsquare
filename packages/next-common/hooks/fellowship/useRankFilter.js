import { useState } from "react";
import Select from "next-common/components/select";

export default function useRankFilter(ranks = []) {
  const options = (ranks || []).map((rank) => ({
    label: String(rank),
    value: rank,
  }));

  options.unshift({
    label: "-",
    value: null,
  });

  const [rank, setRank] = useState(options[0].value);

  const component = (
    <div className="text12Medium text-textPrimary flex items-center gap-x-2">
      <div>Rank</div>
      <Select
        className="w-20"
        small
        value={rank}
        options={options}
        onChange={(option) => {
          setRank(option.value);
        }}
      />
    </div>
  );

  return {
    rank,
    component,
  };
}
