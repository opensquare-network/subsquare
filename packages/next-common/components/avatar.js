import * as React from "react";
import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { modeSelector } from "../store/reducers/settingSlice";
import dark from "./styled/theme/dark";
import light from "./styled/theme/light";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: ${(props) => props.themeObj.grey200Border};
  }
`;

export default function Avatar({ address, size = 24 }) {
  const mode = useSelector(modeSelector);
  const themeObj = mode === "dark" ? dark : light;
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
