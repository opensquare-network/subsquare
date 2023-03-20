import React, { useState } from "react";
import styled from "styled-components";
import InputOrigin from "../input";
import { bg_theme, border_hidden } from "../../styles/tailwindcss";
import { useChain } from "../../context/chain";
import MagnifyingIcon from "../icons/magnifying";

const Wrapper = styled.div``;

const Input = styled(InputOrigin)`
  ${bg_theme("grey100Bg")}
  ${border_hidden}
`;

const googleq = "https://google.com/search?q=";

export default function HeaderSearchBar() {
  const chain = useChain();
  const [value, setValue] = useState("");

  const website = `https://${chain}.subsquare.io`;

  function handleSearch() {
    const params = encodeURIComponent(value + ` site:${website}`);
    const url = googleq + params;
    window.open(url, "_blank");
  }

  return (
    <Wrapper>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for referenda, proposals..."
        onKeyDown={(event) => {
          if (event.code === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        prefix={<MagnifyingIcon />}
      />
    </Wrapper>
  );
}
