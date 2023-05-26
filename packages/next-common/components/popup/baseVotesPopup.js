import React from "react";
import { max_w_full } from "next-common/styles/tailwindcss";
import styled from "styled-components";
import Popup from "./wrapper/Popup";

const StyledPopup = styled(Popup)`
  width: 720px;
  ${max_w_full};
`;

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <StyledPopup {...props} />;
}
