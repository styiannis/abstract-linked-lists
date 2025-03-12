/**
 * Abstract base class for doubly linked list nodes.
 *
 * Defines the contract for bidirectional node implementations that maintain
 * references to both previous and next nodes in the sequence.
 *
 * @example
 * ```typescript
 * class MyDoublyLinkedListNode extends AbstractDoublyLinkedListNode {
 *  // Implement abstract methods
 * }
 * ```
 */
export abstract class AbstractDoublyLinkedListNode {
  /**
   * Detaches the node from its adjacent nodes and sets its pointers to `null`.
   */
  abstract detach(): void;
}
