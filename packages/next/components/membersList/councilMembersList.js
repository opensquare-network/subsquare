import styled, { withTheme } from "styled-components";
import {
  bigNumber2Locale,
  decimalPlaces,
  getNode,
  toPrecision,
} from "next-common/utils";
import User from "next-common/components/user";
import { Fragment, useState } from "react";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  EmptyTd,
  RowSpliter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "next-common/components/styled/table";

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

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

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
      <TitleContainer>{category}</TitleContainer>
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
            backgroundColor={
              theme.isDark ? theme.grey200Border : theme.grey100Bg
            }
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
