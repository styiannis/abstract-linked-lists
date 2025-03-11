/**
 * An abstract class representing a doubly linked list node.
 * Defines the minimum interface that concrete doubly linked list nodes must implement.
 */
export abstract class AbstractDoublyLinkedListNode {
  /**
   * Detaches the node from its adjacent nodes and sets its pointers to `null`.
   */
  abstract detach(): void;
}
