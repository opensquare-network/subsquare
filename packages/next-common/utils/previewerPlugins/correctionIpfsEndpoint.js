const cloudflareIpfsEndpoint = "https://cloudflare-ipfs.com/ipfs";

export default function correctionIpfsEndpointPlugin() {
  const endpoint = process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT;
  const pluginName = "correction-ipfs-endpoint";
  if (!endpoint) {
    return {
      name: pluginName,
    };
  }
  return {
    name: pluginName,
    onRenderedHtml: (el) => {
      el?.querySelectorAll("img")?.forEach((img) => {
        if (
          img?.src &&
          img?.src?.startsWith(cloudflareIpfsEndpoint) &&
          endpoint
        ) {
          img.src = img.src.replace(cloudflareIpfsEndpoint, endpoint);
        }
      });
    },
  };
}
