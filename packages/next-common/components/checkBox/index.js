import React from "react";
import styled from "styled-components";
import CheckedSVG from "./checked.svg";
import UnCheckedSVG from "./unchecked.svg";

const Wrapper = styled.div`
  display: inline-flex;
`;

export default function CheckBox({ checked }) {
  return <Wrapper>{checked ? <CheckedSVG /> : <UnCheckedSVG />}</Wrapper>;
}
