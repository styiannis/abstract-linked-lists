import { doublyLinkedList, singlyLinkedList } from '../src';
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
        expect(next.next).toBe(null);

        singlyLinkedList.node.detach(node, previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBe(null);
        expect(next.next).toBe(null);

        singlyLinkedList.node.detach(previous, null);

        expect(previous.next).toBe(null);
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

        doublyLinkedList.node.detach(previous);

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(null);

        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);

        expect(next.previous).toBe(null);
        expect(next.next).toBe(null);

        node.next = next;
        next.previous = node;
        doublyLinkedList.node.detach(next);

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(null);

        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);

        expect(next.previous).toBe(null);
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

    describe('Remove a specific node from a list using the "removeNode" function', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        const singleNode = singlyLinkedList.node.create();

        expect(
          singlyLinkedList.list.removeNode(list, singleNode, null)
        ).toBeUndefined();

        const first = singlyLinkedList.node.create();
        const second = singlyLinkedList.node.create();
        const third = singlyLinkedList.node.create();
        const forth = singlyLinkedList.node.create();
        const fifth = singlyLinkedList.node.create();

        for (const node of [first, second, third, forth, fifth]) {
          singlyLinkedList.list.pushNode(list, node);
        }

        expect(singlyLinkedList.list.removeNode(list, third, second)).toBe(
          third
        );

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBe(null);

        singlyLinkedList.list.removeNode(list, first, null);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBe(null);

        singlyLinkedList.list.removeNode(list, fifth, forth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBe(null);
        expect(fifth.next).toBe(null);

        const newNode = singlyLinkedList.node.create();

        singlyLinkedList.list.pushNode(list, newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);

        singlyLinkedList.list.removeNode(list, second, null);
        singlyLinkedList.list.removeNode(list, forth, null);
        singlyLinkedList.list.removeNode(list, newNode, null);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
        expect(second.next).toBe(null);
        expect(forth.next).toBe(null);
        expect(newNode.next).toBe(null);

        expect(
          singlyLinkedList.list.removeNode(list, singleNode, null)
        ).toBeUndefined();
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        const singleNode = doublyLinkedList.node.create();

        expect(
          doublyLinkedList.list.removeNode(list, singleNode)
        ).toBeUndefined();

        const first = doublyLinkedList.node.create();
        const second = doublyLinkedList.node.create();
        const third = doublyLinkedList.node.create();
        const forth = doublyLinkedList.node.create();
        const fifth = doublyLinkedList.node.create();

        for (const node of [first, second, third, forth, fifth]) {
          doublyLinkedList.list.pushNode(list, node);
        }

        expect(doublyLinkedList.list.removeNode(list, third)).toBe(third);

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBe(null);
        expect(third.previous).toBe(null);
        expect(forth.previous).toBe(second);

        doublyLinkedList.list.removeNode(list, first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBe(null);
        expect(first.previous).toBe(null);
        expect(second.previous).toBe(null);

        doublyLinkedList.list.removeNode(list, fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBe(null);
        expect(fifth.next).toBe(null);
        expect(fifth.previous).toBe(null);

        const newNode = doublyLinkedList.node.create();

        doublyLinkedList.list.pushNode(list, newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(forth);

        doublyLinkedList.list.removeNode(list, second);
        doublyLinkedList.list.removeNode(list, forth);
        doublyLinkedList.list.removeNode(list, newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
        expect(second.next).toBe(null);
        expect(second.previous).toBe(null);
        expect(forth.next).toBe(null);
        expect(forth.previous).toBe(null);
        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(null);

        expect(
          doublyLinkedList.list.removeNode(list, singleNode)
        ).toBeUndefined();
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
