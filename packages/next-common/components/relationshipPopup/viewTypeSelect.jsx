import Select from "next-common/components/select";
import { VIEW_TYPE } from "next-common/context/relationship";
import { noop } from "lodash-es";

export default function ViewTypeSelect({ viewType, setViewType = noop }) {
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
