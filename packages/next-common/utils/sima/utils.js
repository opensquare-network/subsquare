import { addressEllipsis } from "..";
import { tryConvertToEvmAddress } from "../mixedChainUtil";
import { prettyHTML } from "../viewfuncs";

export function getUserObjFromAddress(address) {
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  return {
    username: addressEllipsis(maybeEvmAddress),
    address: maybeEvmAddress,
  };
}

export function getContentField(content, contentType) {
  const contentFormat = contentType === "html" ? "HTML" : "subsquare_md";
  return {
    content: contentType === "html" ? prettyHTML(content) : content,
    content_format: contentFormat,
  };
}
