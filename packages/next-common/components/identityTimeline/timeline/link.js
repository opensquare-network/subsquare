import ExternalLink from "next-common/components/externalLink";

export default function Link({ name, href }) {
  return (
    <ExternalLink href={href} className="text12Medium text-theme500">
      {name}
    </ExternalLink>
  );
}
