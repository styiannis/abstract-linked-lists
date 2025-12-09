import { areIdenticalArrays } from './areIdenticalArrays';

export function isValidObjectInstance(
  instance: unknown,
  instanceType:
    | 'singly-linked-list'
    | 'singly-linked-list-node'
    | 'doubly-linked-list'
    | 'doubly-linked-list-node'
) {
  if (
    'object' !== typeof instance ||
    Object.getPrototypeOf(instance) !== Object.prototype
  ) {
    return false;
  }

  const props = Object.getOwnPropertyNames(instance).sort();

  if ('singly-linked-list-node' === instanceType) {
    return areIdenticalArrays(props, ['next']);
  }

  if ('doubly-linked-list-node' === instanceType) {
    return areIdenticalArrays(props, ['next', 'previous']);
  }

  return areIdenticalArrays(props, ['head', 'size', 'tail']);
}
