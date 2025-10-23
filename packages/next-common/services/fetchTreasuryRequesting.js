import { backendApi } from "./nextApi";

export const fetchTreasuryRequesting = async () => {
  const response = await backendApi.fetch(
    "/gov2/referenda/treasury-requesting",
  );
  return response.result;
};
