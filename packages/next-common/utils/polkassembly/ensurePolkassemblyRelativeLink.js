export function ensurePolkassemblyRelativeLink(postContent = "", chain = "") {
  return postContent.replace(
    /href=(['"])\.\./g,
    (_, $1) => `href=${$1}https://${chain}.polkassembly.io`,
  );
}
