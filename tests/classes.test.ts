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

        // A node that does not precede the node is rejected, and nothing is changed.
        node.detach(next);

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

    describe('Remove a specific node from a list using the "removeNode" method', () => {
      it('Singly linked list', () => {
        const list = new SinglyLinkedList();

        const singleNode = new SinglyLinkedListNode();

        expect(list.removeNode(singleNode)).toBeUndefined();

        const first = new SinglyLinkedListNode();
        const second = new SinglyLinkedListNode();
        const third = new SinglyLinkedListNode();
        const forth = new SinglyLinkedListNode();
        const fifth = new SinglyLinkedListNode();

        for (const node of [first, second, third, forth, fifth]) {
          list.pushNode(node);
        }

        // A node that is not part of the list leaves the list untouched.
        expect(list.removeNode(singleNode)).toBeUndefined();

        expect(list.size).toBe(5);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(fifth);

        expect(list.removeNode(third)).toBe(third);

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBeNull();

        list.removeNode(first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBeNull();

        list.removeNode(fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBeNull();
        expect(fifth.next).toBeNull();

        // A node that still carries pointers is relinked from scratch.
        const newNode = new SinglyLinkedListNode(singleNode);

        list.pushNode(newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBeNull();

        list.removeNode(second);
        list.removeNode(forth);
        list.removeNode(newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
        expect(second.next).toBeNull();
        expect(forth.next).toBeNull();
        expect(newNode.next).toBeNull();

        expect(list.removeNode(singleNode)).toBeUndefined();

        // "clear" detaches every node it removes.
        list.pushNode(first);
        list.pushNode(second);
        list.clear();

        expect(list.size).toBe(0);
        expect(first.next).toBeNull();

        // The same holds for "unshiftNode".
        newNode.next = first;
        list.unshiftNode(newNode);

        expect(newNode.next).toBeNull();
      });

      it('Doubly linked list', () => {
        const list = new DoublyLinkedList();

        const singleNode = new DoublyLinkedListNode();

        expect(list.removeNode(singleNode)).toBeUndefined();

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
        expect(third.next).toBeNull();
        expect(third.previous).toBeNull();
        expect(forth.previous).toBe(second);

        list.removeNode(first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBeNull();
        expect(first.previous).toBeNull();
        expect(second.previous).toBeNull();

        list.removeNode(fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBeNull();
        expect(fifth.next).toBeNull();
        expect(fifth.previous).toBeNull();

        // A node that still carries pointers is relinked from scratch.
        const newNode = new DoublyLinkedListNode(
          null,
          new DoublyLinkedListNode()
        );

        list.pushNode(newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBeNull();
        expect(newNode.previous).toBe(forth);

        list.removeNode(second);
        list.removeNode(forth);
        list.removeNode(newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
        expect(second.next).toBeNull();
        expect(second.previous).toBeNull();
        expect(forth.next).toBeNull();
        expect(forth.previous).toBeNull();
        expect(newNode.next).toBeNull();
        expect(newNode.previous).toBeNull();

        expect(list.removeNode(singleNode)).toBeUndefined();

        // "clear" detaches every node it removes.
        list.pushNode(first);
        list.pushNode(second);
        list.clear();

        expect(list.size).toBe(0);
        expect(first.next).toBeNull();
        expect(second.previous).toBeNull();

        // The same holds for "unshiftNode".
        newNode.next = first;
        newNode.previous = first;
        list.unshiftNode(newNode);

        expect(newNode.next).toBeNull();
        expect(newNode.previous).toBeNull();

        // A stale "previous" is overwritten at both ends, empty list or not.
        first.previous = second;
        list.unshiftNode(first);

        expect(first.previous).toBeNull();
        expect(first.next).toBe(newNode);

        list.clear();
        second.previous = first;
        list.pushNode(second);

        expect(second.previous).toBeNull();
      });

      it('"clear" detaches every node, for odd and even lengths', () => {
        for (const length of [1, 2, 3, 4, 5]) {
          const list = new DoublyLinkedList();

          const nodes = Array.from(
            { length },
            () => new DoublyLinkedListNode()
          );

          for (const node of nodes) {
            list.pushNode(node);
          }

          list.clear();

          expect(list.size).toBe(0);
          expect(list.head).toBeNull();
          expect(list.tail).toBeNull();

          for (const node of nodes) {
            expect(node.next).toBeNull();
            expect(node.previous).toBeNull();
          }
        }
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
        expect(second.next).toBeNull();

        // Removing the node after the one before the tail moves the tail back.
        expect(list.removeNodeAfter(first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBeNull();
        expect(third.next).toBeNull();

        // The tail has no next node, so there is nothing to remove.
        expect(list.removeNodeAfter(first)).toBeUndefined();

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
        expect(second.next).toBeNull();
        expect(second.previous).toBeNull();

        expect(list.removeNodeAfter(first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBeNull();
        expect(third.next).toBeNull();
        expect(third.previous).toBeNull();

        expect(list.removeNodeAfter(first)).toBeUndefined();

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
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
