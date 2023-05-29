import React from "react";
import noop from "lodash.noop";
import styled from "styled-components";
import { useTheme } from "styled-components";
import PopupListWrapper from "../../styled/popupListWrapper";
import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import { Fragment } from "react";
import Loading from "next-common/components/loading";
import startCase from "lodash.startcase";
import ValueDisplay from "../../valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";
import sumBy from "lodash.sumby";
import { TrackIconMap } from "../../icons/track";
import Flex from "../../styled/flex";

const TrackItemWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`;

function TrackItem({ track, onClick = noop }) {
  return (
    <TrackItemWrapper onClick={onClick}>
      <Flex gap={8}>
        {TrackIconMap[track?.id]}
        {startCase(track?.name)}
      </Flex>
    </TrackItemWrapper>
  );
}

export default function AllBeenDelegatedPopupAllList({
  beenDelegatedList,
  loading = false,
  onTrackClick = noop,
}) {
  const { symbol, decimals } = useChainSettings();
  const theme = useTheme();

  const colWidths = {
    track: 296,
    support: 128,
  };

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: colWidths.track }}>
              TRACK
            </StyledTh>
            <StyledTh style={{ textAlign: "right", width: colWidths.support }}>
              SUPPORT
            </StyledTh>
          </StyledTr>

          <RowSplitter
            backgroundColor={
              theme.isDark ? theme.grey200Border : theme.grey100Bg
            }
            padding={"16px 0 4px 0"}
          />
        </thead>

        <tbody>
          {beenDelegatedList?.length ? (
            beenDelegatedList.map((item, index) => (
              <Fragment key={item.track.id}>
                <StyledTr>
                  <StyledTd
                    style={{ textAlign: "left", width: colWidths.track }}
                  >
                    <TrackItem
                      track={item.track}
                      onClick={() => onTrackClick(item.track.id)}
                    />
                  </StyledTd>
                  <StyledTd
                    style={{ textAlign: "right", width: colWidths.support }}
                  >
                    <ValueDisplay
                      value={toPrecision(
                        sumBy(item.beenDelegated, "balance"),
                        decimals,
                      )}
                      symbol={symbol}
                    />
                  </StyledTd>
                </StyledTr>

                {index !== beenDelegatedList.length - 1 && (
                  <RowSplitter
                    backgroundColor={
                      theme.isDark ? theme.grey200Border : theme.grey100Bg
                    }
                  />
                )}
              </Fragment>
            ))
          ) : (
            <StyledTr>
              <EmptyTd colSpan="3">
                {loading ? <Loading size={16} /> : "No current delegations"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </PopupListWrapper>
  );
}
