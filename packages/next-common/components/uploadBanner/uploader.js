import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { grey_400 } from "next-common/styles/colors";
import { p_12_normal } from "next-common/styles/componentCss";
import Flex from "next-common/components/styled/flex";
import nextApi from "next-common/services/nextApi";
import Loading from "next-common/components/loading";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import DeleteIcon from "next-common/assets/imgs/icons/delete.svg";
import LinkIcon from "next-common/assets/imgs/icons/link.svg";
import { getBannerUrl } from "../../utils/banner";

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
      border-color: ${(props) => props.theme.primaryPurple500};
    `}
`;

const Tips = styled.ul`
  padding: 0;
  list-style: none;
  margin: 8px 0;

  li {
    color: ${(props) => props.theme.textTertiary};
    ${p_12_normal};
    &::before {
      content: "\\2022";
      padding: 0 8px;
    }
  }
`;
const Hint = styled.span`
  color: ${(props) => props.theme.textTertiary};
  line-height: 19.6px;
`;

const SelectFile = styled.span`
  color: ${(props) => props.theme.textSecondary};
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
      background-color: ${(props) => props.theme.grey100Bg}; ;
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

function Uploader({ disabled = false, imageCid, onSetImageCid = () => {} }) {
  const dispatch = useDispatch();
  const inputEl = useRef();
  const [dragging, setDragging] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(imageCid || null);
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
        .postFormData("ipfs/files", formData)
        .then(({ result, error }) => {
          if (result) {
            setCurrentBanner(result.cid);
            onSetImageCid(result.cid);
          }
          if (error) {
            dispatch(newErrorToast(error.message));
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
    onSetImageCid(null);
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
                <img src={getBannerUrl(currentBanner)} />
                <RemoveBannerButton role="button" onClick={handleRemoveBanner}>
                  <DeleteIcon />
                </RemoveBannerButton>
              </BannerPreview>
            ) : (
              <UploadTip>
                <Hint>Drag and drop image or </Hint>
                <SelectFile onClick={handleSelectFile}>
                  <LinkIcon />
                  Upload
                </SelectFile>
              </UploadTip>
            )}
          </>
        )}
      </UploadArea>
      <Tips>
        <li>We recommend a 16:9 image.</li>
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
