import { detach } from '../core/singly-linked-list/node';
import { ISinglyLinkedListNode } from '../types';
import { AbstractSinglyLinkedListNode } from './abstract';

/**
 * Concrete implementation of a singly linked list node.
 *
 * Provides forward-only node linking capabilities.
 *
 * @example
 * ```typescript
 * // Create nodes and link them
 * const node1 = new SinglyLinkedListNode();
 * const node2 = new SinglyLinkedListNode();
 * const node3 = new SinglyLinkedListNode();
 *
 * node1.next = node2;
 * node2.next = node3;
 * ```
 */
export class SinglyLinkedListNode
  extends AbstractSinglyLinkedListNode
  implements ISinglyLinkedListNode
{
  /**
   * Creates a new `SinglyLinkedListNode` instance.
   *
   * @param [next=null] - The next node, or `null` if the node has no next connection.
   * @example
   * ```typescript
   * // Create an isolated node
   * const node = new SinglyLinkedListNode();
   * ```
   * ```typescript
   * // Create a node connected to an existing one
   * const next = new SinglyLinkedListNode();
   * const node = new SinglyLinkedListNode(next);
   * // Result: node -> next
   * ```
   */
  constructor(public next: SinglyLinkedListNode | null = null) {
    super();
  }

  /**
   * Detaches the node by updating the `next` reference of the previous node.
   * After detachment, the node's `next` pointer is set to `null`.
   *
   * @param previous - The previous node, or `null` if the node has no previous connection.
   * @example
   * ```typescript
   * // Create a chain of nodes
   * const node1 = new SinglyLinkedListNode();
   * const node2 = new SinglyLinkedListNode();
   * const node3 = new SinglyLinkedListNode();
   *
   * node1.next = node2;
   * node2.next = node3;
   *
   * // Detach node2 from the chain
   * node2.detach(node1);
   * // Result:
   * // node1 -> node3
   * // node2.next === null
   * ```
   */
  detach(previous: SinglyLinkedListNode | null) {
    return detach(this, previous);
  }
}
