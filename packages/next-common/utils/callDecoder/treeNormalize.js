export function normalizeCallTree(callTree) {
  if (!callTree) return callTree;

  if (
    callTree.type === "Call" &&
    callTree.children &&
    callTree.children.length > 0 &&
    callTree.children[0].type === "Call"
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
