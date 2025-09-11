export function ensurePolkassemblyRelativeLink(postContent = "", chain = "") {
  return String(postContent)?.replace(
    /href=(['"])\.\./g,
    (_, $1) => `href=${$1}https://${chain}.polkassembly.io`,
  );
}
