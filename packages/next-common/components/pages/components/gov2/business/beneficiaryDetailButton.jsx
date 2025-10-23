import Tooltip from "next-common/components/tooltip";
import dynamic from "next/dynamic";
import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});
const InfoDocs = dynamic(() => import("@osn/icons/subsquare/InfoDocs"));

export default function BeneficiaryDetailButton({ beneficiaryLocation }) {
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
        <Popup title="Beneficiary Detail" onClose={() => setShowDetail(false)}>
          <JsonView src={beneficiaryLocation} />
        </Popup>
      )}
    </>
  );
}
