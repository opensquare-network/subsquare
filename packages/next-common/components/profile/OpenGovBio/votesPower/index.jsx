import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import VotesPowerDetail from "./detail";
import OpenGovVotesPowerProvider, {
  useOpenGovVotesPowerContext,
} from "../context/votesPower";
import VotesPowerPanelWrapper from "./panel";
import VotesPowerValueDisplay from "./valueDisplay";

const OpenGovVotesPowerDetailPopup = dynamicPopup(() =>
  import("./detail/detailPopup"),
);

function DataItem({ label, children }) {
  return (
    <div className="inline-flex gap-1 items-center space-x-1">
      <span className="text12Medium text-textTertiary">{label}</span>
      {children}
    </div>
  );
}

function SplitSymbol() {
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
      />
    </DataItem>
  );
}

function MaxDelegationsTracks() {
  const { tracks } = useOpenGovVotesPowerContext();
  if (isNil(tracks)) {
    return null;
  }

  return (
    <>
      <SplitSymbol />
      <div className="inline-flex items-center space-x-1">
        <span>{tracks}</span>
        <span className="text12Medium text-textTertiary">Tracks</span>
      </div>
    </>
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
      <VotesPowerPanelWrapper>
        <VotesPowerValueDisplay />
        <div className="flex flex-row items-start space-x-2">
          <GreyPanel className="flex flex-row items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap">
            <SeleBalance />
            <SplitSymbol />
            <MaxDelegations />
            <MaxDelegationsTracks />
          </GreyPanel>
          <VotesPowerDetail setDetailOpen={setDetailOpen} />
        </div>
      </VotesPowerPanelWrapper>
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
