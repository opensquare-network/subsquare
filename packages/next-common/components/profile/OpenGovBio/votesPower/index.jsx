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
import LoadableContent from "next-common/components/common/loadableContent";

const OpenGovVotesPowerDetailPopup = dynamicPopup(() => import("./detail"));

export function DataItem({ label, children }) {
  return (
    <div className="w-full gap-1 flex justify-between items-center space-x-1 leading-none">
      <span className="text12Medium text-textTertiary">{label}</span>
      {children}
    </div>
  );
}

function SeleBalance() {
  const { selfBalance, isLoading } = useOpenGovVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Self Balance">
      <LoadableContent isLoading={isLoading} size={16}>
        <ValueDisplay
          value={toPrecision(selfBalance, decimals)}
          symbol={symbol}
          className="text12Medium"
        />
      </LoadableContent>
    </DataItem>
  );
}

function MaxDelegations() {
  const { maxDelegations, isLoading } = useOpenGovVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Max Delegations">
      <LoadableContent isLoading={isLoading} size={16}>
        <ValueDisplay
          value={toPrecision(maxDelegations, decimals)}
          symbol={symbol}
          className="text12Medium"
        />
      </LoadableContent>
    </DataItem>
  );
}

function OpenGovVotesPowerInContext() {
  const { address } = useOpenGovVotesPowerContext();
  const [detailOpen, setDetailOpen] = useState(false);

  if (!address) {
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
          <GreyPanel className="w-full flex flex-col items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap gap-y-1">
            <SeleBalance />
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
