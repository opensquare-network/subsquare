import useInitMimir from "next-common/hooks/useInitMimir";
import useInitApiProviders from "next-common/services/chain/apis/useInitApiProviders";
import useUpdateNodesDelay from "next-common/utils/hooks/useUpdateNodesDelay";
import { useContextApi } from "next-common/context/api";
import { useSubscribeChainHead } from "next-common/utils/hooks";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import useStoreDemocracyLockPeriod from "next-common/hooks/democracy/useStoreDemocracyLockPeriod";
import useStoreConvictionVotingLockPeriod from "next-common/hooks/referenda/useStoreConvictionVotingLockPeriod";
import { usePageProperties } from "next-common/context/page";
import { useSubRelayHeight } from "next-common/hooks/relayScanHeight";

export function RelayStatusSubscriber() {
  const { relayScanHeight } = usePageProperties();
  useSubRelayHeight(relayScanHeight);
  return null;
}

export default function BaseInit() {
  useInitMimir();
  useInitApiProviders();
  useUpdateNodesDelay();

  const api = useContextApi();
  useSubscribeChainHead(api);
  useExistentialDeposit();

  useStoreDemocracyLockPeriod();
  useStoreConvictionVotingLockPeriod();

  return <RelayStatusSubscriber />;
}
