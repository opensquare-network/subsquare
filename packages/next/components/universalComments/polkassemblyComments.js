/* eslint-disable react/jsx-key */
import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import PolkassemblyComments from "components/polkassembly/comment";

export default function PolkassemblyCommentsWithData({
  detail,
  chain,
  type,
  btnRef,
  tabs,
}) {
  const polkassemblyId = detail?.polkassemblyId;

  const { comments, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
    chain,
  });

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
