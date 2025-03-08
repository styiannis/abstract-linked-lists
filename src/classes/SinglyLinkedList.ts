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
 * A concrete implementation of a singly linked list.
 *
 * @template N - The type of nodes in the list.
 */
export class SinglyLinkedList<
    N extends SinglyLinkedListNode = SinglyLinkedListNode
  >
  extends AbstractSinglyLinkedList<N>
  implements ISinglyLinkedList<N>
{
  /**
   * The number of nodes in the list.
   */
  size: number = 0;

  /**
   * The first node in the list, or `null` if the list is empty.
   */
  head: N | null = null;

  /**
   * The last node in the list, or `null` if the list is empty.
   */
  tail: N | null = null;

  /**
   * Returns an iterator for traversing the list.
   *
   * @override
   * @param [reversed=false] - If `true`, the iterator will traverse the list in reverse order.
   * @returns A generator that yields nodes in the requested order.
   */
  *[Symbol.iterator](reversed: boolean = false) {
    for (const node of reversed
      ? inReverseOrder(this.head)
      : inOrder(this.head)) {
      yield node;
    }
  }

  /**
   * Clears the list by removing all nodes.
   *
   * @override
   */
  clear() {
    return clear(this);
  }

  /**
   * Retrieves the node at the specified index.
   *
   * @override
   * @param index - The zero-based `index` of the node to retrieve.
   * @returns The node at the specified `index`, or `undefined` if the `index` is out of bounds.
   */
  nodeAt(index: number) {
    return nodeAt(this, index);
  }

  /**
   * Adds a node to the end of the list.
   *
   * @override
   * @param node - The node to add.
   */
  pushNode(node: N) {
    return pushNode(this, node);
  }

  /**
   * Adds a node to the beginning of the list.
   *
   * @override
   * @param node - The node to add.
   */
  unshiftNode(node: N) {
    return unshiftNode(this, node);
  }

  /**
   * Removes and returns the last node of the list.
   *
   * @override
   * @returns The removed node, or `undefined` if the list was empty.
   */
  popNode() {
    return popNode(this);
  }

  /**
   * Removes and returns the first node of the list.
   *
   * @override
   * @returns The removed node, or `undefined` if the list was empty.
   */
  shiftNode() {
    return shiftNode(this);
  }
}
