import { diffArrays, diffWords } from "diff";
import lightTheme from "../../styles/light";
import darkTheme from "../../styles/dark";

const ADDED_INLINE_CLASS = "bg-green100 text-textPrimary rounded-sm px-0.5";
const REMOVED_INLINE_CLASS =
  "bg-red100 text-textTertiary line-through rounded-sm px-0.5";
const ADDED_BLOCK_CLASS = "block bg-green100 rounded-sm";
const REMOVED_BLOCK_CLASS =
  "block bg-red100 text-textTertiary line-through rounded-sm";

const DIFF_DATA_ATTR = "data-version-diff";
const SKIP_ANNOTATION_SELECTOR = "a, code, pre";
const SKIP_PATH_TAGS = new Set(["a", "code", "pre"]);

// Wrapper tags ignored while comparing inline styles when they carry no
// effective attribute (e.g. a <span> left by the editor with only no-op
// styles).
const NEUTRAL_WRAPPER_TAGS = new Set(["span", "font"]);

const TRANSPARENT_COLOR = "rgba(0, 0, 0, 0)";

function parseHtmlToContainer(html) {
  const container = document.createElement("div");
  container.innerHTML = html || "";
  return container;
}

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

// Canonical rgba() representation of a css color value, so that different
// notations of the same color (hex, rgb(), rgba()) compare equal.
function canonicalColor(value) {
  const raw = (value || "").trim().toLowerCase();
  if (!raw || typeof document === "undefined") {
    return raw;
  }

  const probe = document.createElement("span");
  probe.style.color = raw;
  const resolved = (probe.style.color || raw).toLowerCase();
  const match = resolved.match(/^rgba?\(([^)]+)\)$/);
  if (!match) {
    return resolved;
  }

  const [r, g, b, alpha = 1] = match[1]
    .split(",")
    .map((part) => parseFloat(part));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

let defaultTextColorsCache = null;

// Colors that count as the default text color and are therefore ignored when
// they appear in a style attribute: the theme values plus the effective
// --textPrimary css variable of the current page (chains can override it).
function getDefaultTextColors() {
  if (!defaultTextColorsCache) {
    let cssVar = "";
    if (
      typeof document !== "undefined" &&
      typeof getComputedStyle === "function"
    ) {
      try {
        cssVar = getComputedStyle(document.documentElement).getPropertyValue(
          "--textPrimary",
        );
      } catch {
        // Ignore environments without a usable css engine.
      }
    }
    defaultTextColorsCache = new Set(
      [lightTheme?.textPrimary, darkTheme?.textPrimary, cssVar.trim()]
        .filter(Boolean)
        .map(canonicalColor),
    );
  }
  return defaultTextColorsCache;
}

// Strip editor noise declarations, e.g. a fully transparent background or a
// color identical to the default text color, so that they never count as a
// change. Values of the same color written differently are normalized too.
function normalizeStyleAttribute(value) {
  const compact = (str) => str.replace(/\s+/g, "");

  return (value || "")
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator === -1) {
        return compact(declaration.toLowerCase());
      }

      const name = declaration.slice(0, separator).trim().toLowerCase();
      const rawValue = declaration.slice(separator + 1).trim();
      const color = canonicalColor(rawValue);

      if (name === "color") {
        return getDefaultTextColors().has(color) ? "" : `${name}:${color}`;
      }
      if (name === "background-color" || name === "background") {
        if (color === TRANSPARENT_COLOR) {
          return "";
        }
        return /^rgba?\(/.test(color)
          ? `${name}:${color}`
          : `${name}:${compact(rawValue.toLowerCase())}`;
      }
      return `${name}:${compact(rawValue.toLowerCase())}`;
    })
    .filter(Boolean)
    .join(";");
}

// An element is inline when it survives inside a wrapper <p> after being
// parsed - block level elements close the open <p> and become its siblings.
// This uses the html parser rules instead of a hardcoded tag list.
function isInlineElement(element) {
  const probe = document.createElement("div");
  probe.innerHTML = `<p>${element.outerHTML}</p>`;
  return probe.children.length === 1;
}

// Group stray inline content (text nodes and inline elements) directly under
// the root into paragraphs, so both versions are split into blocks the same
// way even when the html has no top level block wrapper.
function wrapStrays(container) {
  let group = null;

  Array.from(container.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE && !isInlineElement(child)) {
      group = null;
      return;
    }
    if (
      child.nodeType === Node.TEXT_NODE &&
      !child.textContent.trim() &&
      !group
    ) {
      return;
    }
    if (!group) {
      group = document.createElement("p");
      container.insertBefore(group, child);
    }
    group.appendChild(child);
  });
}

