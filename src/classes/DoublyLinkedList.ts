import { inOrder, inReverseOrder } from '../core/doubly-linked-list/iterators';
import {
  clear,
  nodeAt,
  popNode,
  pushNode,
  shiftNode,
  unshiftNode,
} from '../core/doubly-linked-list/list';
import { IDoublyLinkedList } from '../types';
import { AbstractDoublyLinkedList } from './abstract';
import { DoublyLinkedListNode } from './DoublyLinkedListNode';

/**
 * Concrete implementation of a doubly linked list.
 *
 * Key characteristics:
 * - Bidirectional structure with head/tail tracking
 * - Direct access to previous/next nodes
 * - Efficient operations at both ends
 *
 * Performance:
 * - Head/tail operations: `O(1)`
 * - Bidirectional traversal: `O(n)`
 * - Random access: `O(min(k,n-k))`
 * - Node deletion: `O(1)` with direct reference
 *
 * @template N - The node type, extends `DoublyLinkedListNode`.
 * @example
 * ```typescript
 * // Create a new doubly linked list
 * const list = new DoublyLinkedList();
 *
 * // Add nodes to the list
 * const node1 = new DoublyLinkedListNode();
 * const node2 = new DoublyLinkedListNode();
 *
 * list.pushNode(node1);
 * list.pushNode(node2);
 *
 * // Traverse the list
 * for (const node of list) {
 *   console.log(node);
 * }
 * ```
 */
export class DoublyLinkedList<
    N extends DoublyLinkedListNode = DoublyLinkedListNode
  >
  extends AbstractDoublyLinkedList<N>
  implements IDoublyLinkedList<N>
{
  /**
   * The number of nodes in the list.
   */
  size: number = 0;

  /**
   * The first node in the list, or `null` if empty.
   */
  head: N | null = null;

  /**
   * The last node in the list, or `null` if empty.
   */
  tail: N | null = null;

  /**
   * Returns an iterator for traversing the list.
   *
   * @param [reversed=false] - If `true`, the iterator will traverse the list in reverse order.
   * @returns An iterator yielding nodes in the specified order.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * // Add nodes to the list
   * list.pushNode(new DoublyLinkedListNode());
   * list.pushNode(new DoublyLinkedListNode());
   *
   * // Forward iteration
   * for (const node of list) {
   *   console.log(node);
   * }
   *
   * // Reverse iteration
   * for (const node of list[Symbol.iterator](true)) {
   *   console.log(node);
   * }
   * ```
   */
  *[Symbol.iterator](reversed: boolean = false) {
    for (const node of reversed
      ? inReverseOrder(this.tail)
      : inOrder(this.head)) {
      yield node;
    }
  }

  /**
   * Resets the list to its initial empty state.
   *
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * list.pushNode(new DoublyLinkedListNode());
   * console.log(list.size); // 1
   *
   * list.clear();
   * console.log(list.size); // 0
   * ```
   */
  clear() {
    return clear(this);
  }

  /**
   * Retrieves the node at the specified index.
   *
   * @param index - The zero-based `index` of the node to retrieve.
   * @returns The node at the specified `index`, or `undefined` if the `index` is out of bounds.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   * const node = new DoublyLinkedListNode();
   *
   * list.pushNode(node);
   *
   * console.log(list.nodeAt(0) === node); // true
   * console.log(list.nodeAt(99)); // undefined
   * ```
   */
  nodeAt(index: number) {
    return nodeAt(this, index);
  }

  /**
   * Adds a node to the end of the list.
   *
   * @param node - The node to add.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * const node1 = new DoublyLinkedListNode();
   * const node2 = new DoublyLinkedListNode();
   *
   * list.pushNode(node1);
   * list.pushNode(node2);
   *
   * console.log(list.head === node1); // true
   * console.log(list.tail === node2); // true
   * ```
   */
  pushNode(node: N) {
    return pushNode(this, node);
  }

  /**
   * Adds a node to the beginning of the list.
   *
   * @param node - The node to add.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * const node1 = new DoublyLinkedListNode();
   * const node2 = new DoublyLinkedListNode();
   *
   * list.unshiftNode(node1);
   * list.unshiftNode(node2);
   *
   * console.log(list.head === node2); // true
   * console.log(list.tail === node1); // true
   * ```
   */
  unshiftNode(node: N) {
    return unshiftNode(this, node);
  }

  /**
   * Removes and returns the last node of the list.
   *
   * @returns The removed node, or `undefined` if the list was empty.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * const node1 = new DoublyLinkedListNode();
   * const node2 = new DoublyLinkedListNode();
   *
   * list.pushNode(node1);
   * list.pushNode(node2);
   *
   * console.log(list.popNode() === node2); // true
   * console.log(list.popNode() === node1); // true
   * console.log(list.size); // 0
   * ```
   */
  popNode() {
    return popNode(this);
  }

  /**
   * Removes and returns the first node of the list.
   *
   * @returns The removed node, or `undefined` if the list was empty.
   * @example
   * ```typescript
   * const list = new DoublyLinkedList();
   *
   * const node1 = new DoublyLinkedListNode();
   * const node2 = new DoublyLinkedListNode();
   *
   * list.pushNode(node1);
   * list.pushNode(node2);
   *
   * console.log(list.shiftNode() === node1); // true
   * console.log(list.shiftNode() === node2); // true
   * console.log(list.size); // 0
   * ```
   */
  shiftNode() {
    return shiftNode(this);
  }
}
