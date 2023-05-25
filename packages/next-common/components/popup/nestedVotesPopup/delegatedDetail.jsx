"use clinet";

import React, { useMemo, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import styled from "styled-components";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import ConvictionSVG from "next-common/assets/imgs/icons/conviction.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import Descriptions from "next-common/components/Descroptions";
import Pagination from "next-common/components/pagination";
import User from "next-common/components/user";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import noop from "lodash.noop";
import {
  flex,
  gap_x,
  items_center,
  text_tertiary,
} from "next-common/styles/tailwindcss";
import { toPrecision } from "next-common/utils";
import sumBy from "lodash.sumby";

const StyledPopupListWrapper = styled(PopupListWrapper)`
  table tbody {
    max-height: 200px;
  }
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

export default function NestedPopupDelegatedDetailPopup({
  data,
  onClose = noop,
}) {
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
      value: (
        <ValueDisplay
          value={delegationCapitalValue}
          symbol={symbol}
          showTooltip={false}
        />
      ),
    },
  ];

  const pageSize = 30;
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

  const items = useMemo(() => {
    return directVoterDelegations.slice(sliceFrom, sliceTo);
  }, [directVoterDelegations, sliceFrom, sliceTo]);

  return (
    <BaseVotesPopup title="Delegated Detail" onClose={onClose}>
      <Descriptions title="Self Votes" items={selfVotesItems} />
      <Descriptions title="Delegation" items={delegationItems} />

      {!!directVoterDelegations?.length && (
        <>
          <DetailDelegatorList items={items} />

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
    <StyledPopupListWrapper>
      <StyledList items={items} columns={columns} rows={rows} />
    </StyledPopupListWrapper>
  );
}
