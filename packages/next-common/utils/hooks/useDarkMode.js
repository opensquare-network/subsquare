import { useEffect, useState } from "react";

function watchAnyObject(
  object = {},
  methods = [],
  callbackBefore = function () {},
  callbackAfter = function () {}
) {
  for (let method of methods) {
    const original = object[method].bind(object);
    const newMethod = function (...args) {
      callbackBefore(method, ...args);
      const result = original.apply(null, args);
      callbackAfter(method, ...args);
      return result;
    };
    object[method] = newMethod.bind(object);
  }
}

const useDarkMode = () => {
  const [theme, setTheme] = useState("light");

  const setMode = (mode) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const themeToggler = () => {
    theme === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme && setTheme(localTheme);
    watchAnyObject(
      window.localStorage,
      ["setItem", "getItem", "removeItem"],
      (method, key, ...args) => {
        if (method === "setItem" && key === "theme") {
          setTheme(args[0]);
        }
      }
    );
  }, []);
  return [theme, themeToggler];
};

export default useDarkMode;
