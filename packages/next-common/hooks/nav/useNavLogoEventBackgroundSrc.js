// event image file format in `public` folder:
// - light: project-menu-bg-{event.name}-{light|dark}-light.{event.filetype}
// - dark:  project-menu-bg-{event.name}-dark.{event.filetype}

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { find } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import solarlunar from "solarlunar";

dayjs.extend(isBetween);

const nowDay = dayjs();

function lunarDateToSolarDate(y, m, d) {
  const { cYear, cMonth, cDay } = solarlunar.lunar2solar(y, m, d);
  return dayjs(new Date(cYear, cMonth - 1, cDay));
}

/**
 * new year
 */
const newYearDay = dayjs(`${nowDay.year()}-01-01`);
const newYearEndDay = newYearDay.add(2, "day");
const newYearEvent = {
  name: "new-year",
  filetype: "png",
  startMonth: newYearDay.month() + 1,
  startDate: newYearDay.date(),
  endMonth: newYearEndDay.month() + 1,
  endDate: newYearEndDay.date(),
};

/**
 * Chinese New Year
 */
const chineseNewYearDay = lunarDateToSolarDate(nowDay.year(), 1, 1);
// Chinese new year's eve
const chineseNewYearsEveDay = chineseNewYearDay.add(-1, "day");
const chineseNewYearEndDay = chineseNewYearDay.add(2, "day");
const chineseNewYearEvent = {
  name: "chinese-new-year",
  filetype: "png",
  startMonth: chineseNewYearsEveDay.month() + 1,
  startDate: chineseNewYearsEveDay.date(),
  endMonth: chineseNewYearEndDay.month() + 1,
  endDate: chineseNewYearEndDay.date(),
};

/**
 * Labour day
 */
const labourDayEvent = {
  name: "labour-day",
  filetype: "png",
  startMonth: 5,
  startDate: 1,
  endMonth: 5,
  endDate: 3,
};

/**
 * Dragon Boat Festival
 */
const dragonBoatFestivalDay = lunarDateToSolarDate(nowDay.year(), 5, 5);
const dragonBoatFestivalEveDay = dragonBoatFestivalDay.add(-1, "day");
const dragonBoatFestivalEvent = {
  name: "dragon-boat-festival",
  filetype: "png",
  startMonth: dragonBoatFestivalEveDay.month() + 1,
  startDate: dragonBoatFestivalEveDay.date(),
  endMonth: dragonBoatFestivalDay.month() + 1,
  endDate: dragonBoatFestivalDay.date(),
};

/**
 * father's day
 */
const juneFirstDay = dayjs(`${nowDay.year()}-06-01`);
const juneFirstDayOfWeek = juneFirstDay.day();
const juneFirstSunday =
  juneFirstDayOfWeek === 0
    ? juneFirstDay
    : juneFirstDay.add(7 - juneFirstDayOfWeek, "day");
const fathersDay = juneFirstSunday.add(14, "day");
const fathersDayEveDay = fathersDay.add(-1, "day");
const fathersDayEvent = {
  name: "fathers-day",
  filetype: "webp",
  startMonth: fathersDayEveDay.month() + 1,
  startDate: fathersDayEveDay.date(),
  endMonth: fathersDay.month() + 1,
  endDate: fathersDay.date(),
};

/**
 * Mid-Autumn
 */
const midAutumnDay = lunarDateToSolarDate(nowDay.year(), 8, 15);
const midAutumnEveDay = midAutumnDay.add(-1, "day");
const midAutumnEndDay = midAutumnDay.add(1, "day");
const midAutumnEvent = {
  name: "mid-autumn",
  filetype: "png",
  startMonth: midAutumnEveDay.month() + 1,
  startDate: midAutumnEveDay.date(),
  endMonth: midAutumnEndDay.month() + 1,
  endDate: midAutumnEndDay.date(),
};

/**
 * Halloween
 */
const halloweenEvent = {
  name: "halloween",
  filetype: "png",
  startMonth: 10,
  startDate: 31,
  endMonth: 11,
  endDate: 2,
};

/**
 * Thanksgiving
 */
const novemberFirstDay = dayjs(`${nowDay.year()}-11-01`);
const novemberFirstDayOfWeek = novemberFirstDay.day();
const novemberFirstThursday =
  novemberFirstDayOfWeek <= 4
    ? novemberFirstDay.add(4 - novemberFirstDayOfWeek, "day")
    : novemberFirstDay.add(11 - novemberFirstDayOfWeek, "day");
const thanksgivingDay = novemberFirstThursday.add(21, "day");
const thanksgivingEndDay = thanksgivingDay.add(2, "day");
const thanksgivingEvent = {
  name: "thanksgiving",
  filetype: "png",
  startMonth: thanksgivingDay.month() + 1,
  startDate: thanksgivingDay.date() - 1,
  endMonth: thanksgivingEndDay.month() + 1,
  endDate: thanksgivingEndDay.date(),
};

/**
 * Christmas
 */
const christmasEvent = {
  name: "christmas",
  filetype: "png",
  startMonth: 12,
  startDate: 23,
  endMonth: 12,
  endDate: 31,
};

const events = [
  newYearEvent,
  chineseNewYearEvent,
  labourDayEvent,
  dragonBoatFestivalEvent,
  fathersDayEvent,
  midAutumnEvent,
  halloweenEvent,
  thanksgivingEvent,
  christmasEvent,
];

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
    }-light.${event.filetype}`,
    dark: `/project-menu-bg-${event.name}-dark.${event.filetype}`,
  };
}
