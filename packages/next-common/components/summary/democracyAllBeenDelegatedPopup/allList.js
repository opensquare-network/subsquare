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

export default function AllBeenDelegatedPopupAllList({
  items,
  loading = false,
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
          {items?.length ? (
            items.map((item, index) => (
              <Fragment key={item.track.id}>
                <StyledTr>
                  <StyledTd style={{ textAlign: "left", width: 296 }}>
                    <Flex gap={8}>
                      {TrackIconMap[item.track.id]}
                      {parseGov2TrackName(item.track.name)}
                    </Flex>
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

                {index !== items.length - 1 && (
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
