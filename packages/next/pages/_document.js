import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import light from "next-common/styles/light";
import dark from "next-common/styles/dark";

const chain = process.env.NEXT_PUBLIC_CHAIN;

function buildThemeVariables(theme) {
  if (!theme) return "";

  return Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {${buildThemeVariables(light.base)}}
                :root {${buildThemeVariables(light.chain[chain])}}
                .dark:root {${buildThemeVariables(dark.base)}}
                .dark:root {${buildThemeVariables(dark.chain[chain])}}

                body {
                  background-color: var(--neutral100);
                }
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var cookie = document.cookie;
                  var theme_mode = cookie.match(/theme-mode=([^;]+)/);
                  if (theme_mode) {
                    theme_mode = theme_mode[1];
                    if (!theme_mode || theme_mode === "system") {
                      if ("matchMedia" in window) {
                        var preferredDark = window.matchMedia(
                          "(prefers-color-scheme: dark)",
                        ).matches;
                        if (preferredDark) {
                          add_dark();
                        }
                      }
                    } else if (theme_mode === "dark") {
                      add_dark();
                    }

                    function add_dark() {
                      var root = document.documentElement;
                      root.classList.add("dark");
                    }
                  }
                })()
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
