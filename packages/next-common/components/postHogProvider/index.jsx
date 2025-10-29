"use client";

import { useEffect } from "react";
import Router from "next/router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { IS_DEVELOPMENT } from "next-common/utils/constants";

function PostHogProviderImpl({ children, posthogKey }) {
  useEffect(() => {
    if (!posthogKey || typeof window === "undefined") {
      return;
    }

    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      loaded: (posthog) => {
        if (IS_DEVELOPMENT) {
          posthog.debug();
        }
      },
      debug: IS_DEVELOPMENT,
      capture_pageleave: true,
      session_recording: {
        recordCrossOriginIframes: true,
        blockSelector: ".ph-block-image",
        ignoreClass: "ph-ignore-image",
      },
      autocapture: {
        dom_event_capture: ["click", "submit"],
        exceptions: false,
      },
    });

    const handleRouteChange = () => posthog.capture("$pageview");
    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [posthogKey]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default function PostHogProvider({ children }) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!posthogKey) {
    return children;
  }

  return (
    <PostHogProviderImpl posthogKey={posthogKey}>
      {children}
    </PostHogProviderImpl>
  );
}
