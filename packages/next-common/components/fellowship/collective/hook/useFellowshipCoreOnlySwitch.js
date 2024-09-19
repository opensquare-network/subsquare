import Toggle from "next-common/components/toggle";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";

function FellowshipCoreOnlySwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Fellowship core only
      </span>
      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
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
