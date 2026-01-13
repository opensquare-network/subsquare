import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useDataTabsContext } from "../context/tabs";
import { ArrowExternalLinkWiki } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";

function PolkadotWikiLink({ href }) {
  return (
    <Tooltip content="Polkadot Wiki" className="ml-2 hover:cursor-pointer">
      <Link href={href} target="_blank">
        <ArrowExternalLinkWiki
          width={16}
          height={16}
          className="[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary"
        />
      </Link>
    </Tooltip>
  );
}

export function PageHeaderTitle({ title, href = "" }) {
  return (
    <div className="w-full py-6 flex items-center justify-center">
      <TitleContainer className="!text20Bold">
        {title}
        <PolkadotWikiLink href={href} />
      </TitleContainer>
    </div>
  );
}

export default function PageHeader({ href = "" }) {
  const { title = "" } = useDataTabsContext();

  return (
    <div className="w-full py-6 flex items-center justify-center">
      <TitleContainer className="!text20Bold">
        {title}
        <PolkadotWikiLink href={href} />
      </TitleContainer>
    </div>
  );
}
