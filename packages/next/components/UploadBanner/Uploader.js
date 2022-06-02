import styled from "styled-components";
import { grey_400, primary_purple_500 } from "next-common/styles/colors";
import {
  text_accessory,
  text_secondary,
  p_12_normal,
} from "next-common/styles/componentCss";
import Flex from "next-common/components/styled/flex";
import Image from "next/image";
import { useRef } from "react";

const Wrapper = styled.div`
  .hidden {
    display: none;
  }
`;

const UploadArea = styled(Flex)`
  justify-content: center;
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
const Hint = styled.span`
  ${text_accessory}
  line-height: 19.6px;
`;

const SelectFile = styled.span`
  ${text_secondary};
  margin-left: 8px;
  line-height: 19.6px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const UploadTip = styled.p`
  display: flex;
  align-items: center;
`;

function Uploader() {
  const inputEl = useRef();

  const handleSelectFile = () => {
    inputEl.current?.click();
  };

  return (
    <Wrapper>
      <UploadArea>
        <UploadTip>
          <Hint>Drag and drop image or </Hint>
          <SelectFile onClick={handleSelectFile}>
            <Image width="20" height="20" src="/imgs/icons/upload.svg" />
            Upload
          </SelectFile>
        </UploadTip>
      </UploadArea>
      <Tips>
        <li>We recommand a 16:9 image.</li>
        <li>
          The banner will be displayed in the post list and as a shared preview
          on social media.
        </li>
      </Tips>

      <input className="hidden" type="file" ref={inputEl} />
    </Wrapper>
  );
}

export default Uploader;
