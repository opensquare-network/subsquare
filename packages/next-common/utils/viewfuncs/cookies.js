import { isNil } from "lodash-es";

const DEFAULT_COOKIE_EXPIRES = 45;

const converter = {
  read: function (value) {
    // eslint-disable-next-line quotes
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function (value) {
    return (
      encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent,
      ) + ";path=/;"
    );
  },
};

export function setCookie(key, value, options) {
  let { expires } = options ?? {};
  if (isNil(expires)) {
    expires = DEFAULT_COOKIE_EXPIRES;
  }
  let stringifiedOptions = "";

  if (typeof document === "undefined") {
    return;
  }
  key = encodeURIComponent(key)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);

  if (expires) {
    if (typeof expires === "number") {
      expires = new Date(Date.now() + expires * 864e5);
    }
    stringifiedOptions += `;expires=${expires.toUTCString()}`;
  }

  document.cookie =
    key +
    "=" +
    converter.write(value, key) +
    stringifiedOptions +
    "; SameSite=None; Secure";

  return document.cookie;
}

export function clearCookie(key) {
  setCookie(key, "", { expires: -1 });
}

export function getCookie(key) {
  if (typeof document === "undefined" || (arguments.length && !key)) {
    return;
  }

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  var cookies = document.cookie ? document.cookie.split("; ") : [];
  var jar = {};
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split("=");
    var value = parts.slice(1).join("=");

    try {
      var foundKey = decodeURIComponent(parts[0]);
      jar[foundKey] = converter.read(value, foundKey);

      if (key === foundKey) {
        break;
      }
    } catch (e) {
      // fixme: ignore
    }
  }

  return key ? jar[key] : jar;
}
