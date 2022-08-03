import React from "react";
import styled from "styled-components";

const Divider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.grey200Border};
  margin: ${(props) => props.margin}px 0;
`;

export default Divider;
