import ExternalLink from "next-common/components/externalLink";
import AddressUser from "next-common/components/user/addressUser";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsRetentionEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
      <span>
        submitted{" "}
        <ExternalLink
          href=""
          className="text-inherit hover:text-textSecondary !underline"
          externalIcon={false}
        >
          evidence
        </ExternalLink>
        ↗ with wish
      </span>

      <FellowshipCoreFeedEventLabel>Retention</FellowshipCoreFeedEventLabel>
    </>
  );
}
