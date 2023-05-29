import styled, { useTheme } from "styled-components";
import PopupListWrapper from "../../styled/popupListWrapper";
import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";
import React, { Fragment } from "react";
import Loading from "next-common/components/loading";
import startCase from "lodash.startcase";
import User from "next-common/components/user";
import ValueDisplay from "../../valueDisplay";
import { toPrecision } from "next-common/utils";
import VStack from "../../styled/vStack";
import { p_12_normal } from "../../../styles/componentCss";
import { useChainSettings } from "../../../context/chain";
import { convictionToLockX, Conviction } from "../../../utils/referendumCommon";
import TooltipOrigin from "../../tooltip";
import { w_full } from "../../../styles/tailwindcss";

const ConvictionText = styled.div`
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};
`;

const TrackName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Tooltip = styled(TooltipOrigin)`
  ${w_full};
`;

export default function AllMyDelegationPopupList({
  loading = true,
  myDelegationList = [],
}) {
  const { symbol, decimals } = useChainSettings();
  const theme = useTheme();

  const colWidths = {
    track: 144,
    delegatingTo: 144,
    info: 128,
  };

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh
              style={{
                textAlign: "left",
                width: colWidths.track,
                minWidth: colWidths.track,
              }}
            >
              TRACK
            </StyledTh>
            <StyledTh
              style={{
                textAlign: "left",
                width: colWidths.delegatingTo,
                minWidth: colWidths.delegatingTo,
              }}
            >
              DELEGATING TO
            </StyledTh>
            <StyledTh
              style={{
                textAlign: "right",
                width: colWidths.info,
                minWidth: colWidths.info,
              }}
            >
              INFO
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
          {myDelegationList?.length ? (
            myDelegationList.map((item, index) => (
              <Fragment key={item.track.id}>
                <StyledTr>
                  <StyledTd
                    style={{
                      textAlign: "left",
                      width: colWidths.track,
                      minWidth: colWidths.track,
                    }}
                  >
                    <Tooltip content={startCase(item.track.name)}>
                      <TrackName style={{ maxWidth: colWidths.track }}>
                        {startCase(item.track.name)}
                      </TrackName>
                    </Tooltip>
                  </StyledTd>
                  <StyledTd
                    style={{
                      textAlign: "left",
                      width: colWidths.delegatingTo,
                      minWidth: colWidths.delegatingTo,
                    }}
                  >
                    <User
                      add={item.delegation.target}
                      fontSize={14}
                      maxWidth={colWidths.delegatingTo}
                      noTooltip
                    />
                  </StyledTd>
                  <StyledTd
                    style={{
                      textAlign: "right",
                      width: colWidths.info,
                      minWidth: colWidths.info,
                    }}
                  >
                    <VStack space={2}>
                      <ValueDisplay
                        value={toPrecision(item.delegation.balance, decimals)}
                        symbol={symbol}
                      />
                      <ConvictionText>
                        {convictionToLockX(
                          Conviction[item.delegation.conviction],
                        )}
                      </ConvictionText>
                    </VStack>
                  </StyledTd>
                </StyledTr>

                {index !== myDelegationList.length - 1 && (
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
