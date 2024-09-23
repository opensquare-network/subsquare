import { gql } from "@apollo/client";
import { useChain } from "next-common/context/chain";
import { useDoTreasuryEcoLazyQuery } from "next-common/hooks/apollo";
import collectives from "next-common/utils/consts/settings/collectives";
import polkadot from "next-common/utils/consts/settings/polkadot";
import bifrostPolkadot from "next-common/utils/consts/settings/bifrostPolkadot";
import bifrost from "next-common/utils/consts/settings/bifrost";
import { find } from "lodash-es";
import { useEffect } from "react";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      chain
      price
    }
  }
`;

const CHAIN_VALUE_TREASURY_MAP = {
  [bifrostPolkadot.value]: bifrost.value,
  [collectives.value]: polkadot.value,
};

export default function useFiatPrice() {
  const chain = useChain();

  const [getTreasuries, { data, loading }] =
    useDoTreasuryEcoLazyQuery(GET_TREASURIES);

  useEffect(() => {
    getTreasuries();

    const intervalId = setInterval(() => {
      getTreasuries();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getTreasuries]);

  const treasury = find(data?.treasuries, {
    chain: CHAIN_VALUE_TREASURY_MAP[chain] || chain,
  });

  return {
    price: treasury?.price,
    loading,
  };
}
