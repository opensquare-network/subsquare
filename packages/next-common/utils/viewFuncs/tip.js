import { stringUpperFirst } from "@subsquare/kintsugi-next/utils";

export const extractLinks = (text) =>
  [...text.matchAll(/(https?:\/\/[^ ]+)/g)].map((item) => item[0]);

export const getLinkNameAndLogo = (link) => {
  try {
    const url = new URL(link);

    let src;
    let name = "";
    if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
      src = "/imgs/icons/youtube-logo.svg";
      name = "YouTube";
    } else if (
      url.host.endsWith("github.com") ||
      url.host.endsWith("github.io")
    ) {
      src = "/imgs/icons/github-logo.svg";
      name = "GitHub";
    } else if (url.host.endsWith("medium.com")) {
      src = "/imgs/icons/medium-logo.svg";
      name = "Medium";
    } else if (url.host.endsWith("polkassembly.io")) {
      src = "/imgs/icons/polkassembly-logo.svg";
      name = "Polkassembly";
    } else if (url.host.endsWith("twitter.com")) {
      src = "/imgs/icons/twitter-logo.svg";
      name = "Twitter";
    } else if (url.host === "t.me") {
      src = "/imgs/icons/telegram-logo.svg";
      name = "Telegram";
    } else if (url.host.endsWith("docs.google.com")) {
      src = "/imgs/icons/googledoc-logo.svg";
      name = "Google Docs";
    } else if (url.host.endsWith("drive.google.com")) {
      src = "/imgs/icons/googledrive-logo.svg";
      name = "Google Drive";
    } else if (url.host.endsWith("opensquare.network")) {
      src = "/imgs/icons/opensquare-icon-logo.svg";
      name = "OpenSquare";
    } else if (url.host.endsWith("dotreasury.com")) {
      src = "/imgs/icons/dotreasury-logo.svg";
      name = "doTreasury";
    } else if (url.host.endsWith("subsquare.io")) {
      src = "/imgs/icons/subsquare-logo.svg";
      name = "SubSquare";
    } else {
      src = "/imgs/icons/link-icon.svg";
    }

    if (!name) {
      [, name] = url.host.match(/([^.]*)(?:\.[a-z]+)?$/);
      if (["co", "com"].includes(name)) {
        const m = url.host.match(/([^.]*)(?:\.[a-z]+){2}$/);
        if (m) {
          [, name] = m;
        }
      }
      name = stringUpperFirst(name);
    }

    return [name, src];
  } catch (e) {
    // Broken link or other errors
    return [];
  }
};
