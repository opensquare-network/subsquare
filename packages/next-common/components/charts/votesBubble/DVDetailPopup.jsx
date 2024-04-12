import Popup from "../../popup/wrapper/Popup";
import DVDetailDelegates from "./dv/delegates";
import DVDetailInfo from "./dv/info";

export default function DVDetailPopup({ closeFunc }) {
  return (
    <Popup
      title="Decentralized Voices Detail"
      className="w-[640px]"
      onClose={closeFunc}
    >
      <div>
        <DVDetailInfo />

        <hr />

        <DVDetailDelegates />
      </div>
    </Popup>
  );
}
