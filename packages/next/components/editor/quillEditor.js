import React, {useState} from "react";
import styled, {css} from "styled-components";
import dynamic from "next/dynamic";


// // import ReactQuill, {Quill} from "react-quill";
// // import "quill-mention";
// // import ImageResize from "quill-image-resize-module";
// // import MagicUrl from 'quill-magic-url';
// import 'quill-mention/dist/quill.mention.css';

const MyReactQuill = dynamic(() => import("./quill").catch(e => console.error(e)), {ssr: false});


// const Quill = dynamic(
//   () => import("react-quill").then(mod => {
//     mod.Quill.register("modules/ImageResize", ImageResize);
//     mod.Quill.register('modules/magicUrl', MagicUrl)
//     return mod.Quill;
//   }),
//   {ssr: false}
// );
//
// console.log(Quill)
//
// const MyReactQuill = dynamic(
//   () => import("react-quill").then(mod => {
//     // import ImageResize from "quill-image-resize-module";
//     // const ImageResize = dynamic(() => import("quill-image-resize-module"), {ssr: false})
//     // mod.Quill.register("modules/ImageResize", ImageResize);
//     // mod.Quill.register('modules/magicUrl', MagicUrl)
//     return mod;
//   }),
//   {ssr: false}
// );
// import 'react-quill/dist/quill.snow.css';


// const MagicUrl = dynamic(() => import("quill-magic-url"), {ssr: false})
// dynamic(() => import("quill-mention"), {ssr: false})


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
            min-height: 114px;
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
    .ql-editor {
      min-height: ${(props) => props.height}px !important;
      max-height: 300px;
      overflow: hidden;
      overflow-y: auto;
      overflow-x: auto;
      word-break: break-all;

      span.mention, span.mention span {
        background-color: #fff;
        color: #0974CD;
      }
    }

    .ql-toolbar.ql-snow {
      padding-right: 80px;
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
                       setModalInsetImgFunc,
                       users = [],
                       height = 100,
                       visible = true,
                       setQuillRef = null
                     }) => {
  const [focused, setFocused] = useState(false);

  return (
    <StyledTextArea
      className={"post-content " + (focused ? "container focused" : "container")}
      visible={visible}
      height={height}
    >
      <MyReactQuill
        setQuillRef={setQuillRef}
        value={content}
        onChange={(content, delta, source, editor) => {
          setContent(content)
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        users={users}
        setModalInsetImgFunc={setModalInsetImgFunc}
      />
    </StyledTextArea>
  );
};

export default QuillEditor;
