export default function usePublicStaticImage(url) {
  const baseUrl =
    "https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/public";

  return `${baseUrl}/${url}`;
}
