import YoutubeSvg from "../../assets/imgs/icons/youtube-logo.svg";
import GithubSvg from "../../assets/imgs/icons/github-logo.svg";
import LinkSvg from "../../assets/imgs/icons/link-icon.svg";
import MediumSvg from "../../assets/imgs/icons/medium-logo.svg";
import PolkassemblySvg from "../../assets/imgs/icons/polkassembly-logo.svg";
import TwitterSvg from "../../assets/imgs/icons/twitter-logo.svg";
import TelegramSvg from "../../assets/imgs/icons/telegram-logo.svg";
import googleDocSvg from "../../assets/imgs/icons/googledoc-logo.svg";
import googleDriveSvg from "../../assets/imgs/icons/googledrive-logo.svg";
import OpenSquareSvg from "../../assets/imgs/icons/opensquare-logo.svg";
import dotreasurySvg from "../../assets/imgs/icons/dotreasury-logo.svg";
import subSquareSvg from "../../assets/imgs/icons/subsquare-logo.svg";

export const extractLinks = (text) =>
  [...text.matchAll(/(https?:\/\/[^ ]+)/g)].map((item) => item[0]);

export const defaultLinkSvg = LinkSvg;

export function getLinkIcon(link) {
  const url = new URL(link);
  if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
    return YoutubeSvg;
  } else if (
    url.host.endsWith("github.com") ||
    url.host.endsWith("github.io")
  ) {
    return GithubSvg;
  } else if (url.host.endsWith("medium.com")) {
    return MediumSvg;
  } else if (url.host.endsWith("polkassembly.io")) {
    return PolkassemblySvg;
  } else if (url.host.endsWith("twitter.com")) {
    return TwitterSvg;
  } else if (url.host === "t.me") {
    return TelegramSvg;
  } else if (url.host.endsWith("docs.google.com")) {
    return googleDocSvg;
  } else if (url.host.endsWith("drive.google.com")) {
    return googleDriveSvg;
  } else if (url.host.endsWith("opensquare.network")) {
    return OpenSquareSvg;
  } else if (url.host.endsWith("dotreasury.com")) {
    return dotreasurySvg;
  } else if (url.host.endsWith("subsquare.io")) {
    return subSquareSvg;
  }

  return LinkSvg;
}
