import { useRouter } from "next/router";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import Toggle from "next-common/components/toggle";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function MyRelatedSwitch({ isOn, setIsOn }) {
  const address = useRealAddress();
  if (!address) {
    return null;
  }

  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        My Related
      </span>
      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
}

export default function useMyRelatedSwitch() {
  const router = useRouter();
  const isMyRelated = getRouterQuery(router, "my_related");
  const isOn = isMyRelated === "true";

  return {
    isOn,
    component: (
      <MyRelatedSwitch
        isOn={isOn}
        setIsOn={(isOn) =>
          isOn
            ? addRouterQuery(router, "my_related", "true")
            : removeRouterQuery(router, "my_related")
        }
      />
    ),
  };
}
