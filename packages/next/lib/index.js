import Cookies from "cookies";
import nextApi from "../services/nextApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userSelector } from "../store/reducers/userSlice";
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function withLoginUser(getServerSideProps) {
  return async function (context) {
    const propsPromise = getServerSideProps(context);

    let options = undefined;
    const cookies = new Cookies(context.req, context.res);
    const authToken = cookies.get("auth-token") ?? `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTQ4OGUzOTAwZTU5NTI4YWM4MzJmZSIsImVtYWlsIjoiNjM0NTU0ODE1QHFxLmNvbSIsInVzZXJuYW1lIjoieW9zaGl5dWtpIiwiaWF0IjoxNjMwMzk5MjU3LCJleHAiOjE2MzEwMDQwNTd9.tF0unQYwDz-XgMiP8BQYPeYtaWPKbN94UT9aaPZvOYQ`;
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
      ...props
    });
  };
}
