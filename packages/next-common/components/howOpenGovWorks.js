import ExternalLink from "./externalLink";

export function HowReferendaWorks() {
  return (
    <span className="text14Medium text-textSecondary">
      Check how referenda works{" "}
      <ExternalLink
        className="font-bold text-theme500"
        externalIcon={false}
        href="https://wiki.polkadot.network/learn/learn-polkadot-opengov#referenda"
      >
        here
      </ExternalLink>
      .
    </span>
  );
}

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
