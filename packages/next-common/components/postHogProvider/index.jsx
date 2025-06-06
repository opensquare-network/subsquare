"use client";

import { useEffect } from "react";
import Router from "next/router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useChainSettings } from "next-common/context/chain";
import { IS_DEVELOPMENT } from "next-common/utils/constants";

function PostHogProviderImpl({ children }) {
  const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  useEffect(() => {
    if (!NEXT_PUBLIC_POSTHOG_KEY) {
      return;
    }

    posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      loaded: (posthog) => {
        if (IS_DEVELOPMENT) {
          posthog.debug();
        }
      },
      debug: IS_DEVELOPMENT,
      capture_pageleave: false,
      session_recording: true,
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
  }, [NEXT_PUBLIC_POSTHOG_KEY]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default function PostHogProvider({ children }) {
  const { hasDataTracking = false } = useChainSettings();

  if (!hasDataTracking) {
    return children;
  }

  return <PostHogProviderImpl>{children}</PostHogProviderImpl>;
}
