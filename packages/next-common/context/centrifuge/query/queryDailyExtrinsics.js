import apolloClient from ".";
import { DAILY_EXTRINSICS_QUERY } from "./schema/dailyExtrinsics";

export default async function queryDailyExtrinsics() {
  try {
    const { data } = await apolloClient.query({
      query: DAILY_EXTRINSICS_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.dailyExtrinsics;
  } catch {
    return null;
  }
}
