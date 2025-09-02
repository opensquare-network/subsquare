import { useSwitchIndications } from "next-common/context/relationship";
import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";
import { cn } from "next-common/utils";
import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";

export const commonIndications = [
  { name: RELATIONSHIP_NODE_TYPE.Multisig, color: "var(--theme500)" },
  { name: RELATIONSHIP_NODE_TYPE.Proxy, color: "var(--green500)" },
  { name: RELATIONSHIP_NODE_TYPE.Identity, color: "var(--blue500)" },
];

export const delegationIndications = [
  { name: RELATIONSHIP_NODE_TYPE.Delegator, color: "var(--orange500)" },
  { name: RELATIONSHIP_NODE_TYPE.Delegated, color: "var(--blue500)" },
];

export const allIndications = [...commonIndications, ...delegationIndications];

export const getIndications = (viewType) => {
  if (viewType === VIEW_TYPE.COMMON) {
    return commonIndications;
  } else if (viewType === VIEW_TYPE.DELEGATION) {
    return delegationIndications;
  }
  return [];
};

export default function Indications() {
  const { toggleIndication, excludedIndications } = useSwitchIndications();
  const { viewType = VIEW_TYPE.COMMON } = useRelationshipViewTypeState();
  const indications = getIndications(viewType);
  return (
    <div className="flex justify-center gap-x-4">
      {indications.map((item, index) => {
        const isDisabled = excludedIndications.includes(item.name);
        return (
          <div
            key={index}
            className={cn(
              "text-textSecondary text12Medium flex gap-x-2 items-center cursor-pointer",
              { "text-textDisabled": isDisabled },
            )}
            onClick={() => toggleIndication(item.name)}
          >
            <span
              className="w-[0.625rem] border-b-2 inline-flex"
              style={{
                borderColor: isDisabled ? "var(--neutral400)" : item.color,
              }}
            ></span>
            {item.name}
          </div>
        );
      })}
    </div>
  );
}
