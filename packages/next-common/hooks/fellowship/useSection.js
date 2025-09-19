import { useState } from "react";
import Select from "next-common/components/select";

export default function useSectionFilter(sections = {}, curSection) {
  const options = Object.entries(sections || {}).map(([key, section]) => ({
    label: section,
    value: key,
  }));

  options.unshift({
    label: "All",
    value: null,
  });

  const [section, setSection] = useState(curSection || options[0].value);

  const component = (
    <div className="text12Medium text-textPrimary flex items-center gap-x-2">
      <div>Section</div>
      <Select
        className="w-40"
        small
        value={section}
        options={options}
        onChange={(option) => {
          setSection(option.value);
        }}
      />
    </div>
  );

  return {
    section,
    component,
  };
}
