# Abstract Linked Lists

[![NPM Version](https://img.shields.io/npm/v/abstract-linked-lists)](https://www.npmjs.com/package/abstract-linked-lists)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/styiannis/abstract-linked-lists)](https://coveralls.io/github/styiannis/abstract-linked-lists?branch=main)

Singly and doubly linked lists for TypeScript in which **your object is the
node**. The pointers live on the object itself, so a list holds your objects
directly, with no per-element wrapper to allocate.

Each structure is available as a class and as the plain functions the class
delegates to.

## Install

```bash
npm install abstract-linked-lists
```

`yarn add` and `pnpm add` work the same way. The package requires Node 18.12 or
later, and ships an ES build and a CommonJS build with type definitions for
each.

## The node is the abstraction

A `SinglyLinkedListNode` has exactly one property, `next`. A
`DoublyLinkedListNode` has two, `previous` and `next`. Neither has a value
field, because the value is whatever you extend the node with:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class TaskNode extends DoublyLinkedListNode {
  constructor(public readonly name: string) {
    super();
  }
}

const queue = new DoublyLinkedList<TaskNode>();

const fetchTask = new TaskNode('fetch');

queue.pushNode(fetchTask);
queue.pushNode(new TaskNode('parse'));

queue.unshiftNode(new TaskNode('auth'));

console.log(queue.size); // 3
console.log(queue.head?.name, queue.tail?.name); // auth parse

for (const node of queue) {
  console.log(node.name); // auth, fetch, parse
}

for (const node of queue[Symbol.iterator](true)) {
  console.log(node.name); // parse, fetch, auth
}
```

The generic parameter carries the subclass through, so `head`, `tail`, `nodeAt`
and the iterators all return `TaskNode`.

## Two layers over the same structures

The classes above delegate to a layer of plain functions that operate on plain
objects. That layer is exported as well, for code that would rather not
allocate class instances:

```typescript
import {
  doublyLinkedList,
  type IDoublyLinkedList,
  type IDoublyLinkedListNode,
} from 'abstract-linked-lists';

const { iterators, list: dll, node: dllNode } = doublyLinkedList;

interface Entry extends IDoublyLinkedListNode {
  key: string;
}

const list = dll.create<IDoublyLinkedList<Entry>>();

for (const key of ['x', 'y', 'z']) {
  dll.pushNode(list, { ...dllNode.create<Entry>(), key });
}

console.log(list.size, list.head?.key, list.tail?.key); // 3 x z
console.log([...iterators.inReverseOrder(list.tail)].map((n) => n.key)); // [ 'z', 'y', 'x' ]
```

## Importing

Everything the package exports is available from its root:

```typescript
import {
  SinglyLinkedList, // class
  DoublyLinkedList, // class
  SinglyLinkedListNode, // class, to extend with your own fields
  DoublyLinkedListNode, // class, to extend with your own fields
  singlyLinkedList, // the functions SinglyLinkedList delegates to
  doublyLinkedList, // the functions DoublyLinkedList delegates to
  type ISinglyLinkedListNode, // { next }
  type IDoublyLinkedListNode, // { previous, next }
} from 'abstract-linked-lists';
```

The same root exports the five abstract classes listed under [API](#api) and
the list interfaces `ILinkedList`, `ISinglyLinkedList` and `IDoublyLinkedList`.

Each structure is additionally published under its own subpath, and each of its
modules (`list`, `node`, `iterators`) under one more, for code that should
carry nothing else:

```typescript
import * as dll from 'abstract-linked-lists/doubly-linked-list';
import { pushNode } from 'abstract-linked-lists/doubly-linked-list/list';

console.log(pushNode === dll.list.pushNode); // true
```

## API

`SinglyLinkedList<N>` and `DoublyLinkedList<N>` expose the same members and
differ only in what those cost. They extend `AbstractSinglyLinkedList<N>` and
`AbstractDoublyLinkedList<N>`, which both extend `AbstractLinkedList<N>`. Those
three and the two abstract node classes, `AbstractSinglyLinkedListNode` and
`AbstractDoublyLinkedListNode`, are exported for implementations of your own.

| Member                         | Singly                                  | Doubly          |
| ------------------------------ | --------------------------------------- | --------------- |
| `size` `head` `tail`           | ✓                                       | ✓               |
| `pushNode(node)`               | `O(1)`                                  | `O(1)`          |
| `unshiftNode(node)`            | `O(1)`                                  | `O(1)`          |
| `shiftNode()`                  | `O(1)`                                  | `O(1)`          |
| `popNode()`                    | `O(n)`                                  | `O(1)`          |
| `nodeAt(k)`                    | `O(k)`                                  | `O(min(k,n-k))` |
| `clear()`                      | `O(1)`                                  | `O(1)`          |
| `[Symbol.iterator](reversed?)` | `O(n)`                                  | `O(n)`          |
| `node.detach(...)`             | `O(1)`, caller supplies the predecessor | `O(1)`          |

Reverse iteration on a singly linked list first copies every node onto a stack,
so it takes `O(n)` space. On a doubly linked list it follows the `previous`
pointers in constant space.

`clear()` resets `size`, `head` and `tail` and leaves the nodes' own pointers
as they were. `pushNode` and `unshiftNode` overwrite those pointers, so a
cleared node can be added again.

`node.detach(...)` relinks the node's neighbours and resets the node's own
pointers. It does not touch the list: `size`, `head` and `tail` keep their
values, even when the node was the list's `head` or `tail`. On a singly linked list,
`detach(predecessor)` first checks that `predecessor.next` is the node, and does
nothing if it is not.

Nothing in the library throws. An index out of range, or a removal from an
empty list, returns `undefined`. No call that takes a node checks that it
belongs to the list: a node from another list is acted on as though it
belonged, and both lists can be left inconsistent.

## When not to use it

A linked list pays for its constant-time edits with a pointer in every node
and a walk for every traversal. What follows are the cases where nothing is
bought with them.

| If this describes the problem                     | Reach for                                                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mostly traversal or indexing                      | an `Array` — a traversal visits every element of either, but only the array can reach one without passing the rest                                                                     |
| Elements are appended and iterated, never removed | an `Array` — it does both without a pointer on every element                                                                                                                           |
| Elements are looked up by key                     | a `Map`, alone or kept beside the list — `pushNode` indexes nothing, and there is no `find`                                                                                            |
| A container that owns its values                  | a wrapper written on top — `pushNode` takes a node, not a value, and there is no `push(value)`, `indexOf` or `filter`                                                                  |
| Removal from the tail of a singly linked list     | `DoublyLinkedList` — the singly linked `popNode` walks the whole list to reach the tail's predecessor, while the doubly linked one pops in constant time for one more pointer per node |
| One object in two lists at once                   | a separate node per list — a node has one set of pointers, and pushing it into a second list overwrites them                                                                           |

## Documentation

- [The generated API reference](https://styiannis.github.io/abstract-linked-lists/)
  — every signature and every type.
- [Open an issue](https://github.com/styiannis/abstract-linked-lists/issues)
  for a question or a bug report.

Released under the
[MIT License](https://github.com/styiannis/abstract-linked-lists/blob/main/LICENSE).
