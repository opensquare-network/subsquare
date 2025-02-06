import { SystemVoteAye } from "@osn/icons/subsquare";
import Checkbox from "next-common/components/checkbox";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import { toPrecision } from "next-common/utils";
import PopupLabel from "../label";

export default function ReferendaOptions({
  decisionDepositValue = 0,
  checkDecisionDeposit = false,
  onCheckDecisionDeposit,
  checkVoteAye = false,
  onCheckVoteAye,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <div>
      <PopupLabel text="Options" />

      <div className="space-y-2">
        <Option
          label={
            <>
              Place decision deposit:{" "}
              <ValueDisplay
                showTooltip={false}
                className="[&_.value-display-symbol]:text-inherit"
                value={toPrecision(decisionDepositValue, decimals)}
                symbol={symbol}
              />
            </>
          }
          checked={checkDecisionDeposit}
          onClick={onCheckDecisionDeposit}
        />
        <Option
          label={
            <>
              Vote <SystemVoteAye className="inline w-5 h-5" /> Aye
            </>
          }
          checked={checkVoteAye}
          onClick={onCheckVoteAye}
        />
      </div>
    </div>
  );
}

function Option({ label, checked, onClick }) {
  return (
    <SecondaryButton
      className="w-full"
      iconRight={<Checkbox className="w-5 h-5" checked={checked} />}
      onClick={onClick}
    >
      <span className="w-full text-left">{label}</span>
    </SecondaryButton>
  );
}
