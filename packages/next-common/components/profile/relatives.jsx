import Button from "next-common/lib/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

const ArrowRight = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.ArrowRight),
);
const SystemRelatives = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemRelatives),
);
const RelativesPopup = dynamic(() => import("../relationshipPopup"));

function RelativesWithNullGuard({ children }) {
  const chain = useChain();

  if (!isPolkadotChain(chain) && !isKusamaChain(chain)) {
    return null;
  }

  return children;
}

export default function Relatives() {
  const [popupVisibled, setPopupVisbled] = useState(false);

  return (
    <RelativesWithNullGuard>
      <Button
        size="small"
        className="border-neutral400 text-textPrimary mt-4"
        iconRight={<ArrowRight className="w-4 h-4 text-textTertiary" />}
        iconLeft={<SystemRelatives className="w-4 h-4 text-textTertiary" />}
        onClick={() => setPopupVisbled(true)}
      >
        Relatives
      </Button>
      {popupVisibled && (
        <RelativesPopup onClose={() => setPopupVisbled(false)} />
      )}
    </RelativesWithNullGuard>
  );
}
