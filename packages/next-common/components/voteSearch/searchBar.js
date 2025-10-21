import { SystemSearch } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import styled from "styled-components";
import { useRef, useEffect } from "react";

const Wrapper = styled.div`
  margin: 24px 0 !important;
  display: flex;
  border-radius: 8px;
  border: 1px solid var(--neutral400);
  background: var(--neutral100);
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;

  color: var(--textPrimary);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
`;

export default function SearchBar({ setSearch = noop, autoFocus = false }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <Wrapper>
      <div className="flex p-[8px] [&_path]:fill-textTertiary">
        <SystemSearch width={24} height={24} />
      </div>
      <Input
        ref={inputRef}
        placeholder="Search for address/identity"
        onChange={(e) => setSearch(e.target.value)}
      />
    </Wrapper>
  );
}
