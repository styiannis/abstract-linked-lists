# FAQ

Behaviour that surprises readers of the API, what the library does instead of
throwing, and the questions the package shape raises.

**Last verified:** 2026-09-20 · v2.0.0

## Behaviour

### `size` did not change when I called `detach()`

`detach()` is a method on the node, and a node holds no reference to the list
it belongs to. It relinks its neighbours and clears its own pointers. It
cannot update a `size` it cannot see.

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

first.detach();

console.log([...queue].map((job) => job.id)); // [ 'j0', 'j2' ]
console.log(queue.size); // 3
```

Call the list's `removeNode` instead. It does both halves — the relinking and
the `size`, `head` and `tail` the node cannot reach:

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

queue.removeNode(first);

console.log([...queue].map((job) => job.id)); // [ 'j0', 'j2' ]
console.log(queue.size); // 2
```

### `head` or `tail` still points at a node I detached

Same cause, and the more damaging form of it. Detaching an end node leaves the
list's `head` or `tail` referring to a node that is no longer in the chain:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(public readonly id: string) {
    super();
  }
}

const list = new DoublyLinkedList<Job>();

const c = new Job('c');

list.pushNode(new Job('a'));
list.pushNode(c);

c.detach();

console.log(list.tail?.id); // c
console.log([...list].map((n) => n.id)); // [ 'a' ]
```

Forward iteration starts at `head` and stops at the first `null`, so it stays
correct; the recorded ends do not. `removeNode` reassigns them before it
unlinks, which is the reason to prefer it to a bare `detach()`.

### What does `clear()` do to my nodes?

It detaches every one of them, setting each node's `next` (and, on a doubly
linked list, its `previous`) to `null`. A singly linked list walks from
`head`; a doubly linked one walks inward from `head` and `tail` at once. Then
it resets the list: `size` to `0`, `head` and `tail` to `null`.

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(public readonly id: string) {
    super();
  }
}

const list = new DoublyLinkedList<Job>();

const n1 = new Job('n1');
const n2 = new Job('n2');

list.pushNode(n1);
list.pushNode(n2);

list.clear();

console.log(list.size, list.head); // 0 null
console.log(n1.next, n2.previous); // null null
```

No node leaves the list still pointing into it. Each one can be pushed into
another list as it is, and holding a reference to one of them does not keep the
rest of the old list in memory.

### Why is `node.next` typed as the base class instead of my subclass?

`next` and `previous` are declared on the base type: `DoublyLinkedListNode | null`
on the class, `IDoublyLinkedListNode | null` on the interface, and likewise for
the singly linked variants. The list is generic in its node type, so `head`,
`tail`, `nodeAt` and the iterators return your type, but a step from a node to
its neighbour is typed as the base.

Narrow the pointers once, where your node type is declared. On a class,
`declare` redeclares them without emitting code or changing anything at
runtime. On an interface, redeclaring them is enough:

```typescript
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
  doublyLinkedList,
  IDoublyLinkedList,
  IDoublyLinkedListNode,
} from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  declare previous: Job | null;
  declare next: Job | null;

  constructor(public readonly id: string) {
    super();
  }
}

interface Entry extends IDoublyLinkedListNode {
  previous: Entry | null;
  next: Entry | null;
  key: string;
}

const queue = new DoublyLinkedList<Job>();

queue.pushNode(new Job('a'));
queue.pushNode(new Job('b'));

console.log(queue.head?.next?.id); // b

const { list: dll, node: dllNode } = doublyLinkedList;

const entries = dll.create<IDoublyLinkedList<Entry>>();

dll.pushNode(entries, { ...dllNode.create<Entry>(), key: 'x' });
dll.pushNode(entries, { ...dllNode.create<Entry>(), key: 'y' });

console.log(entries.head?.next?.key); // y
```

Neither form loosens anything: assigning a different node type to `next` is
still a compile error.

### How do I iterate in reverse?

Call the iterator with an argument. `for...of` and the spread form both invoke
it with no argument, which is forward order:

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

queue.pushNode(new Job('j1', 'resize'));
queue.pushNode(new Job('j2', 'upload'));
queue.unshiftNode(new Job('j0', 'authenticate'));

