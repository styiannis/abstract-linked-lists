import { singlyLinkedList } from '../src';
import { isValidObjectInstance } from './test-utils';

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
    });
  });
});
