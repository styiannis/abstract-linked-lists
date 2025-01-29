function areIdenticalArrays(a: any[], b: any[]) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

export function isValidObjectInstance(
  instance: unknown,
  instanceType: 'singly-linked-list' | 'singly-linked-list-node'
) {
  if (
    'object' !== typeof instance ||
    Object.getPrototypeOf(instance) !== Object.prototype
  ) {
    return false;
  }

  // Own property names (sorted).
  const props = Object.getOwnPropertyNames(instance).sort();

  if ('singly-linked-list-node' === instanceType) {
    return areIdenticalArrays(props, ['next']);
  }

  if ('singly-linked-list' === instanceType) {
    return areIdenticalArrays(props, ['head', 'size', 'tail']);
  }

  return false;
}
