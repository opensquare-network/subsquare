import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";

import "nprogress/nprogress.css";
import "next-common/styles/globals.css";
import "next-common/styles/tailwind.css";
import { store } from "next-common/store";
// import "next-common/styles/richTextStyles.scss";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import GlobalProvider from "next-common/context/global";
import "next-common/styles/cmdk.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import ScanStatusComponent from "next-common/components/scanStatus";
import SystemVersionUpgrade from "next-common/components/systemVersionUpgrade";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on(
  "routeChangeStart",
  (url, { shallow }) => !shallow && NProgress.start(),
);
Router.events.on(
  "routeChangeComplete",
  (url, { shallow }) => !shallow && NProgress.done(),
);
Router.events.on(
  "routeChangeError",
  (url, { shallow }) => !shallow && NProgress.done(),
);

function MyApp({ Component, pageProps }) {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error("NEXT_PUBLIC_CHAIN env not set");
  }

  const {
    loginUser,
    themeMode,
    pageProperties,
    navCollapsed,
    navSubmenuVisible,
    ...otherProps
  } = pageProps;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Provider store={store}>
        <GlobalProvider
          user={loginUser}
          chain={process.env.NEXT_PUBLIC_CHAIN}
          themeMode={themeMode}
          pageProperties={pageProperties}
          navCollapsed={navCollapsed}
          navSubmenuVisible={navSubmenuVisible}
        >
          <SystemVersionUpgrade />
          <ScanStatusComponent>
            <Component {...otherProps} />
          </ScanStatusComponent>
        </GlobalProvider>
      </Provider>
    </>
  );
}

export default MyApp;
