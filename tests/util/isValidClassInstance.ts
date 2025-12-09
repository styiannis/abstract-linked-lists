import {
  AbstractDoublyLinkedList,
  AbstractDoublyLinkedListNode,
  AbstractSinglyLinkedList,
  AbstractSinglyLinkedListNode,
  DoublyLinkedList,
  DoublyLinkedListNode,
  SinglyLinkedList,
  SinglyLinkedListNode,
} from '../../src';
import { areIdenticalArrays } from './areIdenticalArrays';

function isValidListClassInstance(
  instance: unknown,
  instanceType: 'SinglyLinkedList' | 'DoublyLinkedList'
) {
  const props = Object.getOwnPropertyNames(instance).sort();
  const proto = Object.getPrototypeOf(instance);
  const protoProps = Object.getOwnPropertyNames(proto).sort();

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
      proto === SinglyLinkedList.prototype &&
      proto !== AbstractSinglyLinkedList.prototype &&
      areIdenticalArrays(props, expectedProps) &&
      areIdenticalArrays(protoProps, expectedProtoProps)
    );
  }

  return (
    instance instanceof DoublyLinkedList &&
    instance instanceof AbstractDoublyLinkedList &&
    proto === DoublyLinkedList.prototype &&
    proto !== AbstractDoublyLinkedList.prototype &&
    areIdenticalArrays(props, expectedProps) &&
    areIdenticalArrays(protoProps, expectedProtoProps)
  );
}

function isValidNodeClassInstance(
  instance: unknown,
  instanceType: 'SinglyLinkedListNode' | 'DoublyLinkedListNode'
) {
  const props = Object.getOwnPropertyNames(instance).sort();
  const proto = Object.getPrototypeOf(instance);
  const protoProps = Object.getOwnPropertyNames(proto).sort();

  const expectedProtoProps = ['constructor', 'detach'];

  if ('SinglyLinkedListNode' === instanceType) {
    return (
      instance instanceof SinglyLinkedListNode &&
      instance instanceof AbstractSinglyLinkedListNode &&
      proto === SinglyLinkedListNode.prototype &&
      proto !== AbstractSinglyLinkedListNode.prototype &&
      areIdenticalArrays(props, ['next']) &&
      areIdenticalArrays(protoProps, expectedProtoProps)
    );
  }

  return (
    instance instanceof DoublyLinkedListNode &&
    instance instanceof AbstractDoublyLinkedListNode &&
    proto === DoublyLinkedListNode.prototype &&
    proto !== AbstractDoublyLinkedListNode.prototype &&
    areIdenticalArrays(props, ['next', 'previous']) &&
    areIdenticalArrays(protoProps, expectedProtoProps)
  );
}

export const isValidClassInstance = (
  instance: unknown,
  instanceType:
    | 'SinglyLinkedList'
    | 'SinglyLinkedListNode'
    | 'DoublyLinkedList'
    | 'DoublyLinkedListNode'
) =>
  'object' === typeof instance &&
  ('SinglyLinkedList' === instanceType || 'DoublyLinkedList' === instanceType
    ? isValidListClassInstance(instance, instanceType)
    : isValidNodeClassInstance(instance, instanceType));
