import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemAddProxy } from "@osn/icons/subsquare";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import Popup from "next-common/components/popup/wrapper/Popup";
import dynamicPopup from "next-common/lib/dynamic/popup";

const AddProxyPopup = dynamicPopup(() => import("./popup/addProxy"));

function ChoicePopup({ onSelect, onClose }) {
  return (
    <Popup wide className="!w-[640px]" title="Set Proxy" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[16px]">
        <ChoiceButton
          icon={<SystemAddProxy className="text-textTertiary w-10 h-10" />}
          name="Add a Proxy Account"
          onClick={() => {
            onSelect();
            onClose();
          }}
        />
      </div>
    </Popup>
  );
}

export default function SetProxy() {
  const [showChoicePopup, setShowChoicePopup] = useState(false);
  const [showAddProxyPopup, setShowAddProxyPopup] = useState(false);

  return (
    <>
      <PrimaryButton size="small" onClick={() => setShowChoicePopup(true)}>
        Set Proxy
      </PrimaryButton>

      {showChoicePopup && (
        <ChoicePopup
          onSelect={() => {
            setShowAddProxyPopup(true);
          }}
          onClose={() => setShowChoicePopup(false)}
        />
      )}

      {showAddProxyPopup && (
        <AddProxyPopup onClose={() => setShowAddProxyPopup(false)} />
      )}
    </>
  );
}
