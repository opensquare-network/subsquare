import React, { useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import {
  block,
  border_hidden,
  cursor_pointer,
  flex,
  flex_col,
  items_center,
  m_b,
  m_t,
  m_y,
  overflow_hidden,
  p_x,
  p_y,
  rounded,
  rounded_4,
  space_x,
  text_secondary,
  w,
  w_full,
} from "next-common/styles/tailwindcss";
import { smcss } from "next-common/utils/responsive";
import {
  p_12_medium,
  p_14_medium,
  p_14_normal,
} from "../../../styles/componentCss";
import ExternalLink from "../../externalLink";
import InnerDataTable from "../../table/innerDataTable";
import WarningIcon from "../../../assets/imgs/icons/warning.svg";

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
  background-color: var(--neutral200);
  ${p_12_medium};
  ${rounded};
  ${text_secondary};
  ${border_hidden};
  ${cursor_pointer};
  line-height: 1;

  &.active {
    background-color: var(--purple100);
    color: var(--purple500);
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
  border-color: var(--neutral200);
`;

const DataTableViewDescription = styled.div`
  ${p_14_normal};
  a {
    color: var(--sapphire500);
  }
`;

const DataTableViewQuestionLink = styled(ExternalLink)`
  ${p_14_normal};
  color: var(--sapphire500);
`;

const DataTableViewTags = styled.div`
  ${p_14_normal};
`;

const UnavailableText = styled.p`
  ${m_y(0)};
  ${p_14_normal};
`;

export default function MarketMetadata({ id, metadata }) {
  const [view, setView] = useState("metadata");

  const questionLink = `https://app.zeitgeist.pm/markets/${id}`;

  const dataTableViewData = {
    Question: (
      <DataTableViewQuestionLink href={questionLink}>
        {metadata?.question}
      </DataTableViewQuestionLink>
    ),
    Description: (
      <DataTableViewDescription
        dangerouslySetInnerHTML={{ __html: metadata?.description }}
      />
    ),
    Tags: <DataTableViewTags>{metadata?.tags?.join("/")}</DataTableViewTags>,
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <HeaderTitle>Market</HeaderTitle>
        {metadata ? (
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
        ) : (
          <TagsWrapper>
            <WarningIcon />
            <UnavailableText>Metadata unavailable</UnavailableText>
          </TagsWrapper>
        )}
      </HeaderWrapper>

      {metadata && (
        <ViewWrapper>
          {view === "metadata" && <InnerDataTable data={dataTableViewData} />}
          {view === "data" && <JsonView src={metadata} />}
        </ViewWrapper>
      )}

      <div />
    </Wrapper>
  );
}
