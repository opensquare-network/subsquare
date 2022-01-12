import ReactJson from "react-json-view";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #ffffff;
  padding: 8px;
  overflow-x: auto;
  border: 1px solid #eeeeee;
`;

export default function JsonView({ src }) {
  return (
    <Wrapper>
      <ReactJson
        src={src}
        theme="bright:inverted"
        iconStyle="circle"
        enableClipboard={false}
        collapseStringsAfterLength={false}
        displayDataTypes={false}
        name={false}
      />
    </Wrapper>
  );
}
