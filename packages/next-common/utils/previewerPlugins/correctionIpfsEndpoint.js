const ipfsEndpoints = [
  "https://cloudflare-ipfs.com/ipfs",
  "https://subsquare.infura-ipfs.io/ipfs",
];

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
        const sourceEndpoint = ipfsEndpoints.find((source) =>
          img?.src?.startsWith(source),
        );

        if (sourceEndpoint) {
          img.src = img.src.replace(sourceEndpoint, endpoint);
        }
      });
    },
  };
}
