import React, { useCallback, useEffect, useState } from "react";
import User from "next-common/components/user";
import styled from "styled-components";
import useColumns from "next-common/components/styledList/useColumns";
import nextApi from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import Flex from "next-common/components/styled/flex";
import BeenDelegatedListPopup from "../beenDelegatedPopup";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import Tooltip from "next-common/components/tooltip";
import startCase from "lodash.startcase";
import NoBorderList from "next-common/components/styledList/noBorderList";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 768px) {
    overflow-x: auto;
    ${pretty_scroll_bar};
  }
`;

function getSortParams(sortedColumn) {
  if (!sortedColumn) {
    return {};
  }

  let colName;
  switch (sortedColumn) {
    case "COUNT":
      colName = "count";
      break;
    case "CAPITAL":
      colName = "capital";
      break;
    case "VOTES":
      colName = "votes";
      break;
    default:
      colName = "account";
  }

  return { sort: JSON.stringify([colName, "desc"]) };
}

function TrackNameList({ tracks }) {
  return (
    <Flex
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        lineHeight: "16px",
        fontSize: "12px",
      }}
    >
      <span style={{ fontWeight: "700" }}>Tracks</span>
      {tracks.map((track, index) => (
        <span key={index}>{startCase(track.name)}</span>
      ))}
    </Flex>
  );
}

export default function ReferendaDelegatee({ delegatee }) {
  const [delegateeList, setDelegateeList] = useState(delegatee);
  const [showPopup, setShowPopup] = useState(false);
  const [delegateeData, setDelegateeData] = useState();
  const { decimals, voteSymbol, symbol } = useChainSettings();

  const { sortedColumn, columns } = useColumns(
    [
      {
        name: "ADDRESS",
        style: { textAlign: "left", maxWidth: "268px", minWidth: "268px" },
      },
      {
        name: "TRACKS",
        style: { textAlign: "right", maxWidth: "96px", minWidth: "96px" },
      },
      {
        name: "COUNT",
        style: { textAlign: "right", maxWidth: "96px", minWidth: "96px" },
        sortable: true,
      },
      {
        name: "CAPITAL",
        style: { textAlign: "right", maxWidth: "128px", minWidth: "128px" },
        sortable: true,
      },
      {
        name: "VOTES",
        style: { textAlign: "right", maxWidth: "128px", minWidth: "128px" },
        sortable: true,
      },
      {
        name: "",
        style: { textAlign: "right", maxWidth: "40px", minWidth: "40px" },
      },
    ],
    "VOTES",
  );

  const sortedColumnChanged = useStateChanged(sortedColumn);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch("referenda/delegatee", {
          ...getSortParams(sortedColumn),
          page,
          pageSize,
        })
        .then(({ result }) => {
          if (result) {
            setDelegateeList(result);
          }
        });
    },
    [sortedColumn],
  );

  useEffect(() => {
    if (!sortedColumnChanged) {
      return;
    }

    fetchData(delegateeList?.page, delegateeList?.pageSize);
  }, [
    sortedColumnChanged,
    fetchData,
    delegateeList?.page,
    delegateeList?.pageSize,
  ]);

  const rows = (delegateeList.items || []).map((item) => {
    const row = [
      <Flex key="account">
        <User add={item.account} fontSize={14} maxWidth={268} />
      </Flex>,
      <div key="tracks">
        <Tooltip content={<TrackNameList tracks={item.tracks} />}>
          <span>{item.trackIdCount}</span>
        </Tooltip>
      </div>,
      item.count,
      <ValueDisplay
        key="capital"
        value={toPrecision(item.capital || 0, decimals)}
        symbol={voteSymbol || symbol}
      />,
      <ValueDisplay
        key="votes"
        value={toPrecision(item.votes || 0, decimals)}
        symbol={voteSymbol || symbol}
      />,
      <Flex key="enter" style={{ padding: "0 0 0 24px" }}>
        <EnterSVG />
      </Flex>,
    ];

    row.onClick = () => {
      setDelegateeData(item);
      setShowPopup(true);
    };

    return row;
  });

  return (
    <Wrapper>
      <ListWrapper>
        <NoBorderList columns={columns} rows={rows} />
      </ListWrapper>
      <Pagination
        {...delegateeList}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, delegateeList?.pageSize);
        }}
      />
      {showPopup && (
        <BeenDelegatedListPopup
          setShow={setShowPopup}
          delegatee={delegateeData?.account}
          delegatedCapital={delegateeData?.capital}
          delegatedVotes={delegateeData?.votes}
          delegatorsCount={delegateeData?.count}
          tracksCount={delegateeData?.trackIdCount}
        />
      )}
    </Wrapper>
  );
}
