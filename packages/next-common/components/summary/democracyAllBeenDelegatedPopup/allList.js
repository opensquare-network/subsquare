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
import { parseGov2TrackName } from "next-common/utils/gov2";
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
        {parseGov2TrackName(track?.name)}
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

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 296 }}>TRACK</StyledTh>
            <StyledTh style={{ textAlign: "right", width: "100%" }}>
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
                  <StyledTd style={{ textAlign: "left", width: 296 }}>
                    <TrackItem
                      track={item.track}
                      onClick={() => onTrackClick(item.track.id)}
                    />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right", width: "100%" }}>
                    <ValueDisplay
                      value={toPrecision(
                        sumBy(item.beenDelegated, "balance"),
                        decimals
                      )}
                      symbol={symbol}
                      showTooltip={false}
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
