import YoutubeSvg from "../../assets/imgs/icons/youtube-logo.svg";
import MediumSvg from "../../assets/imgs/icons/medium-logo.svg";
import PolkassemblySvg from "../../assets/imgs/icons/polkassembly-logo.svg";
import TwitterSvg from "../../assets/imgs/icons/twitter-logo.svg";
import TelegramSvg from "../../assets/imgs/icons/telegram-logo.svg";
import GoogleDocSvg from "../../assets/imgs/icons/googledoc-logo.svg";
import GoogleDriveSvg from "../../assets/imgs/icons/googledrive-logo.svg";
import OpenSquareSvg from "../../assets/imgs/icons/opensquare-logo.svg";
import DotreasurySvg from "../../assets/imgs/icons/dotreasury-logo.svg";
import {
  LinkGithub,
  ProjectIconSubsquareDark,
  ProjectIconSubsquareLight,
  SystemLink,
} from "@osn/icons/subsquare";

export const extractLinks = (text) =>
  [...text.matchAll(/(https?:\/\/[^ ]+)/g)].map((item) => item[0]);

export const defaultLinkSvg = (
  <SystemLink className="w-5 h-5 [&_path]:fill-textPrimary" />
);

export function getLinkIcon(link) {
  const url = new URL(link);
  if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
    return <YoutubeSvg />;
  } else if (
    url.host.endsWith("github.com") ||
    url.host.endsWith("github.io")
  ) {
    return <LinkGithub className="w-5 h-5 [&_path]:fill-textPrimary" />;
  } else if (url.host.endsWith("medium.com")) {
    return <MediumSvg />;
  } else if (url.host.endsWith("polkassembly.io")) {
    return <PolkassemblySvg />;
  } else if (url.host.endsWith("twitter.com")) {
    return <TwitterSvg />;
  } else if (url.host === "t.me") {
    return <TelegramSvg />;
  } else if (url.host.endsWith("docs.google.com")) {
    return <GoogleDocSvg />;
  } else if (url.host.endsWith("drive.google.com")) {
    return <GoogleDriveSvg />;
  } else if (url.host.endsWith("opensquare.network")) {
    return <OpenSquareSvg />;
  } else if (url.host.endsWith("dotreasury.com")) {
    return <DotreasurySvg />;
  } else if (url.host.endsWith("subsquare.io")) {
    return (
      <>
        <ProjectIconSubsquareLight className="w-5 h-5 dark:hidden" />
        <ProjectIconSubsquareDark className="w-5 h-5 hidden dark:block" />
      </>
    );
  }

  return defaultLinkSvg;
}
