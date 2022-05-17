import Cookies from "cookies";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userSelector } from "next-common/store/reducers/userSlice";
import { useEffect, useLayoutEffect } from "react";
import { isSafari } from "../utils/serverSideUtil";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function withLoginUser(getServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);
    isSafari(context);

    let options = { credentials: true };
    const cookies = new Cookies(context.req, context.res);
    const authToken = cookies.get("auth-token");
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
      return {
        redirect: {
          permanent: false,
          destination: `/login?redirect=${context.resolvedUrl}`,
        },
        props: {},
      };
    }

    return {
      ...props,
      props: {
        ...props.props,
        loginUser: user ?? null,
      },
    };
  };
}

export function withLoginUserRedux(fnComponent) {
  return ({ loginUser, ...props }) => {
    const dispatch = useDispatch();
    useIsomorphicLayoutEffect(() => {
      dispatch(setUser(loginUser));
    }, [loginUser]);

    const storeUser = useSelector(userSelector);
    return fnComponent({
      loginUser: storeUser === undefined ? loginUser : storeUser,
      ...props,
    });
  };
}
