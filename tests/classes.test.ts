import {
  ISinglyLinkedListNode,
  SinglyLinkedList,
  SinglyLinkedListNode,
} from '../src';
import { isValidClassInstance } from './test-utils';

describe('Classes', () => {
  const NODES_SIZE = 7;

  describe('Node', () => {
    describe('Create a node instance, attach a "previous" and "next" node to it, and then detach it', () => {
      it('Singly linked list', () => {
        const next = new SinglyLinkedListNode();
        const node = new SinglyLinkedListNode(next);
        const previous = new SinglyLinkedListNode(node);

        expect(
          isValidClassInstance(node, 'SinglyLinkedListNode') &&
            isValidClassInstance(next, 'SinglyLinkedListNode') &&
            isValidClassInstance(previous, 'SinglyLinkedListNode')
        ).toBe(true);

        expect(previous.next).toBe(node);
        expect(node.next).toBe(next);
        expect(next.next).toBe(null);

        node.detach(previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBe(null);
        expect(next.next).toBe(null);
      });
    });
  });

  describe('List', () => {
    describe('Create and validate a list instance', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        expect(isValidClassInstance(list, 'SinglyLinkedList')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
      });
    });

    describe('Add nodes to a list using the "pushNode" method, then empty the list using the "popNode" removal method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        let firstNode: ISinglyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const lastNode = new SinglyLinkedListNode();

          expect(list.pushNode(lastNode)).toBe(undefined);

          if (0 === i) {
            firstNode = lastNode;
          }

          expect(list.size).toBe(i + 1);
          expect(list.head).toBe(firstNode);
          expect(list.tail).toBe(lastNode);
        }

        for (let i = NODES_SIZE - 1; i >= 0; i--) {
          const lastNode = list.tail;

          if (0 === i) {
            expect(list.head).toBe(lastNode);
          }

          expect(list.size).toBe(i + 1);

          const removedNode = list.popNode();

          expect(list.size).toBe(i);
          expect(removedNode).toBe(lastNode);
          expect(removedNode).not.toBe(list.tail);
        }

        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);

        expect(list.popNode()).toBe(undefined);
      });
    });

    describe('Add nodes to a list using the "unshiftNode" method, then empty the list using the "shiftNode" removal method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        let lastNode: ISinglyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const firstNode = new SinglyLinkedListNode();

          expect(list.unshiftNode(firstNode)).toBe(undefined);

          if (0 === i) {
            lastNode = firstNode;
          }

          expect(list.size).toBe(i + 1);
          expect(list.head).toBe(firstNode);
          expect(list.tail).toBe(lastNode);
        }

        for (let i = NODES_SIZE - 1; i >= 0; i--) {
          const firstNode = list.head;

          if (0 === i) {
            expect(list.tail).toBe(firstNode);
          }

          expect(list.size).toBe(i + 1);

          const removedNode = list.shiftNode();

          expect(list.size).toBe(i);
          expect(removedNode).toBe(firstNode);
          expect(removedNode).not.toBe(list.head);
        }

        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);

        expect(list.shiftNode()).toBe(undefined);
      });
    });

    describe('Accessing list nodes based on their index number', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        expect(list.nodeAt(0)).toBe(undefined);
        expect(list.nodeAt(1)).toBe(undefined);
        expect(list.nodeAt(-1)).toBe(undefined);

        const nodesArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodesArray[i] = n;
          list.pushNode(n);
        }

        expect(list.nodeAt(NODES_SIZE)).toBe(undefined);

        for (let i = 0; i < NODES_SIZE; i++) {
          expect(list.nodeAt(i)).toBe(nodesArray[i]);
          i++;
        }

        expect(list.size).toBe(NODES_SIZE);
        expect(list.head).not.toBe(null);
        expect(list.tail).not.toBe(null);

        expect(list.clear()).toBe(undefined);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
      });
    });
  });

  describe('Iterators', () => {
    describe('Iterate through a sequence of nodes, in both directions', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();
        const nodesArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodesArray[i] = n;
          list.pushNode(n);
        }

        const iter = list[Symbol.iterator]();

        for (
          let curr = iter.next(), i = 0;
          !curr.done;
          curr = iter.next(), i++
        ) {
          expect(curr.value).toBe(nodesArray[i]);
        }

        const revIter = list[Symbol.iterator](true);

        for (
          let curr = revIter.next(), i = NODES_SIZE - 1;
          !curr.done;
          curr = revIter.next(), i--
        ) {
          expect(curr.value).toBe(nodesArray[i]);
        }
      });
    });

    describe('For loop', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();
        const nodesArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodesArray[i] = n;
          list.pushNode(n);
        }

        let i = 0;
        for (const node of list) {
          expect(node).toBe(nodesArray[i]);
          i++;
        }

        list.clear();
      });
    });
  });
});
