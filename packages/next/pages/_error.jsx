import React, { useEffect } from "react";
import Error from "next/error";
import { CHAIN } from "next-common/utils/constants";
import { reportError } from "next-common/services/reportError";

function ErrorPage({ statusCode, err, isServerError, reqUrl }) {
  useEffect(() => {
    if (err) {
      const errorData = {
        chain: CHAIN,
        url: typeof window !== "undefined" ? window.location.href : reqUrl,
        code: statusCode,
        error: err.message,
        source: isServerError ? "server" : "client",
        stack: err.stack,
      };

      reportError(errorData);
    }
  }, [err, isServerError, reqUrl, statusCode]);

  return <Error statusCode={statusCode} />;
}

ErrorPage.getInitialProps = async ({ req, res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode;

  return {
    statusCode,
    err,
    isServerError: !!res,
    reqUrl: req?.url,
  };
};

export default ErrorPage;
