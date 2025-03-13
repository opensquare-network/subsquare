import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DemocracyVotesPowerProvider, {
  useDemocracyVotesPowerContext,
} from "../context/votesPower";
import VotesPowerPanelWrapper from "next-common/components/profile/OpenGovBio/votesPower/panel";
import { VotesPowerContent } from "next-common/components/profile/OpenGovBio/votesPower/valueDisplay";
import {
  SplitSymbol,
  DataItem,
} from "next-common/components/profile/OpenGovBio/votesPower";
import DemocracyVotesPowerDetail from "./detail";

function SelfBalance() {
  const { selfBalance } = useDemocracyVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Self Balance">
      <ValueDisplay
        value={toPrecision(selfBalance, decimals)}
        symbol={symbol}
      />
    </DataItem>
  );
}

function MaxDelegations() {
  const { delegations } = useDemocracyVotesPowerContext();
  const { decimals, symbol } = useChainSettings();

  return (
    <DataItem label="Delegations">
      <ValueDisplay
        value={toPrecision(delegations, decimals)}
        symbol={symbol}
      />
    </DataItem>
  );
}

function DemocracyVotesPowerInContext() {
  const { isLoading, votesPower, address } = useDemocracyVotesPowerContext();

  if (!address || isLoading) {
    return null;
  }

  return (
    <>
      <VotesPowerPanelWrapper>
        <VotesPowerContent
          isLoading={isLoading}
          votesPower={votesPower}
          isReferenda={false}
        />
        <div className="flex flex-row items-start space-x-2">
          <GreyPanel className="flex flex-row items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap">
            <SelfBalance />
            <SplitSymbol />
            <MaxDelegations />
          </GreyPanel>
          <DemocracyVotesPowerDetail />
        </div>
      </VotesPowerPanelWrapper>
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
