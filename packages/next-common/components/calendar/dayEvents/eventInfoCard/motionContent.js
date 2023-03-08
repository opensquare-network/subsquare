import React from "react";
import CallItem from "./infoItem/callItem";
import MotionIndexItem from "./infoItem/motionIndexItem";
import ProposerItem from "./infoItem/proposerItem";
import { ItemWrapper } from "./infoItem/styled";
import TitleItem from "./infoItem/titleItem";

export default function MotionContent({ motionHash, data, baseUrl }) {
  return (
    <>
      <MotionIndexItem motionHash={motionHash} data={data} baseUrl={baseUrl} />
      <TitleItem title={data?.postTitle} />
      <ProposerItem proposer={data?.motion?.proposer} />
      <ItemWrapper>
        <span>Threshold:</span>
        <span>{data?.motion?.threshold}</span>
      </ItemWrapper>
      {data?.motion?.end && (
        <ItemWrapper>
          <span>End:</span>
          <span>Block #{data?.motion?.end}</span>
        </ItemWrapper>
      )}
      <CallItem proposal={data?.motion?.proposal} />
    </>
  );
}
