import { useState } from "react";
import { NoDelegationInfo, CommonDelegationInfoPanel } from "../delegationInfo";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useReferendaDelegationContext } from "../context/referendaDelegationContext";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";

const MyOpenGovDelegationInfoPopup = dynamicPopup(() => import("./popup"));

function DelegationDetailButton({ setDetailOpen }) {
  return (
    <SecondaryButton
      className="w-7 h-7 p-0 flex-shrink-0 absolute top-3 right-3"
      size="small"
      onClick={() => {
        setDetailOpen(true);
      }}
    >
      <SystemMenu className="w-4 h-4" />
    </SecondaryButton>
  );
}

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
