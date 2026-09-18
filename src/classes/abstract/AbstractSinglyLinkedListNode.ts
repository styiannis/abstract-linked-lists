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
   * Detaches the node by updating the `next` reference of its predecessor.
   *
   * @param predecessor - The preceding node, or `null` if the node has no predecessor.
   */
  abstract detach(predecessor: AbstractSinglyLinkedListNode | null): void;
}
