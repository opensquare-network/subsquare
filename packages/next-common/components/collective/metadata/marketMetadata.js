import React, { useState } from "react";
import dynamic from "next/dynamic";
import ExternalLink from "../../externalLink";
import InnerDataTable from "../../table/innerDataTable";
import WarningIcon from "../../../assets/imgs/icons/warning.svg";
import { isNil } from "lodash-es";
import tw from "tailwind-styled-components";

const JsonView = dynamic(() => import("../../jsonView"), { ssr: false });

const Wrapper = tw.div`
  flex flex-col
  overflow-hidden
  w-full
`;

const HeaderWrapper = tw.div`
  flex items-center
  max-sm:block
`;
const HeaderTitle = tw.div`
  text14Medium
  w-40
`;

const TagButton = tw.button`
  text12Medium text-textSecondary
  px-2 py-1
  bg-neutral200
  rounded-sm
  border-none
  leading-none

  [&.active]:bg-theme100 [&.active]:text-theme500
`;
const TagsWrapper = tw.div`
  flex items-center
  space-x-2
  max-sm:mt-2
`;

export default function MarketMetadata({ id, metadata }) {
  const [view, setView] = useState("metadata");
  if (isNil(id)) {
    return null;
  }

  if (!metadata) {
    return (
      <Wrapper>
        <HeaderWrapper>
          <HeaderTitle>Market</HeaderTitle>
          <TagsWrapper>
            <WarningIcon />
            <p className="text14Medium my-0">Metadata unavailable</p>
          </TagsWrapper>
        </HeaderWrapper>
      </Wrapper>
    );
  }

  const questionLink = `https://app.zeitgeist.pm/markets/${id}`;

  const dataTableViewData = {
    Question: (
      <ExternalLink
        href={questionLink}
        className="text14Medium"
      >
        {metadata?.question}
      </ExternalLink>
    ),
    Description: (
      <div
        className="text14Medium [&_a]:text-sapphire500"
        dangerouslySetInnerHTML={{ __html: metadata?.description }}
      />
    ),
    Tags: <div className="text14Medium">{metadata?.tags?.join("/")}</div>,
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

      <div className="rounded border-[24px] border-neutral200 mt-3">
        {view === "metadata" && <InnerDataTable data={dataTableViewData} />}
        {view === "data" && <JsonView src={metadata} />}
      </div>

      <div />
    </Wrapper>
  );
}
