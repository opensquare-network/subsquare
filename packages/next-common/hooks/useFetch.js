import { useAsync } from "react-use";

export default function useFetch(url) {
  return useAsync(
    () =>
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch: " + url);
        }
        return res.json();
      }),
    [url],
  );
}
