import Api from "./api";

export default new Api(
  new URL(`/api/`, process.env.NEXT_PUBLIC_API_END_POINT).href
);

export const ssrNextApi = new Api(
  new URL(`/api/`, process.env.NEXT_PUBLIC_SSR_API_END_POINT).href
);
