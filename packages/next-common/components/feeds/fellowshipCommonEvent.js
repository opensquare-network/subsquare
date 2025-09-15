import FeedsVotedEvent from "next-common/components/feeds/referendaEvents/voted";
import FeedsSubmittedEvent from "next-common/components/feeds/referendaEvents/submitted";
import FeedsDecisionDepositPlacedEvent from "next-common/components/feeds/referendaEvents/decisionDepositPlaced";
import FeedsCommonEvent from "next-common/components/feeds/referendaEvents/commonEvent";

import { getFellowshipCoreFeedsEventContent } from "next-common/components/fellowship/core/feeds/event";
import { getFellowshipSalaryFeedsEventContent } from "../fellowship/salary/feeds/events";

function getReferendaEventContent(feed, showUserInfo = true) {
  const event = feed?.event;
  const EVENT_CONTENTS = {
    Voted: <FeedsVotedEvent feed={feed} showUserInfo={showUserInfo} />,
    Submitted: <FeedsSubmittedEvent feed={feed} showUserInfo={showUserInfo} />,
    DecisionDepositPlaced: (
      <FeedsDecisionDepositPlacedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    DecisionStarted: (
      <FeedsCommonEvent feed={feed} stateName="Decision Started" />
    ),
    Cancelled: <FeedsCommonEvent feed={feed} name="Cancelled" />,
    ConfirmAborted: <FeedsCommonEvent feed={feed} name="Confirm Aborted" />,
    ConfirmStarted: <FeedsCommonEvent feed={feed} name="Confirm Started" />,
    Confirmed: <FeedsCommonEvent feed={feed} name="Confirmed" />,
    Killed: <FeedsCommonEvent feed={feed} name="Killed" />,
    Rejected: <FeedsCommonEvent feed={feed} name="Rejected" />,
    TimedOut: <FeedsCommonEvent feed={feed} name="Timed Out" />,
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
