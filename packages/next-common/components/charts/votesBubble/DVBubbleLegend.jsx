import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import { useState, useEffect } from "react";
import DVDetailPopup from "./DVDetailPopup";
export const DivContainer = styled.div`
  flex: 1;
  padding: 6px 12px;
  border-radius: 4px;
  background: var(--neutral200);
`;
export const DivWrapper = tw(DivContainer)`
  gap-1
  mr-2
  flex
  flex-col
  md:flex-row
`;
export default function DVBubbleLegend({ className, allAye, allNay }) {
  const [isShow, setIsShow] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  useEffect(() => {
    let isExistAry = allAye.some((i) => addressArr.includes(i.account));
    let isExistNays = allNay.some((i) => addressArr.includes(i.account));
    if (isExistAry || isExistNays) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [allAye, allNay]);
  const addressArr = [
    "1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w",
    "13EyMuuDHwtq5RD6w3psCJ9WvJFZzDDion6Fd2FVAqxz1g7K",
    "12s6UMSSfE2bNxtYrJc6eeuZ7UxQnRpUzaAh1gPQrGNFnE8h",
    "15fTH34bbKGMUjF1bLmTqxPYgpg481imThwhWcQfCyktyBzL",
  ];
  return (
    <>
      {isShow && (
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
      )}

      {showDetailPopup && (
        <DVDetailPopup closeFunc={() => setShowDetailPopup(false)} />
      )}
    </>
  );
}
