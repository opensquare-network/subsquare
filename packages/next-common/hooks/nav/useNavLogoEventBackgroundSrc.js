// event image file format in `public` folder:
// - light: project-menu-bg-{event.name}-{light|dark}-light.png
// - dark:  project-menu-bg-{event.name}-dark.png

import dayjs from "dayjs";
import find from "lodash.find";
import { useChainSettings } from "next-common/context/chain";
import solarlunar from "solarlunar";

const nowDay = dayjs();

/**
 * Chinese New Year
 */
const { cYear, cMonth, cDay } = solarlunar.lunar2solar(nowDay.year(), 1, 1);
const newYearDay = dayjs(`${cYear}-${cMonth}-${cDay}`);
// new year's eve
const newYearsEveDay = newYearDay.add(-1);
const chineseNewYearEvent = {
  name: "chinese-new-year",
  month: newYearDay.month() + 1,
  startDate: newYearsEveDay.date(),
  endDate: newYearsEveDay.date() + 3,
};

/**
 * Christmas
 */
const christmasEvent = {
  name: "christmas",
  month: 12,
  startDate: 23,
  endDate: 31,
};

const events = [chineseNewYearEvent, christmasEvent];

export function useNavLogoEventBackgroundSrc() {
  const { navPreferDark } = useChainSettings();

  const event = find(events, (event) => {
    return (
      nowDay.month() + 1 === event.month &&
      nowDay.date() >= event.startDate &&
      nowDay.date() <= event.endDate
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
