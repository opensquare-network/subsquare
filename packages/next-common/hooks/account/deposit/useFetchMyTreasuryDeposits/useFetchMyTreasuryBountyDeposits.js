import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import {
  setBountyBonds,
  setBountyCuratorDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export async function queryAddressDeposits(api, address) {
  const entries = await api.query.bounties.bounties.entries();
  return entries.reduce(
    (result, [storageKey, optionalStorage]) => {
      const { bonds, curatorDeposits } = result;
      if (!optionalStorage.isSome) {
        return result;
      }

      const proposalIndex = storageKey.args[0].toNumber();
      const storage = optionalStorage.unwrap();
      const proposer = storage.proposer.toString();
      const bond = storage.bond.toString();
      const status = storage.status;
      const value = storage.value.toString();
      const curatorDeposit = storage.curatorDeposit.toString();
      if (
        status.isProposed &&
        new BigNumber(bond).gt(0) &&
        proposer === address
      ) {
        bonds.push({
          proposalIndex,
          bond,
          value,
        });
      }

      if (!status.isActive && !status.isPendingPayout) {
        return result;
      }

      if (status.isActive) {
        const curator = status.asActive.curator.toString();
        if (curator === address && new BigNumber(curatorDeposit).gt(0)) {
          curatorDeposits.push({
            proposalIndex,
            curatorDeposit,
            value,
          });
        }
      } else if (status.isPendingPayout) {
        const curator = status.asPendingPayout.curator.toString();
        if (curator === address && new BigNumber(curatorDeposit).gt(0)) {
          curatorDeposits.push({
            proposalIndex,
            curatorDeposit,
            value,
          });
        }
      }

      return { bonds, curatorDeposits };
    },
    { bonds: [], curatorDeposits: [] },
  );
}

export default function useFetchMyTreasuryBountyDeposits() {
  const realAddress = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryBounties = !!treasury?.bounties;

  useEffect(() => {
    if (!hasTreasuryBounties) {
      dispatch(setBountyBonds([]));
      dispatch(setBountyCuratorDeposits([]));
      return;
    }

    if (!api || !realAddress || !api.query?.bounties) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      const { bonds, curatorDeposits } = data;
      dispatch(setBountyBonds(bonds));
      dispatch(setBountyCuratorDeposits(curatorDeposits));
    });
  }, [api, realAddress, dispatch, hasTreasuryBounties]);
}
