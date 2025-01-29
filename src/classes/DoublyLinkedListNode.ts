import { detach } from '../core/doubly-linked-list/node';
import { IDoublyLinkedListNode } from '../types';
import { AbstractDoublyLinkedListNode } from './abstract';

/**
 * A concrete implementation of a doubly linked list node.
 */
export class DoublyLinkedListNode
  extends AbstractDoublyLinkedListNode
  implements IDoublyLinkedListNode
{
  /**
   * The constructor of the class that creates a new instance of it.
   *
   * @param [previous=null] - The previous node, or `null` if the node has no previous connection.
   * @param [next=null] - The next node, or `null` if the node has no next connection.
   */
  constructor(
    public previous: DoublyLinkedListNode | null = null,
    public next: DoublyLinkedListNode | null = null
  ) {
    super();

    if (previous) {
      previous.next = this;
    }

    if (next) {
      next.previous = this;
    }
  }

  /**
   * Detaches the node from its adjacent nodes.
   *
   * @override
   */
  detach() {
    return detach(this);
  }
}
