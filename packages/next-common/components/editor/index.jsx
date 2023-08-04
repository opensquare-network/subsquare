"use client";

import styled from "styled-components";
import EditorWrapper from "./editorWrapper";
import dynamic from "next/dynamic";
import { forwardRef, useState } from "react";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import clsx from "clsx";

const UniverseEditor = dynamic(
  () => import("@osn/rich-text-editor").then((mod) => mod.UniverseEditor),
  { ssr: false },
);

const Wrapper = styled(EditorWrapper)``;

/**
 * @param {Parameters<UniverseEditor>[0]} props
 */
function Editor(props, ref) {
  const [dragging, setDragging] = useState(false);
  const { uploading, upload } = useUploadToIpfs();

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const { files } = e.target;
    upload(files);
  }

  function onPaste(e) {
    e.preventDefault();
    const { items } = e.clipboardData;

    const files = Array.from(items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile());

    upload(files);
  }

  return (
    <Wrapper
      ref={ref}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onPaste={onPaste}
      className={clsx(
        dragging &&
          "[&_.editor-wrapper]:!border-theme500 [&_.toggle-bar-wrapper]:!border-theme500",
      )}
    >
      <UniverseEditor
        {...props}
        toggleBarLeft={
          props.contentType === "markdown" && (
            <div className="text-textTertiary text12Medium">
              {uploading
                ? "Uploading..."
                : "Attach files by dragging & dropping or pasting item."}
            </div>
          )
        }
      />
    </Wrapper>
  );
}

export default forwardRef(Editor);
