"use client";

import styled from "styled-components";
import EditorWrapper from "./editorWrapper";
import dynamic from "next/dynamic";
import { forwardRef, useRef, useState } from "react";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import clsx from "clsx";
import { SystemLoading } from "@osn/icons/subsquare";

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
  const inputRef = useRef();

  function onDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }
  function onDragLeave(event) {
    event.preventDefault();
    setDragging(false);
  }

  function onSelectFile(e) {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    const { files } = event.dataTransfer;

    uploadImage(files);
  }

  function onPaste(event) {
    const { items } = event.clipboardData;

    const files = Array.from(items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile());

    // if has file, then prevent pasting
    if (files.length) {
      event.preventDefault();
    }

    uploadImage(files);
  }

  function uploadImage(files) {
    const image = files?.[0];
    if (image) {
      if (/image\/\w+/.exec(image.type)) {
        let placeholder = "";

        if (props.contentType === "markdown") {
          placeholder = `\n![Uploading ${image.name}...]()\n`;
          props.onChange((props.value || "") + placeholder);
        }

        upload(image).then((response) => {
          if (props.contentType === "markdown") {
            if (response?.result?.url) {
              props.onChange((value) =>
                value.replace(
                  placeholder,
                  `\n![${image.name}](${response.result.url})\n`,
                ),
              );
            }
          }
        });
      }
    }
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
              {uploading ? (
                <span className="inline-flex items-center">
                  <SystemLoading className="w-3.5 h-3.5 mr-1 [&_path]:stroke-textTertiary" />{" "}
                  Uploading...
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    inputRef.current?.click?.();
                  }}
                >
                  Attach files by dragging & dropping, selecting or pasting
                  item.
                </span>
              )}
            </div>
          )
        }
      />

      <input
        className="hidden"
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={onSelectFile}
      />
    </Wrapper>
  );
}

export default forwardRef(Editor);
