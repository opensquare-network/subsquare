import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle, PromptTypes } from "../scrollPrompt";
import { GreyPanel } from "../styled/containers/greyPanel";
import { CACHE_KEY, CHAIN } from "next-common/utils/constants";
import { fetchTreasuryRequesting } from "next-common/services/fetchTreasuryRequesting";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import ValueDisplay from "../valueDisplay";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import getChainSettings from "next-common/utils/consts/settings";

function DisplayTotalRequestingAssets({ onClose }) {
  const { price } = useFiatPriceSnapshot();
  const [confirming, setConfirming] = useState([]);
  const [requesting, setRequesting] = useState([]);
  const [confirmingValue, setConfirmingValue] = useState();
  const [requestingValue, setRequestingValue] = useState();

  useEffect(() => {
    if (price) {
      setConfirmingValue(cumulativeFiatAmount(confirming, price));
      setRequestingValue(cumulativeFiatAmount(requesting, price));
    }
  }, [price, confirming, requesting]);

  useEffect(() => {
    fetchTreasuryRequesting()
      .then((data) => {
        setConfirming(data.confirmingSpends);
        setRequesting(data.requestingSpends);
      })
      .catch((err) => {
        console.error("fetchTreasuryRequesting", err);
      });
  }, []);

  if (!confirmingValue || !requestingValue) return null;

  return (
    <TotalRequestingAssetsContent
      confirmingValue={confirmingValue}
      requestingValue={requestingValue}
      onClose={onClose}
    />
  );
}

export default function TotalRequestingAssets() {
  const { displayTreasuryRequesting } = useChainSettings();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.totalRequestingAssets,
    true,
  );

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible || !displayTreasuryRequesting) return null;

  return <DisplayTotalRequestingAssets onClose={handleClose} />;
}

function TotalRequestingAssetsContent({
  confirmingValue,
  requestingValue,
  onClose,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.INFO]}
    >
      <div className="flex flex-wrap items-center gap-x-2">
        <span>Treasury Requesting:</span>
        <span>Confirming value</span>
        <ValueDisplay
          className="font-bold"
          value={confirmingValue}
          symbol={""}
          prefix={"$"}
        />
        <span>·</span>
        <span>Requesting value</span>
        <ValueDisplay
          className="font-bold"
          value={requestingValue}
          symbol={""}
          prefix={"$"}
        />
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function cumulativeFiatAmount(amounts, price) {
  const { symbol, decimals } = getChainSettings(CHAIN);
  const supportedSymbols = ["USDC", "USDT"];
  return amounts.reduce((acc, curr) => {
    if (curr.symbol === symbol) {
      const amount = BigNumber(toPrecision(curr.amount, decimals));
      return acc.plus(amount.multipliedBy(price));
    } else if (
      supportedSymbols.includes(curr.symbol) &&
      SYMBOL_DECIMALS[curr.symbol]
    ) {
      return acc.plus(toPrecision(curr.amount, SYMBOL_DECIMALS[curr.symbol]));
    }
    return acc;
  }, new BigNumber(0));
}
