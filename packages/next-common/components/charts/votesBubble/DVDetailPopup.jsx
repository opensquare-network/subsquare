import { useMemo } from "react";
import Popup from "../../popup/wrapper/Popup";
import DVDetailDelegates from "./dv/delegates";
import DVDetailGuardians from "./dv/guardians";
import DVDetailInfo from "./dv/info";

export default function DVDetailPopup({
  closeFunc,
  dvVotes,
  dvVotesValue,
  dvPercentage,
  ayeVotesValue,
  ayePercentage,
  nayVotesValue,
  nayPercentage,
}) {
  const delegatesVotes = useMemo(
    () => dvVotes.filter((v) => v.role !== "guardian"),
    [dvVotes],
  );

  const guardiansVotes = useMemo(
    () => dvVotes.filter((v) => v.role === "guardian"),
    [dvVotes],
  );

  return (
    <Popup title="Decentralized Voices Detail" onClose={closeFunc}>
      <div>
        <DVDetailInfo
          dvVotesValue={dvVotesValue}
          dvPercentage={dvPercentage}
          ayeVotesValue={ayeVotesValue}
          ayePercentage={ayePercentage}
          nayVotesValue={nayVotesValue}
          nayPercentage={nayPercentage}
        />

        <hr />

        <DVDetailDelegates votes={delegatesVotes} />
        <DVDetailGuardians votes={guardiansVotes} />
      </div>
    </Popup>
  );
}
