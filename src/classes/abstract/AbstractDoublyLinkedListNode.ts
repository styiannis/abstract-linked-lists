/**
 * An abstract class representing a doubly linked list node.
 */
export abstract class AbstractDoublyLinkedListNode {
  /**
   * Detaches the node from its adjacent nodes and sets its pointers to `null`.
   */
  abstract detach(): void;
}
