import Popup from "next-common/components/popup/wrapper/Popup";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SchedulesTable from "./schedulesTable";

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 max-sm:flex-col max-sm:gap-1 max-sm:items-start">
      <span className="text-textSecondary text14Medium max-sm:text12Medium">
        {label}:
      </span>
      <span className="text14Medium text-textPrimary">{value}</span>
    </div>
  );
}

export default function VestingDetailPopup({ account, data, onClose }) {
  const { decimals, symbol } = useChainSettings();

  if (!data) {
    return null;
  }

  return (
    <Popup title="Vesting Detail" onClose={onClose} wide>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <SummaryItem
              label="Account"
              value={<AddressUser add={account} />}
            />
            <SummaryItem
              label="Current Balance in Lock"
              value={
                <ValueDisplay
                  value={toPrecision(data.currentBalanceInLock, decimals)}
                  symbol={symbol}
                />
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SummaryItem
              label="Total Balance by Vesting"
              value={
                <ValueDisplay
                  value={toPrecision(data.totalVesting, decimals)}
                  symbol={symbol}
                />
              }
            />
            <SummaryItem
              label="Total Unlockable"
              value={
                <ValueDisplay
                  value={toPrecision(data.unlockable, decimals)}
                  symbol={symbol}
                />
              }
            />
          </div>
        </div>

        <div>
          <div className="text-textPrimary text14Bold mt-0 mb-4">
            Schedules
            {!!data?.schedules?.length && (
              <span className="text14Medium text-textTertiary ml-1">
                {data?.schedules?.length}
              </span>
            )}
          </div>
          <SchedulesTable schedules={data.schedules} />
        </div>
      </div>
    </Popup>
  );
}
