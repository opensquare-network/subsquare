import ExternalLink from "next-common/components/externalLink";

export default function Link({ children, href }) {
  return (
    <ExternalLink href={href} className="text12Medium">
      {children}
    </ExternalLink>
  );
}
