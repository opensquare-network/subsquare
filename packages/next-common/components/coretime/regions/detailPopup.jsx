import Popup from "next-common/components/popup/wrapper/Popup";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";

function DetailItem({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-1">
      <span className="text14Medium text-textSecondary">{label}</span>
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
        <DetailItem label="Workload mask">{region.mask}</DetailItem>
        <DetailItem label="Share">
          {region.parts}/80 ({region.percentage}%)
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
