import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "next-common/components/fellowship/core/feeds/event/shared";

export default function FellowshipCoreFeedsRequestedEvent({
  feed,
  showUserInfo = true,
}) {
  const { args: { who, wish } = {} } = feed || {};

  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}

      <span>
        submitted evidence {/* todo: show evidence IPFS link here */}
        {/*<ExternalLink*/}
        {/*  href=""*/}
        {/*  className="text-inherit hover:text-textSecondary !underline"*/}
        {/*  externalIcon={false}*/}
        {/*>*/}
        {/*  evidence*/}
        {/*</ExternalLink>{" "}*/}
        with wish{" "}
      </span>

      <FellowshipCoreFeedEventLabel>{wish}</FellowshipCoreFeedEventLabel>
    </>
  );
}
