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
import { Fragment } from "react";
import Loading from "next-common/components/loading";
import { parseGov2TrackName } from "next-common/utils/gov2";
import User from "next-common/components/user";
import ValueDisplay from "../../valueDisplay";
import { toPrecision } from "next-common/utils";
import VStack from "../../styled/vStack";
import { p_12_normal } from "../../../styles/componentCss";
import { useChainSettings } from "../../../context/chain";
import { convictionToLockX, Conviction } from "../../../utils/referendumCommon";

const ConvictionText = styled.div`
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};
`;

export default function AllMyDelegationPopupList({
  loading = true,
  items = [],
}) {
  const { symbol, decimals } = useChainSettings();
  const theme = useTheme();

  return (
    <PopupListWrapper>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left", width: 144 }}>TRACK</StyledTh>
            <StyledTh style={{ textAlign: "left", width: 144 }}>
              DELEGATING TO
            </StyledTh>
            <StyledTh style={{ textAlign: "right" }}>INFO</StyledTh>
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
            items.map((item) => (
              <Fragment key={item.track.id}>
                <StyledTr>
                  <StyledTd style={{ textAlign: "left", width: 144 }}>
                    <span>{parseGov2TrackName(item.track.name)}</span>
                  </StyledTd>
                  <StyledTd style={{ textAlign: "left", width: 144 }}>
                    <User
                      add={item.delegation.target}
                      fontSize={14}
                      maxWidth={144}
                      noTooltip
                    />
                  </StyledTd>
                  <StyledTd style={{ textAlign: "right" }}>
                    <VStack space={2}>
                      <ValueDisplay
                        value={toPrecision(item.delegation.balance, decimals)}
                        symbol={symbol}
                        showTooltip={false}
                      />
                      <ConvictionText>
                        {convictionToLockX(
                          Conviction[item.delegation.conviction]
                        )}
                      </ConvictionText>
                    </VStack>
                  </StyledTd>
                </StyledTr>
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
