import BaseLayout from "./baseLayout";
import usePageTitle from "next-common/hooks/usePageTitle";
import ListLayoutFrame from "./listLayoutFrame";
import ListLayoutHeader from "./listLayoutHeader";
import Tabs from "./tabs";

/**
 * @typedef {{
 *  label: string
 *  url?: string
 *  active?: boolean
 *  onClick?(): void
 *  extraMatchTabActivePathnames?: string[]
 * }} Tab
 */

/**
 * @typedef {{
 * seoInfo?: Record<string, string>
 * children: JSX.Element
 * title: string
 * children: React.ReactNode
 * description: string
 * headContent?: JSX.Element
 * summary?: JSX.Element
 * summaryFooter?: JSX.Element
 * tabs?: Tab[]
 * }} ListLayoutProps
 */

/**
 * @param {ListLayoutProps} props
 */
export default function ListLayout({
  seoInfo: seoInfoProp = {},
  children,
  title,
  titleExtra,
  description,
  headContent,
  summary,
  summaryFooter,
  tabs = [],
  header,
}) {
  const seoTitle = usePageTitle(
    seoInfoProp.title ?? title ?? "governance platform",
  );

  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: description || seoInfoProp.desc,
  };

  const listHeader = (
    <ListLayoutHeader
      title={title}
      titleExtra={titleExtra}
      description={description}
      headContent={headContent}
      summary={summary}
      summaryFooter={summaryFooter}
    />
  );

  let listTabs = null;
  if (tabs?.length > 0) {
    listTabs = <Tabs tabs={tabs} />;
  }

  return (
    <BaseLayout seoInfo={seoInfo}>
      <ListLayoutFrame header={header || listHeader} tabs={listTabs}>
        {children}
      </ListLayoutFrame>
    </BaseLayout>
  );
}
