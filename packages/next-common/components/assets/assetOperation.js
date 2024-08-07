import React, { useState, useCallback } from "react";
import { SystemTransfer, SystemCrosschain } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import Tooltip from "../tooltip";

const AssetOperationPopup = dynamicClientOnly(() =>
  import("./assetOperationPopup/index").then(
    (module) => module.AssetOperationPopup,
  ),
);

const AssetButton = ({ asset, type }) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = useCallback(() => setShowPopup(false), []);

  const icon = type === "transfer" ? SystemTransfer : SystemCrosschain;
  const tooltipContent = type === "transfer" ? "Transfer" : "Cross Chain";

  const handleClick = useCallback(() => {
    console.log(`show ${tooltipContent} popup`);
    setShowPopup(true);
  }, [tooltipContent]);

  const className = type === "transfer" ? "" : "mr-3";

  return (
    <Tooltip content={tooltipContent} className={className}>
      <ListButton onClick={handleClick}>
        {React.createElement(icon, { width: 16, height: 16 })}
      </ListButton>
      {showPopup && (
        <AssetOperationPopup
          asset={asset}
          onClose={handleClose}
          operationType={type}
        />
      )}
    </Tooltip>
  );
};

export const TransferButton = (props) => {
  return <AssetButton {...props} type="transfer" />;
};

export const CrossChainButton = (props) => {
  // TODO: add other judgment conditions as shown.
  // return props.otherCondition ? () : null;
  return <AssetButton {...props} type="crossChain" />;
};

export default function AssetOperation({ asset }) {
  return asset.type === "native" ? (
    <span className="text14Medium text-textTertiary">-</span>
  ) : (
    <div>
      <CrossChainButton asset={asset} />
      <TransferButton asset={asset} />
    </div>
  );
}
