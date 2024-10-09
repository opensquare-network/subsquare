import Tooltip from "next-common/components/tooltip";
import { useOnchainData } from "next-common/context/post";
import dynamic from "next/dynamic";
import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});
const InfoDocs = dynamic(() => import("@osn/icons/subsquare/InfoDocs"));

function BeneficiaryJsonView({ onClose }) {
  const { proposal } = useOnchainData();
  const beneficiary = proposal?.call?.args?.find(
    (item) => item.name === "beneficiary",
  );

  return (
    <Popup title="Beneficiary Detail" onClose={onClose} className="w-[650px]">
      <JsonView src={beneficiary} />
    </Popup>
  );
}

export default function BeneficiaryDetailButton() {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Tooltip content="Beneficiary Detail">
        <InfoDocs
          className={cn(
            "cursor-pointer w-[16px] h-[16px]",
            "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
            "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
          )}
          onClick={() => setShowDetail(true)}
        />
      </Tooltip>
      {showDetail && (
        <BeneficiaryJsonView onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
