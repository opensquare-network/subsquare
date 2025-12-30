import { omit, sortBy } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import BigNumber from "bignumber.js";
import BarLabel from "./barChart/barLabel";
import { startCase } from "lodash-es";
import { useMemo, useRef, useState } from "react";
import { useElementRect } from "next-common/hooks/useElementRect";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Bars from "./barChart/bars";

const ProposalsPopup = dynamicPopup(() => import("./proposalsPopup"));

export default function CategoriesList() {
  const { statistics } = usePageProps();
  const categories = useMemo(
    () =>
      sortBy(
        Object.entries(omit(statistics.categories, "others")).map(
          ([key, value]) => ({
            key,
            ...value,
          }),
        ),
        (item) => -item.totalPayoutFiatValue,
      ),
    [statistics],
  );
  const totalFiat = categories.reduce(
    (acc, category) => acc.plus(category.totalPayoutFiatValue),
    new BigNumber(0),
  );

  return (
    <SecondaryCard className="[&>div:first-child]:mb-4">
      <Summary totalFiat={totalFiat} />
      <Chart categories={categories} totalFiat={totalFiat} />
    </SecondaryCard>
  );
}

function BarLabels({ dataItems }) {
  const [showDetail, setShowDetail] = useState(false);
  const [category, setCategory] = useState({});

  const labels = useMemo(
    () =>
      dataItems.map((item) => ({
        data: item,
        label: startCase(item.key),
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
        />
      ))}
      {showDetail && (
        <ProposalsPopup
          title={`${startCase(category.key)} Proposals`}
          data={category}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

function Chart({ categories, totalFiat }) {
  const labelsRef = useRef(null);
  const { height: labelsHeight } = useElementRect(labelsRef);

  return (
    <div className="flex items-start gap-x-2">
      <div ref={labelsRef} className="pb-2" style={{ width: "140px" }}>
        <BarLabels dataItems={categories} />
      </div>
      <div
        className="flex-1"
        style={{
          height: labelsHeight || 0,
          overflow: "hidden",
          visibility: labelsHeight ? "visible" : "hidden",
        }}
      >
        <Bars dataItems={categories} totalFiat={totalFiat} />
      </div>
    </div>
  );
}
