import { createContext } from "react";
import { useContextApi } from "../api";
import { useAsync } from "react-use";

export const EraStakersContext = createContext();

export function EraStakersProvider({ children, eraIndex, validators }) {
  const api = useContextApi();
  const { value: eraStakers, loading } = useAsync(async () => {
    if (!api) {
      return null;
    }
    const result = await Promise.all(
      validators.map((validator) =>
        api.query.staking.erasStakersPaged.entries(eraIndex, validator),
      ),
    );

    return result.map((pages) => {
      const firstPage = pages[0];
      const key = firstPage[0].args;
      const era = key[0].toJSON();
      const validatorId = key[1].toJSON();
      let totalOtherStaked = 0n;
      let otherStakers = [];
      for (const [, value] of pages) {
        const data = value.toJSON();
        totalOtherStaked += BigInt(data.pageTotal);
        otherStakers = otherStakers.concat(data.others);
      }
      return {
        era,
        validatorId,
        totalOtherStaked,
        otherStakers,
      };
    });
  }, [api, eraIndex, validators]);

  return (
    <EraStakersContext.Provider value={{ eraStakers, loading }}>
      {children}
    </EraStakersContext.Provider>
  );
}
