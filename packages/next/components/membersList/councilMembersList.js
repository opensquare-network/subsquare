import styled, { css } from "styled-components";

import Flex from "next-common/components/styled/flex";
import { getNode, toPrecision, decimalPlaces } from "utils";
import { bigNumber2Locale } from "next-common/utils";
import User from "next-common/components/user";
import { Fragment, useState } from "react";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import useDarkMode from "next-common/utils/hooks/useDarkMode";

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
`;

const StyledTable = styled.table`
  width: 100%;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-sizing: border-box;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 24px;

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }
    th.clickable {
      color: #506176;
      cursor: pointer;
      pointer-events: auto;
    }
  }
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: #fff;
    `};
`;

const StyledTr = styled.tr``;

const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: #9da9bb;
  pointer-events: none;
`;

const StyledTd = styled.td`
  padding: 15px 0 15px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: #1e2134;
`;

const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #9da9bb;
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

const Balance = ({ value, node }) => (
  <div>
    <span style={{ color: "#1E2134" }}>
      {bigNumber2Locale(
        decimalPlaces(toPrecision(value ?? 0, node.decimals), 4)
      )}
    </span>
    <span style={{ color: "#9DA9BB", marginLeft: "8px" }}>{node.symbol}</span>
  </div>
);

export default function MembersList({
  chain,
  category,
  items,
  prime,
  loading = false,
  hasElections = false,
}) {
  const [hideColumn, setHideColumn] = useState("votes");
  const [theme] = useDarkMode();
  const node = getNode(chain);
  if (!node) {
    return null;
  }

  return (
    <Wrapper>
      <Title>{category}</Title>
      <StyledTable theme={theme}>
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
            backgroundColor={theme === "dark" ? "#272A3A" : "#F6F7FA"}
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
                    backgroundColor={theme === "dark" ? "#272A3A" : "#F6F7FA"}
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
