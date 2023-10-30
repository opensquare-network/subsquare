import tw from "tailwind-styled-components";
import { SystemCopied } from "@osn/icons/subsquare";
import GhostButton from "next-common/components/buttons/ghostButton";

export function VoteSuccessfulWrapper({ children, onClose }) {
  return (
    <div className="flex flex-col !mt-0">
      <div className="flex flex-col gap-[4px] items-center [&_svg_path]:fill-green500 my-[24px]">
        <SystemCopied width={64} height={64} />
        <span className="text16Bold text-textPrimary">Vote successfully!</span>
      </div>
      {children}
      <div className="flex justify-end mt-[24px]">
        <GhostButton onClick={onClose}>Close</GhostButton>
      </div>
    </div>
  );
}

export const VoteFor = tw.div`
  flex
  justify-between
  py-[12px]
  text14Medium
  text-textPrimary
  border-b-neutral300
  border-b
`;
