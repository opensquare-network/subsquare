import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import { useState } from "react";
import DVDetailPopup from "./DVDetailPopup";
import { useDecentralizedVoicesVotes } from "next-common/hooks/referenda/useDecentralizedVoicesVotes";
export const DivWrapper = tw.div`
  flex
  flex-1
  py-1.5
  px-3
  gap-1
  mr-2
  flex-col
  bg-neutral200
  md:flex-row
`;
export default function DVBubbleLegend({ className }) {
  const dvVotes = useDecentralizedVoicesVotes();

  const [showDetailPopup, setShowDetailPopup] = useState(false);

  if (!dvVotes.length) {
    return null;
  }

  return (
    <>
      <div className={cn(className, "flex")}>
        <DivWrapper>
          <div className="flex gap-1">
            <span className="text12Medium text-textTertiary">
              Decentralized Voices
            </span>
            <span className="text12Medium text-textSecondary">
              24.72%(≈42.21M)
            </span>
            <span className="text12Medium text-textTertiary">·</span>
          </div>
          <div className="flex gap-1">
            <span className="text12Medium text-textTertiary">Aye</span>
            <span className="text12Medium text-textSecondary">
              18.36%(≈31.12M)
            </span>
            <span className="text12Medium text-textTertiary">·</span>
            <span className="text12Medium text-textTertiary">Nay</span>
            <span className="text12Medium text-textSecondary">
              6.36%(≈11.12M)
            </span>
          </div>
        </DivWrapper>
        <SecondaryButton
          key={"detail"}
          size="small"
          className="w-7 p-0"
          onClick={() => setShowDetailPopup(true)}
        >
          <SystemMenu className="w-4 h-4" />
        </SecondaryButton>
      </div>

      {showDetailPopup && (
        <DVDetailPopup closeFunc={() => setShowDetailPopup(false)} />
      )}
    </>
  );
}
