import { useEffect, useMemo } from "react";
import Select from "next-common/components/select";
import { useContextApi } from "next-common/context/api";

function getMethodOptions(api, sectionName) {
  if (!api) return [];

  const section = api.tx[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .filter((s) => !s.startsWith("$"))
    .sort()
    .map((value) => {
      const method = section[value];
      const inputs = method.meta.args
        .map((arg) => arg.name.toString())
        .join(", ");

      return {
        key: `${sectionName}_${value}`,
        text: `${value}(${inputs})`,
        label: (
          <div className="flex flex-col overflow-hidden">
            <div
              key={`${sectionName}_${value}:call`}
              className="text14Medium text-textPrimary whitespace-nowrap"
            >
              {value}({inputs})
            </div>
            <div
              key={`${sectionName}_${value}:text`}
              className="text12Medium text-textTertiary whitespace-nowrap"
            >
              {(method.meta.docs[0] || value).toString()}
            </div>
          </div>
        ),
        value,
      };
    });
}

export default function MethodSelect({
  sectionName,
  methodName,
  setMethodName,
}) {
  const api = useContextApi();
  const options = useMemo(
    () => getMethodOptions(api, sectionName),
    [sectionName, api],
  );

  useEffect(() => {
    if (!options || options.length === 0) return;

    const option = options.find((option) => option.value === methodName);
    if (!option) {
      setMethodName(options[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Select
      value={methodName}
      options={options}
      onChange={(item) => setMethodName(item.value)}
      maxDisplayItem={5}
      itemHeight={56}
      search
    />
  );
}
