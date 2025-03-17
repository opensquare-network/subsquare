import { useState } from "react";
import { useDemocracyVotesPowerContext } from "../../context/votesPower";
import DetailButton from "next-common/components/detailButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import DemocracyVotesPowerDetailHeader from "./header";
import DemocracyVotesPowerDetailInfo from "./info";
import Divider from "next-common/components/styled/layout/divider";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import DelegationTabList from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationTabList";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

function DemocracyVotesPowerDetailPopup({ setShowPopup }) {
  const { address } = useDemocracyVotesPowerContext();
  const { beenDelegatedList } = useBeenDelegated(address);

  return (
    <Popup
      title="Votes Power Detail"
      className="w-[640px] max-w-full"
      onClose={() => {
        setShowPopup(false);
      }}
    >
      <DemocracyVotesPowerDetailHeader />
      <DemocracyVotesPowerDetailInfo
        delegatorCount={beenDelegatedList?.length || 0}
      />
      <Divider className="!my-0" />
      <TitleContainer className="text14Bold px-0">Delegators</TitleContainer>
      <DelegationTabList beenDelegatedList={beenDelegatedList} />
    </Popup>
  );
}

export default function DemocracyVotesPowerDetail() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <DetailButton
        onClick={() => {
          setShowPopup(true);
        }}
      />
      {showPopup && (
        <DemocracyVotesPowerDetailPopup setShowPopup={setShowPopup} />
      )}
    </>
  );
}
