import { doublyLinkedList, singlyLinkedList } from '../src';
import { arraysEqual } from './util/arraysEqual';
import { isValidObjectInstance } from './util/isValidObjectInstance';

describe('Core', () => {
  describe('Node', () => {
    describe('Create a node instance, attach a "previous" and "next" node to it, and then detach it', () => {
      it('Singly linked list', () => {
        const next = singlyLinkedList.node.create();
        const node = singlyLinkedList.node.create(next);
        const previous = singlyLinkedList.node.create(node);

        expect(
          isValidObjectInstance(node, 'singly-linked-list-node') &&
            isValidObjectInstance(next, 'singly-linked-list-node') &&
            isValidObjectInstance(previous, 'singly-linked-list-node')
        ).toBe(true);

        expect(previous.next).toBe(node);
        expect(node.next).toBe(next);
        expect(next.next).toBeNull();

        singlyLinkedList.node.detach(node, previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBeNull();
        expect(next.next).toBeNull();

        singlyLinkedList.node.detach(previous, null);

        expect(previous.next).toBeNull();
        expect(node.next).toBeNull();
        expect(next.next).toBeNull();
      });

      it('Doubly linked list', () => {
        const previous = doublyLinkedList.node.create();
        const next = doublyLinkedList.node.create();
        const node = doublyLinkedList.node.create(previous, next);

        expect(
          isValidObjectInstance(node, 'doubly-linked-list-node') &&
            isValidObjectInstance(node.previous, 'doubly-linked-list-node') &&
            isValidObjectInstance(node.next, 'doubly-linked-list-node')
        ).toBe(true);

        expect(previous.previous).toBeNull();
        expect(previous.next).toBe(node);

        expect(node.previous).toBe(previous);
        expect(node.next).toBe(next);

        expect(next.previous).toBe(node);
        expect(next.next).toBeNull();

        doublyLinkedList.node.detach(node);

        expect(previous.previous).toBeNull();
        expect(previous.next).toBe(next);

        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();

        expect(next.previous).toBe(previous);
        expect(next.next).toBeNull();

        doublyLinkedList.node.detach(previous);

        expect(previous.previous).toBeNull();
        expect(previous.next).toBeNull();

        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();

        expect(next.previous).toBeNull();
        expect(next.next).toBeNull();

        node.next = next;
        next.previous = node;
        doublyLinkedList.node.detach(next);

        expect(previous.previous).toBeNull();
        expect(previous.next).toBeNull();

        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();

        expect(next.previous).toBeNull();
        expect(next.next).toBeNull();
      });
    });
  });

  describe('List', () => {
    describe('Create and validate a list instance', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        expect(isValidObjectInstance(list, 'singly-linked-list')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        expect(isValidObjectInstance(list, 'doubly-linked-list')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
      });
    });

    describe('Add a node that still carries pointers using the "pushNode" and "unshiftNode" functions', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        const stale = singlyLinkedList.node.create();
        const first = singlyLinkedList.node.create();
        const second = singlyLinkedList.node.create();

        // Pushing onto an empty list relinks from scratch.
        first.next = stale;
        singlyLinkedList.list.pushNode(list, first);

        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBeNull();

        // Pushing onto a non-empty list does too.
        second.next = stale;
        singlyLinkedList.list.pushNode(list, second);

        expect(list.tail).toBe(second);
        expect(first.next).toBe(second);
        expect(second.next).toBeNull();

        // Unshifting links the node to the former head, not to its own successor.
        const third = singlyLinkedList.node.create();

        third.next = stale;
        singlyLinkedList.list.unshiftNode(list, third);

        expect(list.head).toBe(third);
        expect(third.next).toBe(first);

        // Unshifting onto an empty list leaves no successor either.
        const emptyList = singlyLinkedList.list.create();

        stale.next = first;
        singlyLinkedList.list.unshiftNode(emptyList, stale);

        expect(emptyList.head).toBe(stale);
        expect(emptyList.tail).toBe(stale);
        expect(stale.next).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        const stale = doublyLinkedList.node.create();
        const first = doublyLinkedList.node.create();
        const second = doublyLinkedList.node.create();

        // Pushing onto an empty list relinks from scratch.
        first.previous = stale;
        first.next = stale;
        doublyLinkedList.list.pushNode(list, first);

        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.previous).toBeNull();
        expect(first.next).toBeNull();

        // Pushing onto a non-empty list does too.
        second.previous = stale;
        second.next = stale;
        doublyLinkedList.list.pushNode(list, second);

        expect(list.tail).toBe(second);
        expect(first.next).toBe(second);
        expect(second.previous).toBe(first);
        expect(second.next).toBeNull();

        // Unshifting links the node to the former head, not to its own neighbours.
        const third = doublyLinkedList.node.create();

        third.previous = stale;
        third.next = stale;
        doublyLinkedList.list.unshiftNode(list, third);

        expect(list.head).toBe(third);
        expect(third.previous).toBeNull();
        expect(third.next).toBe(first);
        expect(first.previous).toBe(third);

        // Unshifting onto an empty list leaves no neighbours either.
        const emptyList = doublyLinkedList.list.create();

        stale.previous = first;
        stale.next = first;
        doublyLinkedList.list.unshiftNode(emptyList, stale);

        expect(emptyList.head).toBe(stale);
        expect(emptyList.tail).toBe(stale);
        expect(stale.previous).toBeNull();
        expect(stale.next).toBeNull();
      });
    });
  });

  describe('Iterators', () => {
    describe('Iterate through a sequence of nodes, in both directions', () => {
      it('Singly linked list', () => {
        const fifth = singlyLinkedList.node.create();
        const forth = singlyLinkedList.node.create(fifth);
        const third = singlyLinkedList.node.create(forth);
        const second = singlyLinkedList.node.create(third);
        const first = singlyLinkedList.node.create(second);

        const nodeArray = [first, second, third, forth, fifth];

        let i = 0;
        for (const node of singlyLinkedList.iterators.inOrder(first)) {
          expect(node).toBe(nodeArray[i++]);
        }

        i = nodeArray.length - 1;
        for (const node of singlyLinkedList.iterators.inReverseOrder(first)) {
          expect(node).toBe(nodeArray[i--]);
        }
      });

      it('Doubly linked list', () => {
        const first = doublyLinkedList.node.create();
        const second = doublyLinkedList.node.create(first);
        const third = doublyLinkedList.node.create(second);
        const forth = doublyLinkedList.node.create(third);
        const fifth = doublyLinkedList.node.create(forth);

        first.next = second;
        second.next = third;
        third.next = forth;
        forth.next = fifth;

        const nodeArray = [first, second, third, forth, fifth];

        let i = 0;
        for (const node of singlyLinkedList.iterators.inOrder(first)) {
          expect(node).toBe(nodeArray[i++]);
        }

        i = nodeArray.length - 1;
        for (const node of singlyLinkedList.iterators.inReverseOrder(first)) {
          expect(node).toBe(nodeArray[i--]);
        }
      });
    });

    describe('Create an iterator, modify the list, and then iterate', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        const first = singlyLinkedList.node.create();
        const second = singlyLinkedList.node.create();
        const third = singlyLinkedList.node.create();

        for (const node of [first, second, third]) {
          singlyLinkedList.list.pushNode(list, node);
        }

        // The starting node is read here, not on the first step of the walk.
        const iterator = singlyLinkedList.iterators.inOrder(list.head);

        const newHead = singlyLinkedList.node.create();
        const newTail = singlyLinkedList.node.create();

        singlyLinkedList.list.unshiftNode(list, newHead);
        singlyLinkedList.list.pushNode(list, newTail);

        // The node placed before the starting one is never reached. The node
        // placed after the end is, because each step follows the current links.
        expect(
          arraysEqual([...iterator], [first, second, third, newTail])
        ).toBe(true);

        // Removing the starting node detaches it, so a walk from it stops on it.
        const fromRemoved = singlyLinkedList.iterators.inOrder(list.head);

        singlyLinkedList.list.shiftNode(list);

        expect(arraysEqual([...fromRemoved], [newHead])).toBe(true);
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        const first = doublyLinkedList.node.create();
        const second = doublyLinkedList.node.create();
        const third = doublyLinkedList.node.create();

        for (const node of [first, second, third]) {
          doublyLinkedList.list.pushNode(list, node);
        }

        // "head" is read here for a forward walk, "tail" for a reverse one.
        const forward = doublyLinkedList.iterators.inOrder(list.head);
        const reverse = doublyLinkedList.iterators.inReverseOrder(list.tail);

        const newHead = doublyLinkedList.node.create();
        const newTail = doublyLinkedList.node.create();

        doublyLinkedList.list.unshiftNode(list, newHead);
        doublyLinkedList.list.pushNode(list, newTail);

        // Each walk misses what was placed beyond the end it started from, and
        // reaches what was placed beyond the end it is heading towards.
        expect(arraysEqual([...forward], [first, second, third, newTail])).toBe(
          true
        );
        expect(arraysEqual([...reverse], [third, second, first, newHead])).toBe(
          true
        );

        // Removing the starting node detaches it, so a walk from it stops on it.
        const fromRemoved = doublyLinkedList.iterators.inOrder(list.head);

        doublyLinkedList.list.shiftNode(list);

        expect(arraysEqual([...fromRemoved], [newHead])).toBe(true);
      });
    });
  });
});
