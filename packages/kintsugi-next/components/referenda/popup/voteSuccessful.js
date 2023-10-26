import tw from "tailwind-styled-components";
import { SystemCopied } from "@osn/icons/subsquare";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import GhostButton from "next-common/components/buttons/ghostButton";

const Wrapper = tw.div`
  flex
  flex-col
  !mt-0
`;

const VoteFor = tw.div`
  flex
  justify-between
  py-[12px]
  text14Medium
  text-textPrimary
`;

export default function VoteSuccessful({ addressVote, onClose }) {
  return (
    <Wrapper>
      <div className="flex flex-col gap-[4px] items-center [&_svg_path]:fill-green500 my-[24px]">
        <SystemCopied width={64} height={64} />
        <span className="text16Bold text-textPrimary">Vote successfully!</span>
      </div>
      <VoteFor>
        <span>Vote for</span>
      </VoteFor>
      <VoteItem vote={addressVote} />
      <div className="flex justify-end mt-[24px]">
        <GhostButton onClick={onClose}>Close</GhostButton>
      </div>
    </Wrapper>
  );
}
