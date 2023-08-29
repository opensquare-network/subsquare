import ExternalLink from "./externalLink";

export default function HowOpenGovWorks() {
  return (
    <ExternalLink
      className="text-[14px] text-sapphire500"
      href="https://wiki.polkadot.network/docs/maintain-guides-opengov"
    >
      How OpenGov works&nbsp;
      <span style={{ color: "var(--textSecondary)" }}>↗</span>
    </ExternalLink>
  );
}
