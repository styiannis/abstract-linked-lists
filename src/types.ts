/**
 * An interface representing a singly linked list node.
 */
export interface ISinglyLinkedListNode {
  /**
   * The next node in the list, or `null` if the node has no next connection.
   */
  next: ISinglyLinkedListNode | null;
}

/**
 * An interface representing a generic linked list.
 *
 * @typeParam N - The type of nodes in the list.
 */
export interface ILinkedList<N> {
  /**
   * The number of nodes in the list.
   */
  size: number;
  /**
   * The first node in the list, or `null` if the list is empty.
   */
  head: N | null;
  /**
   * The last node in the list, or `null` if the list is empty.
   */
  tail: N | null;
}

/**
 * An interface representing a singly linked list.
 *
 * @typeParam N - The type of nodes in the singly linked list.
 */
export interface ISinglyLinkedList<
  N extends ISinglyLinkedListNode = ISinglyLinkedListNode
> extends ILinkedList<N> {}
