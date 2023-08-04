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
  const [isPreview, setIsPreview] = useState(false);

  function onDragOver(event) {
    event.preventDefault();

    if (isPreview) {
      return;
    }

    setDragging(true);
  }

  function onDragLeave(event) {
    event.preventDefault();

    if (isPreview) {
      return;
    }

    setDragging(false);
  }

  function onSelectFile(e) {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  }

  function onDrop(event) {
    event.preventDefault();

    if (isPreview) {
      return;
    }

    setDragging(false);
    const { files } = event.dataTransfer;

    uploadImage(files);
  }

  function onPaste(event) {
    if (isPreview) {
      return;
    }

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
        let placeholderPrefix = "";

        if (props.contentType === "markdown") {
          if (props.value) {
            placeholderPrefix = "\n";
          }

          placeholder = `![Uploading ${image.name}...]()`;
          props.onChange(
            (props.value || "") + `${placeholderPrefix}${placeholder}\n`,
          );
        }

        upload(image).then((response) => {
          if (props.contentType === "markdown") {
            if (response?.result?.url) {
              props.onChange((value) =>
                value.replace(
                  placeholder,
                  `![${image.name}](${response.result.url})`,
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
        onChangePreviewMode={setIsPreview}
        toggleBarLeft={
          !isPreview &&
          props.contentType === "markdown" && (
            <div className="text-textTertiary text12Medium max-sm:hidden">
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
