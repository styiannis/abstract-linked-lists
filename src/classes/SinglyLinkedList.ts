import { inOrder, inReverseOrder } from '../core/singly-linked-list/iterators';
import {
  clear,
  nodeAt,
  popNode,
  pushNode,
  shiftNode,
  unshiftNode,
} from '../core/singly-linked-list/list';
import { ISinglyLinkedList } from '../types';
import { AbstractSinglyLinkedList } from './abstract';
import { SinglyLinkedListNode } from './SinglyLinkedListNode';

/**
 * Concrete implementation of a singly linked list.
 *
 * Key characteristics:
 * - Forward-linked structure with head/tail tracking
 * - Memory efficient single directional links
 * - Supports both forward and reverse traversal
 *
 * Performance:
 * - Head operations: `O(1)`
 * - Tail operations: `O(n)`
 * - Forward traversal: `O(n)`
 * - Reverse traversal: `O(n)` time and space
 * - Random access: `O(n)`
 *
 * @template N - The node type, extends `SinglyLinkedListNode`.
 * @example
 * ```typescript
 * // Create a new singly linked list
 * const list = new SinglyLinkedList();
 *
 * // Add nodes to the list
 * const node1 = new SinglyLinkedListNode();
 * const node2 = new SinglyLinkedListNode();
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
export class SinglyLinkedList<
    N extends SinglyLinkedListNode = SinglyLinkedListNode,
  >
  extends AbstractSinglyLinkedList<N>
  implements ISinglyLinkedList<N>
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
   * const list = new SinglyLinkedList();
   *
   * // Add nodes to the list
   * list.pushNode(new SinglyLinkedListNode());
   * list.pushNode(new SinglyLinkedListNode());
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
      ? inReverseOrder(this.head)
      : inOrder(this.head)) {
      yield node;
    }
  }

  /**
   * Resets the list to its initial empty state.
   *
   * @example
   * ```typescript
   * const list = new SinglyLinkedList();
   *
   * list.pushNode(new SinglyLinkedListNode());
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
   * const list = new SinglyLinkedList();
   * const node = new SinglyLinkedListNode();
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
   * const list = new SinglyLinkedList();
   *
   * const node1 = new SinglyLinkedListNode();
   * const node2 = new SinglyLinkedListNode();
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
   * const list = new SinglyLinkedList();
   *
   * const node1 = new SinglyLinkedListNode();
   * const node2 = new SinglyLinkedListNode();
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
   * const list = new SinglyLinkedList();
   *
   * const node1 = new SinglyLinkedListNode();
   * const node2 = new SinglyLinkedListNode();
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
   * const list = new SinglyLinkedList();
   *
   * const node1 = new SinglyLinkedListNode();
   * const node2 = new SinglyLinkedListNode();
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
