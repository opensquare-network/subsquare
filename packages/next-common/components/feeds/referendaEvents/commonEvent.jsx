import Link from "next/link";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import LoadableFellowshipReferendumTitle from "next-common/components/feeds/loadableFellowshipReferendumTitle";
const Label = tw.span`text-textSecondary`;

export default function FeedsCommonEvent({ feed, stateName }) {
  const { args: { referendumIndex } = {} } = feed || {};

  return (
    <>
      <Label>{stateName}</Label>
      <Tooltip
        content={
          <LoadableFellowshipReferendumTitle
            referendumIndex={referendumIndex}
          />
        }
      >
        <Link
          className="truncate cursor-pointer hover:underline"
          href={`/fellowship/referenda/${referendumIndex}`}
        >
          #{referendumIndex}
        </Link>
      </Tooltip>
    </>
  );
}
