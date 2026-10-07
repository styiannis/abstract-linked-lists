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
        expect(next.next).toBeNull();

        node.detach(previous);

        expect(previous.next).toBe(next);
        expect(node.next).toBeNull();
        expect(next.next).toBeNull();

        previous.detach(null);

        expect(previous.next).toBeNull();
        expect(node.next).toBeNull();
        expect(next.next).toBeNull();
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

        expect(previous.previous).toBeNull();
        expect(previous.next).toBe(node);

        expect(node.previous).toBe(previous);
        expect(node.next).toBe(next);

        expect(next.previous).toBe(node);
        expect(next.next).toBeNull();

        node.detach();

        expect(previous.previous).toBeNull();
        expect(previous.next).toBe(next);

        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();

        expect(next.previous).toBe(previous);
        expect(next.next).toBeNull();

        previous.detach();

        expect(previous.previous).toBeNull();
        expect(previous.next).toBeNull();

        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();

        expect(next.previous).toBeNull();
        expect(next.next).toBeNull();

        node.next = next;
        next.previous = node;
        next.detach();

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
        const list = new SinglyLinkedList();

        expect(isValidClassInstance(list, 'SinglyLinkedList')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        expect(isValidClassInstance(list, 'DoublyLinkedList')).toBe(true);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
      });
    });

    describe('Add a node that still carries pointers using the "pushNode" and "unshiftNode" methods', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        const stale = new SinglyLinkedListNode();
        const first = new SinglyLinkedListNode();
        const second = new SinglyLinkedListNode();

        // Pushing onto an empty list relinks from scratch.
        first.next = stale;
        list.pushNode(first);

        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBeNull();

        // Pushing onto a non-empty list does too.
        second.next = stale;
        list.pushNode(second);

        expect(list.tail).toBe(second);
        expect(first.next).toBe(second);
        expect(second.next).toBeNull();

        // Unshifting links the node to the former head, not to its own successor.
        const third = new SinglyLinkedListNode();

        third.next = stale;
        list.unshiftNode(third);

        expect(list.head).toBe(third);
        expect(third.next).toBe(first);

        // Unshifting onto an empty list leaves no successor either.
        const emptyList = new SinglyLinkedList();

        stale.next = first;
        emptyList.unshiftNode(stale);

        expect(emptyList.head).toBe(stale);
        expect(emptyList.tail).toBe(stale);
        expect(stale.next).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        const stale = new DoublyLinkedListNode();
        const first = new DoublyLinkedListNode();
        const second = new DoublyLinkedListNode();

        // Pushing onto an empty list relinks from scratch.
        first.previous = stale;
        first.next = stale;
        list.pushNode(first);

        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.previous).toBeNull();
        expect(first.next).toBeNull();

        // Pushing onto a non-empty list does too.
        second.previous = stale;
        second.next = stale;
        list.pushNode(second);

        expect(list.tail).toBe(second);
        expect(first.next).toBe(second);
        expect(second.previous).toBe(first);
        expect(second.next).toBeNull();

        // Unshifting links the node to the former head, not to its own neighbours.
        const third = new DoublyLinkedListNode();

        third.previous = stale;
        third.next = stale;
        list.unshiftNode(third);

        expect(list.head).toBe(third);
        expect(third.previous).toBeNull();
        expect(third.next).toBe(first);
        expect(first.previous).toBe(third);

        // Unshifting onto an empty list leaves no neighbours either.
        const emptyList = new DoublyLinkedList();

        stale.previous = first;
        stale.next = first;
        emptyList.unshiftNode(stale);

        expect(emptyList.head).toBe(stale);
        expect(emptyList.tail).toBe(stale);
        expect(stale.previous).toBeNull();
        expect(stale.next).toBeNull();
      });
    });

    describe('Add nodes to a list using the "pushNode" method, then empty the list using the "popNode" removal method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        let firstNode: ISinglyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const lastNode = new SinglyLinkedListNode();

          expect(list.pushNode(lastNode)).toBeUndefined();

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

        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        expect(list.popNode()).toBeUndefined();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        let firstNode: IDoublyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const lastNode = new DoublyLinkedListNode();

          expect(list.pushNode(lastNode)).toBeUndefined();

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

        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        expect(list.popNode()).toBeUndefined();
      });
    });

    describe('Add nodes to a list using the "unshiftNode" method, then empty the list using the "shiftNode" removal method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        let lastNode: ISinglyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const firstNode = new SinglyLinkedListNode();

          expect(list.unshiftNode(firstNode)).toBeUndefined();

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

        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        expect(list.shiftNode()).toBeUndefined();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        let lastNode: IDoublyLinkedListNode | null = null;

        for (let i = 0; i < NODES_SIZE; i++) {
          const firstNode = new DoublyLinkedListNode();

          expect(list.unshiftNode(firstNode)).toBeUndefined();

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

        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        expect(list.shiftNode()).toBeUndefined();
      });
    });

    describe('Accessing list nodes based on their index number', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        expect(list.nodeAt(0)).toBeUndefined();
        expect(list.nodeAt(1)).toBeUndefined();
        expect(list.nodeAt(-1)).toBeUndefined();

        const nodeArray: SinglyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new SinglyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        expect(list.nodeAt(NODES_SIZE)).toBeUndefined();

        for (let i = 0; i < NODES_SIZE; i++) {
          expect(list.nodeAt(i)).toBe(nodeArray[i]);
        }

        expect(list.size).toBe(NODES_SIZE);
        expect(list.head).not.toBeNull();
        expect(list.tail).not.toBeNull();

        expect(list.clear()).toBeUndefined();

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        expect(list.nodeAt(0)).toBeUndefined();
        expect(list.nodeAt(1)).toBeUndefined();
        expect(list.nodeAt(-1)).toBeUndefined();

        const nodeArray: DoublyLinkedListNode[] = [];

        for (let i = 0; i < NODES_SIZE; i++) {
          const n = new DoublyLinkedListNode();
          nodeArray[i] = n;
          list.pushNode(n);
        }

        expect(list.nodeAt(NODES_SIZE)).toBeUndefined();

        for (let i = 0; i < NODES_SIZE; i++) {
          expect(list.nodeAt(i)).toBe(nodeArray[i]);
        }

        expect(list.size).toBe(NODES_SIZE);
        expect(list.head).not.toBeNull();
        expect(list.tail).not.toBeNull();

        expect(list.clear()).toBeUndefined();

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
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
