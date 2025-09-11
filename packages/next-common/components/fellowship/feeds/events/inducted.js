import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";

export default function FellowshipInductedFeed({ who, showUserInfo = true }) {
  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        was <FellowshipFeedEventLabel>Inducted</FellowshipFeedEventLabel>
      </span>
    </>
  );
}
