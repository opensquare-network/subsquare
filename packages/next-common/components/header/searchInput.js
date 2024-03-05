import React, { useRef, useState } from "react";
import styled from "styled-components";
import InputOrigin from "../input";
import SearchInputShortcut from "./searchInputShortcut";
import { SystemSearch } from "@osn/icons/subsquare";

const Wrapper = styled.div``;

const Input = styled(InputOrigin)`
  height: 38px;
  background-color: var(--neutral200);
  border-color: var(--neutral200) !important;

  &:hover {
    border-color: var(--neutral400) !important;
  }

  &[data-focus="true"] {
    background-color: var(--neutral100) !important;
    border-color: var(--neutral500) !important;
  }
`;

const googleq = "https://google.com/search?q=";

export default function SearchInput({
  shortcut = true,
  inputType,
  scope = "",
  placeholder = "",
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef();
  const [focus, setFocus] = useState(false);

  function handleSearch() {
    const params = encodeURIComponent(value + (scope ? ` ${scope}` : ""));
    const url = googleq + params;
    window.open(url, "_blank");
  }

  return (
    <Wrapper>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.code === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            handleSearch();
          }
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        prefix={<SystemSearch className="[&_path]:fill-textTertiary" />}
        suffix={
          shortcut && <SearchInputShortcut focus={focus} inputRef={inputRef} />
        }
        inputType={inputType}
        enterkeyhint="Search"
      />
    </Wrapper>
  );
}
