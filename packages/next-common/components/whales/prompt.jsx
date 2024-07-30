import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import BillBoardPanel from "next-common/components/billBoardPanel";
import dynamic from "next/dynamic";

const MenuWhale = dynamic(() => import("@osn/icons/subsquare/MenuWhale"));

function useWhaleThresholdText() {
  const chain = useChain();
  if (Chains.polkadot === chain) {
    return "1M DOT";
  } else if (Chains.kusama === chain) {
    return "10K KSM";
  }

  return "";
}

export default function WhalesPrompt() {
  const thresholdText = useWhaleThresholdText();
  return (
    <BillBoardPanel
      icon={<MenuWhale className="text-theme500" />}
      items={[
        "Votes power: Balance * 6 + max_track_delegations.",
        <>
          Only addresses who have ever voted &nbsp;
          <span className="text-theme500">{`>= ${thresholdText}`}</span>
          (convicted votes) directly are counted.
        </>,
        "Holders who have not voted any referenda are not counted.",
        "Holders who are delegating their votes in all tracks are not counted.",
        "Data is recalculated every 10 minutes in the background.",
      ]}
    />
  );
}
