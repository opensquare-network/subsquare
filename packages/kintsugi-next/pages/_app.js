import React, { useEffect } from "react";
import Script from "next/script";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store } from "../store";
import "nprogress/nprogress.css";
import "../styles/globals.css";
import "../styles/richTextStyles.scss";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import { connect } from "../services/websocket";

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
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/themes/prism.min.css"
        />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js" />
      </Provider>
    </>
  );
}

export default MyApp;
