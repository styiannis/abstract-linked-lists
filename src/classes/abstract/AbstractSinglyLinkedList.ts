import { AbstractLinkedList } from './AbstractLinkedList';
import { AbstractSinglyLinkedListNode } from './AbstractSinglyLinkedListNode';

/**
 * Abstract base class for singly linked list implementations.
 *
 * Defines the contract for forward-only linked structures with head-to-tail traversal.
 *
 * Extends `AbstractLinkedList` with specialized behavior for singly linked nodes.
 *
 * @template N - The type of nodes in the list, must extend `AbstractSinglyLinkedListNode`.
 * @example
 * ```typescript
 * class MySinglyLinkedList extends AbstractSinglyLinkedList {
 *  // Implement abstract methods
 * }
 * ```
 */
export abstract class AbstractSinglyLinkedList<
  N extends AbstractSinglyLinkedListNode = AbstractSinglyLinkedListNode
> extends AbstractLinkedList<N> {}
