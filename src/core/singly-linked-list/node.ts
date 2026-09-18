import { ISinglyLinkedListNode } from '../../types';

/**
 * Creates a new singly linked list node instance.
 *
 * If provided, automatically connects the node with its next node.
 *
 * @typeParam N - The type of the node.
 * @param [next=null] - The next node, or `null` if the node has no next connection.
 * @returns A new singly linked list node instance with the specified next connection.
 */
export function create<N extends ISinglyLinkedListNode>(
  next: N['next'] = null
) {
  return { next } as N;
}

/**
 * Detaches the node by updating the `next` reference of its predecessor.
 *
 * After detachment, the node's `next` pointer is set to `null`. If
 * `predecessor` does not precede `instance`, nothing is changed.
 *
 * @typeParam N - The type of the node.
 * @param instance - The node instance to be detached.
 * @param predecessor - The preceding node, or `null` if the node has no predecessor.
 */
export function detach<N extends ISinglyLinkedListNode>(
  instance: N,
  predecessor: N | null
) {
  if (predecessor) {
    if (predecessor.next !== instance) {
      return;
    }

    predecessor.next = instance.next;
  }

  instance.next = null;
}
