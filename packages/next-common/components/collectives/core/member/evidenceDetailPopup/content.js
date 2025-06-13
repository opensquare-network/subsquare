import FellowshipEvidenceContent from "../../evidenceContent";
import EvidenceVoteBar from "./evidenctVoteBar";
import { WishBar } from "next-common/components/pages/fellowship/member/fellowshipMember/wishBar";
import { cn } from "next-common/utils";

export default function EvidenceContent({ address, rank, wish, evidence }) {
  return (
    <>
      <section className="flex-1 flex-grow-[2] flex-shrink-0 sm:min-w-[418px] flex flex-col ">
        <ComtentWrapper className={"flex-1 sm:overflow-y-auto space-y-4"}>
          <WishBar wish={wish} activeMember={{ rank }} address={address} />
          <FellowshipEvidenceContent
            className="pt-4"
            wish={wish}
            evidence={evidence}
          />
        </ComtentWrapper>
        <ComtentWrapper className="hidden sm:block pt-4 relative bottom-0 bg-neutral100 w-full border-neutral300 border-t z-[1]">
          <EvidenceVoteBar address={address} wish={wish} />
        </ComtentWrapper>
      </section>
    </>
  );
}

function ComtentWrapper({ children, className }) {
  return (
    <>
      <section className={cn("p-6", className)}>
        <div className="max-w-[826px] mx-auto">{children}</div>
      </section>
    </>
  );
}
