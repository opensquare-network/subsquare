import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store } from "next-common/store";
import "nprogress/nprogress.css";
import "../styles/globals.css";
import "next-common/styles/richTextStyles.scss";
import "next-common/styles/prism.min.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "next-common/services/websocket";
import { setPost, setDetailType } from "next-common/store/reducers/postSlice";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on(
  "routeChangeStart",
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  "routeChangeComplete",
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  "routeChangeError",
  (url, { shallow }) => !shallow && NProgress.done()
);

function MyApp({ Component, pageProps }) {
  const { redux: { detail, detailType } = {} } = pageProps || {};
  if (detail && detailType) {
    store.dispatch(setPost({ ...detail }));
    store.dispatch(setDetailType(detailType));
  }

  useEffect(() => {
    connect();
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
