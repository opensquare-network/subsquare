import React, { useEffect, useMemo, useState } from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VotesTab, { tabs } from "./tab";
import Pagination from "next-common/components/pagination";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import { useChainSettings } from "next-common/context/chain";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import Annotation from "next-common/components/democracy/flattenedVotesPopup/annotation";
import SearchBar from "./searchBar";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";

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
  const [search, setSearch] = useState("");
  const [identityDisplayToAddress, setIdentityDisplayToAddress] = useState({});
  const pageSize = 50;
  const chainSettings = useChainSettings();

  let page;
  let votes;
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

  useEffect(() => {
    const identityChain = chainSettings.identity;
    votes.forEach((vote) => {
      fetchIdentity(identityChain, vote.account).then((identity) => {
        const identityDisplay = getIdentityDisplay(identity);
        setIdentityDisplayToAddress((identityDisplayToAddress) => ({
          ...identityDisplayToAddress,
          [identityDisplay]: vote.account,
        }));
      });
    });
  }, [votes, chainSettings]);

  const filteredVotes = useMemo(() => {
    if (search) {
      const addresses = Object.keys(identityDisplayToAddress)
        .filter((display) =>
          display.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
        .map((display) => identityDisplayToAddress[display]);
      return votes.filter(
        (item) =>
          item.account.includes(search) || addresses.includes(item.account),
      );
    }
    return votes;
  }, [votes, search, identityDisplayToAddress]);

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
    total: filteredVotes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return filteredVotes.slice(sliceFrom, sliceTo);
  }, [filteredVotes, sliceFrom, sliceTo]);

  return (
    <BaseVotesPopup
      wide
      title="Flattened View"
      onClose={() => setShowVoteList(false)}
    >
      <SearchBar setSearch={setSearch} />
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainsCount={allAbstain?.length || 0}
      />
      <VotesList items={items} loading={isLoadingVotes} tab={tabIndex} />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}

function VotesList({ items = [], loading, tab }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "ACCOUNT",
      style: { minWidth: 276, textAlign: "left" },
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
    const capital = item.balance;
    const votes = item.votes;

    return [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={276}
        linkToVotesPage
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
        tab={tab}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
      />,
    ];
  });

  return (
    <>
      <PopupListWrapper>
        <StyledList
          items={items}
          columns={columns}
          rows={rows}
          loading={loading}
        />
      </PopupListWrapper>

      {!loading && <Annotation isOpenGov />}
    </>
  );
}
