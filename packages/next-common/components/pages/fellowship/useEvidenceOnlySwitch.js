import Toggle from "next-common/components/toggle";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";

function EvidenceOnlySwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Evidence Only
      </span>
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
