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

function FellowshipCoreOnlySwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <div className="flex items-center gap-[4px]">
        <span className="text-textPrimary text12Medium whitespace-nowrap">
          Core Only
        </span>
        <Tooltip content="Members under the management system" />
      </div>

      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
}

export function useFellowshipCoreOnlySwitchInDropdown() {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    isOn: committedFilter?.fellowship_core_only,
    component: (
      <FellowshipCoreOnlySwitch
        isOn={stagedFilter?.fellowship_core_only}
        setIsOn={(isOn) => {
          setStagedFilter({
            ...stagedFilter,
            fellowship_core_only: isOn,
          });
        }}
      />
    ),
  };
}

export default function useFellowshipCoreOnlySwitch() {
  const router = useRouter();
  const fellowshipCore = getRouterQuery(router, "fellowship_core_only");
  const isOn = fellowshipCore === "true";

  return {
    isOn,
    component: (
      <FellowshipCoreOnlySwitch
        isOn={isOn}
        setIsOn={(isOn) =>
          isOn
            ? addRouterQuery(router, "fellowship_core_only", "true")
            : removeRouterQuery(router, "fellowship_core_only")
        }
      />
    ),
  };
}
