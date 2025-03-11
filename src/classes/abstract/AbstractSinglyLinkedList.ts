import { AbstractLinkedList } from './AbstractLinkedList';
import { AbstractSinglyLinkedListNode } from './AbstractSinglyLinkedListNode';

/**
 * An abstract class representing a singly linked list.
 *
 * @template N - The type of nodes in the list, must extend `AbstractSinglyLinkedListNode`.
 */
export abstract class AbstractSinglyLinkedList<
  N extends AbstractSinglyLinkedListNode = AbstractSinglyLinkedListNode
> extends AbstractLinkedList<N> {}
