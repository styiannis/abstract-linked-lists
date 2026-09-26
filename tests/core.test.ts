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
        expect(next.next).toBe(null);

        // A node that does not precede the node is rejected, and nothing is changed.
        singlyLinkedList.node.detach(node, next);

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

        expect(singlyLinkedList.list.removeNode(list, singleNode)).toBe(
          undefined
        );

        const first = singlyLinkedList.node.create();
        const second = singlyLinkedList.node.create();
        const third = singlyLinkedList.node.create();
        const forth = singlyLinkedList.node.create();
        const fifth = singlyLinkedList.node.create();

        for (const node of [first, second, third, forth, fifth]) {
          singlyLinkedList.list.pushNode(list, node);
        }

        // A node that is not part of the list leaves the list untouched.
        expect(singlyLinkedList.list.removeNode(list, singleNode)).toBe(
          undefined
        );

        expect(list.size).toBe(5);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(fifth);

        expect(singlyLinkedList.list.removeNode(list, third)).toBe(third);

        expect(list.size).toBe(4);
        expect(second.next).toBe(forth);
        expect(third.next).toBe(null);

        singlyLinkedList.list.removeNode(list, first);

        expect(list.size).toBe(3);
        expect(list.head).toBe(second);
        expect(first.next).toBe(null);

        singlyLinkedList.list.removeNode(list, fifth);

        expect(list.size).toBe(2);
        expect(list.tail).toBe(forth);
        expect(forth.next).toBe(null);
        expect(fifth.next).toBe(null);

        // A node that still carries pointers is relinked from scratch.
        const newNode = singlyLinkedList.node.create(singleNode);

        singlyLinkedList.list.pushNode(list, newNode);

        expect(list.size).toBe(3);
        expect(list.tail).toBe(newNode);
        expect(forth.next).toBe(newNode);
        expect(newNode.next).toBe(null);

        singlyLinkedList.list.removeNode(list, second);
        singlyLinkedList.list.removeNode(list, forth);
        singlyLinkedList.list.removeNode(list, newNode);

        expect(list.size).toBe(0);
        expect(list.head).toBe(null);
        expect(list.tail).toBe(null);
        expect(second.next).toBe(null);
        expect(forth.next).toBe(null);
        expect(newNode.next).toBe(null);

        expect(singlyLinkedList.list.removeNode(list, singleNode)).toBe(
          undefined
        );

        // "clear" detaches every node it removes.
        singlyLinkedList.list.pushNode(list, first);
        singlyLinkedList.list.pushNode(list, second);
        singlyLinkedList.list.clear(list);

        expect(list.size).toBe(0);
        expect(first.next).toBe(null);

        // The same holds for "unshiftNode".
        newNode.next = first;
        singlyLinkedList.list.unshiftNode(list, newNode);

        expect(newNode.next).toBe(null);
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        const singleNode = doublyLinkedList.node.create();

        expect(doublyLinkedList.list.removeNode(list, singleNode)).toBe(
          undefined
        );

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

        // A node that still carries pointers is relinked from scratch.
        const newNode = doublyLinkedList.node.create(
          null,
          doublyLinkedList.node.create()
        );

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

        expect(doublyLinkedList.list.removeNode(list, singleNode)).toBe(
          undefined
        );

        // "clear" detaches every node it removes.
        doublyLinkedList.list.pushNode(list, first);
        doublyLinkedList.list.pushNode(list, second);
        doublyLinkedList.list.clear(list);

        expect(list.size).toBe(0);
        expect(first.next).toBe(null);
        expect(second.previous).toBe(null);

        // The same holds for "unshiftNode".
        newNode.next = first;
        newNode.previous = first;
        doublyLinkedList.list.unshiftNode(list, newNode);

        expect(newNode.next).toBe(null);
        expect(newNode.previous).toBe(null);

        // A stale "previous" is overwritten at both ends, empty list or not.
        first.previous = second;
        doublyLinkedList.list.unshiftNode(list, first);

        expect(first.previous).toBe(null);
        expect(first.next).toBe(newNode);

        doublyLinkedList.list.clear(list);
        second.previous = first;
        doublyLinkedList.list.pushNode(list, second);

        expect(second.previous).toBe(null);
      });

      it('"clear" detaches every node, for odd and even lengths', () => {
        for (const length of [1, 2, 3, 4, 5]) {
          const list = doublyLinkedList.list.create();

          const nodes = Array.from({ length }, () =>
            doublyLinkedList.node.create()
          );

          for (const node of nodes) {
            doublyLinkedList.list.pushNode(list, node);
          }

          doublyLinkedList.list.clear(list);

          expect(list.size).toBe(0);
          expect(list.head).toBe(null);
          expect(list.tail).toBe(null);

          for (const node of nodes) {
            expect(node.next).toBe(null);
            expect(node.previous).toBe(null);
          }
        }
      });
    });

    describe('Remove the node after a given node using the "removeNodeAfter" function', () => {
      it('Singly linked list', () => {
        const list = singlyLinkedList.list.create();

        const first = singlyLinkedList.node.create();
        const second = singlyLinkedList.node.create();
        const third = singlyLinkedList.node.create();

        for (const node of [first, second, third]) {
          singlyLinkedList.list.pushNode(list, node);
        }

        expect(singlyLinkedList.list.removeNodeAfter(list, first)).toBe(second);

        expect(list.size).toBe(2);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(third);
        expect(first.next).toBe(third);
        expect(second.next).toBe(null);

        // Removing the node after the one before the tail moves the tail back.
        expect(singlyLinkedList.list.removeNodeAfter(list, first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBe(null);
        expect(third.next).toBe(null);

        // The tail has no next node, so there is nothing to remove.
        expect(singlyLinkedList.list.removeNodeAfter(list, first)).toBe(
          undefined
        );

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
      });

      it('Doubly linked list', () => {
        const list = doublyLinkedList.list.create();

        const first = doublyLinkedList.node.create();
        const second = doublyLinkedList.node.create();
        const third = doublyLinkedList.node.create();

        for (const node of [first, second, third]) {
          doublyLinkedList.list.pushNode(list, node);
        }

        expect(doublyLinkedList.list.removeNodeAfter(list, first)).toBe(second);

        expect(list.size).toBe(2);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(third);
        expect(first.next).toBe(third);
        expect(third.previous).toBe(first);
        expect(second.next).toBe(null);
        expect(second.previous).toBe(null);

        expect(doublyLinkedList.list.removeNodeAfter(list, first)).toBe(third);

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
        expect(first.next).toBe(null);
        expect(third.next).toBe(null);
        expect(third.previous).toBe(null);

        // The tail has no next node, so there is nothing to remove.
        expect(doublyLinkedList.list.removeNodeAfter(list, first)).toBe(
          undefined
        );

        expect(list.size).toBe(1);
        expect(list.head).toBe(first);
        expect(list.tail).toBe(first);
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
