import { doublyLinkedList, singlyLinkedList } from '../src';
import { isValidObjectInstance } from './util';

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
        expect(next.next).toBe(null);

        singlyLinkedList.node.detach(node, previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBe(null);
        expect(next.next).toBe(null);
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

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(node);

        expect(node.previous).toBe(previous);
        expect(node.next).toBe(next);

        expect(next.previous).toBe(node);
        expect(next.next).toBe(null);

        doublyLinkedList.node.detach(node);

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(next);

        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);

        expect(next.previous).toBe(previous);
        expect(next.next).toBe(null);
      });
    });
  });

  describe('List', () => {
    describe('Create and validate a list instance', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        expect(isValidObjectInstance(list, 'singly-linked-list')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        expect(isValidObjectInstance(list, 'doubly-linked-list')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
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
  });
});
