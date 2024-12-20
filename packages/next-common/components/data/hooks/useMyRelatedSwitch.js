import { useRouter } from "next/router";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import Toggle from "next-common/components/toggle";

function MyRelatedSwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        My related
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
