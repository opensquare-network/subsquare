function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex;
  });
}

function isExtrinsicSuccess(events) {
  return events.some((e) => e.event.method === "ExtrinsicSuccess");
}

function getExtrinsicSigner(extrinsic) {
  let signer = extrinsic._raw.signature.get("signer").toString();
  return signer;
}

function isHex(blockData) {
  if (typeof blockData !== "string") {
    return false;
  }

  return blockData.startsWith("0x");
}

function getConstFromRegistry(registry, moduleName, constantName) {
  let iterVersion = 0;
  const metadata = registry.metadata.get("metadata");

  while (iterVersion < 1000) {
    if (!metadata[`isV${iterVersion}`]) {
      iterVersion++;
      continue;
    }

    const modules = metadata[`asV${iterVersion}`].get("modules");
    const targetModule = modules.find(
      (module) => module.name.toString() === moduleName
    );
    if (!targetModule) {
      // TODO: should throw error
      break;
    }

    const targetConstant = targetModule.constants.find(
      (constant) => constant.name.toString() === constantName
    );
    if (!targetConstant) {
      break;
    }

    const typeName = targetConstant.type.toString();
    const Type = registry.registry.get(typeName);
    return new Type(registry.registry, targetConstant.value);
  }

  return null;
}

function getConstsFromRegistry(registry, constants) {
  return constants.map(({ moduleName, constantName }) =>
    getConstFromRegistry(registry, moduleName, constantName)
  );
}

module.exports = {
  isHex,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  getExtrinsicSigner,
  getConstFromRegistry,
  getConstsFromRegistry,
};
