import React, { useState } from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";

const Shade = styled.div`
  z-index: 10;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Wrapper = styled.div`
  z-index: 11;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -200px;
  padding-bottom: 24px;
  width: 400px;
  @media screen and (max-width: 768px) {
    width: 343px;
    margin-top: -50px;
    margin-left: -171px;
    border-radius: 6px;
  }
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
`;
const Title = styled(Flex)`
  padding: 24px 24px 16px 24px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;

  svg {
    cursor: pointer;
  }
`;

const FormWrapper = styled.div`
  padding: 0 24px 12px 24px;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    font-size: 13px;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #ddd;
    width: 96px;
  }
`;

const TextArea = styled.textarea`
  font-family: Inter, serif;
  width: 100%;
  min-height: 66px;
  font-size: 14px;
  line-height: 14px;
  padding: 12px 16px;
  color: #34373c;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus,
  &:active {
    border: 1px solid #aaa;
    outline: none;
  }

  ::placeholder {
    color: #d7dee8;
    opacity: 1;
  }
`;

const SubmitButtonWrapper = styled.div`
  padding-right: 24px;
  display: flex;
  justify-content: end;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  text-align: center;
  all: unset;
  padding: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #ffffff;
  background: #1e2134;
  border-radius: 4px;
  cursor: pointer;
`;

const FileUpload = styled.input`
  visibility: hidden;
  position: absolute;
`;

const Label = styled.div`
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 368px;
  border-radius: 4px;
  background: #f8f8f8;

  span {
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    color: #696d73;
  }
`;

const Hint = styled.p`
  margin: 16px 24px;
  margin-top: 0;
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19.6px;
  color: #6848ff;
  background: #f5f2ff;
  border-radius: 4px;
`;

const FileName = styled.p`
  text-align: center;
  width: 80%;
  font-size: 14px;
  color: #34373c;

  span {
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
  }

  .ellipsis {
    display: inline-block;
    width: calc(30% + 1.2em);
    text-overflow: ellipsis;
  }

  .indent {
    display: inline-flex;
    width: calc(30% - 1.2em);
    justify-content: flex-end;
  }
`;

function InsertContentsModal({
  showModal,
  setShowModal,
  insetQuillContentsFunc: resolveInsertPromise,
  type = "image",
}) {
  const [source, setSource] = useState("remote");
  const [link, setLink] = useState("");

  const onChange = (e) => {
    if (source === "remote") {
      setLink(e.target.value);
    }
  };

  const onInset = () => {
    try {
      if (source === "remote") {
        if (link) {
          resolveInsertPromise(link);
          setShowModal(false);
          setLink("");
        } else {
          // dispatch(
          //   addToast({
          //     type: "info",
          //     message: "请输入图片链接",
          //   })
          // )
        }
      }
    } catch (e) {
      setLink("");
    }
  };

  const onClose = () => {
    setShowModal(false);
  };
  if (!showModal) {
    return null;
  }

  return (
    <Shade>
      <Wrapper>
        <Title>
          <span>Paste URL</span>
          <svg
            onClick={onClose}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00007 7.0574L12.0072 3.05029L12.9498 3.99296L8.94273 8.00007L12.9498 12.0072L12.0072 12.9498L8.00007 8.94273L3.99296 12.9498L3.05029 12.0072L7.0574 8.00007L3.05029 3.99296L3.99296 3.05029L8.00007 7.0574Z"
              fill="#C8CBD0"
            />
          </svg>
        </Title>

        {type === "video" && <Hint>Embedding Youtube video only</Hint>}

        <FormWrapper>
          <TextArea
            value={link}
            placeholder={`Please fill available ${type} URL...`}
            onChange={onChange}
          />
        </FormWrapper>

        <SubmitButtonWrapper>
          <SubmitButton onClick={onInset}>Confirm</SubmitButton>
        </SubmitButtonWrapper>
      </Wrapper>
    </Shade>
  );
}

export default InsertContentsModal;
