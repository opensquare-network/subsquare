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
      <FeedsCommonEvent feed={feed} suffixLabel="decision started" />
    ),
    Cancelled: <FeedsCommonEvent feed={feed} suffixLabel="was cancelled" />,
    ConfirmAborted: (
      <FeedsCommonEvent feed={feed} suffixLabel="confirmation aborted" />
    ),
    ConfirmStarted: (
      <FeedsCommonEvent feed={feed} suffixLabel="started confirmation" />
    ),
    Confirmed: <FeedsCommonEvent feed={feed} suffixLabel="was confirmed" />,
    Killed: <FeedsCommonEvent feed={feed} suffixLabel="was killed" />,
    Rejected: <FeedsCommonEvent feed={feed} suffixLabel="was rejected" />,
    TimedOut: <FeedsCommonEvent feed={feed} suffixLabel="was timed out" />,
    Executed: <FeedsCommonEvent feed={feed} suffixLabel="was executed" />,
  };
  return EVENT_CONTENTS[event];
}

function EventContent({ feed, showUserInfo = true }) {
  const eventSection = feed?.section;
  const event = feed?.event;

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

  return event;
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