console.log([...queue].map((job) => job.id)); // [ 'j0', 'j1', 'j2' ]
console.log([...queue[Symbol.iterator](true)].map((job) => job.id)); // [ 'j2', 'j1', 'j0' ]
```

On a doubly linked list this follows the `previous` pointers in constant
space. On a singly linked list there are no `previous` pointers, so the
iterator first pushes every node onto a stack and then drains it: the same
`O(n)` time, but `O(n)` memory rather than `O(1)`.

### Can I remove nodes while iterating over the list?

Not the node the iterator is currently on. To advance, the iterator reads the
current node's `next`, or its `previous` when walking a doubly linked list
backwards. `removeNode` and `detach()` both set those pointers to `null`, so
the walk stops at the node you removed:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(public readonly id: string) {
    super();
  }
}

const l = new DoublyLinkedList<Job>();

['w', 'x', 'y', 'z'].forEach((id) => l.pushNode(new Job(id)));

const seen: string[] = [];
for (const n of l) {
  seen.push(n.id);
  if (n.id === 'x') {
    l.removeNode(n);
  }
}

console.log(seen); // [ 'w', 'x' ]
console.log(l.size); // 3
console.log([...l].map((n) => n.id)); // [ 'w', 'y', 'z' ]
```

The list itself is correct afterwards. Only the walk ended early.

Removing any node other than the current one is safe. The removal relinks
around it, and the iterator follows the new links.

All of this holds for forward iteration on both structures and for reverse
iteration on a doubly linked list. Reverse iteration on a singly linked list
works differently. It first copies every node onto a stack, then walks the
stack rather than the links. Removals made during the walk do not affect it:
it never stops early, and it still visits nodes removed after it started.

In every case, to remove safely the node you are on, iterate over a snapshot:
`for (const n of [...list])`.

### Can the same node be in two lists at once?

No, but nothing stops you from trying. A node has a single set of pointers,
so it can hold one position in one chain. Pushing it into a second list
overwrites those pointers and silently joins the two lists:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  constructor(public readonly id: string) {
    super();
  }
}

const a = new DoublyLinkedList<Job>();
a.pushNode(new Job('a1'));

const b = new DoublyLinkedList<Job>();
b.pushNode(new Job('b1'));

const shared = new Job('s');

a.pushNode(shared); // list a: a1 -> s
b.pushNode(shared); // list b: b1 -> s

console.log([...a].map((n) => n.id)); // [ 'a1', 's' ]
console.log([...a[Symbol.iterator](true)].map((n) => n.id)); // [ 's', 'b1' ]
```

Walking `a` forwards looks right. Walking it backwards from its tail leaves
`a` entirely and ends up in `b`. A node belongs to one list. Put a second node
in the other one.

### What happens if I push a node that is already linked to something?

Its old links are overwritten. `pushNode` and `unshiftNode` set every pointer
the node has, so it arrives with no neighbours except the ones the list gives
it:

```typescript
import { SinglyLinkedList, SinglyLinkedListNode } from 'abstract-linked-lists';

class Item extends SinglyLinkedListNode {
  constructor(public readonly value: number) {
    super();
  }
}

const list = new SinglyLinkedList<Item>();

const stray = new Item(9);
stray.next = new Item(99);

list.pushNode(stray);

console.log(list.size); // 1
console.log([...list].map((n) => n.value)); // [ 9 ]
console.log(stray.next); // null
```

Only the pushed node's own pointers change. If it was still in another list,
that list and the neighbours it had there continue pointing at it, as in
[the previous question](#can-the-same-node-be-in-two-lists-at-once). To move a
node, remove it from its list first and then push it into the new one.

### Why did constructing a node change the nodes I passed to it?

Because the constructor links the new node to them.
`new DoublyLinkedListNode(previous, next)` sets its own `previous` and `next`,
and also `previous.next` and `next.previous`, so the new node sits between the
two:

```typescript
import { DoublyLinkedListNode } from 'abstract-linked-lists';

class Nd extends DoublyLinkedListNode {
  constructor(public readonly id: string) {
    super();
  }
}

const a = new Nd('a');
const b = new Nd('b');

const middle = new DoublyLinkedListNode(a, b);

