import LoadableContent from "next-common/components/common/loadableContent";
import Tooltip from "next-common/components/tooltip";
import { isNil } from "lodash-es";

const TOOLTIP_CONTENTS = {
  Retention:
    "Retention: how many times a member is approved to keep his/her rank",
  Demotion: "Demotion: how many times a member gets demoted to a lower rank",
  Promotion:
    "Promotion: how many times a member gets promoted to a higher rank",
};

export default function MemberRankChanges({ value, loading }) {
  return (
    <div className="flex flex-row gap-x-2 items-center flex-wrap">
      <div className="flex text12Medium items-center gap-x-2">
        <MemberRankChangesLabel
          label="Retention"
          tooltipContent={TOOLTIP_CONTENTS.Retention}
        />
        <MemberRankChangesValue
          value={value?.retentionTimes}
          loading={loading}
        />
      </div>
      <SplitSymbol />
      <div className="flex text12Medium items-center gap-x-2">
        <MemberRankChangesLabel
          label="Demotion"
          tooltipContent={TOOLTIP_CONTENTS.Demotion}
        />
        <MemberRankChangesValue
          value={value?.demotionTimes}
          loading={loading}
        />
      </div>
      <SplitSymbol />
      <div className="flex text12Medium items-center gap-x-1">
        <MemberRankChangesLabel
          label="Promotion"
          tooltipContent={TOOLTIP_CONTENTS.Promotion}
        />
        <MemberRankChangesValue
          value={value?.promotionTimes}
          loading={loading}
        />
      </div>
    </div>
  );
}

function MemberRankChangesLabel({ label, tooltipContent }) {
  return (
    <Tooltip content={tooltipContent}>
      <span className="text-textTertiary text12Medium flex items-center gap-x-1">
        {label}
      </span>
    </Tooltip>
  );
}

function MemberRankChangesValue({ value, loading }) {
  return (
    <LoadableContent isLoading={loading || isNil(value)}>
      <span className="text16Bold">{value}</span>
    </LoadableContent>
  );
}

function SplitSymbol() {
  return <span className="text-textTertiary text12Medium">/</span>;
}
