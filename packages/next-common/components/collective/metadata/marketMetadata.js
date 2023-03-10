import React, { useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import {
  bg_theme,
  block,
  border_hidden,
  cursor_pointer,
  flex,
  flex_col,
  items_center,
  m_b,
  m_t,
  overflow_hidden,
  p_x,
  p_y,
  rounded,
  rounded_4,
  space_x,
  text_secondary,
  text_theme,
  w,
  w_full,
} from "next-common/styles/tailwindcss";
import { smcss } from "next-common/utils/responsive";
import { p_12_medium, p_14_medium } from "../../../styles/componentCss";
import ExternalLink from "../../externalLink";
import InnerDataTable from "../../table/innerDataTable";
const JsonView = dynamic(() => import("../../jsonView"), { ssr: false });

const Wrapper = styled.div`
  ${flex};
  ${flex_col};
  ${overflow_hidden};
  ${w_full};
`;

const HeaderWrapper = styled.div`
  ${flex};
  ${items_center};
  ${m_b(12)};
  ${smcss(block)};
`;
const HeaderTitle = styled.div`
  ${p_14_medium};
  ${w(160)};
`;

const TagButton = styled.button`
  ${p_x(8)};
  ${p_y(4)};
  ${bg_theme("grey100Bg")};
  ${p_12_medium};
  ${rounded};
  ${text_secondary};
  ${border_hidden};
  ${cursor_pointer};
  line-height: 1;

  &.active {
    ${bg_theme("primaryPurple100")};
    ${text_theme("primaryPurple500")};
  }
`;
const TagsWrapper = styled.div`
  ${flex};
  ${items_center};
  ${space_x(8)};

  ${smcss(m_t(8))};
`;

const ViewWrapper = styled.div`
  ${rounded_4};
  border: 24px solid;
  border-color: ${(p) => p.theme.grey100Bg};
`;

const DataTableViewDescription = styled.div`
  a {
    ${text_theme("secondarySapphire500")};
  }
`;

const QuestionLink = styled(ExternalLink)`
  ${text_theme("secondarySapphire500")};
`;

export default function MarketMetadata({ id, metadata }) {
  const [view, setView] = useState("metadata");

  if (!metadata) {
    return <div>no data</div>;
  }

  const questionLink = `https://app.zeitgeist.pm/markets/${id}`;

  const dataTableViewData = {
    Question: (
      <QuestionLink href={questionLink}>{metadata.question}</QuestionLink>
    ),
    Description: (
      <DataTableViewDescription
        dangerouslySetInnerHTML={{ __html: metadata.description }}
      />
    ),
    Tags: metadata.tags?.join("/"),
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <HeaderTitle>Market</HeaderTitle>
        <TagsWrapper>
          <TagButton
            className={view === "metadata" && "active"}
            onClick={() => setView("metadata")}
          >
            Metadata
          </TagButton>
          <TagButton
            className={view === "data" && "active"}
            onClick={() => setView("data")}
          >
            Data
          </TagButton>
        </TagsWrapper>
      </HeaderWrapper>

      <ViewWrapper>
        {view === "metadata" && <InnerDataTable data={dataTableViewData} />}
        {view === "data" && <JsonView src={metadata} />}
      </ViewWrapper>

      <div />
    </Wrapper>
  );
}
