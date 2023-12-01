import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { setTreasuryProposalDeposits } from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";

async function queryAddressDeposits(api, address) {
  const entries = await api.query.treasury.proposals.entries();
  return entries.reduce((result, [storageKey, optionalStorage]) => {
    if (!optionalStorage.isSome) {
      return result;
    }

    const proposalIndex = storageKey.args[0].toNumber();
    const storage = optionalStorage.unwrap();
    const bond = storage.bond.toString();
    const proposer = storage.proposer.toString();
    if (new BigNumber(bond).lte(0) || proposer !== address) {
      return result;
    }

    return [
      ...result,
      {
        proposalIndex,
        bond,
        value: storage.value.toString(),
      },
    ];
  }, []);
}

export default function useFetchMyTreasuryProposalDeposits() {
  const realAddress = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !realAddress || !api.query?.treasury) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      dispatch(setTreasuryProposalDeposits(data));
      // todo: populate treasury proposal context info
    });
  }, [api, realAddress, dispatch]);
}
