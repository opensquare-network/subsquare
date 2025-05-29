import nextApi from "next-common/services/nextApi";

export default async function fetchProfile(req) {
  let options = {};
  if (req) {
    options = {
      headers: {
        Cookie: req?.headers?.cookie,
      },
    };
  }

  return nextApi.fetch("user/profile", {}, options);
}
