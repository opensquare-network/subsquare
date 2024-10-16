"use client";

import styled from "styled-components";
import EditorWrapper from "./editorWrapper";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { cn } from "next-common/utils";
import { SystemLoading } from "@osn/icons/subsquare";
import { createGlobalState, useEvent } from "react-use";
import { noop } from "lodash-es";
import LoadingEditor from "./loading";

export const useEditorUploading = createGlobalState(false);

const UniverseEditor = dynamic(
  () => import("@osn/rich-text-editor").then((mod) => mod.UniverseEditor),
  {
    ssr: false,
  },
);

const Wrapper = styled(EditorWrapper)``;

/**
 * @param {Parameters<UniverseEditor>[0]} props
 */
function Editor(props, ref) {
  // Handle default values
  props = Object.assign(
    {
      setContentType: noop,
      loadSuggestions: () => [],
      setQuillRef: noop,
      previewerPlugins: [],
    },
    props,
  );
  const [, setEditorUploading] = useEditorUploading();
  const [dragging, setDragging] = useState(false);
  const { uploading, upload } = useUploadToIpfs();
  const inputRef = useRef();
  const [isPreview, setIsPreview] = useState(false);
  const textAreaRef = useRef(null);
  const [lastCaretPosition, setLastCursorPosition] = useState(0);

  function saveLastCaretPosition(e) {
    const start = e.target.selectionStart;

    if (start) {
      setLastCursorPosition(start);
    }
  }

  useEvent("selectionchange", saveLastCaretPosition, textAreaRef.current);

  useEffect(() => {
    if (!uploading) {
      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = lastCaretPosition;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploading, textAreaRef]);

  useEffect(() => {
    setEditorUploading(uploading);
  }, [setEditorUploading, uploading]);

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
        "relative",
        isPreview
          ? "min-h-[182px] max-sm:min-h-[182px]"
          : "min-h-[182px] max-sm:min-h-[222px]",
        "[&_.editor-wrapper]:bg-neutral100",
        "[&_.editor-wrapper]:relative",
        "[&_.editor-wrapper]:z-1",
        "[&_.editor-wrapper]:min-h-[inherit] [&_.editor-wrapper]:max-sm:min-h-[inherit]",
        "[&_.editor-wrapper]:pb-10",
        "[&_.toggle-bar-wrapper]:absolute [&_.toggle-bar-wrapper]:left-0 [&_.toggle-bar-wrapper]:right-0 [&_.toggle-bar-wrapper]:bottom-0",
        dragging &&
          "[&_.editor-wrapper]:!border-theme500 [&_.toggle-bar-wrapper]:!border-theme500",
      )}
    >
      <LoadingEditor />
      <UniverseEditor
        loadingSkeleton={
          <LoadingEditor className="border-none min-h-[inherit] max-sm:min-h-[inherit]" />
        }
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
