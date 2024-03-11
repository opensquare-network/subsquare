import { IS_SERVER } from "next-common/utils/constants";
import Api from "./api";

const clientNextApi = new Api(
  new URL("/api/", process.env.NEXT_PUBLIC_API_END_POINT).href,
);

export const ssrNextApi = new Api(
  new URL(process.env.NEXT_PUBLIC_BACKEND_API_END_POINT).href,
);

export const nextApi = IS_SERVER ? ssrNextApi : clientNextApi;

export default nextApi;
