import { noop } from "lodash-es";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import Tooltip from "next-common/components/tooltip";
import useMyRank from "../memberPromotionPopup/voteButtons/useMyRank";
import useRequiredRankToPromoteMember from "./useRequiredRankToPromoteMember";

function RankOption({ currentRank, optionRank }) {
  const myRank = useMyRank();
  const requiredRank = useRequiredRankToPromoteMember(currentRank, optionRank);
  if (requiredRank <= myRank) {
    return optionRank;
  }

  return (
    <Tooltip
      className="w-full"
      content={`Only rank >= ${requiredRank} can create a referendum and then vote`}
    >
      <div className="text-textTertiary">{optionRank}</div>
    </Tooltip>
  );
}

export default function RankField({
  currentRank,
  selectedRank,
  setSelectedRank = noop,
}) {
  const options = [1, 2, 3]
    .filter((r) => r > currentRank)
    .map((r) => ({
      text: <RankOption currentRank={currentRank} optionRank={r} />,
      value: r,
    }));

  return (
    <CommonSelectField
      title="To Rank"
      value={selectedRank}
      setValue={setSelectedRank}
      options={options}
    />
  );
}
