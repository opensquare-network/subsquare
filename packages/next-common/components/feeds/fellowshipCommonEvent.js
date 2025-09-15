import FeedsVotedEvent from "next-common/components/feeds/referendaEvents/voted";
import FeedsSubmittedEvent from "next-common/components/feeds/referendaEvents/submitted";
import FeedsDecisionStartedEvent from "next-common/components/feeds/referendaEvents/decisionStarted";
import FeedsDecisionDepositPlacedEvent from "next-common/components/feeds/referendaEvents/decisionDepositPlaced";

import { getFellowshipCoreFeedsEventContent } from "next-common/components/fellowship/core/feeds/event";
import { getFellowshipSalaryFeedsEventContent } from "../fellowship/salary/feeds/events";

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

function EventContent({ feed, showUserInfo = true }) {
  const eventSection = feed?.section?.toUpperCase();

  if (eventSection === "FELLOWSHIPREFERENDA") {
    return getReferendaEventContent(feed, showUserInfo);
  }

  if (eventSection === "FELLOWSHIPCORE") {
    return getFellowshipCoreFeedsEventContent(feed, showUserInfo);
  }

  if (eventSection === "FELLOWSHIPSALARY") {
    return getFellowshipSalaryFeedsEventContent(feed, showUserInfo);
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
