import { sortBy } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import BigNumber from "bignumber.js";
import BarLabel from "./barChart/barLabel";
import { useMemo, useRef, useState } from "react";
import { useElementRect } from "next-common/hooks/useElementRect";
import { AddressUser } from "next-common/components/user";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Bars from "./barChart/bars";
import { BeneficiaryTooltipContent } from "./beneficiaryTooltipContent";

const ProposalsPopup = dynamicPopup(() => import("./proposalsPopup"));

export default function BeneficiariesList() {
  const { statistics } = usePageProps();
  const beneficiaries = useMemo(
    () =>
      sortBy(
        Object.entries(statistics.beneficiaries).map(([key, value]) => ({
          key,
          name: key,
          ...value,
        })),
        (item) => -item.totalPayoutFiatValue,
      ),
    [statistics],
  );
  const totalFiat = Object.values(statistics.beneficiaries).reduce(
    (acc, beneficiary) => acc.plus(beneficiary.totalPayoutFiatValue),
    new BigNumber(0),
  );

  return (
    <div className="[&>div:first-child]:mb-4">
      <Summary totalFiat={totalFiat} />
      <Chart dataItems={beneficiaries} totalFiat={totalFiat} />
    </div>
  );
}

function BarLabels({ dataItems, TooltipContent }) {
  const [showDetail, setShowDetail] = useState(false);
  const [beneficiary, setCategory] = useState({});

  const labels = useMemo(
    () =>
      dataItems.map((item) => ({
        data: item,
        name: item.key,
        label: (
          <AddressUser add={item.key} className="text12Medium" noEvent={true} />
        ),
        value: item.totalPayoutFiatValue,
      })),
    [dataItems],
  );

  return (
    <div className="flex flex-col gap-1">
      {labels.map((label, i) => (
        <BarLabel
          key={i}
          label={label}
          onClick={(label) => {
            setCategory(label.data);
            setShowDetail(true);
          }}
          TooltipContent={TooltipContent}
        />
      ))}
      {showDetail && (
        <ProposalsPopup
          role="Beneficiary"
          proposalOwner={beneficiary.key}
          data={beneficiary}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

function Chart({ dataItems, totalFiat }) {
  const labelsRef = useRef(null);
  const { height: labelsHeight } = useElementRect(labelsRef);

  return (
    <div className="flex items-start gap-x-2">
      <div ref={labelsRef} className="pb-2" style={{ width: "140px" }}>
        <BarLabels
          dataItems={dataItems}
          TooltipContent={BeneficiaryTooltipContent}
        />
      </div>
      <div
        className="flex-1"
        style={{
          height: labelsHeight || 0,
          overflow: "hidden",
          visibility: labelsHeight ? "visible" : "hidden",
        }}
      >
        <Bars dataItems={dataItems} totalFiat={totalFiat} />
      </div>
    </div>
  );
}
