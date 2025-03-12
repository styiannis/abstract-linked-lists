import { inOrder as singlyLinkedListInOrder } from '../singly-linked-list/iterators';
import { IDoublyLinkedListNode } from '../../types';

/**
 * Generates an iterator that traverses a doubly linked list in order (head to tail).
 *
 * Reuses the singly linked list implementation since forward traversal is identical.
 *
 * - Time Complexity (complete traversal): `O(n)`
 * - Space Complexity: `O(1)` - only stores current node reference.
 *
 * @typeParam N - The type of the doubly linked list node.
 * @param head - The `head` node of the list, or `null` if the list is empty.
 * @returns  An iterator yielding nodes in forward order.
 */
export function inOrder<N extends IDoublyLinkedListNode>(head: N | null) {
  return singlyLinkedListInOrder(head);
}

/**
 * Generates an iterator that traverses a doubly linked list in reverse order (tail to head).
 *
 * Takes advantage of previous pointers for direct backward traversal, unlike singly linked lists.
 *
 * - Time Complexity (complete traversal): `O(n)`
 * - Space Complexity: `O(1)`- only stores current node reference.
 *
 * @typeParam N - The type of the doubly linked list node.
 * @param tail - The `tail` node of the list, or `null` if the list is empty.
 * @returns  An iterator yielding nodes in reverse order.
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