function elementSignature(element) {
  const tag = element.tagName.toLowerCase();
  const attrs = Array.from(element.attributes)
    .map((attr) => {
      const name = attr.name.toLowerCase();
      const value =
        name === "style" ? normalizeStyleAttribute(attr.value) : attr.value;
      return name === "style" && !value ? "" : `${name}=${value}`;
    })
    .filter(Boolean)
    .sort()
    .join(";");

  // A wrapper that keeps no effective attribute does not change the style
  // path of the text inside it.
  if (!attrs && NEUTRAL_WRAPPER_TAGS.has(tag)) {
    return "";
  }

  return `${tag}[${attrs}]`;
}

function toBlock(node) {
  return {
    node,
    tag: node.tagName.toLowerCase(),
    text: node.textContent || "",
    // Include the block tag, its attributes and its markup, so that tag
    // changes (`p` -> `h1`) and formatting only changes (font, underline, ...)
    // are treated as changed blocks as well.
    key: `${elementSignature(node)}|${normalizeText(
      node.textContent,
    )}|${normalizeText(node.innerHTML)}`,
  };
}

// Collect the inline style signature for every character of the block text.
function collectStyleChars(blockNode) {
  const styles = [];

  const walk = (node, path) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const key = path.join(">");
      for (let i = 0; i < node.data.length; i += 1) {
        styles.push(key);
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const tag = node.tagName.toLowerCase();
    const signature = tag === "br" ? "" : elementSignature(node);
    const nextPath =
      tag === "br" || SKIP_PATH_TAGS.has(tag) || !signature
        ? path
        : [...path, signature];
    Array.from(node.childNodes).forEach((child) => walk(child, nextPath));
  };

  walk(blockNode, []);
  return styles;
}

// Patches for the ranges whose text is unchanged but inline styles changed.
function formatPatches(oldBlock, newBlock) {
  const oldStyles = collectStyleChars(oldBlock.node);
  const newStyles = collectStyleChars(newBlock.node);
  const text = newBlock.text;
  const patches = [];
  let start = -1;

  for (let i = 0; i <= text.length; i += 1) {
    const changed = i < text.length && oldStyles[i] !== newStyles[i];
    if (changed && start === -1) {
      start = i;
    }
    if (!changed && start !== -1) {
      patches.push({ start, end: i, text: text.slice(start, i) });
      start = -1;
    }
  }

  return patches;
}

// Leaf blocks used for block level alignment. Lists are split into items.
function collectBlocks(container) {
  wrapStrays(container);

  const blocks = [];
  Array.from(container.children).forEach((child) => {
    const tag = child.tagName.toLowerCase();
    if (tag === "ul" || tag === "ol") {
      Array.from(child.children).forEach((li) => {
        if (li.tagName.toLowerCase() === "li") {
          blocks.push(toBlock(li));
        }
      });
      return;
    }
    blocks.push(toBlock(child));
  });
  return blocks;
}

// Text nodes of the block with their offsets in the full block text. Text
// inserted for removed fragments is skipped, so the offsets stay valid while
// patches are applied one by one.
function textNodesWithOffsets(root) {
  const entries = [];
  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  );
  let offset = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest(`del[${DIFF_DATA_ATTR}]`)) {
      continue;
    }
    entries.push({ node, start: offset, end: offset + node.data.length });
    offset += node.data.length;
  }
  return entries;
}

function isSkippedTextNode(node) {
  return !!node?.parentElement?.closest(SKIP_ANNOTATION_SELECTOR);
}

function createWrapper(type, className) {
  const wrapper = document.createElement(type);
  wrapper.setAttribute(DIFF_DATA_ATTR, "1");
  wrapper.className = className;
  return wrapper;
}

// Apply one patch to the cloned block: wrap the [start, end) text range with
// <ins> and/or insert the removed `text` as a <del> at start. Ranges may span
// several text nodes; each overlapped part is wrapped separately, so element
// boundaries are never crossed. Parts inside skipped elements (a/code/pre) are
// left untouched.
function applyPatch(root, patch) {
  if (patch.end > patch.start) {
    textNodesWithOffsets(root).forEach(({ node, start, end }) => {
      const from = Math.max(patch.start, start);
      const to = Math.min(patch.end, end);
      if (from >= to || isSkippedTextNode(node)) {
        return;
      }

      let target = node;
      if (from > start) {
        target = target.splitText(from - start);
      }
      if (to - from < target.data.length) {
        target.splitText(to - from);
      }

      const wrapper = createWrapper("ins", ADDED_INLINE_CLASS);
      target.parentNode.insertBefore(wrapper, target);
      wrapper.appendChild(target);
    });
  }

  if (!patch.text) {
    return;
  }

  const entries = textNodesWithOffsets(root);
  for (let i = 0; i < entries.length; i += 1) {
    const { node, start, end } = entries[i];
    if (end < patch.start) {
      continue;
    }
    // Do not annotate if either side of the insertion point is inside a
    // skipped element (a/code/pre).
    if (
      isSkippedTextNode(node) ||
      (end === patch.start && isSkippedTextNode(entries[i + 1]?.node))
    ) {
      return;
    }
    const target =
      patch.start > start ? node.splitText(patch.start - start) : node;
    const wrapper = createWrapper("del", REMOVED_INLINE_CLASS);
    wrapper.textContent = patch.text;
    // If the position is already wrapped by an inserted <ins>, put the <del>
    // right before it instead of nesting inside it.
    const insWrapper = target.parentElement?.closest(`ins[${DIFF_DATA_ATTR}]`);
    const anchor = insWrapper || target;
    anchor.parentNode.insertBefore(wrapper, anchor);
    return;
  }
}

