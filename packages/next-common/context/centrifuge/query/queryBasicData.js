import apolloClient from ".";
import { BASIC_DATA_QUERY } from "./schema/basicData";

export default async function queryBasicData() {
  try {
    const { data } = await apolloClient.query({
      query: BASIC_DATA_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.basicData;
  } catch {
    return null;
  }
}
