import { SystemSearch } from "@osn/icons/subsquare";
import InputOrigin from "next-common/components/input";
import styled from "styled-components";
import { useEffect } from "react";
import { debounce } from "lodash-es";

const Input = styled(InputOrigin)`
  width: 100%;
  height: 30px;
  background-color: var(--neutral100);
  border-radius: 4px;
`;

export default function SearchBox({
  value,
  setValue,
  placeholder = "Search hash",
  isDebounce = false,
  debounceDelay = 500,
}) {
  const handleDebouncedChange = debounce((newValue) => {
    setValue(newValue);
  }, debounceDelay);

  useEffect(() => {
    // Clean up debounce on unmount to avoid memory leaks
    return () => handleDebouncedChange.cancel();
  }, [handleDebouncedChange]);

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (isDebounce) {
      handleDebouncedChange(newValue);
    } else {
      setValue(newValue);
    }
  };

  return (
    <div className="flex items-center gap-x-2 max-md:w-full text12Normal">
      <Input
        placeholder={placeholder}
        prefix={<SystemSearch className="text-textTertiary w-5 h-5" />}
        defaultValue={value}
        onChange={handleChange}
      />
    </div>
  );
}
