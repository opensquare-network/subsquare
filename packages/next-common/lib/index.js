import Cookies from "cookies";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { checkBrowserCompatibility } from "next-common/utils/serverSideUtil";
import { setMode } from "../store/reducers/settingSlice";
import { CACHE_KEY } from "../utils/constants";
import { useUser } from "../context/user";

export function withLoginUser(getServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);

    checkBrowserCompatibility(context);

    let options = {};
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

    const [props, { error, result: user }] = await Promise.all([
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
  return ({ themeMode, ...props }) => {
    const dispatch = useDispatch();
    const loginUser = useUser();

    if (themeMode) {
      dispatch(setMode(themeMode));
    }

    return fnComponent({
      ...props,
      loginUser,
    });
  };
}
