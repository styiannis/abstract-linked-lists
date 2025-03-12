import { detach } from '../core/doubly-linked-list/node';
import { IDoublyLinkedListNode } from '../types';
import { AbstractDoublyLinkedListNode } from './abstract';

/**
 * Concrete implementation of a doubly linked list node.
 *
 * Provides bidirectional node linking capabilities.
 *
 * @example
 * ```typescript
 * // Create nodes and link them
 * const node1 = new DoublyLinkedListNode();
 * const node2 = new DoublyLinkedListNode();
 * const node3 = new DoublyLinkedListNode();
 *
 * // Connect nodes bidirectionally
 * node1.next = node2;
 * node2.previous = node1;
 * node2.next = node3;
 * node3.previous = node2;
 * ```
 */
export class DoublyLinkedListNode
  extends AbstractDoublyLinkedListNode
  implements IDoublyLinkedListNode
{
  /**
   * Creates a new `DoublyLinkedListNode` instance.
   *
   * @param [previous=null] - The previous node, or `null` if the node has no previous connection.
   * @param [next=null] - The next node, or `null` if the node has no next connection.
   * @example
   * ```typescript
   * // Create an isolated node
   * const node = new DoublyLinkedListNode();
   * ```
   * ```typescript
   * // Create a node with connections
   * const prev = new DoublyLinkedListNode();
   * const next = new DoublyLinkedListNode();
   * const node = new DoublyLinkedListNode(prev, next);
   * // Result: prev <-> node <-> next
   * ```
   */
  constructor(
    public previous: DoublyLinkedListNode | null = null,
    public next: DoublyLinkedListNode | null = null
  ) {
    super();

    if (previous) {
      previous.next = this;
    }

    if (next) {
      next.previous = this;
    }
  }

  /**
   * Detaches the node from its adjacent nodes and sets its pointers to `null`.
   * Updates the connections of adjacent nodes to maintain list integrity.
   *
   * @example
   * ```typescript
   * // Create a chain of nodes
   * const node1 = new DoublyLinkedListNode();
   * const node2 = new DoublyLinkedListNode(node1);
   * const node3 = new DoublyLinkedListNode(node2);
   *
   * // Detach node2 from the chain
   * node2.detach();
   * // Result:
   * // node1 <-> node3
   * // node2.previous === null
   * // node2.next === null
   * ```
   */
  detach() {
    return detach(this);
  }
}
