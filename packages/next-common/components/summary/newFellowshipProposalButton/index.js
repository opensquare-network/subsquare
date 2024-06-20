import Chains from "next-common/utils/consts/chains";
import NewButton from "../newProposalButton/newButton";
import { useState } from "react";
import { useChain } from "next-common/context/chain";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SubmitFellowshipProposalPopup = dynamicPopup(() =>
  import("./submitProposalPopup"),
);

export default function NewFellowshipProposalButton() {
  const chain = useChain();
  const [showPopup, setShowPopup] = useState(false);
  if (![Chains.kusama, Chains.collectives, Chains.rococo].includes(chain)) {
    return;
  }

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <SubmitFellowshipProposalPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
