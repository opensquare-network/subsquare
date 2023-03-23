import React, { useRef, useState } from "react";
import styled from "styled-components";
import InputOrigin from "../input";
import { bg_theme, theme } from "../../styles/tailwindcss";
import { useChain } from "../../context/chain";
import MagnifyingIcon from "../icons/magnifying";
import SearchInputShortcut from "./searchInputShortcut";

const Wrapper = styled.div``;

const Input = styled(InputOrigin)`
  ${bg_theme("grey100Bg")};
  border-color: ${theme("grey100Bg")};

  &[data-focus="true"] {
    ${bg_theme("neutral")}
    border-color: ${theme("grey400Border")};
  }
`;

const googleq = "https://google.com/search?q=";

export default function SearchInput({ shortcut = true, inputType }) {
  const chain = useChain();
  const [value, setValue] = useState("");
  const inputRef = useRef();
  const [focus, setFocus] = useState(false);

  const website = `https://${chain}.subsquare.io`;

  function handleSearch() {
    const params = encodeURIComponent(value + ` site:${website}`);
    const url = googleq + params;
    window.open(url, "_blank");
  }

  return (
    <Wrapper>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search on SubSquare"
        onKeyDown={(event) => {
          if (event.code === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        prefix={<MagnifyingIcon />}
        suffix={
          shortcut && <SearchInputShortcut focus={focus} inputRef={inputRef} />
        }
        inputType={inputType}
        enterkeyhint="Search"
      />
    </Wrapper>
  );
}
