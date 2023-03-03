import React from "react";
import styled, { css } from "styled-components";

import PostList from "next-common/components/postList";
import PlusIcon from "../../assets/imgs/icons/plusInCircle.svg";
import EmptyOverview from "./emptyOverview";
import OverviewSummary from "../summary/overviewSummary";
import AllianceOverviewSummary from "../summary/allianceOverviewSummary";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";
import { mdcss, smcss } from "../../utils/responsive";
import { TitleContainer as TitleContainerOrigin } from "../styled/containers/titleContainer";
import { useChain } from "../../context/chain";
import { isCollectivesChain } from "../../utils/chain";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 26px;
  }
`;

const Create = styled.a`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.primaryPurple500};
  font-size: 14px;
  white-space: nowrap;
  svg {
    margin-right: 8px;
  }
  cursor: pointer;
`;

const TitleContainer = styled(TitleContainerOrigin)`
  margin-bottom: 16px;
`;

const OverviewSummaryWrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  ${mdcss(css`
    max-width: 960px;
  `)}
  ${smcss(css`
    margin: 0 16px;
  `)}
`;

export default function Overview({ overviewData, summaryData }) {
  const chain = useChain();

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  const allCategoriesCount = (overviewData || []).reduce(
    (result, category) => result + category.items?.length || 0,
    0,
  );
  if (allCategoriesCount <= 0) {
    // All items are empty, show default empty page
    return (
      <Wrapper>
        <OverviewSummaryWrapper>
          <TitleContainer>Overview</TitleContainer>
          <SummaryComponent summaryData={summaryData} />
        </OverviewSummaryWrapper>

        <EmptyOverview />
      </Wrapper>
    );
  }

  const createDiscussion = (
    <Create href="post/create">
      <PlusIcon />
      New Discussion
    </Create>
  );

  return (
    <Wrapper>
      <OverviewSummaryWrapper>
        <TitleContainer>Overview</TitleContainer>
        <SummaryComponent summaryData={summaryData} />
      </OverviewSummaryWrapper>

      {overviewData.map((item, index) => {
        if (item) {
          return (
            <PostList
              key={index}
              category={item.category}
              link={item.link}
              items={item.items}
              type={item.type}
              create={item.category === "Discussions" && createDiscussion}
            />
          );
        }
      })}
    </Wrapper>
  );
}
