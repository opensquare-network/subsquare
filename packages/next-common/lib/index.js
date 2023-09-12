import Cookies from "cookies";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  isBrowserCompatible,
  redirect,
  toBrowserIncompatible,
} from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";
import { useUser } from "../context/user";
import getDetailPageProperties from "./pages/detail";

async function defaultGetServerSideProps() {
  return { props: {} };
}

export function withLoginUser(getServerSideProps = defaultGetServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);

    if (!isBrowserCompatible(context)) {
      return toBrowserIncompatible();
    }

    let options = {};
    const cookies = new Cookies(context.req, context.res);
    const themeMode = cookies.get(CACHE_KEY.themeMode);
    const navCollapsed = cookies.get(CACHE_KEY.navCollapsed);
    const navSubmenuVisible = cookies.get(CACHE_KEY.navSubmenuVisible);
    const authToken = cookies.get(CACHE_KEY.authToken);
    const pageProperties = getDetailPageProperties(context.resolvedUrl);
    if (authToken) {
      options = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
    }
    const profilePromise = nextApi.fetch("user/profile", {}, options);

    const [props, { result: user }] = await Promise.all([
      propsPromise,
      profilePromise,
    ]);

    if (context.resolvedUrl?.startsWith("/setting/") && !user) {
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
        themeMode: themeMode ?? null,
        navCollapsed: navCollapsed || false,
        navSubmenuVisible: navSubmenuVisible || "{}",
        pageProperties: {
          ...pageProperties,
          userAgent,
          props: props.props,
        },
      },
    };
  };
}

export function withLoginUserRedux(fnComponent) {
  return ({ ...props }) => {
    const loginUser = useUser();

    return fnComponent({
      ...props,
      loginUser,
    });
  };
}
