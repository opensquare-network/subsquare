import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import { createWsEndpoints } from "@polkadot/apps-config";
import { bnToBn } from "@polkadot/util";
import useCall from "next-common/utils/hooks/useCall";

const endpoints = createWsEndpoints((k, v) => v?.toString() || k);
const getEndpoints = (numId) =>
  endpoints.filter(({ paraId }) => paraId === numId);

export function useParachainInfo({ search = "" }) {
  const api = useContextApi();
  const { loading, value: paraIds } = useCall(api?.query?.paras?.parachains);
  const tableData = useMemo(() => {
    const chainDetails = [];
    const unknowChains = [];
    paraIds?.forEach((paraId) => {
      const idHuman = paraId.toHuman();
      const numId = bnToBn(paraId).toNumber();
      const chainEndPoints = getEndpoints(numId);
      if (chainEndPoints.length > 0) {
        const [info] = chainEndPoints;
        chainDetails.push({
          id: numId,
          idHuman,
          paraId,
          info,
          endpoints: chainEndPoints,
        });
      } else {
        unknowChains.push({
          id: numId,
          idHuman,
          paraId,
          info: {},
          endpoints: chainEndPoints,
        });
      }
    });
    return [...chainDetails, ...unknowChains];
  }, [paraIds]);

  const filterData = useMemo(() => {
    return tableData?.filter(({ id, idHuman, info }) => {
      if (search === "") {
        return true;
      }
      if (search) {
        const name = info?.text?.toLowerCase() || "";
        if (
          id.toString().includes(search) ||
          name.includes(search.toLowerCase()) ||
          idHuman.includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
  }, [tableData, search]);

  return { loading, value: filterData, totalCount: filterData.length };
}
