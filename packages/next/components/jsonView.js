import ReactJson from "react-json-view";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #ffffff;
  padding: 8px;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
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
      />
    </Wrapper>
  );
}
