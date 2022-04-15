import styled from "styled-components";

import BalanceInput from "components/balanceInput";
import { getNode, toPrecision } from "utils";
import Tooltip from "next-common/components/tooltip";
import useDeposit from "./useDeposit";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  padding: 12px 16px;

  background: #fff1f0;
  border-radius: 4px;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;

  color: #f44336;
  margin-top: 8px !important;
`;

export default function DepositRequired({ chain, depositRequired }) {
  const { deposit, balanceInsufficient } = useDeposit(chain, depositRequired);

  const node = getNode(chain);

  return (
    <>
      <div>
        <TooltipWrapper>
          <Label>Deposit</Label>
          <Tooltip
            content={
              "The deposit will be locked for the lifetime of the proposal"
            }
          />
        </TooltipWrapper>
        <BalanceInput
          disabled={true}
          value={toPrecision(deposit, node.decimals)}
          symbol={node?.symbol}
        />
      </div>
      {balanceInsufficient && <ErrorMessage>Insufficient balance</ErrorMessage>}
    </>
  );
}
