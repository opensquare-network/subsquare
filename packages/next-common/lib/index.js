import Cookies from "cookies";
import {
  isBrowserCompatible,
  redirect,
  toBrowserIncompatible,
} from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";
import getDetailPageProperties, { getIdProperty } from "./pages/detail";
import fetchProfile from "next-common/lib/fetchProfile";
import fetchUserStatus from "next-common/lib/fetchUserStatus";
import { adminsApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import { getConnectedAccount } from "next-common/services/serverSide/getConnectedAccount";
import getNavSubMenuVisible from "next-common/services/serverSide/getNavSubMenuVisible";
import getNavCollapsed from "next-common/services/serverSide/getNavCollapsed";

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
    const navCollapsed = getNavCollapsed(cookies);
    const navSubmenuVisible = getNavSubMenuVisible(cookies);
    const detailPageProperties = getDetailPageProperties(context);
    const connectedAccount = getConnectedAccount(cookies);

    const [
      props,
      { result: user },
      { result: userStatus },
      { result: admins },
    ] = await Promise.all([
      getServerSideProps(context),
      fetchProfile(context),
      fetchUserStatus(context),
      ssrNextApi.fetch(adminsApi),
    ]);

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
        ...props.props,
        chain: process.env.CHAIN,
        user: user ?? null,
        userStatus: userStatus ?? null,
        connectedAccount: connectedAccount ?? null,
        admins: admins ?? [],
        themeMode: themeMode ?? null,
        navCollapsed: navCollapsed || false,
        navSubmenuVisible: navSubmenuVisible || "{}",
        ...detailPageProperties,
        pageProperties: {
          ...detailPageProperties,
          userAgent,
          props: {
            ...getIdProperty(context),
            ...props.props,
          },
        },
      },
    };
  };
}
