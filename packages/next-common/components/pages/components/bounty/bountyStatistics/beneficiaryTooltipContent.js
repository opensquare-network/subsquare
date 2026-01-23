import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import Avatar from "next-common/components/avatar";
import { AddressUser } from "next-common/components/user";
import { addressEllipsis } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import ValueDisplay from "next-common/components/valueDisplay";

function AccountInfoContent({ address }) {
  const maybeEvmAddress = tryConvertToEvmAddress(address);

  return (
    <div className="flex gap-[8px]">
      <Avatar address={address} size={30} />
      <div className="flex flex-col">
        <AddressUser
          add={address}
          showAvatar={false}
          className="text12Medium text-textPrimaryContrast"
          noTooltip={true}
        />
        <div className="max-md:hidden text-textTertiaryContrast text12Medium inline-flex items-center">
          {maybeEvmAddress}
        </div>
        <div className="md:hidden text-textTertiaryContrast text12Medium">
          {addressEllipsis(maybeEvmAddress)}
        </div>
      </div>
    </div>
  );
}

export function BeneficiaryTooltipContent({ data }) {
  return (
    <div className="space-y-2">
      <AccountInfoContent address={data.name} />
      <Divider style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="flex gap-4">
        <div className="flex gap-2 text12Medium">
          <span className="text-textSecondaryContrast">Total</span>
          <ValueDisplay
            className="text-textPrimaryContrast"
            value={data.totalPayoutFiatValue}
            prefix="$"
            showTooltip={false}
          />
        </div>
        <div className="flex gap-2 text12Medium">
          <span className="text-textSecondaryContrast">Proposals</span>
          <span className="text-textPrimaryContrast">
            {data.childBounties.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
