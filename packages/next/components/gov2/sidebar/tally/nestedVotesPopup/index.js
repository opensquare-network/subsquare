import Pagination from "next-common/components/pagination";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import StyledList from "next-common/components/styledList";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
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
  inline_flex,
  items_center,
  justify_between,
  text_primary,
  text_tertiary,
  theme,
} from "next-common/styles/tailwindcss";
import {
  p_14_bold,
  p_14_medium,
  p_14_normal,
} from "next-common/styles/componentCss";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import ConvictionSVG from "next-common/assets/imgs/icons/conviction.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import Chains from "next-common/utils/consts/chains";

const DescriptionsWrapper = styled.div``;
const DescriptionsTitle = styled.h3`
  margin: 0;
  margin-bottom: 8px;
  ${p_14_bold};
  ${text_primary};
`;
const DescriptionItem = styled.div`
  height: 44px;
  ${flex};
  ${justify_between};
  ${items_center};
  ${text_primary};

  & + & {
    border-top: 1px solid ${theme("grey200Border")};
  }
`;
const DescriptionItemLabel = styled.div`
  ${p_14_medium};
`;
const DescriptionItemValue = styled.div`
  ${p_14_normal};
`;

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

const Capital = styled.div`
  ${inline_flex};
  ${p_14_normal};
`;
const CapitalConvictionLabel = styled.span`
  width: 60px;
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
      <User key="user" add={item.account} fontSize={14} noTooltip />,
      // FIXME: #2866, nested delegators, is conviction equal to delegator?
      item.conviction,
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

// FIXME: #2866, nested detail, fulfill content
function DelegatedDetailPopup({ data, onClose = noop }) {
  const selfVotesItems = [
    {
      label: (
        <DetailDescriptionLabel>
          <StyledAccountSVG />
          <span>
            Self Votes
            {/* FIXME: #2866, by data `isSplit`? */}
            <DetailSelfVotesAnnotation>/splitabstain</DetailSelfVotesAnnotation>
          </span>
        </DetailDescriptionLabel>
      ),
      value: "FIXME",
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledConvictionSVG />
          <span>Conviction</span>
        </DetailDescriptionLabel>
      ),
      value: data.conviction,
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      value: "FIXME",
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
      value: "FIXME",
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledDelegatorsSVG />
          <span>Delegators</span>
        </DetailDescriptionLabel>
      ),
      value: "FIXME",
    },
    {
      label: (
        <DetailDescriptionLabel>
          <StyledCapitalSVG />
          <span>Capital</span>
        </DetailDescriptionLabel>
      ),
      value: "FIXME",
    },
  ];

  return (
    <BaseVotesPopup title="Delegated Detail" onClose={onClose}>
      <Descriptions title="Self Votes" items={selfVotesItems} />
      <Descriptions title="Delegation" items={delegationItems} />

      {/* FIXME: #2866, nested detail delegator list props and display */}
      <DetailDelegatorList />
    </BaseVotesPopup>
  );
}

function DetailDelegatorList({ items = [] }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

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
            <VoteLabel {...item} />
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
      <StyledList columns={columns} rows={rows} />
    </PopupListWrapper>
  );
}

// TODO: make this as `Descriptions` component
// similar to https://ant.design/components/descriptions, Display multiple read-only fields in groups.
// can use in Been Delegated, sidebar tally aye nay etc.
function Descriptions({ title = "", items = [] }) {
  return (
    <DescriptionsWrapper>
      {title && <DescriptionsTitle>{title}</DescriptionsTitle>}

      {items?.length &&
        items.map((item, idx) => (
          <DescriptionItem key={idx}>
            <DescriptionItemLabel>{item.label}</DescriptionItemLabel>
            <DescriptionItemValue>{item.value}</DescriptionItemValue>
          </DescriptionItem>
        ))}
    </DescriptionsWrapper>
  );
}
