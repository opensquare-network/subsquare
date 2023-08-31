import { useChainSettings } from "next-common/context/chain";
import {
  LinkWebsite,
  LinkTwitter,
  LinkDiscord,
  LinkTelegram,
  LinkGithub,
  LinkElement,
  LinkMedium,
  LinkYoutube,
  LinkReddit,
} from "@osn/icons/subsquare";
import ExternalLink from "../externalLink";
import clsx from "clsx";

const iconMap = {
  website: LinkWebsite,
  twitter: LinkTwitter,
  discord: LinkDiscord,
  telegram: LinkTelegram,
  github: LinkGithub,
  element: LinkElement,
  medium: LinkMedium,
  youtube: LinkYoutube,
  reddit: LinkReddit,
};

export default function ChainSocialLinks({ className }) {
  const chainSettings = useChainSettings();

  return (
    <ul className={clsx("flex gap-x-3", className)}>
      {chainSettings.links?.map?.((link) => {
        const Icon = iconMap[link.name] || LinkWebsite;

        return (
          <li key={link.name}>
            <ExternalLink
              href={link.url}
              title={link.title || link.name}
              className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
              externalIcon={false}
            >
              <Icon className="w-5 h-5" />
            </ExternalLink>
          </li>
        );
      })}
    </ul>
  );
}
