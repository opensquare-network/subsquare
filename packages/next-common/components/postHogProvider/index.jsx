"use client";

import { useEffect } from "react";
import Router from "next/router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useChainSettings } from "next-common/context/chain";
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
      capture_pageleave: false,
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
  const { hasDataTracking = false } = useChainSettings();
  const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!hasDataTracking || !NEXT_PUBLIC_POSTHOG_KEY) {
    return children;
  }

  return (
    <PostHogProviderImpl posthogKey={NEXT_PUBLIC_POSTHOG_KEY}>
      {children}
    </PostHogProviderImpl>
  );
}
