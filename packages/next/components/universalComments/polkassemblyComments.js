import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import PolkassemblyComments from "components/polkassembly/comment";

export default function PolkassemblyCommentsWithData({ detail, btnRef, tabs }) {
  const polkassemblyId = detail?.polkassemblyId;
  const polkassemblyPostType = detail?.polkassemblyPostType;

  const { comments, loadingComments } = usePolkassemblyPostData({
    polkassemblyId, polkassemblyPostType,
  });

  return (
    <PolkassemblyComments
      detail={detail}
      isLoading={loadingComments}
      comments={comments}
      paId={polkassemblyId}
      tabs={tabs}
      btnRef={btnRef}
    />
  );
}
