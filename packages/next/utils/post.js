import { fetchIdentity } from "next-common//services/identity";
import { addressEllipsis } from "next-common/utils";
import { encodeAddressToChain } from "next-common/services/address";
import { nodes } from "next-common/utils/constants";

export function getMentionList(comments) {
  function isUniqueInArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  return (
    comments?.items
      ?.map((comment) => comment.author?.username)
      .filter(item => !!item)
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

export async function getMentionName(username, chain) {
  if (!username.startsWith("polkadot-key-0x")) {
    return username;
  }

  const publicKey = username.substr(15);
  const address = encodeAddressToChain(
    Buffer.from(publicKey, "hex"),
    chain
  );

  let displayName;

  const identityChain = nodes.find(
    (n) => n.value === chain
  )?.identity;
  if (identityChain) {
    const identityAddress = encodeAddressToChain(
      Buffer.from(publicKey, "hex"),
      identityChain
    );
    const identity = await fetchIdentity(
      identityChain,
      identityAddress
    );
    displayName = identity?.info?.displayParent
      ? `${identity?.info?.displayParent}/${identity?.info?.display}`
      : identity?.info?.display;
  }

  const name = displayName || addressEllipsis(address);
  return name;
}

export function getOnReply(
  contentType,
  content,
  setContent,
  quillRef,
  focusEditor,
  chain,
) {
  return (username) => {
    if (!username) {
      return focusEditor();
    }

    getMentionName(username, chain).then((name) => {
      let reply = "";
      if (contentType === "markdown") {
        reply = `[@${name}](/member/${username}) `;
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
                  value: name + " &nbsp; ",
                },
              },
            },
            { insert: "\n" },
          ],
        };
        quillRef.current.getEditor().setContents(contents.ops.concat(reply.ops));
      }
      focusEditor();
    });

  };
}
