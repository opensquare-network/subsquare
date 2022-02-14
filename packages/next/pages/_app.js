import Script from "next/script";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";

import "nprogress/nprogress.css";
import "../styles/globals.css";
import "public/prism.css";
import { store } from "../store";
import "../styles/richTextStyles.scss";
import "react-quill/dist/quill.snow.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import { connect } from "../services/websocket";
import { useEffect } from "react";

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
      <Component {...pageProps} />
      <Script src="/prism.js" />
    </Provider>
  );
}

export default MyApp;
