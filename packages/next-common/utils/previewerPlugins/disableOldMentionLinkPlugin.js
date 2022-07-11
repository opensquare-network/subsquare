import { isAddress } from "@polkadot/util-crypto";

/**
 * @type {import('@osn/previewer').Plugin}
 */
export const disableOldMentionLinkPlugin = {
  name: "disable-old-mention-link",

  collectCss(css) {
    return css`
      .disabled-link {
        color: #506176;
        pointer-events: none;
      }
    `;
  },

  onRenderedHtml(el) {
    // markdown previewer
    el.querySelectorAll("a").forEach((block) => {
      const [, memberId] =
        block.getAttribute("href")?.match(/^\/member\/([-\w]+)$/) || [];
      if (memberId && !isAddress(memberId)) {
        block.classList.add("disabled-link");
      }
    });

    // html previewer
    el.querySelectorAll("span.mention").forEach((block) => {
      const p = block.parentElement;
      const address = block.getAttribute("osn-polka-address");
      if (isAddress(address)) {
        const a = document.createElement("a");
        a.href = `/member/${address}`;
        a.target = "_blank";
        a.innerHTML = block.innerText;
        p.replaceChild(a, block);
      }
    });
  },
};
