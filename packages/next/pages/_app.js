import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";

import "nprogress/nprogress.css";
import "../styles/globals.css";
import { store } from "../store";
import Auth from "components/auth";
import "../styles/richTextStyles.scss";
import { connect } from "../services/websocket";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
  useEffect(() => {
    connect();
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <title>SubSquare</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Auth />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
