import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { usePostOnChainData } from "next-common/context/post";

export default function CollectiveCall({ call }) {
  const motion = usePostOnChainData();

  const data = [["Hash", motion.hash], [<Proposal key={"call"} call={call} />]];

  return <KvList data={data} />;
}
