import Cookies from "cookies";
import {
  isBrowserCompatible,
  redirect,
  toBrowserIncompatible,
} from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";
import getListPageProperties from "./pages/list";
import getDetailPageProperties, { getIdProperty } from "./pages/detail";
import fetchProfile from "next-common/lib/fetchProfile";
import fetchUserStatus from "next-common/lib/fetchUserStatus";
import { adminsApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { getConnectedAccount } from "next-common/services/serverSide/getConnectedAccount";
import {
  fetchRelayScanHeight,
  fetchScanHeight,
} from "next-common/services/fetchScanHeight";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

async function defaultGetServerSideProps() {
  return { props: {} };
}

export function withCommonProps(
  getServerSideProps = defaultGetServerSideProps,
) {
  return async function (context) {
    if (!isBrowserCompatible(context)) {
      return toBrowserIncompatible();
    }

    const cookies = new Cookies(context.req, context.res);
    const themeMode = cookies.get(CACHE_KEY.themeMode);
    const navCollapsed = cookies.get(CACHE_KEY.navCollapsed);
    const navSubmenuVisible = cookies.get(CACHE_KEY.navSubmenuVisible);
    const listPageProperties = getListPageProperties(context);
    const detailPageProperties = getDetailPageProperties(context);
    const connectedAccount = getConnectedAccount(cookies);
    const pathname = context.resolvedUrl?.split("?")?.[0];

    const [
      props,
      { result: user },
      { result: userStatus },
      { result: admins },
      scanHeight,
    ] = await Promise.all([
      getServerSideProps(context),
      fetchProfile(context?.req),
      fetchUserStatus(context),
      backendApi.fetch(adminsApi),
      fetchScanHeight(),
    ]);

    let relayScanHeight = null;
    if (isAssetHubMigrated()) {
      relayScanHeight = await fetchRelayScanHeight();
    }

    if (context.resolvedUrl?.startsWith("/settings/") && !user) {
      const { unsubscribe } = context.query;
      if (!unsubscribe) {
        return redirect("/");
      }
    }

    const userAgent = context?.req?.headers?.["user-agent"] ?? "";
    return {
      ...props,
      props: {
        ...(props?.props || {}),
        pathname,
        chain: process.env.CHAIN,
        user: user ?? null,
        userStatus: userStatus ?? null,
        connectedAccount: connectedAccount ?? null,
        admins: admins ?? [],
        themeMode: themeMode ?? null,
        navCollapsed: navCollapsed || "true",
        navSubmenuVisible: navSubmenuVisible || "{}",
        ...listPageProperties,
        ...detailPageProperties,
        pageProperties: {
          ...listPageProperties,
          ...detailPageProperties,
          userAgent,
          scanHeight: scanHeight ?? null,
          relayScanHeight: relayScanHeight ?? null,
          props: {
            ...getIdProperty(context),
            ...(props?.props || {}),
          },
        },
      },
    };
  };
}
