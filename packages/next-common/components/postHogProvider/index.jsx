"use client";

import { useEffect } from "react";
import Router from "next/router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useChainSettings } from "next-common/context/chain";

function PostHogProviderImpl({ children }) {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error("NEXT_PUBLIC_CHAIN env not set");
  }

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
      debug: process.env.NODE_ENV === "development",
      capture_pageleave: true,
      autocapture: {
        dom_event_capture: ["click"],
        exceptions: true,
      },
    });

    const handleRouteChange = () => posthog.capture("$pageview");
    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default function PostHogProvider({ children }) {
  const { PostHog } = useChainSettings();

  if (!PostHog) {
    return children;
  }

  return <PostHogProviderImpl>{children}</PostHogProviderImpl>;
}
