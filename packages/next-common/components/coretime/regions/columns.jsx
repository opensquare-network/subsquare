import { useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import RegionActionColumn from "./actionColumn";
import RegionStatusTag from "./statusTag";
import { REGION_MASK_BITS } from "./utils";
import RegionTimeColumn, { RegionTimeHeaderButton } from "./timeColumn";

function PaidColumn({ paid }) {
  const { decimals, symbol } = useChainSettings();

  if (isNil(paid)) {
    return <span className="text-textTertiary">-</span>;
  }

  return (
    <ValueDisplay
      value={toPrecision(paid.toString(), decimals)}
      symbol={symbol}
    />
  );
}

export default function useRegionColumns() {
  return useMemo(
    () => [
      {
        name: "Core",
        key: "core",
        className: "w-[90px] text-left",
        render: (region) => <span>#{region.core}</span>,
      },
      {
        name: <RegionTimeHeaderButton name="Start time" ageName="Start age" />,
        key: "startTime",
        className: "w-[140px]",
        render: (region) => (
          <RegionTimeColumn height={region.startRelayBlock} />
        ),
      },
      {
        name: <RegionTimeHeaderButton name="End time" ageName="End age" />,
        key: "endTime",
        className: "w-[140px]",
        render: (region) => <RegionTimeColumn height={region.endRelayBlock} />,
      },
      {
        name: "Owner",
        key: "owner",
        className: "min-w-[220px]",
        render: (region) => <AddressUser add={region.owner} maxWidth={160} />,
      },
      {
        name: "Share",
        key: "share",
        className: "w-[140px]",
        render: (region) => (
          <Tooltip
            content={`Owned: ${region.parts} / Total: ${REGION_MASK_BITS}`}
          >
            <span>
              {region.parts}/{REGION_MASK_BITS}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Paid",
        key: "paid",
        className: "w-[140px] flex justify-end text-right",
        render: (region) => <PaidColumn paid={region.paid} />,
      },
      {
        name: "Status",
        key: "status",
        className: "w-[110px] flex justify-end text-right",
        render: (region) => <RegionStatusTag status={region.status} />,
      },
      {
        name: "",
        key: "action",
        className: "w-[80px] flex justify-end text-right",
        render: (region) => <RegionActionColumn region={region} />,
      },
    ],
    [],
  );
}
