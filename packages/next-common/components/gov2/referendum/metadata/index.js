import KVList from "../../../listInfo/kvList";
import React from "react";
import isNil from "lodash.isnil";
import { GreyText, ValueWrapper } from "./styled";
import BlockPeriod from "./blockPeriod";
import UserBond, { DecisionUserBond } from "./userBond";
import { useTrack } from "../../../../context/post/gov2/track";
import { useOnchainData } from "next-common/context/post";
import Copyable from "next-common/components/copyable";

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

export default function Gov2ReferendumMetadata({ info, pallet = "referenda" }) {
  const onchainData = useOnchainData();
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
        <DecisionUserBond
          address={info?.decisionDeposit?.who}
          bond={info?.decisionDeposit?.amount}
          pallet={pallet}
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
    [
      "Enact",
      <ValueWrapper key="enactment">
        {getEnactmentValue(info?.enactment)}
      </ValueWrapper>,
    ],
    proposalHash
      ? [
          "Proposal Hash",
          <ValueWrapper key="proposal-hash">
            <Copyable key="hash">{proposalHash}</Copyable>
          </ValueWrapper>,
        ]
      : null,
  ].filter(Boolean);

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
