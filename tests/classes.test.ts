import {
  DoublyLinkedList,
  DoublyLinkedListNode,
  IDoublyLinkedListNode,
  ISinglyLinkedListNode,
  SinglyLinkedList,
  SinglyLinkedListNode,
} from '../src';
import { arraysEqual } from './util/arraysEqual';
import { isValidClassInstance } from './util/isValidClassInstance';

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

        // A node that does not precede the node is rejected, and nothing is changed.
        node.detach(next);

        expect(previous.next).toBe(node);
        expect(node.next).toBe(next);
        expect(next.next).toBe(null);

        node.detach(previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBe(null);
        expect(next.next).toBe(null);

        previous.detach(null);

        expect(previous.next).toBe(null);
        expect(node.next).toBe(null);
        expect(next.next).toBe(null);
      });

      it('Doubly linked list', () => {
        const previous = new DoublyLinkedListNode();
        const next = new DoublyLinkedListNode();
        const node = new DoublyLinkedListNode(previous, next);

        expect(
          isValidClassInstance(node, 'DoublyLinkedListNode') &&
            isValidClassInstance(next, 'DoublyLinkedListNode') &&
            isValidClassInstance(previous, 'DoublyLinkedListNode')
        ).toBe(true);

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(node);

        expect(node.previous).toBe(previous);
        expect(node.next).toBe(next);

        expect(next.previous).toBe(node);
        expect(next.next).toBe(null);

        node.detach();

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(next);

        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);

        expect(next.previous).toBe(previous);
        expect(next.next).toBe(null);

        previous.detach();

        expect(previous.previous).toBe(null);
        expect(previous.next).toBe(null);

        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);

        expect(next.previous).toBe(null);
        expect(next.next).toBe(null);

        node.next = next;
        next.previous = node;
        next.detach();

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
        const list = new SinglyLinkedList();

        expect(isValidClassInstance(list, 'SinglyLinkedList')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        expect(isValidClassInstance(list, 'DoublyLinkedList')).toBe(true);

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

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        let firstNode: IDoublyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const lastNode = new DoublyLinkedListNode();

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

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        let lastNode: IDoublyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const firstNode = new DoublyLinkedListNode();

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

    describe('Remove a specific node from a list using the "removeNode" method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        const singleNode = new SinglyLinkedListNode();

        expect(list.removeNode(singleNode)).toBe(undefined);

        const first = new SinglyLinkedListNode();
        const second = new SinglyLinkedListNode();
        const third = new SinglyLinkedListNode();
        const forth = new SinglyLinkedListNode();
        const fifth = new SinglyLinkedListNode();

        for (const node of [first, second, third, forth, fifth]) {
          list.pushNode(node);
        }

        // A node that is not part of the list leaves the list untouched.
        expect(list.removeNode(singleNode)).toBe(undefined);

        expect(list.size).toBe(5);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(fifth);

        expect(list.removeNode(third)).toBe(third);

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBe(null);

        list.removeNode(first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBe(null);

        list.removeNode(fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBe(null);
        expect(fifth.next).toBe(null);

        // A node that still carries pointers is relinked from scratch.
        const newNode = new SinglyLinkedListNode(singleNode);

        list.pushNode(newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBe(null);

        list.removeNode(second);
        list.removeNode(forth);
        list.removeNode(newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
        expect(second.next).toBe(null);
        expect(forth.next).toBe(null);
        expect(newNode.next).toBe(null);

        expect(list.removeNode(singleNode)).toBe(undefined);

        // "clear" detaches every node it removes.
        list.pushNode(first);
        list.pushNode(second);
        list.clear();

        expect(list.size).toBe(0);
        expect(first.next).toBe(null);

        // The same holds for "unshiftNode".
        newNode.next = first;
        list.unshiftNode(newNode);

        expect(newNode.next).toBe(null);
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        const singleNode = new DoublyLinkedListNode();

        expect(list.removeNode(singleNode)).toBe(undefined);

        const first = new DoublyLinkedListNode();
        const second = new DoublyLinkedListNode();
        const third = new DoublyLinkedListNode();
        const forth = new DoublyLinkedListNode();
        const fifth = new DoublyLinkedListNode();

        for (const node of [first, second, third, forth, fifth]) {
          list.pushNode(node);
        }

        expect(list.removeNode(third)).toBe(third);

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBe(null);
        expect(third.previous).toBe(null);
        expect(forth.previous).toBe(second);

        list.removeNode(first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBe(null);
        expect(first.previous).toBe(null);
        expect(second.previous).toBe(null);

        list.removeNode(fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBe(null);
        expect(fifth.next).toBe(null);
        expect(fifth.previous).toBe(null);

        // A node that still carries pointers is relinked from scratch.
        const newNode = new DoublyLinkedListNode(
          null,
          new DoublyLinkedListNode()
        );

        list.pushNode(newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(forth);

        list.removeNode(second);
        list.removeNode(forth);
        list.removeNode(newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
        expect(second.next).toBe(null);
        expect(second.previous).toBe(null);
        expect(forth.next).toBe(null);
        expect(forth.previous).toBe(null);
        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(null);

        expect(list.removeNode(singleNode)).toBe(undefined);

        // "clear" detaches every node it removes.
        list.pushNode(first);
        list.pushNode(second);
        list.clear();

        expect(list.size).toBe(0);
        expect(first.next).toBe(null);
        expect(second.previous).toBe(null);

        // The same holds for "unshiftNode".
        newNode.next = first;
        newNode.previous = first;
        list.unshiftNode(newNode);

        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(null);

        // A stale "previous" is overwritten at both ends, empty list or not.
        first.previous = second;
        list.unshiftNode(first);

        expect(first.previous).toBe(null);
        expect(first.next).toBe(newNode);

        list.clear();
        second.previous = first;
        list.pushNode(second);

        expect(second.previous).toBe(null);
      });
    });

    describe('Remove the node after a given node using the "removeNodeAfter" method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        const first = new SinglyLinkedListNode();
        const second = new SinglyLinkedListNode();
        const third = new SinglyLinkedListNode();

        for (const node of [first, second, third]) {
          list.pushNode(node);
        }

        expect(list.removeNodeAfter(first)).toBe(second);

        expect(list.size).toBe(2);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(third);
        expect(first.next).toBe(third);
        expect(second.next).toBe(null);

        // Removing the node after the one before the tail moves the tail back.
        expect(list.removeNodeAfter(first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBe(null);
        expect(third.next).toBe(null);

        // The tail has no next node, so there is nothing to remove.
        expect(list.removeNodeAfter(first)).toBe(undefined);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        const first = new DoublyLinkedListNode();
        const second = new DoublyLinkedListNode();
        const third = new DoublyLinkedListNode();

        for (const node of [first, second, third]) {
          list.pushNode(node);
        }

        expect(list.removeNodeAfter(first)).toBe(second);

        expect(list.size).toBe(2);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(third);
        expect(first.next).toBe(third);
        expect(third.previous).toBe(first);
        expect(second.next).toBe(null);
        expect(second.previous).toBe(null);

        expect(list.removeNodeAfter(first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBe(null);
        expect(third.next).toBe(null);
        expect(third.previous).toBe(null);

        expect(list.removeNodeAfter(first)).toBe(undefined);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
      });
    });

    describe('Accessing list nodes based on their index number', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        expect(list.nodeAt(0)).toBe(undefined);
        expect(list.nodeAt(1)).toBe(undefined);
        expect(list.nodeAt(-1)).toBe(undefined);

        const nodeArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        expect(list.nodeAt(NODES_SIZE)).toBe(undefined);

        for (let i = 0; i < NODES_SIZE; i++) {
          expect(list.nodeAt(i)).toBe(nodeArray[i]);
        }

        expect(list.size).toBe(NODES_SIZE);
        expect(list.head).not.toBe(null);
        expect(list.tail).not.toBe(null);

        expect(list.clear()).toBe(undefined);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        expect(list.nodeAt(0)).toBe(undefined);
        expect(list.nodeAt(1)).toBe(undefined);
        expect(list.nodeAt(-1)).toBe(undefined);

        const nodeArray: DoublyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new DoublyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        expect(list.nodeAt(NODES_SIZE)).toBe(undefined);

        for (let i = 0; i < NODES_SIZE; i++) {
          expect(list.nodeAt(i)).toBe(nodeArray[i]);
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
        const nodeArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        let i = 0;
        for (const node of list[Symbol.iterator]()) {
          expect(node).toBe(nodeArray[i++]);
        }

        i = NODES_SIZE - 1;
        for (const node of list[Symbol.iterator](true)) {
          expect(node).toBe(nodeArray[i--]);
        }
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();
        const nodeArray: DoublyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new DoublyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        let i = 0;
        for (const node of list[Symbol.iterator]()) {
          expect(node).toBe(nodeArray[i++]);
        }

        i = NODES_SIZE - 1;
        for (const node of list[Symbol.iterator](true)) {
          expect(node).toBe(nodeArray[i--]);
        }
      });
    });

    describe('For loop', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();
        const nodeArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        let i = 0;
        for (const node of list) {
          expect(node).toBe(nodeArray[i]);
          i += 1;
        }

        list.clear();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();
        const nodeArray: DoublyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new DoublyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        let i = 0;
        for (const node of list) {
          expect(node).toBe(nodeArray[i]);
          i += 1;
        }

        list.clear();
      });
    });

    describe('Create an iterator, modify the list, and then iterate', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();
        const nodeArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        // "head" is read here, not on the first step of the walk.
        const iterator = list[Symbol.iterator]();

        const newHead = new SinglyLinkedListNode();
        const newTail = new SinglyLinkedListNode();

        list.unshiftNode(newHead);
        list.pushNode(newTail);

        // The node placed before the starting one is never reached. The node
        // placed after the end is, because each step follows the current links.
        expect(arraysEqual([...iterator], [...nodeArray, newTail])).toBe(true);

        // Removing the starting node detaches it, so a walk from it stops on it.
        const fromRemoved = list[Symbol.iterator]();

        list.shiftNode();

        expect(arraysEqual([...fromRemoved], [newHead])).toBe(true);
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();
        const nodeArray: DoublyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new DoublyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        // "head" is read here for a forward walk, "tail" for a reverse one.
        const forward = list[Symbol.iterator]();
        const reverse = list[Symbol.iterator](true);

        const newHead = new DoublyLinkedListNode();
        const newTail = new DoublyLinkedListNode();

        list.unshiftNode(newHead);
        list.pushNode(newTail);

        // Each walk misses what was placed beyond the end it started from, and
        // reaches what was placed beyond the end it is heading towards.
        expect(arraysEqual([...forward], [...nodeArray, newTail])).toBe(true);
        expect(
          arraysEqual([...reverse], [...nodeArray].reverse().concat(newHead))
        ).toBe(true);

        // Removing the starting node detaches it, so a walk from it stops on it.
        const fromRemoved = list[Symbol.iterator]();

        list.shiftNode();

        expect(arraysEqual([...fromRemoved], [newHead])).toBe(true);
      });
    });
  });
});
