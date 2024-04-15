import Descriptions from "next-common/components/Descriptions";
import { InfoUsers, SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function Label({ icon, label, percentage }) {
  return (
    <div className="flex justify-between items-center gap-x-2">
      {icon}

      <div className="flex items-center gap-x-1">
        <span className="text14Medium text-textPrimary">{label}</span>
        <span className="text14Medium text-textTertiary">({percentage}%)</span>
      </div>
    </div>
  );
}

export default function DVDetailInfo({
  dvVotesValue,
  dvPercentage,
  ayeVotesValue,
  ayePercentage,
  nayVotesValue,
  nayPercentage,
}) {
  const { decimals, symbol } = useChainSettings();

  const descriptionsItems = [
    {
      label: (
        <Label
          icon={<InfoUsers className="w-5 h-5 text-textTertiary" />}
          label="Decentralized Voices"
          percentage={dvPercentage.toFixed(2)}
        />
      ),
      value: (
        <ValueDisplay
          value={toPrecision(dvVotesValue, decimals)}
          symbol={symbol}
        />
      ),
    },
    {
      label: (
        <Label
          icon={<SystemVoteAye className="w-5 h-5" />}
          label="Aye"
          percentage={ayePercentage.toFixed(2)}
        />
      ),
      value: (
        <ValueDisplay
          value={toPrecision(ayeVotesValue, decimals)}
          symbol={symbol}
        />
      ),
    },
    {
      label: (
        <Label
          icon={<SystemVoteNay className="w-5 h-5" />}
          label="Nay"
          percentage={nayPercentage.toFixed(2)}
        />
      ),
      value: (
        <ValueDisplay
          value={toPrecision(nayVotesValue, decimals)}
          symbol={symbol}
        />
      ),
    },
  ];

  return <Descriptions items={descriptionsItems} />;
}
