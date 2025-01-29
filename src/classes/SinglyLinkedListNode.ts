import { detach } from '../core/singly-linked-list/node';
import { ISinglyLinkedListNode } from '../types';
import { AbstractSinglyLinkedListNode } from './abstract';

/**
 * A concrete implementation of a singly linked list node.
 */
export class SinglyLinkedListNode
  extends AbstractSinglyLinkedListNode
  implements ISinglyLinkedListNode
{
  /**
   * The constructor of the class that creates a new instance of it.
   *
   * @param [next=null] - The next node, or `null` if the node has no next connection.
   */
  constructor(public next: SinglyLinkedListNode | null = null) {
    super();
  }

  /**
   * Detaches the node by updating the `next` reference of the previous node.
   *
   * @override
   * @param previous - The previous node, or `null` if the node has no previous connection.
   */
  detach(previous: SinglyLinkedListNode | null) {
    return detach(this, previous);
  }
}
