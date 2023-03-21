import React from "react";
import {
  CollectivesTag,
  DemocracyTag,
  OpenGovTag,
  SchedulerTag,
  StakingTag,
  TreasuryTag,
  SocietyTag,
  ParachainTag,
} from "../../../tags/business";
import {
  FULLCALENDAR_CATEGORY_COLLECTIVES,
  FULLCALENDAR_CATEGORY_DEMOCRACY,
  FULLCALENDAR_CATEGORY_OPEN_GOV,
  FULLCALENDAR_CATEGORY_SCHEDULER,
  FULLCALENDAR_CATEGORY_STAKING,
  FULLCALENDAR_CATEGORY_TREASURY,
  FULLCALENDAR_CATEGORY_SOCIETY,
  FULLCALENDAR_CATEGORY_PARACHAIN,
} from "../../fullCalendar/consts";

export default function EventTag({ event }) {
  if (event.category === FULLCALENDAR_CATEGORY_TREASURY) {
    return <TreasuryTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_DEMOCRACY) {
    return <DemocracyTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_OPEN_GOV) {
    return <OpenGovTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_COLLECTIVES) {
    return <CollectivesTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_STAKING) {
    return <StakingTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_SCHEDULER) {
    return <SchedulerTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_SOCIETY) {
    return <SocietyTag />;
  } else if (event.category === FULLCALENDAR_CATEGORY_PARACHAIN) {
    return <ParachainTag />;
  }

  return null;
}
