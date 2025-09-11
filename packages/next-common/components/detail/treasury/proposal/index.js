import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import CommonTreasuryProposalDetail from "./commonTreasuryProposalDetail";

export default function TreasuryProposalDetail() {
  return (
    <CommonTreasuryProposalDetail
      head={
        <>
          <TreasuryAwardCountDown />
          <TreasuryProposalNavigation />
        </>
      }
    />
  );
}
