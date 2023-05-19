import React, { useState } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "./tab";
import Pagination from "next-common/components/pagination";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import User from "next-common/components/user";
import styled from "styled-components";
import { inline_flex, text_tertiary } from "next-common/styles/tailwindcss";
import { p_12_medium, p_14_normal } from "next-common/styles/componentCss";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";

const Capital = styled.div`
  ${inline_flex};
  ${p_14_normal};
`;
const CapitalConvictionLabel = styled.span`
  width: 60px;
  ${text_tertiary};
`;
const Annotation = styled.p`
  ${p_12_medium};
  ${text_tertiary};
`;

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  allAbstain,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const [abstainPage, setAbstainPage] = useState(1);
  const pageSize = 50;

  let page = 1;
  let votes = [];
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = allAye;
  } else if (tabIndex === "Nay") {
    page = nayPage;
    votes = allNay;
  } else {
    page = abstainPage;
    votes = allAbstain;
  }

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else if (tabIndex === "Nay") {
      setNayPage(target);
    } else {
      setAbstainPage(target);
    }
  }

  const pagination = {
    page,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <BaseVotesPopup
      wide
      title="Flattened Votes"
      onClose={() => setShowVoteList(false)}
    >
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainsCount={allAbstain?.length || 0}
      />
      <VotesList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoadingVotes}
        tab={tabIndex}
      />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading, tab }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

  const columns = [
    {
      name: "VOTERS",
      style: { minWidth: 356, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 188, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    // NOTE: #2866, flattened capital votes
    const capital = item.balance;
    const votes = capital * item.conviction.toString() || item.balance;

    const row = [
      <User key="user" add={item.account} fontSize={14} noTooltip />,
      <Capital key="capital">
        <ValueDisplay
          key="value"
          value={toPrecision(capital, chainSettings.decimals)}
          symbol={symbol}
          showTooltip={false}
        />
        {hasLabel && (
          <CapitalConvictionLabel>
            <VoteLabel {...item} tab={tab} />
          </CapitalConvictionLabel>
        )}
      </Capital>,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
        showTooltip={false}
      />,
    ];

    return row;
  });

  return (
    <PopupListWrapper>
      <StyledList columns={columns} rows={rows} loading={loading} />

      {!loading && (
        <Annotation>d: Delegation s: Split sa: SplitAbstain</Annotation>
      )}
    </PopupListWrapper>
  );
}
