import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import SummaryPanel from "./summaryPanel";

export default function ReferendaTracksSummary() {
  return (
    <ReferendaPalletProvider pallet="referenda">
      <OnChainReferendaProvider>
        <div className="flex flex-col">
          <span className="ml-[24px] mb-[16px] text16Bold text-textPrimary">
            Referenda
          </span>
          <SummaryPanel />
        </div>
      </OnChainReferendaProvider>
    </ReferendaPalletProvider>
  );
}