console.log(a.next === middle, b.previous === middle); // true true
```

The two-argument form exists to build a chain by hand in a single expression.
Called with no arguments, as in every other example on this page, the
constructor creates an isolated node and modifies nothing else.

The constructor links, but it does not insert. It does not look at what the
nodes passed to it were already linked to. If `a` is followed by `b` and only
`a` is passed, `a.next` becomes the new node, which has no `next` of its own,
so the chain from `a` ends there, while `b.previous` still points at `a`. To
place a node between two others, pass both.

### Does the list copy or own my objects?

Neither. It stores references to the nodes you pass and reads and writes their
`next` and `previous` fields. Every other property is yours, untouched, and
the node you get back from `popNode` or `nodeAt` is the same object you put
in.

## What happens instead of an error

Nothing in `src/` throws. There is no validation layer and no `TypeError` to
catch, which keeps the operations to the pointer updates they describe and
makes misuse silent rather than loud. These are the cases worth knowing:

| Call                                                                                 | Result                                                                                                              |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `nodeAt(i)` with `i < 0` or `i >= size`                                              | `undefined`                                                                                                         |
| `popNode()` or `shiftNode()` on an empty list                                        | `undefined`                                                                                                         |
| `removeNode(node)` on an empty list                                                  | `undefined`                                                                                                         |
| `removeNode(node)`, singly, where `node` is not in this list                         | `undefined`. The search from `head` never finds `node`, so nothing changes                                          |
| `removeNode(node)`, doubly, where `node` is not in this list                         | `node` is unlinked from the list it is actually in, this list's `size` drops by one, and `node` is returned         |
| `removeNodeAfter(predecessor)` where `predecessor` is the tail                       | `undefined`                                                                                                         |
| `removeNodeAfter(predecessor)` where `predecessor` is not in this list               | the node after `predecessor` is unlinked from the list it is actually in, and this list's `size` drops by one       |
| `pushNode(node)` where `node` is still in another list                               | `node`'s pointers are overwritten, and the list it came from still leads to it                                      |
| `node.detach(...)` on a node that is already detached                                | nothing happens                                                                                                     |
| singly `node.detach(predecessor)` where `predecessor.next` is not `node`             | nothing happens. The call checks this before relinking                                                              |
| singly `node.detach(null)` where `node` is not the head                              | `node` loses its `next`, so the nodes after it drop out of the chain. The list's `size` and `tail` still count them |
| `new DoublyLinkedListNode(previous, next)` where `previous` and `next` are in a list | the new node is linked between them, and the list's `size` does not count it                                        |

Most of these have one cause, and it is deliberate: a node holds no reference
to its list. A call handed a node therefore cannot check in constant time that
the node belongs to the list it was called on. Giving it that reference would
cost every node another pointer.

So these calls accept a node from another list without noticing, and act on
it as though it were theirs. Adding it, with `pushNode` or `unshiftNode`,
overwrites its pointers while the list it came from still points at it — see
[the question on sharing a node](#can-the-same-node-be-in-two-lists-at-once).
Removing it, with `removeNode` on a doubly linked list or `removeNodeAfter` on
either, unlinks it from the list it is really in and decrements the `size` of
the list you called. Both lists are then wrong: one has lost a node without
knowing, and the other counts one node fewer than it holds.

Two calls are exceptions, for different reasons. The singly linked
`removeNode` has to walk from `head` to find the predecessor anyway. If the
node is not in the list, the walk ends without finding it and the call returns
`undefined`. That is a consequence of the walk, not a check. The singly linked
`detach(predecessor)` does check, on purpose, because one comparison settles
it: `predecessor.next === node`. `detach(null)` cannot be checked. Passing
`null` claims that the node is the head, and a singly linked node does not know
what precedes it.

Everywhere else, `undefined` means there was nothing at that position. It
never means the node was a stranger.

## Environment and integration

### Does it work in the browser?

Yes. `src/` references no platform API — no `process`, no `document`, no
`Buffer`, no timers — so the built modules run unmodified in browsers, Node,
Deno, Bun, workers and edge runtimes. There is nothing to polyfill.

### ESM or CommonJS?

Both. `import` resolves to `dist/es/index.mjs` and `require` to
`dist/cjs/index.cjs`, each with its own declarations —
`dist/@types/es/index.d.mts` and `dist/@types/cjs/index.d.cts` — emitted from
the same source by the same build. The module system is carried by the file
extension rather than inferred from a `type` field, so Node reads each build
as what it is and neither path prints a warning.

### Can I import only part of the library?

Yes, at three depths. The package root exports everything. Each structure is
also an entry point of its own — `abstract-linked-lists/singly-linked-list` and
`abstract-linked-lists/doubly-linked-list` — exporting its `list`, `node` and
`iterators` modules as namespaces. And each of those modules is an entry point
too:

```typescript
import { doublyLinkedList } from 'abstract-linked-lists';
import * as dll from 'abstract-linked-lists/doubly-linked-list';
import { pushNode } from 'abstract-linked-lists/doubly-linked-list/list';

console.log(pushNode === dll.list.pushNode); // true
console.log(pushNode === doublyLinkedList.list.pushNode); // true
```

All three paths reach the same function, so they can be mixed freely, and each
resolves to the ES or CommonJS build like the root does. The classes and the
interfaces are exported from the root only.
[architecture-and-api.md](architecture-and-api.md#the-public-surface) lists
every export.

### Will unused parts be dropped from my bundle?

The package declares `"sideEffects": false` and ships an ES build that keeps
one module per source file, so a bundler that performs tree-shaking removes
what you do not import. Importing `SinglyLinkedList` alone does not pull in
the doubly linked list.

### What does it depend on at runtime?

Nothing. `dependencies` and `peerDependencies` are both absent from
`package.json`; everything under `devDependencies` is build and test tooling.

### What are the version requirements?

Node 18.12 or later, and npm 8 or later. The published code targets ES2022.
