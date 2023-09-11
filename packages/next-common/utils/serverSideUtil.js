// redirect to 404 page
export function to404() {
  return redirect("/404");
}

export function isBrowserCompatible(context) {
  const userAgent = context?.req?.headers["user-agent"] ?? "";
  const isSafari =
    userAgent.includes("Safari") && !userAgent.includes("Chrome");
  if (isSafari) {
    const regex = /\bVersion\/(\d+?\.\d+)/;
    const version = regex.exec(userAgent)?.[1];
    if (parseFloat(version) < 14) {
      return false;
    }
  }

  return true;
}

// redirect to browser incompatible page
export function toBrowserIncompatible() {
  return redirect("/incompatible");
}

export function redirect(url) {
  return {
    redirect: {
      permanent: false,
      destination: url,
    },
    props: {},
  };
}
