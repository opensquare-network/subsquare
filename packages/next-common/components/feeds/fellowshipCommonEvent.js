import FeedsVotedEvent from "next-common/components/feeds/referendaEvents/voted";
import FeedsSubmittedEvent from "next-common/components/feeds/referendaEvents/submitted";
import FeedsDecisionStartedEvent from "next-common/components/feeds/referendaEvents/decisionStarted";
import FeedsDecisionDepositPlacedEvent from "next-common/components/feeds/referendaEvents/decisionDepositPlaced";

import FellowshipRegisteredFeed from "../fellowship/salary/feeds/events/registered";
import FellowshipInductedFeed from "../fellowship/feeds/events/inducted";
import FellowshipCycleStartedFeed from "../fellowship/salary/feeds/events/cycleStarted";
import FellowshipSalaryPaidFeed from "../fellowship/salary/feeds/events/paid";

import { getFellowshipCoreFeedsEventContent } from "next-common/components/fellowship/core/feeds/event";

function getReferendaEventContent(feed, showUserInfo = true) {
  const event = feed?.event;
  const EVENT_CONTENTS = {
    Voted: <FeedsVotedEvent feed={feed} showUserInfo={showUserInfo} />,
    Submitted: <FeedsSubmittedEvent feed={feed} showUserInfo={showUserInfo} />,
    DecisionStarted: (
      <FeedsDecisionStartedEvent feed={feed} showUserInfo={showUserInfo} />
    ),
    DecisionDepositPlaced: (
      <FeedsDecisionDepositPlacedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
  };
  return EVENT_CONTENTS[event];
}

function getFellowshipSalaryEventContent(feed, showUserInfo = true) {
  const event = feed?.event;
  const EVENT_CONTENTS = {
    Inducted: (
      <FellowshipInductedFeed
        who={feed?.args?.who}
        showUserInfo={showUserInfo}
      />
    ),
    Registered: (
      <FellowshipRegisteredFeed
        who={feed?.args?.who}
        amount={feed?.args?.amount}
        index={feed?.index}
        showUserInfo={showUserInfo}
      />
    ),
    CycleStarted: <FellowshipCycleStartedFeed index={feed?.index} />,
    Paid: <FellowshipSalaryPaidFeed feed={feed} />,
  };
  return EVENT_CONTENTS[event];
}

function EventContent({ feed, showUserInfo = true }) {
  const eventSection = feed?.section?.toUpperCase();

  if (eventSection === "FELLOWSHIPREFERENDA") {
    return getReferendaEventContent(feed, showUserInfo);
  }

  if (eventSection === "FELLOWSHIPCORE") {
    return getFellowshipCoreFeedsEventContent(feed, showUserInfo);
  }

  if (eventSection === "FELLOWSHIPSALARY") {
    return getFellowshipSalaryEventContent(feed, showUserInfo);
  }

  return null;
}

export default function FellowshipCommonEvent({
  feed,
  showUserInfo = true,
  prefix = null,
  suffix = null,
}) {
  return (
    <>
      {prefix}
      <EventContent feed={feed} showUserInfo={showUserInfo} />
      {suffix}
    </>
  );
}
