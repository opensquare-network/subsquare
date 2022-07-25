/* eslint-disable react/jsx-key */
import SourceTabs from "next-common/components/comment/sourceTabs";
import usePolkassemblyPostData from "components/polkassembly/usePostComments";
import PolkassemblyComments from "components/polkassembly/comment";

export default function PolkassemblyCommentsWithData({
  tabIndex,
  setTabIndex,
  detail,
  chain,
  type,
  page,
  pageSize,
}) {
  const polkassemblyId = detail?.polkassemblyId;

  const { comments: paComments, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
    chain,
    page,
    pageSize,
  });

  return (
    <PolkassemblyComments
      isLoading={loadingComments}
      data={{
        items: paComments,
        page: page + 1,
        pageSize,
        total: detail?.commentsCount,
      }}
      chain={chain}
      type={type}
      paId={polkassemblyId}
      tabs={
        <div style={{ width: "240px", marginTop: "-6px" }}>
          <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      }
    />
  );
}
