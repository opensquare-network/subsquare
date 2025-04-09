import Popup from "next-common/components/popup/wrapper/Popup";
import OpenGovVotesPowerDetailHeader from "./header";
import OpenGovVotesPowerDetailInfo from "./info";
import OpenGovVotesPowerDetailList from "./table";
import Divider from "next-common/components/styled/layout/divider";

export default function OpenGovVotesPowerDetailPopup({ setDetailOpen }) {
  return (
    <Popup
      title="Votes Power Detail"
      className="w-[640px] max-w-full"
      onClose={() => {
        setDetailOpen(false);
      }}
    >
      <OpenGovVotesPowerDetailHeader />
      <OpenGovVotesPowerDetailInfo />
      <Divider className="!my-0" />
      <OpenGovVotesPowerDetailList />
    </Popup>
  );
}
