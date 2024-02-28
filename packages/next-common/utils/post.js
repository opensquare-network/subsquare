import flatten from "lodash.flatten";
import { fetchIdentity } from "../services/identity";
import {
  addressEllipsis,
  isEthereumKeyRegisteredUser,
  isKeyRegisteredUser,
  isPolkadotKeyRegisteredUser,
} from ".";
import { encodeAddressToChain } from "../services/address";
import uniqBy from "lodash.uniqby";
import getChainSettings from "./consts/settings";
import { getIdentityDisplay } from "./identity";
import { tryConvertToEvmAddress } from "./hydradxUtil";

export function getTitle(item) {
  return `${item?.title ?? "--"}`;
}

export function getMentionList(comments) {
  const items = [
    ...(comments?.items ?? []),
    ...flatten((comments?.items ?? []).map((item) => item.replies)),
  ]
    .map((comment) => comment.author)
    .filter((author) => !!author);

  return uniqBy(items, (item) => item.username);
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
  };
}

export function getMemberId(user, chain) {
  if (isEthereumKeyRegisteredUser(user)) {
    return user.address;
  } else if (isPolkadotKeyRegisteredUser(user)) {
    return encodeAddressToChain(Buffer.from(user.publicKey, "hex"), chain);
  } else {
    return user.address || user.username;
  }
}

export async function getMentionName(user, chain) {
  let address;
  let mentionName;
  if (isEthereumKeyRegisteredUser(user)) {
    address = user.address;
    mentionName = addressEllipsis(address);
  } else if (isPolkadotKeyRegisteredUser(user)) {
    address = encodeAddressToChain(Buffer.from(user.publicKey, "hex"), chain);
    const maybeEvmAddress = tryConvertToEvmAddress(address);
    mentionName = addressEllipsis(maybeEvmAddress);
  } else {
    address = user.address;
    mentionName = user.username;
  }

  const setting = getChainSettings(chain);
  const identityChain = setting.identity;

  const identityAddress = encodeAddressToChain(address, identityChain);
  const identity = await fetchIdentity(identityChain, identityAddress);
  const displayName = getIdentityDisplay(identity);

  return displayName || mentionName;
}

export function getOnReply(
  contentType,
  content,
  setContent,
  quillRef,
  focusEditor,
  chain,
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
        if (isKeyRegisteredUser(user)) {
          reply = `[@${name}](${memberId}-${chain}) `;
        }
        const at = content ? `${reply}` : reply;
        if (content === reply) {
          setContent("");
        } else {
          setContent(content + at);
        }
      } else if (contentType === "html") {
        const contents = quillRef.getContents();
        const isKeyRegistered = isKeyRegisteredUser(user);
        const address = user.address ?? "";
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
        if (
          JSON.stringify(contents.ops) === JSON.stringify([{ insert: "\n" }])
        ) {
          quillRef.setContents(reply.ops);
        } else {
          quillRef.setContents(contents.ops.concat(reply.ops));
        }
      }
      focusEditor();
    });
  };
}

export function isPostEdited(post) {
  if (post?.refToPost) {
    return post?.refToPost?.updatedAt !== post?.refToPost?.createdAt;
  }
  return post?.updatedAt !== post?.createdAt;
}
