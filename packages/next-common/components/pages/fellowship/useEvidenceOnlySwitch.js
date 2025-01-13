import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import Toggle from "next-common/components/toggle";
import Tooltip from "next-common/components/tooltip";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";

function EvidenceOnlySwitch({ isOn, setIsOn }) {
  return (
    <div className="flex grow items-center justify-between gap-[8px]">
      <div className="flex items-center gap-[4px]">
        <span className="text-textPrimary text12Medium whitespace-nowrap my-[12px]">
          Evidence Only
        </span>
        <Tooltip content="Members who have on-chain evidence" />
      </div>
      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
}

export default function useEvidenceOnlySwitch() {
  const router = useRouter();
  const evidenceOnly = getRouterQuery(router, "evidence_only");
  const isOn = evidenceOnly === "true";

  return {
    isOn,
    component: (
      <EvidenceOnlySwitch
        isOn={isOn}
        setIsOn={(isOn) =>
          isOn
            ? addRouterQuery(router, "evidence_only", "true")
            : removeRouterQuery(router, "evidence_only")
        }
      />
    ),
  };
}

export function useEvidenceOnlySwitchInDropdown() {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    isOn: committedFilter?.evidence_only,
    component: (
      <EvidenceOnlySwitch
        isOn={stagedFilter?.evidence_only}
        setIsOn={(isOn) => {
          setStagedFilter({
            ...stagedFilter,
            evidence_only: isOn,
          });
        }}
      />
    ),
  };
}
