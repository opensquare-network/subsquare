import Select from "next-common/components/select";
import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";
import { noop } from "lodash-es";

export default function ViewTypeSelect({ setViewType = noop, className = "" }) {
  const { viewType } = useRelationshipViewTypeState();
  return (
    <Select
      small
      className={className}
      options={[
        {
          label: "Common",
          value: VIEW_TYPE.COMMON,
        },
        {
          label: "Delegation",
          value: VIEW_TYPE.DELEGATION,
        },
        {
          label: "Transfer",
          value: VIEW_TYPE.TRANSFER,
        },
      ]}
      value={viewType}
      onChange={(item) => setViewType(item.value)}
    />
  );
}
