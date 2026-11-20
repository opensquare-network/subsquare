import Popup from "next-common/components/popup/wrapper/Popup";
import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import { WORKLOAD_PARTS_TOOLTIP } from "./tooltips";

function DetailItem({ label, tooltip, children }) {
  return (
    <div className="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-1">
      <span className="flex items-center gap-x-1 text14Medium text-textSecondary">
        <span>{label}</span>
        {tooltip && (
          <Tooltip content={tooltip} contentClassName="max-w-[280px]" />
        )}
      </span>
      <div className="text14Medium text-textPrimary break-all">{children}</div>
    </div>
  );
}

export default function RegionDetailPopup({ region, onClose }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <Popup title={`Region on core #${region.core}`} onClose={onClose}>
      <div className="space-y-4">
        <DetailItem label="Owner">
          <AddressUser add={region.owner} />
        </DetailItem>
        <DetailItem label="Start timeslice">#{region.begin}</DetailItem>
        <DetailItem label="End timeslice">#{region.end}</DetailItem>
        <DetailItem label="Workload mask" tooltip={WORKLOAD_PARTS_TOOLTIP}>
          {region.mask}
        </DetailItem>
        <DetailItem label="Share">
          {region.parts}/{region.totalParts} ({region.percentage}%)
        </DetailItem>
        <DetailItem label="Paid">
          {isNil(region.paid) ? (
            <span className="text-textTertiary">-</span>
          ) : (
            <ValueDisplay
              value={toPrecision(region.paid.toString(), decimals)}
              symbol={symbol}
            />
          )}
        </DetailItem>
      </div>
    </Popup>
  );
}
