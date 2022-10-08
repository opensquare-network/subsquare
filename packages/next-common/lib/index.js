import Cookies from "cookies";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useSelector } from "react-redux";
import { userSelector } from "next-common/store/reducers/userSlice";
import { checkBrowserCompatibility } from "next-common/utils/serverSideUtil";
import { CACHE_KEY } from "../utils/constants";

export function withLoginUser(getServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);

    checkBrowserCompatibility(context);

    let options = { credentials: true };
    const cookies = new Cookies(context.req, context.res);
    const themeMode = cookies.get(CACHE_KEY.themeMode);
    const authToken = cookies.get(CACHE_KEY.authToken);
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
        return {
          redirect: {
            permanent: false,
            destination: `/login?redirect=${context.resolvedUrl}`,
          },
          props: {},
        };
      }
    }

    return {
      ...props,
      props: {
        ...props.props,
        loginUser: user ?? null,
        themeMode: themeMode ?? "light",
      },
    };
  };
}

export function withLoginUserRedux(fnComponent) {
  return ({ loginUser, themeMode, ...props }) => {
    const storeUser = useSelector(userSelector);
    return fnComponent({
      loginUser: storeUser === undefined ? loginUser : storeUser,
      ...props,
    });
  };
}
