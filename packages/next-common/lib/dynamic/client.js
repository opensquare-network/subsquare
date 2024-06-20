import { isPlainObject, merge } from "lodash-es";
import dynamic from "next/dynamic";

const defaultOptions = {
  ssr: false,
};

/**
 * @type {dynamic}
 */
export default function dynamicClient(dynamicOptions, options) {
  if (isPlainObject(dynamicOptions)) {
    dynamicOptions = merge(defaultOptions, dynamicOptions);
  }

  return dynamic(dynamicOptions, { ...defaultOptions, ...options });
}
