import { IDoublyLinkedListNode } from '../../types';

/**
 * Creates a new doubly linked list node instance.
 *
 * @typeParam N - The type of the node.
 * @param [previous=null] - The previous node, or `null` if the node has no previous connection.
 * @param [next=null] - The next node, or `null` if the node has no next connection.
 */
export function create<N extends IDoublyLinkedListNode>(
  previous: N['previous'] = null,
  next: N['next'] = null
) {
  const instance = { previous, next } as N;

  if (previous) {
    previous.next = instance;
  }

  if (next) {
    next.previous = instance;
  }

  return instance;
}

/**
 * Detaches the node from its adjacent nodes.
 *
 * @typeParam N - The type of the node.
 * @param instance - The node instance to be detached.
 */
export function detach<N extends IDoublyLinkedListNode>(instance: N) {
  if (instance.previous) {
    instance.previous.next = instance.next;
  }

  if (instance.next) {
    instance.next.previous = instance.previous;
  }

  instance.next = null;
  instance.previous = null;
}
