import styled from "styled-components";
import { grey_400, primary_purple_500 } from "next-common/styles/colors";
import { text_accessory, p_12_normal } from "next-common/styles/componentCss";

const Wrapper = styled.div``;

const UploadArea = styled.div`
  border: 1px dashed;
  border-color: ${grey_400};
  height: 116px;
  border-radius: 4px;

  &.active {
    border-color: ${primary_purple_500};
  }
`;

const Tips = styled.ul`
  padding: 0;
  list-style: none;
  margin: 8px 0;

  li {
    ${text_accessory};
    ${p_12_normal};
    &::before {
      content: "\\2022";
      padding: 0 8px;
    }
  }
`;

function Uploader() {
  return (
    <Wrapper>
      <UploadArea></UploadArea>
      <Tips>
        <li>We recommand a 16:9 image.</li>
        <li>
          The banner will be displayed in the post list and as a shared preview
          on social media.
        </li>
      </Tips>
    </Wrapper>
  );
}

export default Uploader;
