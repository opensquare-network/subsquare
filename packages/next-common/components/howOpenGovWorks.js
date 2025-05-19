import ExternalLink from "./externalLink";

export default function HowOpenGovWorks({ anchor }) {
  let link = "https://wiki.polkadot.network/learn/learn-polkadot-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }

  return (
    <ExternalLink className="text14Medium" href={link}>
      How OpenGov works
    </ExternalLink>
  );
}
