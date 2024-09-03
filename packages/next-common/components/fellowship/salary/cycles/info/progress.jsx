import MultiProgress from "next-common/components/progress/multiProgress";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { cn, toPercentage, toPrecision } from "next-common/utils";

const registreredPaidColor = "var(--theme500)";
const unRegisteredPaidColor = "var(--theme300)";
const bg = "var(--theme100)";

export default function FellowshipCycleProgress({ cycle }) {
  const { registeredPaid, unRegisteredPaid } = cycle;
  const { budget } = cycle.status;

  const registeredPaidPercentage = toPercentage(registeredPaid / budget, 2);
  const unRegisteredPaidPercentage = toPercentage(unRegisteredPaid / budget, 2);

  const progressItems = [
    {
      percentage: 100,
      start: 0,
      end: registeredPaidPercentage,
      tooltipContent: `${registeredPaidPercentage.toFixed(2)}%`,
      fg: registreredPaidColor,
      bg,
    },
    {
      percentage: 100,
      start: registeredPaidPercentage,
      end: unRegisteredPaidPercentage,
      tooltipContent: `${unRegisteredPaidPercentage.toFixed(2)}%`,
      fg: unRegisteredPaidColor,
      bg,
    },
  ];

  return (
    <div>
      <div className="py-2">
        <MultiProgress progressItems={progressItems} bg={bg} />
      </div>

      <div
        className={cn(
          "mt-2",
          "flex flex-wrap items-center gap-x-4",
          "max-sm:block",
        )}
      >
        <PaidLabel
          color={registreredPaidColor}
          label="Registered Paid"
          value={registeredPaid}
        />
        <PaidLabel
          color={unRegisteredPaidColor}
          label="Unregistered Paid"
          value={unRegisteredPaid}
        />
      </div>
    </div>
  );
}

function PaidLabel({ value, label = "", color = "" }) {
  const { decimals, symbol } = getSalaryAsset();

  return (
    <div className="flex items-center gap-x-2 text12Medium">
      <div
        className="w-[11px] h-[11px] rounded-sm"
        style={{ backgroundColor: color }}
      />
      <div className="text-textTertiary">{label}</div>
      <ValueDisplay symbol={symbol} value={toPrecision(value, decimals)} />
    </div>
  );
}
