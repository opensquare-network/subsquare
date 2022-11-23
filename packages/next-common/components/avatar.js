import * as React from "react";
import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";
import { useThemeSetting } from "../context/theme";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: ${(props) => props.themeObj.grey200Border};
  }
`;

export default function Avatar({ address, size = 24 }) {
  const themeObj = useThemeSetting();
  const theme = "polkadot";
  return (
    <StyledIdenticon
      value={address}
      size={size}
      theme={theme}
      themeObj={themeObj}
    />
  );
}
