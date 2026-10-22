import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { IconButton } from "next-common/components/styled/iconButton";
import { MenuTreasuryProposal } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";

const ModifyNomineesPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/modifyNomineesPopup"
  ),
);

export default function ModifyNomineesButton({ startNominating = false }) {
  const [modifyNomineePopup, setModifyNomineePopup] = useState(false);
  const { ledger } = useMyStakingLedger();
  const { decimals, symbol } = useChainSettings();
  const { result: minNominatorBond, loading } = useSubStorage(
    "staking",
    "minNominatorBond",
    [],
  );

  const minBond = BigInt(minNominatorBond?.toString() || 0);
  const activeBond = BigInt(ledger?.active || 0);
  const belowMinBond = !loading && !!ledger && activeBond < minBond;

  return (
    <>
      <Tooltip
        content={
          belowMinBond
            ? `Bond at least ${toPrecision(
                minBond,
                decimals,
              )} ${symbol} to nominate validators`
            : startNominating
            ? "Start Nominating"
            : "Modify Nominees"
        }
      >
        <IconButton
          className={cn(
            "text-theme500 bg-theme100 [&_svg_path]:fill-theme500",
            belowMinBond && "opacity-50 cursor-not-allowed",
          )}
          disabled={belowMinBond}
          onClick={() => setModifyNomineePopup(true)}
        >
          <MenuTreasuryProposal className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {modifyNomineePopup && (
        <ModifyNomineesPopup
          startNominating={startNominating}
          onClose={() => setModifyNomineePopup(false)}
        />
      )}
    </>
  );
}