// Annotate a matched (modified) block pair: word level diff for text changes,
// inline style comparison when only the formatting changed.
function annotateBlockPair(oldBlock, newBlock) {
  const clone = newBlock.node.cloneNode(true);
  const parts = diffWords(oldBlock.text, newBlock.text);

  if (parts.every((part) => !part.added && !part.removed)) {
    if (oldBlock.text === newBlock.text) {
      formatPatches(oldBlock, newBlock).forEach((patch) =>
        applyPatch(clone, patch),
      );
    }
    return clone;
  }

  let cursor = 0;

  parts.forEach((part) => {
    if (part.added) {
      applyPatch(clone, { start: cursor, end: cursor + part.value.length });
      cursor += part.value.length;
    } else if (part.removed) {
      applyPatch(clone, { start: cursor, text: part.value });
    } else {
      cursor += part.value.length;
    }
  });

  return clone;
}

// Whole block annotation for added / removed blocks.
function wrapBlock(block, type) {
  const wrapper = createWrapper(
    type,
    type === "ins" ? ADDED_BLOCK_CLASS : REMOVED_BLOCK_CLASS,
  );
  wrapper.appendChild(block.node.cloneNode(true));
  return wrapper;
}

/**
 * Diff two html content versions and return an annotated html string: block
 * level alignment first, then word level (or formatting) annotation inside the
 * matched block pairs.
 *
 * @param {string} previousHtml
 * @param {string} html
 * @returns {string}
 */
export function buildDiffHtml(previousHtml, html) {
  const oldBlocks = collectBlocks(parseHtmlToContainer(previousHtml));
  const newBlocks = collectBlocks(parseHtmlToContainer(html));

  const parts = diffArrays(
    oldBlocks.map((block) => block.key),
    newBlocks.map((block) => block.key),
  );

  const output = document.createElement("div");
  let oldCursor = 0;
  let newCursor = 0;
  let index = 0;

  while (index < parts.length) {
    const part = parts[index];

    if (part.removed) {
      const removedBlocks = oldBlocks.slice(
        oldCursor,
        oldCursor + part.value.length,
      );
      oldCursor += part.value.length;

      const nextPart = parts[index + 1];
      if (nextPart?.added) {
        const addedBlocks = newBlocks.slice(
          newCursor,
          newCursor + nextPart.value.length,
        );
        newCursor += nextPart.value.length;

        // Adjacent removed/added blocks with the same tag are treated as a
        // modified pair and diffed word by word. `pre` blocks are always
        // rendered as whole removed/added blocks.
        const pairCount = Math.min(removedBlocks.length, addedBlocks.length);
        let paired = 0;
        while (
          paired < pairCount &&
          removedBlocks[paired].tag === addedBlocks[paired].tag &&
          removedBlocks[paired].tag !== "pre"
        ) {
          output.appendChild(
            annotateBlockPair(removedBlocks[paired], addedBlocks[paired]),
          );
          paired += 1;
        }
        removedBlocks
          .slice(paired)
          .forEach((block) => output.appendChild(wrapBlock(block, "del")));
        addedBlocks
          .slice(paired)
          .forEach((block) => output.appendChild(wrapBlock(block, "ins")));

        index += 2;
        continue;
      }

      removedBlocks.forEach((block) =>
        output.appendChild(wrapBlock(block, "del")),
      );
      index += 1;
      continue;
    }

    if (part.added) {
      const addedBlocks = newBlocks.slice(
        newCursor,
        newCursor + part.value.length,
      );
      newCursor += part.value.length;
      addedBlocks.forEach((block) =>
        output.appendChild(wrapBlock(block, "ins")),
      );
      index += 1;
      continue;
    }

    // Unchanged blocks are rendered as is.
    for (let i = 0; i < part.value.length; i += 1) {
      const block = newBlocks[newCursor];
      if (block) {
        output.appendChild(block.node.cloneNode(true));
      }
      oldCursor += 1;
      newCursor += 1;
    }
    index += 1;
  }

  return output.innerHTML;
}
