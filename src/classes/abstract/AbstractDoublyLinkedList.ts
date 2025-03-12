import { AbstractDoublyLinkedListNode } from './AbstractDoublyLinkedListNode';
import { AbstractLinkedList } from './AbstractLinkedList';

/**
 * Abstract base class for doubly linked list implementations.
 *
 * Defines the contract for bidirectional linked structures that allow traversal in both directions.
 *
 * Extends `AbstractLinkedList` with specialized behavior for doubly linked nodes.
 *
 * @template N - The type of nodes in the list, must extend `AbstractDoublyLinkedListNode`.
 *
 * @example
 * ```typescript
 * class MyDoublyLinkedList extends AbstractDoublyLinkedList {
 *  // Implement abstract methods
 * }
 * ```
 */
export abstract class AbstractDoublyLinkedList<
  N extends AbstractDoublyLinkedListNode = AbstractDoublyLinkedListNode
> extends AbstractLinkedList<N> {}
