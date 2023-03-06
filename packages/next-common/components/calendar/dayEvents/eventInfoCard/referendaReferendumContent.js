import React from "react";
import {
  referendaReferendumBaseUrl,
  referendaTrackBaseUrl,
} from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import CallItem from "./infoItem/callItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import TrackItem from "./infoItem/trackItem";
import ValueItem from "./infoItem/valueItem";

export default function referendaReferendumContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={referendaReferendumBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <TrackItem
        track={data?.track}
        trackName={data?.trackName}
        baseUrl={referendaTrackBaseUrl}
      />
      <CallItem proposal={data.proposal?.call} />
      {data.isTreasury && (
        <>
          <ValueItem value={data.treasuryInfo?.amount} itemName="Amount" />
          <BeneficiaryItem beneficiary={data.treasuryInfo?.beneficiary} />
        </>
      )}
    </>
  );
}
