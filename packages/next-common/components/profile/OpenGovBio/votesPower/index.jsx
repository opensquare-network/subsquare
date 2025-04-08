import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import OpenGovVotesPowerProvider, {
  useOpenGovVotesPowerContext,
} from "../context/votesPower";
import CommonPanel from "next-common/components/profile/bio/commonPanel";
import VotesPowerValueDisplay from "./valueDisplay";
import { SystemMenu } from "@osn/icons/subsquare";

const OpenGovVotesPowerDetailPopup = dynamicPopup(() =>
  import("./detail/detailPopup"),
);

export function DataItem({ label, children }) {
  return (
    <div className="inline-flex gap-1 items-center space-x-1 leading-none">
      <span className="text12Medium text-textTertiary">{label}</span>
      {children}
    </div>
  );
}

export function SplitSymbol() {
  return (
    <div className="text12Medium text-textDisabled mx-2 flex items-center">
      ·
    </div>
  );
}

function SeleBalance() {
  const { selfBalance } = useOpenGovVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Self Balance">
      <ValueDisplay
        value={toPrecision(selfBalance, decimals)}
        symbol={symbol}
        className="text12Medium"
      />
    </DataItem>
  );
}

function MaxDelegations() {
  const { maxDelegations } = useOpenGovVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Max Delegations">
      <ValueDisplay
        value={toPrecision(maxDelegations, decimals)}
        symbol={symbol}
        className="text12Medium"
      />
    </DataItem>
  );
}

function OpenGovVotesPowerInContext() {
  const { isLoading, address } = useOpenGovVotesPowerContext();
  const [detailOpen, setDetailOpen] = useState(false);

  if (!address || isLoading) {
    return null;
  }

  return (
    <>
      <CommonPanel
        className="relative h-[116px] overflow-hidden"
        onExtraBtnClick={setDetailOpen}
        extra={<SystemMenu className="w-4 h-4" />}
      >
        <VotesPowerValueDisplay />
        <div className="flex flex-row items-start space-x-2 w-full gap-y-2">
          <GreyPanel className="flex flex-row items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap gap-y-1">
            <SeleBalance />
            <SplitSymbol />
            <MaxDelegations />
          </GreyPanel>
        </div>
      </CommonPanel>
      {detailOpen && (
        <OpenGovVotesPowerDetailPopup setDetailOpen={setDetailOpen} />
      )}
    </>
  );
}

export default function OpenGovVotesPower({ address }) {
  return (
    <OpenGovVotesPowerProvider address={address}>
      <OpenGovVotesPowerInContext />
    </OpenGovVotesPowerProvider>
  );
}
