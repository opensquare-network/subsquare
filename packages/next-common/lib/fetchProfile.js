import { CACHE_KEY } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";

export default async function fetchProfile(cookies) {
  let options = {};
  const authToken = cookies.get(CACHE_KEY.authToken);
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  return ssrNextApi.fetch("user/profile", {}, options);
}
