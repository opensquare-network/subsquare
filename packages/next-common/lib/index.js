import Cookies from "cookies";
import {
  isBrowserCompatible,
  redirect,
  toBrowserIncompatible,
} from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";
import getDetailPageProperties, { getIdProperty } from "./pages/detail";
import fetchProfile from "next-common/lib/fetchProfile";
import { adminsApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import { getConnectedWallet } from "next-common/services/serverSide/getConnectedWallet";

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
    const detailPageProperties = getDetailPageProperties(context);
    const connectedWallet = getConnectedWallet(context);

    const [props, { result: user }, { result: admins }] = await Promise.all([
      getServerSideProps(context),
      fetchProfile(cookies),
      ssrNextApi.fetch(adminsApi),
    ]);

    if (
      context.resolvedUrl?.startsWith("/settings/") &&
      !user &&
      !connectedWallet
    ) {
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
        loginUser: user ?? null,
        connectedWallet: connectedWallet ?? null,
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
