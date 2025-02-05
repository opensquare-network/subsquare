import SecondaryButton from "next-common/lib/button/secondary";
import PopupLabel from "../label";
import Checkbox from "next-common/components/checkbox";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { SystemVoteAye } from "@osn/icons/subsquare";

export default function ReferendaOptions({
  checkDeposit = false,
  onCheckDeposit,
  checkVoteAye = false,
  onCheckVoteAye,
}) {
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();
  const deposit = api?.consts?.balances?.existentialDeposit?.toString() || 0;

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
                value={toPrecision(deposit, decimals)}
                symbol={symbol}
              />
            </>
          }
          checked={checkDeposit}
          onClick={onCheckDeposit}
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
