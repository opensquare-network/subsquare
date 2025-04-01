import { useState } from "react";
import { NoDelegationInfo, CommonDelegationInfoPanel } from "../delegationInfo";
import DelegationDetailButton from "next-common/components/profile/OpenGovBio/votesPower/detail";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useReferendaDelegationContext } from "../context/referendaDelegationContext";

const MyOpenGovDelegationInfoPopup = dynamicPopup(() => import("./popup"));

export default function OpenGovDelegationInfo() {
  const { result, isLoading } = useReferendaDelegationContext();
  const [detailOpen, setDetailOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  if (result?.length === 0) {
    return <NoDelegationInfo />;
  }

  return (
    <>
      <div className="w-full flex flex-row">
        <CommonDelegationInfoPanel
          suffix={<DelegationDetailButton setDetailOpen={setDetailOpen} />}
        >
          <span>
            You are delegating your votes to this account in
            <span className="text-textSecondary mx-1">{result?.length}</span>
            tracks.
          </span>
        </CommonDelegationInfoPanel>
      </div>
      {detailOpen && (
        <MyOpenGovDelegationInfoPopup
          data={result}
          setDetailOpen={setDetailOpen}
        />
      )}
    </>
  );
}
