import styled, { css } from "styled-components";
import { grey_400, primary_purple_500 } from "next-common/styles/colors";
import {
  text_accessory,
  text_secondary,
  p_12_normal,
} from "next-common/styles/componentCss";
import Flex from "next-common/components/styled/flex";
import Image from "next/image";
import { useRef, useState } from "react";
import nextApi from "next-common/services/nextApi";
import Loading from "next-common/components/loading";

const Wrapper = styled.div`
  position: relative;
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

  ${(p) =>
    p.active &&
    css`
      border-color: ${primary_purple_500};
    `}
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
const BannerPreview = styled(Flex)`
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px 17.5px;

  ${(p) =>
    p.disabled &&
    css`
      background-color: #f6f7fa;
    `}

  img {
    height: 100%;
  }
`;
const RemoveBannerButton = styled.div`
  cursor: pointer;
`;

const DisabledMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

function Uploader({ disabled = false, imageUrl, onSetImageUrl = () => {} }) {
  const inputEl = useRef();
  const [dragging, setDragging] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(imageUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleSelectFile = () => {
    inputEl.current?.click();
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const { files } = e.dataTransfer;
    uploadImage(files);
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  };

  const resetSelectedFile = () => {
    if (inputEl.current) {
      inputEl.current.value = "";
    }
  };

  const uploadImage = (files) => {
    if (files && files.length) {
      const image = files[0];
      if (!/image\/\w+/.exec(image.type)) {
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", image, image.name);
      nextApi
        .postFormData("files/upload", formData)
        .then(({ result }) => {
          if (result) {
            setCurrentBanner(result.url);
            onSetImageUrl(result.url);
          }
        })
        .finally(() => {
          setUploading(false);
          resetSelectedFile();
        });
    }
  };

  const handleRemoveBanner = () => {
    setCurrentBanner(null);
    onSetImageUrl("");
    resetSelectedFile();
  };

  return (
    <Wrapper>
      {disabled && <DisabledMask />}
      <UploadArea
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        active={dragging}
      >
        {uploading ? (
          <Loading />
        ) : (
          <>
            {currentBanner ? (
              <BannerPreview disabled={disabled}>
                <div />
                <img src={currentBanner} />
                <RemoveBannerButton role="button" onClick={handleRemoveBanner}>
                  <Image src="/imgs/icons/delete.svg" width={12} height={12} />
                </RemoveBannerButton>
              </BannerPreview>
            ) : (
              <UploadTip>
                <Hint>Drag and drop image or </Hint>
                <SelectFile onClick={handleSelectFile}>
                  <Image width="20" height="20" src="/imgs/icons/upload.svg" />
                  Upload
                </SelectFile>
              </UploadTip>
            )}
          </>
        )}
      </UploadArea>
      <Tips>
        <li>We recommand a 16:9 image.</li>
        <li>
          The banner will be displayed in the post list and as a shared preview
          on social media.
        </li>
      </Tips>

      <input
        className="hidden"
        type="file"
        ref={inputEl}
        accept="image/*"
        onChange={onSelectFile}
      />
    </Wrapper>
  );
}

export default Uploader;
