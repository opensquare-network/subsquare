import ExternalLink from "./externalLink";

export default function HowOpenGovWorks({ anchor }) {
  let link = "https://wiki.polkadot.network/docs/maintain-guides-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }

  return (
    <ExternalLink className="text14Medium text-sapphire500" href={link}>
      How OpenGov works
    </ExternalLink>
  );
}
