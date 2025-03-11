import { AbstractDoublyLinkedListNode } from './AbstractDoublyLinkedListNode';
import { AbstractLinkedList } from './AbstractLinkedList';

/**
 * An abstract class representing a doubly linked list.
 *
 * @template N - The type of nodes in the list, must extend `AbstractDoublyLinkedListNode`.
 */
export abstract class AbstractDoublyLinkedList<
  N extends AbstractDoublyLinkedListNode = AbstractDoublyLinkedListNode
> extends AbstractLinkedList<N> {}
