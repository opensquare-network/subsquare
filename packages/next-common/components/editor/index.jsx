"use client";

import styled from "styled-components";
import EditorWrapper from "./editorWrapper";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { cn } from "next-common/utils";
import { SystemLoading } from "@osn/icons/subsquare";
import { useEventListener } from "usehooks-ts";
import { useDispatch } from "react-redux";
import { setEditorUploading } from "next-common/store/reducers/editorSlice";

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
  const textAreaRef = useRef(null);
  const [lastCaretPosition, setLastCursorPosition] = useState(0);
  const dispatch = useDispatch();

  function saveLastCaretPosition(e) {
    const start = e.target.selectionStart;

    if (start) {
      setLastCursorPosition(start);
    }
  }

  useEventListener(
    "selectionchange",
    saveLastCaretPosition,
    textAreaRef.current,
  );

  useEffect(() => {
    if (!uploading) {
      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = lastCaretPosition;
      }
    }
  }, [uploading, textAreaRef]);

  useEffect(() => {
    dispatch(setEditorUploading(uploading));
  }, [uploading]);

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

  function getPositionRangeText() {
    const text = props.value.slice(0, lastCaretPosition);
    return text;
  }

  function checkPositionIsNewLine() {
    const textarea = textAreaRef.current;
    const start = lastCaretPosition;
    const lines = textarea.value.slice(0, start).split("\n");
    const currentLine = lines[lines.length - 1];

    return currentLine === "";
  }

  function uploadImage(files) {
    const image = files?.[0];
    if (image) {
      if (/image\/\w+/.exec(image.type)) {
        const textarea = textAreaRef.current;
        let placeholderUploading = "";
        let placeholderPrefix = "";

        if (props.contentType === "markdown") {
          if (!checkPositionIsNewLine()) {
            placeholderPrefix = "\n";
          }
          placeholderUploading = `![Uploading ${image.name}...]()`;

          const rangeTextStr = getPositionRangeText();
          const replaceTextStr = `${rangeTextStr}${placeholderPrefix}${placeholderUploading}\n`;

          props.onChange((value) =>
            (value || "").replace(rangeTextStr, replaceTextStr),
          );

          // update textarea cursor position
          Promise.resolve().then(() => {
            setLastCursorPosition(rangeTextStr.length + replaceTextStr.length);
            textarea.selectionStart = textarea.selectionEnd =
              replaceTextStr.length;
            textarea?.focus?.();
          });
        }

        upload(image).then((response) => {
          if (props.contentType === "markdown") {
            if (response?.result?.url) {
              const imageResult = `![${image.name}](${response.result.url})`;

              props.onChange((value) =>
                value.replace(placeholderUploading, imageResult),
              );

              // update cursor position, diff to placeholderUploading and imageResult
              setLastCursorPosition(
                (value) =>
                  value + imageResult.length - placeholderUploading.length,
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
      className={cn(
        "min-h-[182px] max-sm:min-h-[222px]",
        dragging &&
          "[&_.editor-wrapper]:!border-theme500 [&_.toggle-bar-wrapper]:!border-theme500",
      )}
    >
      <UniverseEditor
        {...props}
        setTextAreaRef={(textarea) => {
          textAreaRef.current = textarea;
        }}
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
