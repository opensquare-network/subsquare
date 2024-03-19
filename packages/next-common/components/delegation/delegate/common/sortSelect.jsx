import { noop } from "lodash-es";
import Select from "next-common/components/select";

export default function DelegationSortSelect({ sort = "", setSort = noop }) {
  return (
    <div className="flex items-center gap-x-2 text12Medium text-textSecondary">
      Sort by
      <Select
        className="w-40 text12Medium"
        value={sort}
        onChange={(item) => {
          setSort(item.value);
        }}
        options={[
          {
            label: <Label>Delegated Votes</Label>,
            value: "votes",
          },
          {
            label: <Label>Delegators</Label>,
            value: "",
          },
          {
            label: <Label>Participation</Label>,
            value: "participation",
          },
        ]}
        small
      />
    </div>
  );
}

function Label({ children }) {
  return <span className="text12Medium">{children}</span>;
}
