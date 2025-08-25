import React, { useMemo } from "react";
import Tag from "next-common/components/tags/state/tag";
import MotionElapse from "next-common/components/motionElapse";
import Divider from "../styled/layout/divider";
import businessCategory from "../../utils/consts/business/category";
import { getMotionStateArgs } from "../../utils/collective/result";
import IpfsLink from "../alliance/ipfsLink";
import { useScreenSize } from "../../utils/hooks/useScreenSize";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";
import {
  PostItemAISummary,
  PostItemBanner,
  PostItemCommentCount,
  PostItemDemocracyTag,
  PostItemLabel,
  PostItemMalicious,
  PostItemTime,
  PostItemTitle,
  PostItemTitleValue,
  PostItemTreasuryTag,
} from "./common";

import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "./styled";

function PostUser({ data }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;

  if (data?.author) {
    return (
      <SystemUser
        user={data?.author}
        className="text12Medium text-textPrimary"
        maxWidth={userMaxWidth}
      />
    );
  }

  return (
    <AddressUser
      add={data.address || data.proposer}
      className="text12Medium text-textPrimary"
      maxWidth={userMaxWidth}
    />
  );
}

export default function Post({ data, type }) {
  const stateArgs = useMemo(() => {
    if (
      [
        businessCategory.collective,
        businessCategory.financialMotions,
        businessCategory.advisoryMotions,
        businessCategory.treasuryCouncilMotions,
        businessCategory.openTechCommitteeProposals,
      ].includes(type)
    ) {
      return getMotionStateArgs(data.onchainData.state);
    }
  }, [data.onchainData.state, type]);

  const elapseIcon = useMemo(() => {
    if (
      [
        businessCategory.financialMotions,
        businessCategory.advisoryMotions,
        businessCategory.allianceMotions,
        businessCategory.treasuryCouncilMotions,
        businessCategory.openTechCommitteeProposals,
      ].includes(type)
    ) {
      return <MotionElapse motion={data.onchainData} />;
    }
  }, [data.onchainData, type]);

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data.detailLink} />
          <PostItemTitleValue data={data} />
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostUser data={data} type={type} />
            <PostItemTreasuryTag isTreasury={data.isTreasury} />
            <PostItemDemocracyTag isDemocracy={data.isDemocracy} />
            <PostItemTime data={data} elapseIcon={elapseIcon} />
            <PostItemCommentCount data={data} />
            {businessCategory.allianceAnnouncements === type && (
              <IpfsLink cid={data.cid} />
            )}
            <PostItemLabel labels={data.labels} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>

          <div className="flex items-center gap-x-2">
            {data.status && (
              <Tag
                state={data.status}
                category={type}
                args={stateArgs}
                data={data}
              />
            )}
          </div>
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data.bannerCid} />
    </Wrapper>
  );
}
