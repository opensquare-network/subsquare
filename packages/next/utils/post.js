export function getMentionList(comments) {
  function isUniqueInArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  return (
    comments?.items
      ?.map((comment) => comment.author?.username)
      .filter(isUniqueInArray) ?? []
  );
}

export function getFocusEditor(contentType, editorWrapperRef, quillRef) {
  return () => {
    if (contentType === "markdown") {
      editorWrapperRef.current?.querySelector("textarea")?.focus();
    } else if (contentType === "html") {
      setTimeout(() => {
        quillRef.current.getEditor().setSelection(99999, 0, "api"); //always put caret to the end
      }, 4);
    }
    editorWrapperRef.current?.scrollIntoView();
  };
}

export function getOnReply(
  contentType,
  content,
  setContent,
  quillRef,
  focusEditor
) {
  return (username) => {
    let reply = "";
    if (contentType === "markdown") {
      reply = `[@${username}](/member/${username}) `;
      const at = content ? `${reply}` : reply;
      if (content === reply) {
        setContent(``);
      } else {
        setContent(content + at);
      }
    } else if (contentType === "html") {
      const contents = quillRef.current.getEditor().getContents();
      reply = {
        ops: [
          {
            insert: {
              mention: {
                index: "0",

                denotationChar: "@",
                id: username,
                value: username + " &nbsp; ",
              },
            },
          },
          { insert: "\n" },
        ],
      };
      quillRef.current.getEditor().setContents(contents.ops.concat(reply.ops));
    }
    focusEditor();
  };
}
