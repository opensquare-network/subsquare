export async function personalSign(message, address) {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
}

export async function getChainId() {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "eth_chainId",
  });
}

export async function requestAccounts() {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "eth_requestAccounts",
  });
}
