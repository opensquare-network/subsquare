export function normalizeCallTree(callTree) {
  if (!callTree) return callTree;

  if (
    callTree.type === "Call" &&
    callTree.rawType === "enum" &&
    callTree.children &&
    callTree.children.length > 0 &&
    callTree.children[0].type === "Call" &&
    callTree.children[0].rawType === "enum" &&
    callTree.children[0].children &&
    callTree.children[0].children.length > 0 &&
    callTree.children[0].children[0].type === "Call" &&
    callTree.children[0].children[0].rawType === "struct"
  ) {
    return {
      type: callTree.type,
      name: callTree.name,
      section: callTree.children[0].name,
      method: callTree.children[0].children[0].name,
      children: callTree.children[0].children[0].children.map((child) =>
        normalizeCallTree(child),
      ),
    };
  }

  if (
    callTree.type === "Call" &&
    callTree.rawType === "enum" &&
    callTree.children &&
    callTree.children.length > 0 &&
    callTree.children[0].type === "Call" &&
    callTree.children[0].rawType === "struct"
  ) {
    return {
      type: callTree.type,
      section: callTree.name,
      method: callTree.children[0].name,
      children: callTree.children[0].children.map((child) =>
        normalizeCallTree(child),
      ),
    };
  }

  if (callTree.children) {
    callTree.children = callTree.children.map((child) =>
      normalizeCallTree(child),
    );
  }

  return callTree;
}

export default { normalizeCallTree };
