import { useContextApi } from "next-common/context/api";
import { useEffect, useRef, useState } from "react";
import { isNull, isFunction, isUndefined, nextTick } from "@polkadot/util";
import useIsMountedRef from "./useIsMountedRef";

export default function useCall(fn, params, options) {
  const api = useContextApi();

  const mountedRef = useIsMountedRef();
  const tracker = useRef({
    error: null,
    fn: null,
    isActive: false,
    serialized: null,
    subscriber: null,
    type: "useCall",
  });
  const [value, setValue] = useState(options?.defaultValue);

  // initial effect, we need an un-subscription
  useEffect(() => {
    return () => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect(() => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && fn) {
      const [serialized, mappedParams] = extractParams(
        fn,
        params || [],
        options,
      );

      if (
        mappedParams &&
        (fn !== tracker.current.fn || serialized !== tracker.current.serialized)
      ) {
        tracker.current.fn = fn;
        tracker.current.serialized = serialized;

        subscribe(
          api,
          mountedRef,
          tracker,
          fn,
          mappedParams,
          setValue,
          options,
        );
      }
    }
  }, [api, fn, options, mountedRef, params]);

  // throwOnError(tracker.current);

  return value;
}

function extractParams(fn, params, { paramMap = transformIdentity } = {}) {
  return [
    JSON.stringify({ f: fn?.name, p: params }),
    params.length === 0 ||
    !params.some((param) => isNull(param) || isUndefined(param))
      ? paramMap(params)
      : null,
  ];
}

function unsubscribe(tracker) {
  tracker.current.isActive = false;

  if (tracker.current.subscriber) {
    tracker.current.subscriber
      .then((u) => isFunction(u) && u())
      .catch((e) => handleError(e, tracker));
    tracker.current.subscriber = null;
  }
}

function handleError(error, tracker, fn) {
  console.error(
    (tracker.current.error = new Error(
      `${tracker.current.type}(${
        isQuery(fn) ? `${fn.creator.section}.${fn.creator.method}` : "..."
      }):: ${error.message}:: ${error.stack || "<unknown>"}`,
    )),
  );
}

function isQuery(fn) {
  return !!fn && !isUndefined(fn.creator);
}

function transformIdentity(value) {
  return value;
}

function subscribe(
  api,
  mountedRef,
  tracker,
  fn,
  params,
  setValue,
  { transform = transformIdentity, withParams, withParamsTransform } = {},
) {
  const validParams = params.filter((p) => !isUndefined(p));

  unsubscribe(tracker);

  nextTick(() => {
    if (mountedRef.current) {
      const canQuery =
        !!fn &&
        (isMapFn(fn)
          ? fn.meta.type.asMap.hashers.length === validParams.length
          : true);

      if (canQuery) {
        // swap to active mode
        tracker.current.isActive = true;
        tracker.current.subscriber = fn(...params, (value) => {
          // we use the isActive flag here since .subscriber may not be set on immediate callback)
          if (mountedRef.current && tracker.current.isActive) {
            try {
              setValue(
                withParams
                  ? [params, transform(value, api)]
                  : withParamsTransform
                  ? transform([params, value], api)
                  : transform(value, api),
              );
            } catch (error) {
              handleError(error, tracker, fn);
            }
          }
        }).catch((error) => handleError(error, tracker, fn));
      } else {
        tracker.current.subscriber = null;
      }
    }
  });
}

function isMapFn(fn) {
  return !!fn.meta?.type?.isMap;
}
