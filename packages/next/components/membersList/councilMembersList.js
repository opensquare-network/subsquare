import styled, { withTheme } from "styled-components";

import Flex from "next-common/components/styled/flex";
import { decimalPlaces, getNode, toPrecision } from "utils";
import { bigNumber2Locale } from "next-common/utils";
import User from "next-common/components/user";
import { Fragment, useState } from "react";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled(Flex)`
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => props.theme.textPrimary};
`;

const StyledTable = styled.table`
  width: 100%;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  box-sizing: border-box;
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 24px;

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }
    th.clickable {
      color: ${(props) => props.theme.textSecondary};
      cursor: pointer;
      pointer-events: auto;
    }
  }
`;

const StyledTr = styled.tr``;

const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
  pointer-events: none;
`;

const StyledTd = styled.td`
  padding: 15px 0 15px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: ${(props) => props.theme.textPrimary};
`;

const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textTertiary};
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RowSpliter = ({ backgroundColor, padding }) => (
  <tr>
    <td colSpan="3" style={{ padding }}>
      <div style={{ height: "1px", backgroundColor }} />
    </td>
  </tr>
);

const BalanceWrapper = styled.span`
  color: ${(props) => props.theme.textPrimary};
`;
const SymbolWrapper = styled.span`
  color: ${(props) => props.theme.textTertiary};
`;

const Balance = ({ value, node }) => (
  <div>
    <BalanceWrapper>
      {bigNumber2Locale(
        decimalPlaces(toPrecision(value ?? 0, node.decimals), 4)
      )}
    </BalanceWrapper>
    <SymbolWrapper style={{ color: "#9DA9BB", marginLeft: "8px" }}>
      {node.symbol}
    </SymbolWrapper>
  </div>
);

function MembersList({
  chain,
  category,
  items,
  prime,
  loading = false,
  hasElections = false,
  theme,
}) {
  const [hideColumn, setHideColumn] = useState("votes");
  const node = getNode(chain);
  if (!node) {
    return null;
  }

  return (
    <Wrapper>
      <Title>{category}</Title>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>MEMBERS</StyledTh>
            {hasElections && (
              <>
                <StyledTh
                  className={
                    hideColumn === "backing" ? "autohide" : "clickable"
                  }
                  style={{ textAlign: "right" }}
                  onClick={() => setHideColumn("backing")}
                >
                  BACKING
                </StyledTh>
                <StyledTh
                  className={hideColumn === "votes" ? "autohide" : "clickable"}
                  style={{ textAlign: "right" }}
                  onClick={() => setHideColumn("votes")}
                >
                  VOTES
                </StyledTh>
              </>
            )}
          </StyledTr>
          <RowSpliter
            backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
            padding={"16px 0 4px 0"}
          />
        </thead>
        <tbody>
          {items?.length > 0 ? (
            items.map((item, index) => (
              <Fragment key={index}>
                <StyledTr>
                  <StyledTd style={{ textAlign: "left" }}>
                    <Member>
                      <User add={item.address} chain={chain} fontSize={14} />
                      {item.address === prime && <PrimeAddressMark />}
                    </Member>
                  </StyledTd>
                  {hasElections && (
                    <>
                      <StyledTd
                        className={hideColumn === "backing" ? "autohide" : ""}
                        style={{ textAlign: "right" }}
                      >
                        <Balance value={item.backing} node={node} />
                      </StyledTd>
                      <StyledTd
                        className={hideColumn === "votes" ? "autohide" : ""}
                        style={{ textAlign: "right" }}
                      >
                        {item.votes}
                      </StyledTd>
                    </>
                  )}
                </StyledTr>
                {index !== items.length - 1 && (
                  <RowSpliter
                    backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
                  />
                )}
              </Fragment>
            ))
          ) : (
            <StyledTr>
              <EmptyTd colSpan="3">
                {loading ? <Loading size={16} /> : "No current members"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
}

export default withTheme(MembersList);
