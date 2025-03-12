/**
 * Abstract base class for singly linked list nodes.
 *
 * Defines the contract for forward-only node implementations that maintain
 * a single reference to the next node in the sequence.
 *
 * @example
 * ```typescript
 * class MySinglyLinkedListNode extends AbstractSinglyLinkedListNode {
 *  // Implement abstract methods
 * }
 * ```
 */
export abstract class AbstractSinglyLinkedListNode {
  /**
   * Detaches the node by updating the `next` reference of the previous node.
   *
   * @param previous - The previous node, or `null` if the node has no previous connection.
   */
  abstract detach(previous: typeof this | null): void;
}
