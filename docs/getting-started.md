# Getting started

From an empty project to a list you can add to, walk in both directions, and
remove from in constant time.

**Last verified:** 2026-09-16 · v1.1.0 · Node ≥ 18.12

## Install

```bash
npm install abstract-linked-lists
```

The package has no runtime dependencies. It ships an ES build, a CommonJS
build and type definitions, so TypeScript needs no additional configuration
and JavaScript works with either module system.

## Put your own objects in a list

The first thing to know is that this library does not store values. It links
nodes, and a node is whatever you extend `DoublyLinkedListNode` with. Your
class becomes the node, rather than being wrapped by one.

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(
    public readonly id: string,
    public readonly payload: string
  ) {
    super();
  }
}

const queue = new DoublyLinkedList<Job>();

const first = new Job('j1', 'resize');
queue.pushNode(first);
queue.pushNode(new Job('j2', 'upload'));
queue.unshiftNode(new Job('j0', 'authenticate'));

console.log(queue.size); // 3
console.log(queue.head?.payload); // authenticate
console.log(queue.tail?.payload); // upload
```

`pushNode` appends, `unshiftNode` prepends, and both are constant time. Pass
the class as the generic parameter, as `DoublyLinkedList<Job>` does above, and
`head`, `tail`, `nodeAt` and the iterators all give you back a `Job` rather
than a bare node.

## Walk it

A list is iterable in the usual way, and the iterator takes an argument for
the other direction.

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(
    public readonly id: string,
    public readonly payload: string
  ) {
    super();
  }
}

const queue = new DoublyLinkedList<Job>();

const first = new Job('j1', 'resize');
queue.pushNode(first);
queue.pushNode(new Job('j2', 'upload'));
queue.unshiftNode(new Job('j0', 'authenticate'));

for (const job of queue) {
  console.log(job.id, job.payload);
}
// j0 authenticate
// j1 resize
// j2 upload

console.log([...queue[Symbol.iterator](true)].map((job) => job.id));
// [ 'j2', 'j1', 'j0' ]

console.log(queue.nodeAt(1)?.id); // j1
console.log(queue.nodeAt(7)); // undefined
```

`nodeAt` on a doubly linked list starts from whichever end is closer, so it
costs `O(min(k, n - k))`. An index outside the list returns `undefined`; the
library does not throw.

## Remove a node you are already holding

This is the operation the structure exists for. You kept a reference to
`first` when you queued it, so cancelling that job does not require finding it
first.

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(
    public readonly id: string,
    public readonly payload: string
  ) {
    super();
  }
}

const queue = new DoublyLinkedList<Job>();

const first = new Job('j1', 'resize');
queue.pushNode(first);
queue.pushNode(new Job('j2', 'upload'));
queue.unshiftNode(new Job('j0', 'authenticate'));

const cancelled = queue.removeNode(first);

console.log(cancelled === first); // true
console.log(cancelled?.payload); // resize
console.log([...queue].map((job) => job.id)); // [ 'j0', 'j2' ]
console.log(queue.size); // 2
console.log(first.previous, first.next); // null null
```

`removeNode` is constant time wherever the node sits — `first` above was
already in the middle of the queue, not an end. It reassigns `head` or `tail`
if the node was an end, unlinks it from its neighbours, decrements `size`, and
hands the node back — or `undefined` if the list was already empty, which is
the one thing the call can tell you that you did not already know. The node
comes back isolated, so it can be pushed straight into another list.

A lower-level `detach()` exists on the node itself, without the list-side
bookkeeping; [faq.md](faq.md) covers the difference and when it shows up.

## Take from either end

When the position is an end rather than a held reference, the list does the
bookkeeping itself.

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(
    public readonly id: string,
    public readonly payload: string
  ) {
    super();
  }
}

const q3 = new DoublyLinkedList<Job>();
q3.pushNode(new Job('a', 'one'));
q3.pushNode(new Job('b', 'two'));

console.log(q3.shiftNode()?.id); // a
console.log(q3.popNode()?.id); // b
console.log(q3.popNode()); // undefined
console.log(q3.size); // 0
```

Both return the node they removed, or `undefined` on an empty list — the same
shape as `removeNode`. On a doubly linked list both are constant time.

## Choose singly or doubly

Use `SinglyLinkedList` when you only ever add and remove at the head and walk
forward. It costs eight bytes less per node — 40 against 48 for a node
carrying one number — and that is the whole of the difference in its favour.

Everything else favours the doubly linked list. `popNode` on a singly linked
list walks the entire list to reach the predecessor of the last node, reverse
iteration builds a stack of every node instead of following `previous`
pointers, and `removeNode` has to find the node's predecessor by walking from
`head`:

```typescript
import { SinglyLinkedList, SinglyLinkedListNode } from 'abstract-linked-lists';

class Item extends SinglyLinkedListNode {
  constructor(public readonly value: number) {
    super();
  }
}

const list = new SinglyLinkedList<Item>();
[1, 2, 3].forEach((value) => list.pushNode(new Item(value)));

const second = list.nodeAt(1)!;

console.log(list.removeNode(second)?.value); // 2
console.log(
  list.size,
  [...list].map((item) => item.value)
); // 2 [ 1, 3 ]
```

The call is `O(n)` rather than the `O(1)` of its doubly linked counterpart, so
in a singly linked list a removal that is not at the head is a walk, whatever
the shape of the API suggests.

When the predecessor is already in hand — mid-traversal, or because you kept
it — `removeNodeAfter` skips the search and removes in constant time:

```typescript
const first = list.nodeAt(0)!;

console.log(list.removeNodeAfter(first)?.value); // 3
console.log(list.size); // 1
```

It exists on `DoublyLinkedList` too, for the same interface, though there
`removeNode` is already constant time.

## The same operations without the classes

Every method shown above is one line: `DoublyLinkedList.popNode` is
`return popNode(this)`, and the rest have that shape too. The functions it
delegates to are exported, so the whole API is available over plain objects,
with no class involved and the same complexity:

```typescript
import {
  doublyLinkedList,
  IDoublyLinkedList,
  IDoublyLinkedListNode,
} from 'abstract-linked-lists';

const { iterators, list: dll, node: dllNode } = doublyLinkedList;

interface Entry extends IDoublyLinkedListNode {
  key: string;
}

const list = dll.create<IDoublyLinkedList<Entry>>();

for (const key of ['x', 'y', 'z']) {
  dll.pushNode(list, { ...dllNode.create<Entry>(), key });
}

const middle = dll.nodeAt(list, 1)!;

console.log(dll.removeNode(list, middle)?.key); // y
console.log(
  list.size,
  [...iterators.inOrder(list.head)].map((n) => n.key)
); // 2 [ 'x', 'z' ]
```

A core list is the plain object `{ size, head, tail }`, with no
`Symbol.iterator` on it — the classes add that, and it is the only member they
add rather than delegate. Hence `iterators.inOrder(list.head)` above, where
the class form would be `for...of`.

Neither form is the wrapper of the other: they operate on the same shapes, so
a class instance can be passed to these functions and an object like `Entry`
can be handed to code expecting a list. Which one you use is a question of the
style your project is written in — with one case where it is not a preference,
described in
[architecture-and-api.md](architecture-and-api.md#two-layers).

## What this page did not cover

[faq.md](faq.md) covers the behaviour this page has only touched — what
`clear()` does to your nodes, what happens when a node is pushed into two
lists, and which module system resolves to which build.
[architecture-and-api.md](architecture-and-api.md) explains why the library is
split into these two layers and what the abstract classes are for.
