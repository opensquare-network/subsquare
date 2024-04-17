import { useMemo } from "react";
import { useChainSettings } from "../../../context/chain";
import Tooltip from "../../tooltip";
import FullCalendarCategory from "./category";
import {
  FULLCALENDAR_CATEGORY_COLLECTIVES,
  FULLCALENDAR_CATEGORY_DEMOCRACY,
  FULLCALENDAR_CATEGORY_OPEN_GOV,
  FULLCALENDAR_CATEGORY_OTHERS,
  FULLCALENDAR_CATEGORY_PARACHAIN,
  FULLCALENDAR_CATEGORY_SCHEDULER,
  FULLCALENDAR_CATEGORY_SOCIETY,
  FULLCALENDAR_CATEGORY_STAKING,
  FULLCALENDAR_CATEGORY_TREASURY,
  FULLCALENDAR_CATEGORY_USER,
} from "./consts";

export default function FullCalendarFooter() {
  const {
    modules: { referenda: hasReferenda },
    hasFellowship,
  } = useChainSettings();
  const hasGov2 = hasReferenda || hasFellowship;

  const categories = useMemo(
    () =>
      [
        hasGov2 && FULLCALENDAR_CATEGORY_OPEN_GOV,
        FULLCALENDAR_CATEGORY_DEMOCRACY,
        FULLCALENDAR_CATEGORY_TREASURY,
        FULLCALENDAR_CATEGORY_COLLECTIVES,
      ].filter(Boolean),
    [hasGov2],
  );

  const othersTooltip = (
    <div>
      <div>{FULLCALENDAR_CATEGORY_PARACHAIN}</div>
      <div>{FULLCALENDAR_CATEGORY_SCHEDULER}</div>
      <div>{FULLCALENDAR_CATEGORY_STAKING}</div>
      <div>{FULLCALENDAR_CATEGORY_SOCIETY}</div>
      <div>{FULLCALENDAR_CATEGORY_USER}</div>
    </div>
  );

  return (
    <div className="flex justify-center gap-x-4 gap-y-2 pb-2 flex-wrap max-sm:hidden">
      {categories.map((category) => (
        <FullCalendarCategory key={category} category={category} />
      ))}
      <div className="flex items-center gap-x-1">
        <FullCalendarCategory category={FULLCALENDAR_CATEGORY_OTHERS} />
        <Tooltip content={othersTooltip} />
      </div>
    </div>
  );
}
