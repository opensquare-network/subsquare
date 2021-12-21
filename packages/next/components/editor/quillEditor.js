import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import dynamic from "next/dynamic";

const MyReactQuill = dynamic(
  () => import("./quill").catch((e) => console.error(e)),
  { ssr: false }
);

export const StyledTextArea = styled.div`
  ${(props) =>
    props &&
    !props.visible &&
    css`
      visibility: hidden;
      height: 0 !important;
    `}
  ${(props) =>
    props &&
    props.visible &&
    css`
      min-height: 100px;
    `}
  border: 1px solid #dddddd;
  border-radius: 0.25rem;

  &:hover,
  &.focused {
    border: 1px solid #b5b5b5;
  }

  & > section {
    margin-bottom: 8px;
  }

  textarea {
    color: #000 !important;
    padding: 0.75rem 1rem !important;
    line-height: 1.375 !important;
    outline: none;
    font-size: 0.875rem;
  }

  .quill {
    overflow: hidden;
    .ql-editor {
      min-height: ${(props) => props.height}px !important;
      max-height: 300px;
      overflow: hidden;
      overflow-y: auto;
      overflow-x: auto;
      word-break: break-all;

      span.mention,
      span.mention span {
        background-color: #fff;
        color: #0974cd;
      }
    }

    .ql-toolbar.ql-snow {
      @media screen and (max-width: 768px) {
        white-space: nowrap;
        margin-right: 90px;
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .ql-mention-list-container {
      width: auto;
      min-width: 180px;

      .ql-mention-list-item.selected {
        background-color: #f8f8f8;
        color: #34373c;
      }

      .ql-mention-list-item {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        padding: 4px 16px 4px 16px;
      }
    }
  }
`;

const QuillEditor = ({
  content,
  setContent,
  setModalInsetFunc,
  users = [],
  height = 100,
  setEditorHeight = null,
  visible = true,
  setQuillRef = null,
  readOnly = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [ref, setRef] = useState(null);

  return (
    <StyledTextArea
      className={
        "post-content " + (focused ? "container focused" : "container")
      }
      visible={visible}
      height={height >= 300 ? 300 : height}
    >
      <MyReactQuill
        setQuillRef={(ref) => {
          setQuillRef && setQuillRef(ref);
          setRef(ref);
        }}
        value={content}
        onChange={(content, delta, source, editor) => {
          setContent(content);
          if (ref?.current?.editingArea) {
            setEditorHeight(ref?.current?.editingArea.children[0].scrollHeight);
          }
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        users={users}
        setModalInsetFunc={setModalInsetFunc}
        readOnly={readOnly}
      />
    </StyledTextArea>
  );
};

export default QuillEditor;
