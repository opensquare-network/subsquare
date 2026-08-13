import Chains from "next-common/utils/consts/chains";
import getMetadata from "next-common/services/chain/apis/metadata";
import getApiProvider from "next-common/services/chain/apis/providers";

const xcmPaymentApiMethods = {
  query_acceptable_payment_assets: {
    description: "The API to query acceptable payment assets",
    params: [{ name: "version", type: "u32" }],
    type: "Result<Vec<XcmVersionedAssetId>, XcmPaymentApiError>",
  },
  query_weight_to_asset_fee: {
    description: "",
    params: [
      { name: "weight", type: "WeightV2" },
      { name: "asset", type: "XcmVersionedAssetId" },
    ],
    type: "Result<u128, XcmPaymentApiError>",
  },
  query_xcm_weight: {
    description: "",
    params: [{ name: "message", type: "XcmVersionedXcm" }],
    type: "Result<WeightV2, XcmPaymentApiError>",
  },
  // Signature matches Asset Hub (destination, message, fee_asset). Chains whose
  // metadata already declares query_delivery_fees (e.g. Hydration's 2-arg
  // variant) keep their own via the metadata-first merge below.
  query_delivery_fees: {
    description: "The API to query the delivery fees of an XCM message",
    params: [
      { name: "destination", type: "XcmVersionedLocation" },
      { name: "message", type: "XcmVersionedXcm" },
      { name: "feeAsset", type: "XcmVersionedAssetId" },
    ],
    // The chain returns xcm::VersionedAssets (V3/V4/V5 assets), NOT a bare
    // Vec<XcmAsset> — the latter is only declared inside the runtime API and
    // resolves to DoNotConstruct when the api is built from a metadata keyed
    // by genesis-specVersion. XcmVersionedAssets is a registered core type.
    type: "Result<XcmVersionedAssets, XcmPaymentApiError>",
  },
};

const xcmPaymentApiRuntimeVersions = [
  { methods: xcmPaymentApiMethods, version: 1 },
  { methods: xcmPaymentApiMethods, version: 2 },
];

// Runtime API definitions for XcmPaymentApi. Exported for API instances that
// are built from metadata only (see getChainApi) so methods like
// query_delivery_fees stay decorated even when the cached metadata is stale.
export function getXcmPaymentApiRuntime() {
  return { XcmPaymentApi: xcmPaymentApiRuntimeVersions };
}

function mergeRuntimeDefinitions(runtime = {}) {
  const existingXcmPaymentApiVersions = runtime.XcmPaymentApi || [];
  const existingVersions = new Set(
    existingXcmPaymentApiVersions.map(({ version }) => version),
  );

  return {
    ...runtime,
    XcmPaymentApi: [
      ...existingXcmPaymentApiVersions,
      ...xcmPaymentApiRuntimeVersions.filter(
        ({ version }) => !existingVersions.has(version),
      ),
    ],
  };
}

async function getOptions(chain, endpoint) {
  const provider = await getApiProvider(endpoint);
  let options = { provider };

  const allOptions = (await import("@osn/provider-options")).default;

  let customizedOptions;
  if ([Chains.karura, Chains.acala].includes(chain)) {
    customizedOptions = allOptions.karuraOptions;
  } else if ([Chains.khala, Chains.phala].includes(chain)) {
    customizedOptions = allOptions.khalaOptions;
  } else {
    customizedOptions = allOptions[chain] || {};
  }

  const { id, metadata } = await getMetadata(provider);
  return {
    ...customizedOptions,
    ...options,
    runtime: mergeRuntimeDefinitions(customizedOptions.runtime),
    metadata: { [id]: metadata },
  };
}

export default getOptions;
