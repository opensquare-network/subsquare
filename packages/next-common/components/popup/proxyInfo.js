import React from "react";
import isNil from "lodash.isnil";
import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";
import { addressEllipsis } from "../../utils";
import { formatBalance } from "../../utils/viewfuncs";
import Loading from "../loading";
import Tooltip from "../tooltip";

const Wrapper = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
  padding: 10px 16px;
  justify-content: space-between;

  ${p_14_normal}
  color: ${(p) => p.theme.textSecondary};
  .proxyaddr {
    font-weight: 500;
    color: ${(p) => p.theme.textPrimary};
  }

  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;
`;

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textPrimary};
  font-weight: bold;
`;

export default function ProxyInfo({ address, balance, isLoading, symbol }) {
  const noBalance = isNil(balance) && isNil(isLoading);
  const shortAddr = addressEllipsis(address);
  return (
    <Wrapper>
      <div>
        As proxy of <span className="proxyaddr">{shortAddr}</span>{" "}
        <Tooltip content={"Extirinsic will be wrapped in a proxy call"} />
      </div>
      {!noBalance && (
        <BalanceWrapper>
          {!isLoading && (
            <div>
              {formatBalance(balance, symbol)} {symbol}
            </div>
          )}
          {isLoading && <Loading />}
        </BalanceWrapper>
      )}
    </Wrapper>
  );
}
