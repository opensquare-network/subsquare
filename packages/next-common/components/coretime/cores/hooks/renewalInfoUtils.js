import { isNil } from "lodash-es";

function toNumberOrNull(value) {
  if (isNil(value)) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function buildAutoRenewalIndex(list = []) {
  const index = {};
  for (const item of list) {
    const core = toNumberOrNull(item?.core);
    if (isNil(core)) {
      continue;
    }
    index[core] = {
      core,
      task: toNumberOrNull(item?.task),
      nextRenewal: toNumberOrNull(item?.next_renewal ?? item?.nextRenewal),
    };
  }
  return index;
}

export function buildRenewalIndex(entries = [], when) {
  const index = {};
  const target = toNumberOrNull(when);
  if (isNil(target)) {
    return index;
  }

  for (const entry of entries) {
    const key = entry?.args?.[0];
    const record = entry?.value;
    if (!key || toNumberOrNull(key.when) !== target) {
      continue;
    }
    if (record?.completion?.type !== "Complete") {
      continue;
    }
    const core = toNumberOrNull(key.core);
    if (isNil(core)) {
      continue;
    }

    const taskIds = [
      ...new Set(
        (record.completion.value ?? [])
          .filter((item) => item?.assignment?.type === "Task")
          .map((item) => toNumberOrNull(item.assignment.value))
          .filter((task) => !isNil(task)),
      ),
    ];

    index[core] = {
      core,
      when: target,
      price: record?.price ?? null,
      taskIds,
    };
  }

  return index;
}
