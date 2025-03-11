/**
 * Base interface representing a singly linked list node.
 * Defines the minimal structure required for singly linked list operations.
 */
export interface ISinglyLinkedListNode {
  /**
   * Reference to the next node in the list.
   * Set to `null` if this is the last node or detached from the list.
   */
  next: ISinglyLinkedListNode | null;
}

/**
 * Base interface representing a doubly linked list node.
 * Extends the concept of linked nodes by maintaining references to both next and previous nodes.
 */
export interface IDoublyLinkedListNode {
  /**
   * Reference to the next node in the list.
   * Set to `null` if this is the last node or detached from the list.
   */
  next: IDoublyLinkedListNode | null;
  /**
   * Reference to the previous node in the list.
   * Set to `null` if this is the first node or detached from the list.
   */
  previous: IDoublyLinkedListNode | null;
}

/**
 * Base interface for all linked list implementations.
 * Provides the common structure and properties shared by both singly and doubly linked lists.
 *
 * @typeParam N - The type of nodes contained in the list.
 */
export interface ILinkedList<N> {
  /**
   * The current number of nodes in the list.
   * Automatically updated when nodes are added or removed.
   */
  size: number;
  /**
   * Reference to the first node in the list.
   * Set to `null` when the list is empty.
   */
  head: N | null;
  /**
   * Reference to the last node in the list.
   * Set to `null` when the list is empty.
   */
  tail: N | null;
}

/**
 * Interface representing a singly linked list data structure.
 * Implements the base linked list interface with singly linked nodes.
 *
 * @typeParam N - The type of nodes in the list, must extend `ISinglyLinkedListNode`.
 *                Defaults to the base `ISinglyLinkedListNode` if not specified.
 */
export interface ISinglyLinkedList<
  N extends ISinglyLinkedListNode = ISinglyLinkedListNode
> extends ILinkedList<N> {}

/**
 * Interface representing a doubly linked list data structure.
 * Implements the base linked list interface with doubly linked nodes.
 *
 * @typeParam N - The type of nodes in the list, must extend `IDoublyLinkedListNode`.
 *                Defaults to the base `IDoublyLinkedListNode` if not specified.
 */
export interface IDoublyLinkedList<
  N extends IDoublyLinkedListNode = IDoublyLinkedListNode
> extends ILinkedList<N> {}
