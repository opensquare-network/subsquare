import PolkassemblyComments from "next-common/components/polkassembly/comment";
import { usePolkassemblyPostData } from "next-common/hooks/polkassembly/usePolkassemblyPostData";

export default function PolkassemblyCommentsWithData({ detail, btnRef, tabs }) {
  const polkassemblyId = detail?.polkassemblyId;
  const polkassemblyPostType = detail?.polkassemblyPostType;

  const { comments, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
    polkassemblyPostType,
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
