import nextApi from "../nextApi";

const apiUrl = "https://api.github.com/repos/polkadot-fellows/RFCs/issues";

export async function fetchRFCs() {
  const resp = await nextApi.fetch(apiUrl);

  const issues = resp?.result?.filter?.((item) =>
    item.html_url.endsWith(`/issues/${item.number}`),
  );

  return {
    items: issues,
  };
}
