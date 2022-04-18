import BalanceInput from "components/balanceInput";
import { getNode, toPrecision } from "utils";
import useDeposit from "./useDeposit";
import PopupLabel from "next-common/components/popup/label";
import { WarningMessage } from "next-common/components/popup/styled";

export default function DepositRequired({ chain, depositRequired }) {
  const { deposit, balanceInsufficient } = useDeposit(chain, depositRequired);

  const node = getNode(chain);

  return (
    <>
      <div>
        <PopupLabel
          text={"Deposit"}
          tooltip={"The deposit will be locked for the lifetime of the proposal"}
        />
        <BalanceInput
          disabled={true}
          value={toPrecision(deposit, node.decimals)}
          symbol={node?.symbol}
        />
      </div>
      {balanceInsufficient && <WarningMessage danger>Insufficient balance</WarningMessage>}
    </>
  );
}
