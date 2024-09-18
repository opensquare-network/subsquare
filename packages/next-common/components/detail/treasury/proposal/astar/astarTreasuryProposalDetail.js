import CommonTreasuryProposalDetail from "../commonTreasuryProposalDetail";
import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import AstarTreasuryProposalNavigation from "./astarTreasuryProposalNavigation";

export default function AstarTreasuryProposalDetail() {
  return (
    <CommonTreasuryProposalDetail
      head={
        <>
          <TreasuryAwardCountDown />
          <AstarTreasuryProposalNavigation />
        </>
      }
    />
  );
}
