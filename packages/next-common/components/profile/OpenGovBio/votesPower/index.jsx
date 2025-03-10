import useQueryVotesPower from "next-common/components/profile/OpenGovBio/hooks/useQueryVotesPower";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion } from "@osn/icons/subsquare";

function DataItem({ label, children }) {
  return (
    <div className="inline-flex space-x-1 items-center">
      <span className="text12Medium text-textTertiary">{label}</span>
      {children}
    </div>
  );
}

export default function OpenGovVotesPower({ address }) {
  const { result, isLoading } = useQueryVotesPower(address);
  const { decimals, symbol } = useChainSettings();

  if (!address || isLoading) {
    return null;
  }

  const {
    selfBalance = 0,
    maxDelegations = 0,
    votesPower = 0,
    trackId = null,
  } = result || {};

  return (
    <>
      <GreyPanel
        className="flex flex-col bg-neutral100 justify-center gap-4 text14Medium text-textPrimary p-4 pb-0 max-w-full"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(246, 247, 250, 0.80) 0%, rgba(246, 247, 250, 0.00) 100%)",
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <Tooltip
            content={"Votes power: Balance * 6 + max_track_delegations."}
            className="space-x-1"
          >
            <span className="text12Medium text-textTertiary">Votes Power</span>
            <SystemQuestion className="inline-flex w-4 h-4 cursor-pointer [&_path]:fill-textTertiary" />
          </Tooltip>
          <ValueDisplay
            value={toPrecision(votesPower, decimals)}
            symbol={symbol}
            className="text20Bold"
          />
        </div>
        <GreyPanel className="flex flex-row items-center bg-neutral200 px-3 py-1.5 rounded-[4px] space-x-2 flex-wrap">
          <DataItem label="Self Balance">
            <ValueDisplay
              value={toPrecision(selfBalance, decimals)}
              symbol={symbol}
            />
          </DataItem>
          <div className="text12Medium text-textDisabled">·</div>
          <DataItem label="Max Delegations">
            <ValueDisplay
              value={toPrecision(maxDelegations, decimals)}
              symbol={symbol}
            />
          </DataItem>
          <div className="text12Medium text-textDisabled">·</div>
          <DataItem label="Tracks">
            <span>{trackId}</span>
          </DataItem>
        </GreyPanel>
      </GreyPanel>
    </>
  );
}
