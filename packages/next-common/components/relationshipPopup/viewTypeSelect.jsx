import Select from "next-common/components/select";
import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";
import { noop } from "lodash-es";

export default function ViewTypeSelect({ setViewType = noop }) {
  const { viewType } = useRelationshipViewTypeState();
  return (
    <div>
      <Select
        options={[
          {
            label: "Common",
            value: VIEW_TYPE.COMMON,
          },
          {
            label: "Delegation",
            value: VIEW_TYPE.DELEGATION,
          },
        ]}
        value={viewType}
        onChange={(item) => setViewType(item.value)}
      />
    </div>
  );
}
