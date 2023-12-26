import { useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import dayjs from "dayjs";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

const MONTH = 11;
const START_DATE = 23;
const END_DATE = 31;

const now = dayjs();
const isBetweenChristmas =
  now.month() === MONTH && now.date() >= START_DATE && now.date() <= END_DATE;

export default function ChainLogoEventBackground() {
  const chainSettings = useChainSettings();
  const isKusama = chainSettings.value === Chains.kusama;
  const [navCollapsed] = useNavCollapsed();

  return (
    isBetweenChristmas && (
      <div
        className={cn(
          "absolute inset-0",
          navCollapsed && "hidden",
          "bg-no-repeat bg-cover",
          "bg-[url('/bg-christmas-light.png')]",
          isKusama && "bg-[url('/bg-christmas-kusama-light.png')]",
          "dark:bg-[url('/bg-christmas-dark.png')]",
        )}
      />
    )
  );
}
