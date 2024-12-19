import { withCommonProps } from "next-common/lib";
import BaseLayout from "next-common/components/layout/baseLayout";
import ProxyExplorer from "next-common/components/data/proxies";

export default function ProxiesPage() {
  const title = "Proxy Explorer";
  const seoInfo = { title, desc: title };

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="flex-1">
        <div className={"px-6 py-6 mx-auto max-w-[1200px] max-sm:px-0"}>
          <ProxyExplorer />
        </div>
      </div>
    </BaseLayout>
  );
}

export const getServerSideProps = withCommonProps();
