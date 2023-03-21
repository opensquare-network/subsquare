import React, { useRef, useState } from "react";
import styled from "styled-components";
import InputOrigin from "../input";
import { bg_theme, theme } from "../../styles/tailwindcss";
import { useChain } from "../../context/chain";
import MagnifyingIcon from "../icons/magnifying";
import SlashShortIcon from "../icons/slashShortcut";
import { useKey } from "../../utils/hooks/useKey";

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

export default function HeaderSearchBar() {
  const chain = useChain();
  const [value, setValue] = useState("");
  const input = useRef();
  const [focus, setFocus] = useState(false);

  const website = `https://${chain}.subsquare.io`;

  function handleSearch() {
    const params = encodeURIComponent(value + ` site:${website}`);
    const url = googleq + params;
    window.open(url, "_blank");
  }

  useKey(
    "/",
    (event) => {
      if (!focus) {
        event.preventDefault();
        input.current?.focus();
      }
    },
    null,
    null,
    focus,
  );
  useKey("Escape", () => {
    input.current?.blur();
  });

  return (
    <Wrapper>
      <Input
        ref={input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for referenda, proposals..."
        onKeyDown={(event) => {
          if (event.code === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        prefix={<MagnifyingIcon />}
        suffix={!focus && <SlashShortIcon />}
      />
    </Wrapper>
  );
}
