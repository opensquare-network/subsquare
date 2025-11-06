import useSubStorage from "next-common/hooks/common/useSubStorage";

export const useMinJoin = () => {
  const { result: minJoinBond, loading } = useSubStorage(
    "nominationPools",
    "minJoinBond",
    [],
  );

  return {
    minJoinBond: minJoinBond?.toNumber(),
    loading,
  };
};
