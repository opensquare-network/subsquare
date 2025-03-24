import { Interface } from "ethers";
import { getFileNameByContractAddress } from "./importAbi";

const IMPL_ABI = "0xac611e17f191312003e9b13483ddf1384cc6f1ef";

export async function decodeInput(data, contractAddress) {
  if (!data || typeof data !== "string") {
    return [data, false];
  }

  try {
    const abi = await Promise.all([
      getFileNameByContractAddress(contractAddress),
      getFileNameByContractAddress(IMPL_ABI),
    ]).then((abis) => abis?.flat());

    const parsedAbi = typeof abi === "string" ? JSON.parse(abi) : abi;
    const iface = new Interface(parsedAbi);

    data = data.trim();
    const methodId = data.slice(2, 10);

    for (const func of parsedAbi) {
      try {
        if (func.type !== "function") continue;

        const result = iface.decodeFunctionData(func.name, data);
        if (!result) continue;

        const types = func.inputs?.map((input) => getParamType(input)) || [];
        const names = func.inputs?.map((input) => input.name) || [];

        const inputs = Array.from(result).map((param, index) => {
          return processParam(param, func.inputs?.[index]);
        });

        return [
          {
            method: func.name,
            types,
            inputs,
            names,
            selector: methodId,
          },
          true,
        ];
      } catch {
        continue;
      }
    }

    return [data, false];
  } catch (err) {
    return [data, false];
  }
}

function getParamType(input) {
  if (!input?.type) return "unknown";

  // 处理元组类型
  if (input.type.includes("tuple")) {
    const components = input.components.map((comp) => comp.type).join(",");
    return input.type.includes("[]") ? `(${components})[]` : `(${components})`;
  }

  return input.type;
}

function processParam(param, input) {
  if (!input) return param;

  if (Array.isArray(param)) {
    return param.map((item) =>
      processParam(item, {
        ...input,
        type: input.type.replace("[]", ""),
      }),
    );
  }

  if (input.type === "address" && typeof param === "string") {
    return param.toLowerCase();
  }

  if (typeof param === "bigint") {
    return param.toString();
  }

  return param;
}
