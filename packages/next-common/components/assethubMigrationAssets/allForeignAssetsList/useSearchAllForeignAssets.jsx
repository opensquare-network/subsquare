import useSearchAssets, {
  SearchInput as BaseSearchInput,
} from "../useSearchAssets";

export function SearchInput({ value, onChange }) {
  return (
    <BaseSearchInput
      value={value}
      onChange={onChange}
      placeholder="Search for foreign asset"
    />
  );
}

export default function useSearchAllForeignAssets(list, value) {
  return useSearchAssets(list, value, { assetIdToString: false });
}
