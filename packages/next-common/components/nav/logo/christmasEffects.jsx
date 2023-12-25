import Christmas from "./christmas.svg";
import ChristmasKusama from "./christmas-kusama.svg";
import { useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import dayjs from "dayjs";

// (christmas(72) - logo(40)) / 2
const iconOffset = (72 - 40) / 2;

const now = dayjs();
const isBetweenChristmas =
  now.month() === 11 && now.date() >= 23 && now.date() <= 27;

export default function ChainLogoChristmasEffects() {
  const chainSettings = useChainSettings();
  const isKusama = chainSettings.value === Chains.kusama;

  return (
    isBetweenChristmas && (
      <div
        className="absolute inset-0"
        style={{
          left: -iconOffset,
          top: -iconOffset,
        }}
      >
        {isKusama ? <ChristmasKusama /> : <Christmas />}
      </div>
    )
  );
}
