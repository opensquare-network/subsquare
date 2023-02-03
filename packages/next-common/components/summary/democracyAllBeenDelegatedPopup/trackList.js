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
import User from "next-common/components/user";
import ValueDisplay from "../../valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";

export default function AllBeenDelegatedPopupTrackList({
  loading = false,
  items,
}) {
  const { symbol, decimals } = useChainSettings();
  const theme = useTheme();

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 208 }}>
              ADDRESS
            </StyledTh>
            <StyledTh style={{ textAlign: "right", width: 80 }}>TRACK</StyledTh>
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
              <Fragment key={index}>
                <StyledTr>
                  <StyledTd style={{ textAlign: "left", width: 208 }}>
                    <User
                      add={item.delegator}
                      fontSize={14}
                      maxWidth={144}
                      noTooltip
                    />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right", width: 80 }}>
                    {item.conviction}
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right", width: "100%" }}>
                    <ValueDisplay
                      value={toPrecision(item.balance, decimals)}
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
