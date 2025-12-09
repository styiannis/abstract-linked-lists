import { IDoublyLinkedList } from '../../types';

/**
 * Creates a new doubly linked list instance.
 *
 * @typeParam L - The type of the list.
 * @returns A new doubly linked list instance.
 */
export function create<L extends IDoublyLinkedList>() {
  return { size: 0, head: null, tail: null } as L;
}

/**
 * Clears a doubly linked list by removing all nodes.
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 */
export function clear<L extends IDoublyLinkedList>(instance: L) {
  instance.size = 0;
  instance.head = null;
  instance.tail = null;
}

/**
 * Retrieves the node at the specified index in a doubly linked list.
 *
 * Optimizes traversal by starting from `head` or `tail` based on `index` position.
 *
 * - Time Complexity: `O(min(index, n - index))` - traverses from nearest end.
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param index - The zero-based `index` of the node to retrieve.
 * @returns The node at the specified `index`, or `undefined` if the `index` is out of bounds.
 */
export function nodeAt<L extends IDoublyLinkedList>(
  instance: L,
  index: number
) {
  if (0 > index || instance.size - 1 < index) {
    return undefined;
  }

  if (index < instance.size - 1 - index) {
    let node = instance.head as NonNullable<L['head']>;

    for (let i = 0; i < index && node.next; i++) {
      node = node.next;
    }

    return node;
  }

  let node = instance.tail as NonNullable<L['head']>;

  for (let i = instance.size - 1; node.previous && i > index; i--) {
    node = node.previous;
  }

  return node;
}

/**
 * Removes and returns the last node from a doubly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @returns The removed node, or `undefined` if the list is empty.
 */
export function popNode<L extends IDoublyLinkedList>(instance: L) {
  if (!instance.tail) {
    return;
  }

  const last: NonNullable<L['head']> = instance.tail;
  const previous: L['head'] = last.previous;

  if (previous) {
    last.previous = null;
    previous.next = null;
    instance.tail = previous;
  } else {
    instance.head = null;
    instance.tail = null;
  }

  instance.size--;

  return last;
}

/**
 * Adds a node to the end of a doubly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param node - The node to add.
 */
export function pushNode<L extends IDoublyLinkedList>(
  instance: L,
  node: NonNullable<L['head']>
) {
  if (instance.tail) {
    node.previous = instance.tail;
    instance.tail.next = node;
    instance.tail = node;
  } else {
    instance.head = node;
    instance.tail = node;
  }

  instance.size++;
}

/**
 * Removes and returns the first node from a doubly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @returns The removed node, or `undefined` if the list is empty.
 */
export function shiftNode<L extends IDoublyLinkedList>(instance: L) {
  if (!instance.head) {
    return;
  }

  const first: NonNullable<L['head']> = instance.head;
  const second: L['head'] = first.next;

  if (second) {
    first.next = null;
    second.previous = null;
    instance.head = second;
  } else {
    instance.head = null;
    instance.tail = null;
  }

  instance.size--;

  return first;
}

/**
 * Adds a node to the beginning of a doubly linked list.
 *
 * - Time Complexity: `O(1)`
 * - Space Complexity: `O(1)`
 *
 * @typeParam L - The type of the list.
 * @param instance - The list instance.
 * @param node - The node to add.
 */
export function unshiftNode<L extends IDoublyLinkedList>(
  instance: L,
  node: NonNullable<L['head']>
) {
  if (instance.head) {
    node.next = instance.head;
    instance.head.previous = node;
    instance.head = node;
  } else {
    instance.head = node;
    instance.tail = node;
  }

  instance.size++;
}
