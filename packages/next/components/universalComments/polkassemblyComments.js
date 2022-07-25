/* eslint-disable react/jsx-key */
import SourceTabs from "next-common/components/comment/sourceTabs";
import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import PolkassemblyComments from "components/polkassembly/comment";

export default function PolkassemblyCommentsWithData({
  tabIndex,
  setTabIndex,
  detail,
  chain,
  type,
  btnRef,
}) {
  const polkassemblyId = detail?.polkassemblyId;

  const { comments, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
    chain,
  });

  const tabs = (
    <div style={{ width: "240px", marginTop: "-6px" }}>
      <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </div>
  );

  return (
    <PolkassemblyComments
      detail={detail}
      isLoading={loadingComments}
      comments={comments}
      chain={chain}
      type={type}
      paId={polkassemblyId}
      tabs={tabs}
      btnRef={btnRef}
    />
  );
}
