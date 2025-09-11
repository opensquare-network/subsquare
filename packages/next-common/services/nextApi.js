import { IS_SERVER } from "next-common/utils/constants";
import Api from "./api";

const clientNextApi = new Api(
  new URL("/api/", process.env.NEXT_PUBLIC_API_END_POINT).href,
);

export const backendApi = new Api(
  new URL(process.env.NEXT_PUBLIC_BACKEND_API_END_POINT).href,
);

export const nextApi = IS_SERVER ? backendApi : clientNextApi;

export default nextApi;
