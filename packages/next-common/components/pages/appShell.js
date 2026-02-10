import React from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store } from "next-common/store";
import GlobalProvider from "next-common/context/global";
import Head from "next/head";
import SystemVersionUpgrade from "next-common/components/systemVersionUpgrade";
import dynamic from "next/dynamic";

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

// Convert localStorage read/write to client-side rendering only.
const ClientOnlySystemUpgrade = dynamic(
  () => Promise.resolve(SystemVersionUpgrade),
  {
    ssr: false,
  },
);

export function AppShell({ Component, pageProps }) {
  const {
    connectedAccount,
    user,
    userStatus,
    admins,
    themeMode,
    pageProperties,
    navCollapsed,
    navSubmenuVisible,
    pathname,
    ...otherProps
  } = pageProps;

  return (
    <>
      {/* <PostHogProvider> */}
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Provider store={store}>
        <GlobalProvider
          connectedAccount={connectedAccount}
          user={user}
          userStatus={userStatus}
          admins={admins}
          chain={process.env.NEXT_PUBLIC_CHAIN}
          themeMode={themeMode}
          pageProperties={pageProperties}
          navCollapsed={navCollapsed}
          navSubmenuVisible={navSubmenuVisible}
          pathname={pathname}
        >
          <ClientOnlySystemUpgrade />
          <Component {...otherProps} />
        </GlobalProvider>
      </Provider>
      {/* </PostHogProvider> */}
    </>
  );
}

export default function AppWithChainCheck({ Component, pageProps }) {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error("NEXT_PUBLIC_CHAIN env not set");
  }
  return <AppShell Component={Component} pageProps={pageProps} />;
}
