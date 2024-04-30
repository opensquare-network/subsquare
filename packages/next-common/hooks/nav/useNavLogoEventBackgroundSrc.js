// event image file format in `public` folder:
// - light: project-menu-bg-{event.name}-{light|dark}-light.png
// - dark:  project-menu-bg-{event.name}-dark.png

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { find } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import solarlunar from "solarlunar";

dayjs.extend(isBetween);

const nowDay = dayjs();

/**
 * Chinese New Year
 */
const { cYear, cMonth, cDay } = solarlunar.lunar2solar(nowDay.year(), 1, 1);
const newYearDay = dayjs(`${cYear}-${cMonth}-${cDay}`);
// new year's eve
const newYearsEveDay = newYearDay.add(-1, "day");
const newYearEndDay = newYearDay.add(2, "day");
const chineseNewYearEvent = {
  name: "chinese-new-year",
  startMonth: newYearsEveDay.month() + 1,
  startDate: newYearsEveDay.date(),
  endMonth: newYearEndDay.month() + 1,
  endDate: newYearEndDay.date(),
};

/**
 * Labour day
 */
const labourDayEvent = {
  name: "labour-day",
  startMonth: 5,
  startDate: 1,
  endMonth: 5,
  endDate: 3,
};

/**
 * Christmas
 */
const christmasEvent = {
  name: "christmas",
  startMonth: 12,
  startDate: 23,
  endMonth: 12,
  endDate: 31,
};

const events = [chineseNewYearEvent, labourDayEvent, christmasEvent];

export function useNavLogoEventBackgroundSrc() {
  const { navPreferDark } = useChainSettings();

  const event = find(events, (event) => {
    return nowDay.isBetween(
      `${nowDay.get("year")}-${event.startMonth}-${event.startDate}`,
      `${nowDay.get("year")}-${event.endMonth}-${event.endDate}`,
      "date",
      "[]",
    );
  });

  if (!event) {
    return null;
  }

  return {
    light: `/project-menu-bg-${event.name}-${
      navPreferDark ? "dark" : "light"
    }-light.png`,
    dark: `/project-menu-bg-${event.name}-dark.png`,
  };
}
