import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DemocracyVotesPowerProvider, {
  useDemocracyVotesPowerContext,
} from "../context/votesPower";
import CommonPanel from "next-common/components/profile/bio/commonPanel";
import { VotesPowerContent } from "next-common/components/profile/OpenGovBio/votesPower/valueDisplay";
import { DataItem } from "next-common/components/profile/OpenGovBio/votesPower";
import { SystemMenu } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import LoadableContent from "next-common/components/common/loadableContent";

const DemocracyVotesPowerDetailPopup = dynamicPopup(() => import("./detail"));

function SelfBalance() {
  const { selfBalance, isLoading } = useDemocracyVotesPowerContext();
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
  const { delegations, isLoading } = useDemocracyVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Delegations">
      <LoadableContent isLoading={isLoading} size={16}>
        <ValueDisplay
          value={toPrecision(delegations, decimals)}
          symbol={symbol}
          className="text12Medium"
        />
      </LoadableContent>
    </DataItem>
  );
}

function DemocracyVotesPowerInContext() {
  const { isLoading, votesPower, address } = useDemocracyVotesPowerContext();
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
        <VotesPowerContent
          isLoading={isLoading}
          votesPower={votesPower}
          isReferenda={false}
        />
        <div className="flex flex-row items-start space-x-2 w-full gap-y-2">
          <GreyPanel className="w-full flex flex-col items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap gap-y-1">
            <SelfBalance />
            <MaxDelegations />
          </GreyPanel>
        </div>
      </CommonPanel>
      {detailOpen && (
        <DemocracyVotesPowerDetailPopup setDetailOpen={setDetailOpen} />
      )}
    </>
  );
}

export default function DemocracyVotesPower({ address }) {
  return (
    <DemocracyVotesPowerProvider address={address}>
      <DemocracyVotesPowerInContext />
    </DemocracyVotesPowerProvider>
  );
}
