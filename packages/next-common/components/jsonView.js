import React from "react";
import ReactJson from "react-json-view";
import styled, { withTheme } from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props) =>
    props.theme.isDark ? "#2C303B" : props.theme.neutral};
  padding: 8px;
  overflow-x: auto;
  border: 1px solid
    ${(props) => (props.theme.isDark ? "#2C303B" : props.theme.grey200Border)};
`;

function JsonView({ src, theme }) {
  const jsonTheme = theme?.isDark ? "ocean" : "bright:inverted";

  return (
    <Wrapper>
      <ReactJson
        src={src}
        theme={jsonTheme}
        iconStyle="circle"
        enableClipboard={false}
        collapseStringsAfterLength={false}
        displayDataTypes={false}
        name={false}
      />
    </Wrapper>
  );
}

export default withTheme(JsonView);
