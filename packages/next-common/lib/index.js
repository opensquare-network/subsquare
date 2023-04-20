import Cookies from "cookies";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  isBrowserCompatible,
  toBrowserIncompatible,
  toLogin,
} from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";
import { useUser } from "../context/user";
import getDetailPageProperties from "./pages/detail";

export function withLoginUser(getServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);

    if (!isBrowserCompatible(context)) {
      return toBrowserIncompatible();
    }

    let options = {};
    const cookies = new Cookies(context.req, context.res);
    const themeMode = cookies.get(CACHE_KEY.themeMode);
    const homeExpandedMenus = cookies.get(CACHE_KEY.homeExpandedMenus);
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
        return toLogin(context);
      }
    }

    const userAgent = context?.req?.headers?.["user-agent"] ?? "";

    return {
      ...props,
      props: {
        ...props.props,
        loginUser: user ?? null,
        themeMode: themeMode ?? null,
        homeExpandedMenus: homeExpandedMenus || "",
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
