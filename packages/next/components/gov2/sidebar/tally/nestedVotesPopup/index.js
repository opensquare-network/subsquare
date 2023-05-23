import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import React, { useState } from "react";
import VotesTab, { tabs } from "../flattenedVotesPopup/tab";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import Flex from "next-common/components/styled/flex";
import { toPrecision } from "next-common/utils";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import noop from "lodash.noop";
import styled from "styled-components";
import {
  flex,
  gap_x,
  items_center,
  text_tertiary,
} from "next-common/styles/tailwindcss";
import Descriptions from "next-common/components/Descroptions";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import ConvictionSVG from "next-common/assets/imgs/icons/conviction.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import sumBy from "lodash.sumby";

const StyledAccountSVG = styled(AccountSVG)`
  fill: ${(p) => p.theme.textTertiary};
`;
const StyledConvictionSVG = styled(ConvictionSVG)`
  stroke: ${(p) => p.theme.textTertiary};
`;
const StyledCapitalSVG = styled(BalanceSVG)`
  stroke: ${(p) => p.theme.textTertiary};
`;
const StyledDelegatorsSVG = styled(AddressesSVG)`
  stroke: ${(p) => p.theme.textTertiary};
`;
const StyledTotalDelegationSvg = styled(SupportSVG)`
  stroke: ${(p) => p.theme.textTertiary};
`;
const DetailDescriptionLabel = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(8)};
`;
const DetailSelfVotesAnnotation = styled.span`
  ${text_tertiary};
`;

export default function NestedVotesPopup({
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
    <>
      <BaseVotesPopup
        title="Nested Votes"
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
          items={votes?.slice(sliceFrom, sliceTo)}
          loading={isLoadingVotes}
          tab={tabIndex}
        />

        <Pagination {...pagination} />
      </BaseVotesPopup>
    </>
  );
}

function VotesList({ items = [], loading }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState();

  const columns = [
    {
      name: "ADDRESS",
      style: { minWidth: 376, textAlign: "left" },
    },
    {
      name: "DELEGATORS",
      style: { minWidth: 128, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
    {
      name: "",
      style: { textAlign: "right", width: 40, minWidth: 40 },
    },
  ];

  const rows = items.map((item) => {
    // NOTE: #2866, nested votes
    const votes = item.balance * item.conviction || item.balance;

    const row = [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={326}
      />,
      item.directVoterDelegations?.length,
      <ValueDisplay
        key="value"
        value={toPrecision(votes, chainSettings.decimals)}
        symbol={symbol}
        showTooltip={false}
      />,
      <Flex key="enter" style={{ padding: "0 0 0 24px" }}>
        <EnterSVG />
      </Flex>,
    ];

    row.onClick = () => {
      setDetailData(item);
      setShowDetail(true);
    };

    return row;
  });

  return (
    <>
      <PopupListWrapper>
        <StyledList columns={columns} rows={rows} loading={loading} />
      </PopupListWrapper>

      {showDetail && (
        <DelegatedDetailPopup
          data={detailData}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

function getAnnotation(data = {}) {
  const { isDelegating, isSplit, isSplitAbstain } = data;

  if (isDelegating) {
    return "Delegating";
  } else if (isSplit) {
    return "Split";
  } else if (isSplitAbstain) {
    return "SplitAbstain";
  }
}

// FIXME: #2866, nested detail, fulfill content
function DelegatedDetailPopup({ data, onClose = noop }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const annotation = getAnnotation(data);
  const directVoterDelegations = data.directVoterDelegations;

  const [detailListPage, setDetailListPage] = useState(1);

  const selfVotesTotalvalue = toPrecision(
    data.balance * (data.conviction || 1),
    chainSettings.decimals,
  );
  const selfVotesCapitalValue = toPrecision(
    data.balance,
    chainSettings.decimals,
  );

  const delegationTotalDelegationValue = toPrecision(
    sumBy(directVoterDelegations, (item) => {
      return Number(item.balance) * (item.conviction || 1);
    }),
    chainSettings.decimals,
  );
  const delegationCapitalValue = toPrecision(
    sumBy(directVoterDelegations, (item) => {
      return Number(item.balance);
    }),
    chainSettings.decimals,
  );

  const selfVotesItems = [
    {
      label: (
        <DetailDescriptionLabel>
          <StyledAccountSVG />
          <span>
            Self Votes
            {annotation && (
              <DetailSelfVotesAnnotation>
                /{annotation}
              </DetailSelfVotesAnnotation>
            )}
          </span>
        </DetailDescriptionLabel>
      ),
      value: (
        <ValueDisplay
          value={selfVotesTotalvalue}
          symbol={symbol}
          showTooltip={false}
        />
      ),
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledConvictionSVG />
          <span>Conviction</span>
        </DetailDescriptionLabel>
      ),
      value: <VoteLabel {...data} />,
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      value: (
        <ValueDisplay
          value={selfVotesCapitalValue}
          symbol={symbol}
          showTooltip={false}
        />
      ),
    },
  ];

  const delegationItems = [
    {
      label: (
        <DetailDescriptionLabel>
          <StyledTotalDelegationSvg />
          <span>Total Delegation</span>
        </DetailDescriptionLabel>
      ),
      value: (
        <ValueDisplay
          value={delegationTotalDelegationValue}
          symbol={symbol}
          showTooltip={false}
        />
      ),
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledDelegatorsSVG />
          <span>Delegators</span>
        </DetailDescriptionLabel>
      ),
      value: directVoterDelegations?.length || 0,
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      // FIXME: #2866, nested detail, delegation capital correct?
      value: (
        <ValueDisplay
          value={delegationCapitalValue}
          symbol={symbol}
          showTooltip={false}
        />
      ),
    },
  ];

  const pageSize = 3;
  function onPageChange(e, newPage) {
    e.preventDefault();
    setDetailListPage(newPage);
  }
  const pagination = {
    page: detailListPage,
    pageSize,
    total: directVoterDelegations?.length || 0,
    onPageChange,
  };
  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <BaseVotesPopup title="Delegated Detail" onClose={onClose}>
      <Descriptions title="Self Votes" items={selfVotesItems} />
      <Descriptions title="Delegation" items={delegationItems} />

      {/* FIXME: #2866, nested detail delegator list props and display */}
      {!!directVoterDelegations?.length && (
        <>
          <DetailDelegatorList
            items={directVoterDelegations.slice(sliceFrom, sliceTo)}
          />

          <Pagination {...pagination} />
        </>
      )}
    </BaseVotesPopup>
  );
}

function DetailDelegatorList({ items = [] }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "DELEGATOR",
      style: { minWidth: 376, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 168, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    // NOTE: #2866, nested detail capital votes
    const capital = item.balance;
    const votes = capital * item.conviction || item.balance;

    const row = [
      <User
        key="user"
        add={item.account}
        fontSize={14}
        noTooltip
        maxWidth={326}
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
      />,
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
      <StyledList columns={columns} rows={rows} />
    </PopupListWrapper>
  );
}
