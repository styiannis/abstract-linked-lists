import { ISinglyLinkedList } from '../../types';
import { detach } from './node';

/**
 * Creates a new singly linked list instance.
 *
 * @typeParam L - The type of the list.
 * @returns A new singly linked list instance.
 */
export function create<L extends ISinglyLinkedList>() {
  return { size: 0, head: null, tail: null } as L;
}

/**
 * Clears a singly linked list by removing all nodes.
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 */
export function clear<L extends ISinglyLinkedList>(instance: L) {
  instance.size = 0;
  instance.head = null;
  instance.tail = null;
}

/**
 * Retrieves the node at the specified index in a singly linked list.
 *
 * - Time Complexity: `O(n)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param index - The zero-based `index` of the node to retrieve.
 * @returns The node at the specified `index`, or `undefined` if the `index` is out of bounds.
 */
export function nodeAt<L extends ISinglyLinkedList>(
  instance: L,
  index: number
) {
  if (0 > index || instance.size - 1 < index) {
    return undefined;
  }

  let node = instance.head as NonNullable<L['head']>;

  for (let i = 0; i < index && node.next; i++) {
    node = node.next;
  }

  return node;
}

/**
 * Removes and returns the last node from a singly linked list.
 *
 * - Time Complexity: `O(n)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @returns The removed node, or `undefined` if the list is empty.
 */
export function popNode<L extends ISinglyLinkedList>(instance: L) {
  if (!instance.head) {
    return;
  }

  let last: NonNullable<L['head']> = instance.head;
  let previous: L['head'] = null;

  while (last.next) {
    previous = last;
    last = last.next;
  }

  if (previous) {
    previous.next = null;
    instance.tail = previous;
  } else {
    instance.head = null;
    instance.tail = null;
  }

  instance.size -= 1;

  return last;
}

/**
 * Adds a node to the end of a singly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param node - The node to add.
 */
export function pushNode<L extends ISinglyLinkedList>(
  instance: L,
  node: NonNullable<L['head']>
) {
  if (instance.tail) {
    instance.tail.next = node;
    instance.tail = node;
  } else {
    instance.head = node;
    instance.tail = node;
  }

  instance.size += 1;
}

/**
 * Removes a specific node from a singly linked list.
 *
 * The caller must already hold references to both the `node` and its
 * `previous` node, since a singly linked list cannot look either up on its
 * own without an `O(n)` traversal from `head`.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param node - The node to remove.
 * @param previous - The node preceding `node`, or `null` if `node` is the `head`.
 */
export function removeNode<L extends ISinglyLinkedList>(
  instance: L,
  node: NonNullable<L['head']>,
  previous: L['head']
) {
  if (!instance.head) {
    return;
  }

  if (node === instance.head) {
    instance.head = node.next;
  }

  if (node === instance.tail) {
    instance.tail = previous;
  }

  detach(node, previous);

  instance.size -= 1;
}

/**
 * Removes and returns the first node from a singly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @returns The removed node, or `undefined` if the list is empty.
 */
export function shiftNode<L extends ISinglyLinkedList>(instance: L) {
  if (!instance.head) {
    return;
  }

  const first: NonNullable<L['head']> = instance.head;

  if (first.next) {
    instance.head = first.next;
    first.next = null;
  } else {
    instance.head = null;
    instance.tail = null;
  }

  instance.size -= 1;

  return first;
}

/**
 * Adds a node to the beginning of a singly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param node - The node to add.
 */
export function unshiftNode<L extends ISinglyLinkedList>(
  instance: L,
  node: NonNullable<L['head']>
) {
  if (instance.head) {
    node.next = instance.head;
    instance.head = node;
  } else {
    instance.head = node;
    instance.tail = node;
  }

  instance.size += 1;
}
