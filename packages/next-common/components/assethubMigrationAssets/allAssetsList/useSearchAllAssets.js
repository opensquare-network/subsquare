import useSearchAssets, {
  SearchInput as BaseSearchInput,
} from "../useSearchAssets";

export function SearchInput({ value, onChange }) {
  return (
    <BaseSearchInput
      value={value}
      onChange={onChange}
      placeholder="Search for asset"
    />
  );
}

export default function useSearchAllAssets(list, value) {
  return useSearchAssets(list, value, { assetIdToString: true });
}
