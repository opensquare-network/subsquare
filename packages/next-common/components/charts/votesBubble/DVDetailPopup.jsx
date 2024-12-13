import Popup from "../../popup/wrapper/Popup";
import DVDetailDelegates from "./dv/delegates";
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

        <DVDetailDelegates votes={dvVotes} />
      </div>
    </Popup>
  );
}
