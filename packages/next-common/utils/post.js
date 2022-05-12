import { fetchIdentity } from "../services/identity";
import { addressEllipsis } from ".";
import { encodeAddressToChain } from "../services/address";
import { nodes } from "./constants";
import uniqBy from "lodash.uniqby";

export function getMentionList(comments) {
  return (
    uniqBy(
      comments?.items?.map((comment) => comment.author).filter(author => !!author) ?? [],
      (item) => item.username
    )
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

export async function getMentionName(user, chain) {
  let address;
  let mentionName;
  if (user.username.startsWith("polkadot-key-0x")) {
    const publicKey = user.username.substr(15);
    address = encodeAddressToChain(
      Buffer.from(publicKey, "hex"),
      chain
    );
    mentionName = addressEllipsis(address);
  } else {
    address = user.addresses.find(item => item.chain === chain)?.address;
    mentionName = user.username;
  }

  let displayName;

  const identityChain = nodes.find(
    (n) => n.value === chain
  )?.identity;
  if (identityChain) {
    const identityAddress = encodeAddressToChain(
      address,
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

  const name = displayName || mentionName;
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
