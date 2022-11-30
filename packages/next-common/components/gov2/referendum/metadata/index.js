import KVList from "../../../listInfo/kvList";
import React from "react";
import Proposal from "../../../proposal";
import isNil from "lodash.isnil";
import { GreyText } from "./styled";
import BlockPeriod from "./blockPeriod";
import UserBond from "./userBond";
import { useTrack } from "../../../../context/post/gov2/track";

function getEnactmentValue(enactment = {}) {
  let value = "";
  let key;
  if (!isNil(enactment.at)) {
    key = "At";
    value = enactment.at;
  } else if (!isNil(enactment.after)) {
    key = "After";
    value = enactment.after;
  }

  if (!key) {
    return "--";
  }

  const localeValue = Number(value).toLocaleString();
  return `${key}: ${localeValue}`;
}

export default function Gov2ReferendumMetadata({ detail }) {
  const onchainData = detail?.onchainData ?? {};
  const info = onchainData?.info ?? {};
  const proposal = onchainData?.proposal ?? {};
  const trackInfo = useTrack();
  const proposalHash = onchainData?.proposalHash;

  const metadata = [
    [
      "Submission",
      <UserBond
        address={info?.submissionDeposit?.who}
        bond={info?.submissionDeposit?.amount}
        key="submission-bond"
      />,
    ],
    [
      "Decision",
      info?.decisionDeposit ? (
        <UserBond
          address={info?.decisionDeposit?.who}
          bond={info?.decisionDeposit?.amount}
          key="decision-bond"
        />
      ) : (
        <GreyText>--</GreyText>
      ),
    ],
    [
      "Decision Period",
      <BlockPeriod block={trackInfo.decisionPeriod} key="decision-period" />,
    ],
    [
      "Confirming Period",
      <BlockPeriod block={trackInfo.confirmPeriod} key="confirmation-period" />,
    ],
    ["Enact", getEnactmentValue(info?.enactment)],
    ["Proposal Hash", proposalHash],
  ];

  if (proposal?.args) {
    metadata.push([
      <Proposal
        key="preimage"
        call={proposal}
        referendumIndex={detail?.onchainData.referendumIndex}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
