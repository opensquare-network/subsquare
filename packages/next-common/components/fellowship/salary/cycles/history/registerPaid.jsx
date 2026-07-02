import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

function RegisterPaid({ count, paid, type = "", blockHeight }) {
  const { symbol, decimals } = getSalaryAsset("fellowship", blockHeight);

  return (
    <div className="max-sm:text-right">
      <ValueDisplay value={toPrecision(paid, decimals)} symbol={symbol} />
      <div>
        <Tooltip
          className="text12Medium text-textSecondary"
          content={!!count && `${count} ${type}`}
        >
          ({count})
        </Tooltip>
      </div>
    </div>
  );
}

export function FellowshipSalaryRegisteredPaid({ cycle = {} }) {
  return (
    <RegisterPaid
      paid={cycle.registeredPaid}
      count={cycle.registeredPaidCount}
      type="Registers"
      blockHeight={cycle?.indexer?.blockHeight}
    />
  );
}

export function FellowshipSalaryUnregisteredPaid({ cycle = {} }) {
  return (
    <RegisterPaid
      paid={cycle.unRegisteredPaid}
      count={cycle.unRegisteredPaidCount}
      type="Unregisters"
      blockHeight={cycle?.indexer?.blockHeight}
    />
  );
}
