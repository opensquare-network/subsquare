import { SystemSearch } from "@osn/icons/subsquare";
import styled from "styled-components";

const Input = styled.input`
  all: unset;
  display: flex;
  flex-grow: 1;
  border: none;

  overflow: hidden;
  color: var(--textPrimary);
  text-overflow: ellipsis;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 160px;

  gap: 8px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
  background: var(--neutral100);
`;

export default function SearchBox({ value, setValue,placeholder = "Search hash" }) {
  return (
    <Wrapper className="max-md:!w-full">
      <div>
        <SystemSearch
          width={20}
          height={20}
          className="[&_path]:fill-textTertiary"
        />
      </div>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
