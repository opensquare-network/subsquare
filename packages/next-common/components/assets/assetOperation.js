import React, { useState, useCallback } from "react";
import { SystemTransfer, SystemCrosschain } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import Tooltip from "../tooltip";

const AssetTransferPopup = dynamicClientOnly(() =>
  import("./transferPopup").then((module) => module.AssetTransferPopup),
);

const AssetCrossChainPopup = dynamicClientOnly(() =>
  import("./crossChainPopup").then((module) => module.AssetCrossChainPopup),
);

const AssetButton = ({ asset, type }) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = useCallback(() => setShowPopup(false), []);

  const PopupComponent =
    type === "transfer" ? AssetTransferPopup : AssetCrossChainPopup;
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
      {showPopup && <PopupComponent asset={asset} onClose={handleClose} />}
    </Tooltip>
  );
};

export const TransferButton = (props) => {
  return props.type !== "native" ? (
    <AssetButton {...props} type="transfer" />
  ) : null;
};

export const CrossChainButton = (props) => {
  // TODO: add other judgment conditions as shown.
  // return props.otherCondition ? (
  return props.type !== "native" ? (
    <AssetButton {...props} type="crossChain" />
  ) : null;
};
