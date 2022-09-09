import { fetchIdentity } from "../services/identity";
import { addressEllipsis } from ".";
import { encodeAddressToChain } from "../services/address";
import { nodes } from "./constants";
import uniqBy from "lodash.uniqby";
import { isAddress } from "./viewfuncs";

export function getMentionList(comments) {
  return uniqBy(
    comments?.items
      ?.map((comment) => comment.author)
      .filter((author) => !!author) ?? [],
    (item) => item.username
  );
}

export function getFocusEditor(contentType, editorWrapperRef, quillRef) {
  return () => {
    if (contentType === "markdown") {
      editorWrapperRef.current?.querySelector("textarea")?.focus();
    } else if (contentType === "html") {
      setTimeout(() => {
        quillRef.setSelection(99999, 0, "api"); //always put caret to the end
      }, 4);
    }
    editorWrapperRef.current?.scrollIntoView();
  };
}

export function getMemberId(user, chain) {
  if (user.username.startsWith("polkadot-key-0x")) {
    const publicKey = user.username.substr(15);
    const address = encodeAddressToChain(Buffer.from(publicKey, "hex"), chain);
    return address;
  } else {
    const address = user.addresses.find(
      (item) => item.chain === chain
    )?.address;
    return address || user.username;
  }
}

export async function getMentionName(user, chain) {
  let address;
  let mentionName;
  if (user.username.startsWith("polkadot-key-0x")) {
    const publicKey = user.username.substr(15);
    address = encodeAddressToChain(Buffer.from(publicKey, "hex"), chain);
    mentionName = address;
  } else {
    address = user.addresses.find((item) => item.chain === chain)?.address;
    mentionName = user.username;
  }

  if (isAddress(mentionName)) {
    mentionName = addressEllipsis(mentionName);
  }

  let displayName;

  const identityChain = nodes.find((n) => n.value === chain)?.identity;
  if (identityChain) {
    const identityAddress = encodeAddressToChain(address, identityChain);
    const identity = await fetchIdentity(identityChain, identityAddress);
    displayName = identity?.info?.displayParent
      ? `${identity?.info?.displayParent}/${identity?.info?.display}`
      : identity?.info?.display;
  }

  return displayName || mentionName;
}

export function getOnReply(
  contentType,
  content,
  setContent,
  quillRef,
  focusEditor,
  chain
) {
  return (user) => {
    if (!user) {
      return focusEditor();
    }

    getMentionName(user, chain).then((name) => {
      let reply = "";
      const memberId = getMemberId(user, chain);
      if (contentType === "markdown") {
        reply = `[@${name}](/user/${memberId}) `;
        if (user.username.startsWith("polkadot-key-0x")) {
          reply = `[@${name}](${memberId}-${chain}) `;
        }
        const at = content ? `${reply}` : reply;
        if (content === reply) {
          setContent(``);
        } else {
          setContent(content + at);
        }
      } else if (contentType === "html") {
        const contents = quillRef.getContents();
        const isKeyRegistered = user.username.startsWith("polkadot-key-0x");
        const address = user.addresses?.[0]?.address ?? "";
        reply = {
          ops: [
            {
              insert: {
                mention: {
                  index: "0",
                  denotationChar: "@",
                  id: isKeyRegistered ? address : memberId,
                  value: name + " &nbsp; ",
                  isKeyRegistered,
                  chain,
                  address,
                  ...(isKeyRegistered
                    ? {
                        osnPolkaAddress: address,
                        osnPolkaNetwork: chain,
                      }
                    : {}),
                },
              },
            },
          ],
        };
        if (JSON.stringify(contents.ops) === `[{"insert":"\\n"}]`) {
          quillRef.setContents(reply.ops);
        } else {
          quillRef.setContents(contents.ops.concat(reply.ops));
        }
      }
      focusEditor();
    });
  };
}
