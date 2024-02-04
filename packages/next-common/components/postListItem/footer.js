import React from "react";
import {
  DemocracyTag,
  TreasuryTag,
} from "next-common/components/tags/business";
import businessCategory from "next-common/utils/consts/business/category";
import IpfsLink from "next-common/components/alliance/ipfsLink";
import PostLabels from "next-common/components/postLabels";
import { Footer, MobileHiddenInfo } from "./styled";
import PostUser from "./postUser";
import Status from "./status";
import VoteSummaryBar from "./voteSummaryBar";
import TrackName from "./trackName";
import ChildBountyParent from "./childBountyParent";
import CommentCount from "./commentCount";
import PostTime from "./postTime";

export default function ItemFooter({ data, type }) {
  return (
    <>
      <Footer>
        <PostUser data={data} type={type} />
        <TrackName data={data} type={type} />
        {data.isTreasury && <TreasuryTag />}
        {data.isDemocracy && <DemocracyTag />}
        <PostTime data={data} type={type} />
        <CommentCount data={data} />
        <VoteSummaryBar data={data} type={type} />
        {businessCategory.allianceAnnouncements === type && (
          <IpfsLink cid={data.cid} />
        )}
        <ChildBountyParent data={data} />
        {data?.labels && data?.labels?.length > 0 && (
          <MobileHiddenInfo>
            <PostLabels labels={data.labels} />
          </MobileHiddenInfo>
        )}
      </Footer>
      <Status />
    </>
  );
}
