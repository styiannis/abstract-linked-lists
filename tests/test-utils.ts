import {
  AbstractSinglyLinkedList,
  AbstractSinglyLinkedListNode,
  SinglyLinkedList,
  SinglyLinkedListNode,
} from '../src';

function areIdenticalArrays(a: any[], b: any[]) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

export function isValidClassInstance(
  instance: unknown,
  instanceType: 'SinglyLinkedList' | 'SinglyLinkedListNode'
) {
  if ('object' !== typeof instance) {
    return false;
  }

  // Own property names (sorted)
  const props = Object.getOwnPropertyNames(instance).sort();

  // Prototype property names (sorted)
  const protoProps = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  ).sort();

  if ('SinglyLinkedListNode' === instanceType) {
    const expectedProtoProps = ['constructor', 'detach'];

    if ('SinglyLinkedListNode' === instanceType) {
      return (
        instance instanceof SinglyLinkedListNode &&
        instance instanceof AbstractSinglyLinkedListNode &&
        Object.getPrototypeOf(instance) === SinglyLinkedListNode.prototype &&
        Object.getPrototypeOf(instance) !==
          AbstractSinglyLinkedListNode.prototype &&
        areIdenticalArrays(props, ['next']) &&
        areIdenticalArrays(protoProps, expectedProtoProps)
      );
    }
  }

  if (
    'SinglyLinkedList' === instanceType ||
    'DoublyLinkedList' === instanceType
  ) {
    const expectedProps = ['head', 'size', 'tail'];
    const expectedProtoProps = [
      'clear',
      'constructor',
      'nodeAt',
      'popNode',
      'pushNode',
      'shiftNode',
      'unshiftNode',
    ];

    if ('SinglyLinkedList' === instanceType) {
      return (
        instance instanceof SinglyLinkedList &&
        instance instanceof AbstractSinglyLinkedList &&
        Object.getPrototypeOf(instance) === SinglyLinkedList.prototype &&
        Object.getPrototypeOf(instance) !==
          AbstractSinglyLinkedList.prototype &&
        areIdenticalArrays(props, expectedProps) &&
        areIdenticalArrays(protoProps, expectedProtoProps)
      );
    }
  }

  return false;
}

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

  // Own property names (sorted).
  const props = Object.getOwnPropertyNames(instance).sort();

  if ('singly-linked-list-node' === instanceType) {
    return areIdenticalArrays(props, ['next']);
  }

  if ('doubly-linked-list-node' === instanceType) {
    return areIdenticalArrays(props, ['next', 'previous']);
  }

  if (
    'singly-linked-list' === instanceType ||
    'doubly-linked-list' === instanceType
  ) {
    return areIdenticalArrays(props, ['head', 'size', 'tail']);
  }

  return false;
}
