import useQueryVotesPower from "next-common/components/profile/OpenGovBio/hooks/useQueryVotesPower";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion } from "@osn/icons/subsquare";
import { useTheme } from "styled-components";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

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

export default function OpenGovVotesPower({ address }) {
  const { result, isLoading } = useQueryVotesPower(address);
  const { decimals, symbol } = useChainSettings();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  if (!address || isLoading) {
    return null;
  }

  const {
    selfBalance = 0,
    maxDelegations = 0,
    votesPower = 0,
    tracks = null,
  } = result || {};

  const backgroundImage = isDark
    ? "linear-gradient(180deg, rgba(30, 33, 48, 0.80) 0%, rgba(30, 33, 48, 0.00) 100%)"
    : "linear-gradient(180deg, rgba(246, 247, 250, 0.80) 0%, rgba(246, 247, 250, 0.00) 100%)";

  return (
    <>
      <GreyPanel
        className={cn(
          "flex flex-col bg-neutral100 justify-end text14Medium text-textPrimary p-4 pb-0 max-w-full rounded-[12px] gap-y-4",
          isMobile ? "mt-0" : "mt-6",
        )}
        style={{
          backgroundImage,
        }}
      >
        <div className="flex flex-col justify-center items-center py-4 gap-y-1">
          <Tooltip
            content={"Votes Power = Self Balance * 6 + Max Delegations"}
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
        <GreyPanel className="flex flex-row items-center bg-neutral200 px-3 py-1.5 rounded-[4px] flex-wrap">
          <DataItem label="Self Balance">
            <ValueDisplay
              value={toPrecision(selfBalance, decimals)}
              symbol={symbol}
            />
          </DataItem>
          <SplitSymbol />
          <DataItem label="Max Delegations">
            <ValueDisplay
              value={toPrecision(maxDelegations, decimals)}
              symbol={symbol}
            />
          </DataItem>
          {!isNil(tracks) && (
            <>
              <SplitSymbol />
              <div className="inline-flex items-center space-x-1">
                <span>{tracks}</span>
                <span className="text12Medium text-textTertiary">Tracks</span>
              </div>
            </>
          )}
        </GreyPanel>
      </GreyPanel>
    </>
  );
}
