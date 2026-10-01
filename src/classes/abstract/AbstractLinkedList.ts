/**
 * Core abstract base class for all linked list implementations.
 *
 * Defines the fundamental contract that all linked lists must fulfill,
 * providing a unified interface for basic list operations.
 *
 * @template N - The type of the nodes in the list.
 * @example
 * ```typescript
 * class MyLinkedList extends AbstractLinkedList {
 *  // Implement abstract methods
 * }
 * ```
 */
export abstract class AbstractLinkedList<N> {
  /**
   * Returns an iterator for traversing the list.
   * Supports both forward and reverse traversal.
   *
   * @param reversed - If `true`, the iterator will traverse the list in reverse order.
   * @returns An iterator yielding nodes in the specified orders.
   */
  abstract [Symbol.iterator](reversed: boolean): Generator<N, void, void>;

  /**
   * Resets the list to its initial empty state.
   */
  abstract clear(): void;

  /**
   * Retrieves the node at the specified index.
   *
   * @param index - The zero-based `index` of the node to retrieve.
   * @returns The node at the specified `index`, or `undefined` if the `index` is out of bounds.
   */
  abstract nodeAt(index: number): N | undefined;

  /**
   * Adds a node to the end of the list.
   *
   * @param node - The node to add.
   */
  abstract pushNode(node: N): void;

  /**
   * Adds a node to the beginning of the list.
   *
   * @param node - The node to add.
   */
  abstract unshiftNode(node: N): void;

  /**
   * Removes and returns the last list node.
   *
   * @returns The removed node, or `undefined` if the list is empty.
   */
  abstract popNode(): N | undefined;

  /**
   * Removes and returns the first list node.
   *
   * @returns The removed node, or `undefined` if the list is empty.
   */
  abstract shiftNode(): N | undefined;
}
