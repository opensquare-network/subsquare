import MembersList from "components/membersList/councilMembersList";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { useChainSettings } from "next-common/context/chain";

export default function Members({ category }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { hasElections } = useChainSettings();
  const [electionsInfo, loadingElectionsInfo] = useCall(
    api?.derive?.elections?.info,
    [],
  );
  const [allVotes, loadingAllVotes] = useCall(api?.derive?.council?.votes, []);
  const prime = usePrime();

  useEffect(() => {
    setLoading(loadingElectionsInfo || loadingAllVotes);

    if (!loadingElectionsInfo && !loadingAllVotes) {
      const votesMap = {};
      (allVotes || []).forEach((item) => {
        const votes = item[1].votes.toJSON();
        for (const addr of votes) {
          votesMap[addr] = (votesMap[addr] || 0) + 1;
        }
      });

      const data = (electionsInfo?.members || []).map((item) => {
        const address = item[0]?.toJSON();
        return {
          address,
          backing: item[1]?.toJSON(),
          votes: votesMap[address],
        };
      });
      setData(data);
    }
  }, [electionsInfo, loadingElectionsInfo, allVotes, loadingAllVotes]);

  return (
    <MembersList
      category={category}
      items={data}
      prime={prime}
      loading={loading}
      hasElections={hasElections}
    />
  );
}
