import Api from "./api";

const ogTrackerApi = new Api(
  new URL("/rest/v1/", process.env.NEXT_PUBLIC_OGTRACKER_API_END_POINT).href,
);

export default ogTrackerApi;
