import AddressUser from "next-common/components/user/addressUser";
import { cn } from "next-common/utils";
import tw from "tailwind-styled-components";
import FellowshipRank from "../../rank";

const EventLabel = tw.span`text-textSecondary`;
const TertiaryLabel = tw.span`text-textTertiary`;

function Rank({ rank }) {
  return (
    <EventLabel className="inline-flex gap-x-1">
      Rank
      <FellowshipRank rank={rank} />
    </EventLabel>
  );
}

export default function FellowshipCoreFeedsListEvent({
  feed = {},
  className = "",
}) {
  const event = feed?.event;

  const eventContent = <EventLabel>{event}</EventLabel>;

  const EVENT_CONTENTS = {
    Inducted: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
        <TertiaryLabel>was</TertiaryLabel>
        {eventContent}
      </>
    ),
    Imported: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
        <TertiaryLabel>was</TertiaryLabel>
        {eventContent}
        <TertiaryLabel>with</TertiaryLabel>
        <Rank rank={feed?.args?.rank} />
      </>
    ),
    Promoted: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
        <TertiaryLabel>was</TertiaryLabel>
        {eventContent}
        <TertiaryLabel>to</TertiaryLabel>
        <Rank rank={feed?.args?.toRank} />
      </>
    ),
    Demoted: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
        <TertiaryLabel>was</TertiaryLabel>
        {eventContent}
        <TertiaryLabel>to</TertiaryLabel>
        <Rank rank={feed?.args?.toRank} />
      </>
    ),
    Proved: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
        <TertiaryLabel>was</TertiaryLabel>
        {eventContent}
        <TertiaryLabel>at</TertiaryLabel>
        <Rank rank={feed?.args?.rank} />
      </>
    ),
    Promotion: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      </>
    ),
    Rentention: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      </>
    ),
    Offboarded: (
      <>
        <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      </>
    ),
    // active
    // inactive
    // retained
    ParamsChanged: (
      <>
        <span>The Polkadot Collectives Fellowship</span>
        <EventLabel>Params Changed</EventLabel>
      </>
    ),
  };

  const content = EVENT_CONTENTS[event];

  return (
    <div className={cn("flex items-center gap-x-2", "text14Medium", className)}>
      {content}
    </div>
  );
}
