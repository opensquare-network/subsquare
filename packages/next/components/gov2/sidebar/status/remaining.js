import { extractTime } from "@polkadot/util";

export default function Remaining({ ms = 0 }) {
  const { days, hours, minutes } = extractTime(ms);
  return [
    days ? `${days}d` : "",
    hours ? `${hours}hrs` : "",
    minutes ? `${minutes}mins` : "",
    "remaining",
  ].join(" ");
}
