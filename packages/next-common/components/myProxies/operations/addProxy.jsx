import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const AddProxyPopup = dynamicPopup(() => import("./popup/addProxy"));

export default function SetProxy() {
  const [showAddProxyPopup, setShowAddProxyPopup] = useState(false);

  return (
    <>
      <PrimaryButton size="small" onClick={() => setShowAddProxyPopup(true)}>
        Add a proxy
      </PrimaryButton>

      {showAddProxyPopup && (
        <AddProxyPopup onClose={() => setShowAddProxyPopup(false)} />
      )}
    </>
  );
}
