/**
 * An abstract class representing a singly linked list node.
 * Defines the minimum interface that concrete singly linked list nodes must implement.
 */
export abstract class AbstractSinglyLinkedListNode {
  /**
   * Detaches the node by updating the `next` reference of the previous node.
   *
   * @param previous - The previous node, or `null` if the node has no previous connection.
   */
  abstract detach(previous: typeof this | null): void;
}
