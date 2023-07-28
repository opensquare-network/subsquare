import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Copyable from "next-common/components/copyable";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ClosedTag } from "next-common/components/tags/state/styled";
import DetailButton from "next-common/components/detailButton";
import { useState } from "react";
import usePreimage from "hooks/usePreimage";
import { SystemLoadingDots } from "@osn/icons/subsquare";
import PreimageDetailPopup from "./preImageDetailPopup";
import { useUser } from "next-common/context/user";

const FieldLoading = styled(SystemLoadingDots)`
  & ellipse {
    fill: var(--textTertiary);
  }
`;

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

const StyledList = styled(StyledListOrigin)`
  border: none;
  box-shadow: none;
  padding: 0;
`;

function Hash({ hash, proposal }) {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(false);

  return (
    <div className="flex">
      <div className="flex items-center w-[160px]">
        <Copyable copyText={hash}>
          <span className="inline-block w-[96px] truncate">{hash}</span>
        </Copyable>
      </div>
      <div className="flex items-centers mx-[16px]">
        <DetailButton
          disabled={!proposal}
          onClick={() => setShowArgumentsDetail(true)}
        />
      </div>
      {showArgumentsDetail && (
        <PreimageDetailPopup
          setShow={setShowArgumentsDetail}
          proposal={proposal}
        />
      )}
    </div>
  );
}

function Deposit({ deposit }) {
  const { symbol, decimals } = useChainSettings();
  const { who, amount } = deposit;

  return (
    <div className="flex flex-col">
      <User add={who} maxWidth={128} />
      <div className="ml-[28px] text-textSecondary text-[12px]">
        <ValueDisplay
          value={toPrecision(amount.toJSON(), decimals)}
          symbol={symbol}
        />
      </div>
    </div>
  );
}

function Proposal({ proposal, proposalError, proposalWarning }) {
  if (proposalError) {
    return <span className="text-red500 font-medium">{proposalError}</span>;
  }
  if (proposalWarning) {
    return (
      <span className="text-orange500 font-medium">{proposalWarning}</span>
    );
  }
  const { section, method, meta } = proposal || {};
  const doc = meta?.docs[0]?.toJSON();
  return (
    <div className="flex flex-col">
      <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
      <span className="text-textSecondary text-[12px] leading-[16px]">
        {doc}
      </span>
    </div>
  );
}

function parseStatus(status) {
  const statusName = Object.keys(status || {})[0];
  if (!statusName) return {};
  const { deposit = [] } = status[statusName];
  return {
    statusName,
    deposit,
  };
}

export default function PreImagesTable({ data, searchValue, isMyDepositOn }) {
  const user = useUser();
  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left", width: "220px" },
    },
    {
      name: "Arguments",
      style: { textAlign: "left", minWidth: "360px" },
    },
    {
      name: "Depositor",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Length",
      style: { textAlign: "right", width: "128px", minWidth: "96px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ]);

  const rows = (data || [])
    .filter(([hash, status]) => {
      if (!hash.includes(searchValue.toLowerCase())) {
        return false;
      }

      const { deposit } = parseStatus(status);
      const [who] = deposit || [];
      if (isMyDepositOn && user && who !== user.address) {
        return false;
      }

      return true;
    })
    .map(([hash]) => {
      return {
        useData: () => {
          const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

          return [
            <Hash key="hash" hash={hash} proposal={preimage.proposal} />,
            isBytesLoaded ? (
              <Proposal
                key="proposal"
                proposal={preimage.proposal}
                proposalError={preimage.proposalError}
                proposalWarning={preimage.proposalWarning}
              />
            ) : (
              <FieldLoading />
            ),
            isStatusLoaded ? (
              preimage.deposit && (
                <Deposit key="deposit" deposit={preimage.deposit} />
              )
            ) : (
              <FieldLoading />
            ),
            isStatusLoaded ? (
              preimage.proposalLength?.toJSON()?.toLocaleString()
            ) : (
              <FieldLoading />
            ),
            isStatusLoaded ? (
              preimage.statusName && (
                <ClosedTag key="status" className="capitalize">
                  {preimage.statusName +
                    (preimage.count ? ` / ${preimage.count}` : "")}
                </ClosedTag>
              )
            ) : (
              <FieldLoading />
            ),
          ];
        },
      };
    });

  return (
    <SecondaryCard>
      <ListWrapper>
        <StyledList
          columns={columns}
          rows={rows}
          noDataText="No current preimages"
          loading={!data}
        />
      </ListWrapper>
    </SecondaryCard>
  );
}
