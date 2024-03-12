import nextApi from "next-common/services/nextApi";

export default async function fetchUserStatus(context) {
  let options = {
    headers: {
      Cookie: context.req.headers.cookie,
    },
  };

  return nextApi.fetch("user/status", {}, options);
}
