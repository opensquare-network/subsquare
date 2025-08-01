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
        <MemberRankChangesLabel label="Retention" />
        <MemberRankChangesValue
          value={value?.retentionTimes}
          loading={loading}
          tooltipContent={TOOLTIP_CONTENTS.Retention}
        />
      </div>
      <SplitSymbol />
      <div className="flex text12Medium items-center gap-x-2">
        <MemberRankChangesLabel label="Demotion" />
        <MemberRankChangesValue
          value={value?.demotionTimes}
          loading={loading}
          tooltipContent={TOOLTIP_CONTENTS.Demotion}
        />
      </div>
      <SplitSymbol />
      <div className="flex text12Medium items-center gap-x-1">
        <MemberRankChangesLabel label="Promotion" />
        <MemberRankChangesValue
          value={value?.promotionTimes}
          loading={loading}
          tooltipContent={TOOLTIP_CONTENTS.Promotion}
        />
      </div>
    </div>
  );
}

function MemberRankChangesLabel({ label }) {
  return (
    <span className="text-textTertiary flex items-center gap-x-1">{label}</span>
  );
}

function MemberRankChangesValue({ value, loading, tooltipContent }) {
  return (
    <LoadableContent isLoading={loading || isNil(value)}>
      <Tooltip content={tooltipContent}>
        <span className="text14Bold">{value}</span>
      </Tooltip>
    </LoadableContent>
  );
}

function SplitSymbol() {
  return <span className="text-textTertiary text12Medium">/</span>;
}
