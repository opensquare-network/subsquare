import { usePageProps } from "next-common/context/page";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useSubCoreFellowshipEvidence from "./useSubCoreFellowshipEvidence";
import { useFellowshipCoreRelatedReferenda } from "next-common/components/collectives/core/member/relatedReferenda";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import { isHash, isSameAddress } from "next-common/utils";
import { useAsync } from "react-use";

export default function useFellowshipMemberEvidence(address) {
  const {
    fellowshipMembers,
    ambassadorMembers,
    fellowshipMemberActiveEvidence: serverEvidence,
  } = usePageProps();
  const { section } = useCollectivesContext();

  const hasServerData = !!(
    serverEvidence?.wish &&
    (serverEvidence?.hex || serverEvidence?.cid)
  );
  const serverContent = serverEvidence?.content || "";
  const hasServerContent = !!serverContent;

  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(
    address,
    "fellowshipCore",
  );
  const shouldUseServerData = hasServerData && loading;

  const { relatedReferenda: chainReferenda, isLoading: isChainLoading } =
    useFellowshipCoreRelatedReferenda(address);

  const onChainCid =
    evidence && isHash(evidence) ? getCidByEvidence(evidence) : null;
  const evidenceId = shouldUseServerData ? null : onChainCid;
  const { loading: isDocLoading, value: evidenceDoc } = useAsync(async () => {
    if (!evidenceId) {
      return null;
    }
    const res = await fetch(
      `/api/${section}/members/${address}/evidences/${evidenceId}`,
    );
    return res.ok ? res.json() : null;
  }, [section, address, evidenceId]);

  // Ambassador section members live in ambassadorMembers, not fellowshipMembers
  const members =
    section === "ambassador" ? ambassadorMembers : fellowshipMembers;
  const activeMember = (members || []).find((m) =>
    isSameAddress(m.address, address),
  );

  if (shouldUseServerData) {
    const relatedReferenda = (serverEvidence?.referenda ?? []).map(
      ({ index }) => ({ referendumIndex: index }),
    );

    return {
      loading: false,
      wish: serverEvidence.wish,
      evidence: serverEvidence.hex || serverEvidence.cid,
      cid: serverEvidence.cid,
      rank: activeMember?.rank ?? serverEvidence.rank,
      relatedReferenda,
      isReferendaLoading: false,
      content: serverContent,
      hasServerContent,
    };
  }

  const dbReferenda = (evidenceDoc?.referenda ?? []).map(({ index }) => ({
    referendumIndex: index,
  }));
  const relatedReferenda =
    dbReferenda.length > 0 ? dbReferenda : chainReferenda;
  const isReferendaLoading =
    isDocLoading || (dbReferenda.length === 0 && isChainLoading);

  // NOTE: the client path still falls back to the SSR server content. If the
  // on-chain evidence was updated but the IPFS document fetch fails, the stale
  // server content may be shown. Acceptable for now.
  return {
    loading,
    wish,
    evidence,
    cid: onChainCid,
    rank: activeMember?.rank,
    relatedReferenda,
    isReferendaLoading,
    content: serverContent,
    hasServerContent,
  };
}
