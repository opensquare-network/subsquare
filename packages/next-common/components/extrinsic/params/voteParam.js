import Select from "next-common/components/select";
import { useCallback, useEffect, useState } from "react";

const EMPTY_VOTE = { aye: true, conviction: 0 };

const optAye = [
  { label: "Nay", value: false },
  { label: "Aye", value: true },
];

const optConv = [
  { label: "None", value: 0 },
  { label: "Locked1x", value: 1 },
  { label: "Locked2x", value: 2 },
  { label: "Locked3x", value: 3 },
  { label: "Locked4x", value: 4 },
  { label: "Locked5x", value: 5 },
  { label: "Locked6x", value: 6 },
];

export default function VoteParam({ setValue }) {
  const [vote, setVote] = useState(EMPTY_VOTE);

  const onChangeVote = useCallback(
    (aye) => setVote(({ conviction }) => ({ aye, conviction })),
    [],
  );

  const onChangeConviction = useCallback(
    (conviction) => setVote(({ aye }) => ({ aye, conviction })),
    [],
  );

  useEffect(() => {
    setValue({
      isValid: true,
      data: vote,
    });
  }, [setValue, vote]);

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-col gap-[8px]">
        <span className="text12Bold whitespace-nowrap">aye: bool</span>
        <Select
          options={optAye}
          value={vote.aye}
          onChange={(item) => onChangeVote(item.value)}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <span className="text12Bold whitespace-nowrap">
          conviction: Conviction
        </span>
        <Select
          options={optConv}
          value={vote.conviction}
          onChange={(item) => onChangeConviction(item.value)}
        />
      </div>
    </div>
  );
}
