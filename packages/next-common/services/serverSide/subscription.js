import { CACHE_KEY } from "next-common/utils/constants";
import nextApi from "../nextApi";
import Cookies from "cookies";

export async function fetchUserSubscription(context) {
  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get(CACHE_KEY.authToken);
  let options = { credentials: true };
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  const { result: subscription } = await nextApi.fetch(
    "user/subscription",
    {},
    options,
  );

  return subscription || {};
}
