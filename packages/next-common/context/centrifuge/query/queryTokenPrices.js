import apolloClient from ".";
import { PRICES_GQL } from "./schema/prices";

export default async function queryTokenPrices(range) {
  try {
    const { data } = await apolloClient.query({
      query: PRICES_GQL,
      variables: {
        timeRange: range,
      },
      fetchPolicy: "no-cache",
    });

    return data?.prices;
  } catch {
    return null;
  }
}
