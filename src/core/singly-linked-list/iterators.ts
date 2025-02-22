import { ISinglyLinkedListNode } from '../../types';

/**
 * Generates an iterator that traverses a singly linked list in order.
 *
 * Time Complexity (complete traversal): `O(n)`, where `n` is the number of nodes in the list.
 * Space Complexity: `O(1)`
 *
 * @typeParam N - The type of the singly linked list node.
 * @param head - The `head` node of the list, or `null` if the list is empty.
 * @returns A generator that yields nodes in order.
 */
export function* inOrder<N extends ISinglyLinkedListNode>(head: N | null) {
  let node: N | null = head;
  while (node) {
    yield node;
    node = node.next as N | null;
  }
}

/**
 * Generates an iterator that traverses a singly linked list in reverse order.
 *
 * Time Complexity (complete traversal): `O(n)`, where `n` is the number of nodes in the list.
 * Space Complexity: `O(n)`
 *
 * @typeParam N - The type of the singly linked list node.
 * @param head - The `head` node of the list, or `null` if the list is empty.
 * @returns A generator that yields nodes in reverse order.
 */
export function* inReverseOrder<N extends ISinglyLinkedListNode>(
  head: N | null
) {
  const stack: N[] = [];

  let node: N | null = head;
  while (node) {
    stack.push(node);
    node = node.next as N | null;
  }

  for (let node = stack.pop(); node; node = stack.pop()) {
    yield node;
  }
}
