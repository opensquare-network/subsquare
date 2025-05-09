import React from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import "nprogress/nprogress.css";
import "next-common/styles/globals.css";
import "next-common/styles/tailwind.css";
import { store } from "next-common/store";
import GlobalProvider from "next-common/context/global";
import "next-common/styles/cmdk.css";
import "next-common/styles/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import ScanStatusComponent from "next-common/components/scanStatus";
import SystemVersionUpgrade from "next-common/components/systemVersionUpgrade";
import "@osn/previewer/styles.css";
import "next-common/styles/markdown.css";
import useInitMimir from "next-common/hooks/useInitMimir";
import dynamic from "next/dynamic";
// import ErrorBoundary from "next-common/components/errorBoundary";

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

//convert the read and write operations of localStorage to client-side rendering
const ClientOnlySystemUpgrade = dynamic(
  () => Promise.resolve(SystemVersionUpgrade),
  {
    ssr: false,
  },
);

function MyApp({ Component, pageProps }) {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error("NEXT_PUBLIC_CHAIN env not set");
  }

  // const [resetKey, setResetKey] = React.useState(0);
  // const handleErrorReset = () => setResetKey((prev) => prev + 1);

  useInitMimir();

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
    scanHeight,
    ...otherProps
  } = pageProps;

  return (
    <>
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

          <ScanStatusComponent scanHeight={scanHeight}>
            {/* The error boundary is not in use temporarily */}
            {/* <ErrorBoundary
              key={resetKey}
              user={user}
              onReset={handleErrorReset}
              isPartialComponent={false}
            >
              <Component {...otherProps} />
            </ErrorBoundary> */}
            <Component {...otherProps} />
          </ScanStatusComponent>
        </GlobalProvider>
      </Provider>
    </>
  );
}

export default MyApp;
