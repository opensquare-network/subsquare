import FeedsVotedEvent from "next-common/components/feeds/referendaEvents/voted";
import FeedsSubmittedEvent from "next-common/components/feeds/referendaEvents/submitted";
import FeedsDecisionDepositPlacedEvent from "next-common/components/feeds/referendaEvents/decisionDepositPlaced";
import FeedsCommonEvent from "next-common/components/feeds/referendaEvents/commonEvent";

import { getFellowshipCoreFeedsEventContent } from "next-common/components/fellowship/core/feeds/event";
import { getFellowshipSalaryFeedsEventContent } from "../fellowship/salary/feeds/events";
import { FellowshipRegisteredFeedContent } from "../fellowship/salary/feeds/events/registered";

export const SECTIONS = {
  FELLOWSHIP_REFERENDA: "fellowshipReferenda",
  FELLOWSHIP_CORE: "fellowshipCore",
  FELLOWSHIP_SALARY: "fellowshipSalary",
};

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
    Cancelled: <FeedsCommonEvent feed={feed} stateName="Cancelled" />,
    ConfirmAborted: (
      <FeedsCommonEvent feed={feed} stateName="Confirm Aborted" />
    ),
    ConfirmStarted: (
      <FeedsCommonEvent feed={feed} stateName="Confirm Started" />
    ),
    Confirmed: <FeedsCommonEvent feed={feed} stateName="Confirmed" />,
    Killed: <FeedsCommonEvent feed={feed} stateName="Killed" />,
    Rejected: <FeedsCommonEvent feed={feed} stateName="Rejected" />,
    TimedOut: <FeedsCommonEvent feed={feed} stateName="Timed Out" />,
  };
  return EVENT_CONTENTS[event];
}

function EventContent({ feed, showUserInfo = true }) {
  const eventSection = feed?.section;

  if (eventSection === SECTIONS.FELLOWSHIP_REFERENDA) {
    return getReferendaEventContent(feed, showUserInfo);
  }

  if (eventSection === SECTIONS.FELLOWSHIP_CORE) {
    return getFellowshipCoreFeedsEventContent(feed, showUserInfo);
  }

  if (eventSection === SECTIONS.FELLOWSHIP_SALARY) {
    if (feed?.event === "Registered" && !showUserInfo) {
      return (
        <FellowshipRegisteredFeedContent
          amount={feed?.args?.amount}
          index={feed?.index}
        />
      );
    }
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
