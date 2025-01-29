import { inOrder as singlyLinkedListInOrder } from '../singly-linked-list/iterators';
import { IDoublyLinkedListNode } from '../../types';

/**
 * Generates an iterator that traverses a doubly linked list in order.
 *
 * Time Complexity (complete traversal): `O(n)`, where `n` is the number of nodes in the list.
 * Space Complexity: `O(1)`
 *
 * @typeParam N - The type of the doubly linked list node.
 * @param head - The `head` node of the list, or `null` if the list is empty.
 * @returns A generator that yields nodes in order.
 */
export function inOrder<N extends IDoublyLinkedListNode>(head: N | null) {
  return singlyLinkedListInOrder(head);
}

/**
 * Generates an iterator that traverses a doubly linked list in reverse order.
 *
 * Time Complexity (complete traversal): `O(n)`, where `n` is the number of nodes in the list.
 * Space Complexity: `O(1)`
 *
 * @typeParam N - The type of the doubly linked list node.
 * @param tail - The `tail` node of the list, or `null` if the list is empty.
 * @returns A generator that yields nodes in reverse order.
 */
export function* inReverseOrder<N extends IDoublyLinkedListNode>(
  tail: N | null
) {
  let node: N | null = tail;
  while (node) {
    yield node;
    node = node.previous as N | null;
  }
}
