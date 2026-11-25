import { cloneElement } from "react";
import { createRoot } from "react-dom/client";

const addressAttr = "osn-polka-address";
const networkAttr = "osn-polka-network";
const mentionLink = /^(\w+)-(\w+)$/;

export function renderMentionIdentityUserPlugin(identity, options = {}) {
  const tag = options.targetElement?.tag ?? "a";

  return {
    name: "render-mention-identity-user",
    markedOptions({ renderer }) {
      const originalLink = renderer.link;
      renderer.link = function (href, title, text) {
        const match = mentionLink.exec(href ?? "");
        if (!match) {
          return originalLink.call(this, href, title, text);
        }

        const [, address, network] = match;
        return `<${tag} ${addressAttr}="${address}" ${networkAttr}="${network}">${text}</${tag}>`;
      };
    },
    onRenderedHtml(element) {
      const mentions = element?.querySelectorAll(
        `${tag}[${addressAttr}][${networkAttr}]`,
      );
      mentions?.forEach((mention) => {
        const parent = mention.parentNode;
        if (!parent) {
          return;
        }

        const container = mention.ownerDocument.createElement("span");
        container.className = "mention-identity-user-app";
        parent.replaceChild(container, mention);
        createRoot(container).render(
          cloneElement(identity, {
            address: mention.getAttribute(addressAttr),
            network: mention.getAttribute(networkAttr),
          }),
        );
      });
    },
  };
}
