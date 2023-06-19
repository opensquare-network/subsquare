import { useChainSettings } from "next-common/context/chain";
import {
  LinkWebsite,
  LinkTwitter,
  LinkDiscord,
  LinkTelegram,
  LinkGithub,
  LinkElement,
} from "@osn/icons/subsquare";
import ExternalLink from "../externalLink";

const iconMap = {
  website: LinkWebsite,
  twitter: LinkTwitter,
  discord: LinkDiscord,
  telegram: LinkTelegram,
  github: LinkGithub,
  element: LinkElement,
};

export default function ChainInfo() {
  const chainSettings = useChainSettings();

  return (
    <div>
      <h3 className="text20Bold text-textPrimary">{chainSettings.name}</h3>
      <p className="text14Medium text-textTertiary">
        {"{chainSettings.description}"}
      </p>

      <ul className="flex gap-x-3 mt-2">
        {chainSettings.links?.map?.((link) => {
          const Icon = iconMap[link.name] || LinkWebsite;

          return (
            <li key={link.name}>
              <ExternalLink
                href={link.url}
                title={link.title || link.name}
                className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
              >
                <Icon className="w-5 h-5" />
              </ExternalLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
