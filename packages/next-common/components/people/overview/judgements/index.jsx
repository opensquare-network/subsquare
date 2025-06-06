import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import columnsDef from "./columns";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import RightWrapper from "next-common/components/rightWraper";
import PrimaryButton from "next-common/lib/button/primary";
import useJudgementsData from "../hooks/useJudgementsData";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";
import { isIdentityEmpty } from "next-common/components/people/common";
import Divider from "next-common/components/styled/layout/divider";

const RequestJudgementPopup = dynamicPopup(
  () => import("next-common/components/requestJudgementPopup"),
  {
    ssr: false,
  },
);

function RequestJudgements() {
  const [showPopup, setShowPopup] = useState(false);
  const { info, isLoading } = useIdentityInfoContext();
  const isEmpty = isIdentityEmpty(info);

  if (isLoading || isEmpty) {
    return null;
  }

  return (
    <div className="mt-4">
      <RightWrapper>
        <PrimaryButton className="w-auto" onClick={() => setShowPopup(true)}>
          Request Judgement
        </PrimaryButton>
      </RightWrapper>
      {showPopup && (
        <RequestJudgementPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

function JudgementsTable() {
  const { data, isLoading } = useJudgementsData();

  return (
    <>
      <ScrollerX>
        <SignerPopupWrapper>
          <MapDataList
            columnsDef={columnsDef}
            data={data}
            loading={isLoading}
            noDataText="No current judgements"
          />
        </SignerPopupWrapper>
      </ScrollerX>
      {!isLoading && data?.length === 0 && <Divider className="mb-4" />}
    </>
  );
}

export default function PeopleOverviewJudgements() {
  return (
    <SecondaryCardDetail>
      <JudgementsTable />
      <RequestJudgements />
    </SecondaryCardDetail>
  );
}
