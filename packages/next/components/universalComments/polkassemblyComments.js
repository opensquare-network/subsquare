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
  btnRef,
}) {
  const polkassemblyId = detail?.polkassemblyId;

  // Don't support fetching last page
  page = page === "last" ? 1 : parseInt(page);

  const { comments, loadingComments, commentsCount } = usePolkassemblyPostData({
    polkassemblyId,
    chain,
    page: page - 1,
    pageSize,
  });

  return (
    <PolkassemblyComments
      detail={detail}
      isLoading={loadingComments}
      data={{
        items: comments,
        page,
        pageSize,
        total: commentsCount,
      }}
      chain={chain}
      type={type}
      paId={polkassemblyId}
      tabs={
        <div style={{ width: "240px", marginTop: "-6px" }}>
          <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      }
      btnRef={btnRef}
    />
  );
}
