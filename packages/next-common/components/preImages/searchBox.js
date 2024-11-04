import { SystemSearch } from "@osn/icons/subsquare";
import InputOrigin from "next-common/components/input";
import styled from "styled-components";

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
}) {
  return (
    <div className="flex items-center gap-x-2 max-md:w-full">
      <Input
        placeholder={placeholder}
        prefix={<SystemSearch className="text-textTertiary w-5 h-5" />}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
