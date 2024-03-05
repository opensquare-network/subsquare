import { useMemo } from "react";
import Select from "next-common/components/select";
import { useContextApi } from "next-common/context/api";

function getSectionOptions(api) {
  if (!api) return [];
  return Object.keys(api.tx)
    .filter((s) => !s.startsWith("$"))
    .sort()
    .filter((name) => Object.keys(api.tx[name]).length)
    .map((name) => ({
      label: <span className="text14Medium">{name}</span>,
      text: name,
      value: name,
    }));
}

export default function SectionSelect({ sectionName, setSectionName }) {
  const api = useContextApi();
  const options = useMemo(() => getSectionOptions(api), [api]);

  return (
    <Select
      value={sectionName}
      options={options}
      onChange={(item) => setSectionName(item.value)}
      maxDisplayItem={5}
      search
    />
  );
}
