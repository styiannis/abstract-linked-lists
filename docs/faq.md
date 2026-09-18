# FAQ

Behaviour that surprises readers of the API, what the library does instead of
throwing, and the questions the package shape raises.

**Last verified:** 2026-09-16 · v1.1.0

## Behaviour

### `size` did not change when I called `detach()`

`detach()` is a method on the node, and a node holds no reference to the list
it belongs to. It relinks its neighbours and clears its own pointers; it
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

The same call works on a singly linked list, where it finds the node's
predecessor by walking from `head` and so costs `O(n)`. If you already hold
that predecessor, `list.removeNodeAfter(predecessor)` removes the node after
it in constant time.

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
list.pushNode(new Job('a'));
const c = new Job('c');
list.pushNode(c);

c.detach();

console.log(list.tail?.id); // c
console.log([...list].map((n) => n.id)); // [ 'a' ]
```

Forward iteration starts at `head` and stops at the first `null`, so it stays
correct; the recorded ends do not. `removeNode` reassigns them before it
unlinks, which is the reason to prefer it to a bare `detach()`.

### What does `clear()` do to my nodes?

It resets the list — `size` to `0`, `head` and `tail` to `null` — and touches
no node at all. The nodes remain linked to each other:

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
console.log(n1.next === n2); // true
```

That is usually what you want, because it makes `clear()` constant time and
leaves any chain you still hold a reference to intact. If the nodes must be
isolated, walk the list and detach each one before clearing.

### Why is `node.next` typed as the base class instead of my subclass?

`DoublyLinkedListNode.next` is declared as `DoublyLinkedListNode | null` and
`SinglyLinkedListNode.next` as `SinglyLinkedListNode | null`. The list is
generic in its node type, so `list.head` and `list.nodeAt(i)` return your
subclass, but a step taken from one node to its neighbour is typed as the
base.

Narrow the two pointers once, on your own class, with `declare` — a type-only
redeclaration that emits no code and changes nothing at runtime:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class Job extends DoublyLinkedListNode {
  declare previous: Job | null;
  declare next: Job | null;

  constructor(public readonly id: string) {
    super();
  }
}

const queue = new DoublyLinkedList<Job>();
const a = new Job('a');
const b = new Job('b');
queue.pushNode(a);
queue.pushNode(b);

console.log(a.next?.id); // b

let cursor: Job | null = queue.head;
while (cursor) {
  console.log(cursor.id); // a, then b
  cursor = cursor.next;
}
```

No cast at the step, and nothing is loosened by it: assigning a different node
subclass to `a.next` is still a compile error.

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

No. The iterator holds the current node and reads `next` from it to advance,
and both `removeNode` and `detach()` set that pointer to `null`, so the walk
ends at the node you removed:

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
  if (n.id === 'x') l.removeNode(n);
}

console.log(seen); // [ 'w', 'x' ]
console.log(l.size); // 3
console.log([...l].map((n) => n.id)); // [ 'w', 'y', 'z' ]
```

The list is left correct; it is the walk that stops early. Collect first and
mutate afterwards — `[...list]` gives you a snapshot to iterate safely.

### Can the same node be in two lists at once?

No, and nothing prevents you from trying. A node has one `next` and one
`previous`, so it can occupy one position in one chain. Pushing it into a
second list rewrites those pointers and silently joins the two structures:

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
`a` entirely and ends up in `b`. A node belongs to one list; put a second node
in the other one.

### What happens if I push a node that is already linked to something?

`pushNode` and `unshiftNode` write the pointers they need and do not clear the
ones they do not. A node arriving with a live `next` keeps it, and the list
inherits a tail it never counted:

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
console.log([...list].map((n) => n.value)); // [ 9, 99 ]
```

Push nodes that are isolated: freshly constructed, or detached from wherever
they were.

### Why did constructing a node change the nodes I passed to it?

Because the constructor links the new node into them. `new
DoublyLinkedListNode(previous, next)` sets `previous.next` and `next.previous`
to itself:

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

It is a convenience for building a chain by hand, and it is the one place
where a constructor writes to its arguments. It also does not touch any list:
a node spliced in this way is invisible to the `size` of whatever list `a` and
`b` belong to. Constructed with no arguments — the form every example here
uses — the node is isolated and nothing else is modified.

### Does the list copy or own my objects?

Neither. It stores references to the nodes you pass and reads and writes their
`next` and `previous` fields. Every other property is yours, untouched, and
the node you get back from `popNode` or `nodeAt` is the same object you put
in.

## What happens instead of an error

Nothing in `src/` throws. There is no validation layer and no `TypeError` to
catch, which keeps the operations to the pointer updates they describe and
makes misuse silent rather than loud. These are the cases worth knowing:

| Call                                                        | Result                                                                                                                                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nodeAt(i)` with `i` out of range, or `-1`                  | `undefined`                                                                                                                                                      |
| `popNode()` / `shiftNode()` on an empty list                | `undefined`, and the list is left empty                                                                                                                          |
| `detach()` on an already-detached node                      | no-op; both pointers are already `null`                                                                                                                          |
| `detach(predecessor)` where it does not precede the node    | no-op; `predecessor.next` is compared to the node first, and nothing is relinked                                                                                 |
| `detach(null)` on a node that is not the head               | the chain is cut at the node; `size` and `tail` keep the old values                                                                                              |
| `removeNode(node)` on an empty list                         | `undefined`, and nothing is changed                                                                                                                              |
| `removeNode(node)`, singly, with a foreign node             | `undefined`; the walk from `head` never reaches it, so nothing is changed                                                                                        |
| `removeNode(node)`, doubly, with a foreign node             | `node` is unlinked from the list it really is in, the `size` of the list you called it on is decremented, and `node` is returned as though it had belonged there |
| `removeNodeAfter(predecessor)` where it is the tail         | `undefined`, and nothing is changed                                                                                                                              |
| `removeNodeAfter(predecessor)` with a foreign `predecessor` | `predecessor.next` is unlinked from the list it really is in, and the `size` of the list you called it on is decremented                                         |
| `pushNode(node)` with a linked `node`                       | the list adopts whatever `node.next` was pointing at                                                                                                             |

Most of these come from one absence, and it is a decision rather than an
oversight: a node carries no reference to the list it is in, so no call that
is handed a node can check that the node belongs to the list it was handed
alongside. Adding that reference would grow every node by another pointer and
make each one aware of a list it does not otherwise need to know about.

It applies to every function that takes a node, not to removal in particular.
`pushNode` and `unshiftNode` adopt whatever the node was already linked to.
`removeNodeAfter(predecessor)` relinks at the position it is handed. The doubly
linked `removeNode` unlinks a foreign node from wherever it really is. In each
case a node from another list corrupts two at once — the one that loses a node
without knowing, and the one whose `size` changes without gaining or losing
anything.

Two calls escape it, for unrelated reasons. `removeNode` on a singly linked
list has to search from `head` for the predecessor, and the search doubles as
a membership test, so a foreign node is reported as `undefined` and nothing is
touched — an accident of what the call costs rather than a design. The singly
`detach(predecessor)` escapes by design instead: it is the one call handed two
nodes that can contradict each other, and `predecessor.next === instance`
settles that in a single comparison, so it is checked. Neither is a general
guarantee. Passing `null` as `predecessor` claims the node is the head, and
that claim is not checkable at all — a singly linked node does not know what
precedes it.
Where an operation is `O(1)` and the question is membership, there is no such
moment, and no return value substitutes for one: `undefined` means there was
nothing at that position, never that the node was a stranger.

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

Yes — the core functions are published as subpaths, one per module:

```typescript
import * as list from 'abstract-linked-lists/doubly-linked-list/list';
import * as node from 'abstract-linked-lists/doubly-linked-list/node';
```

The available subpaths are `singly-linked-list` and `doubly-linked-list`, each
of them also with `/list`, `/node` and `/iterators`. The classes are only
available from the package root.

### Will unused parts be dropped from my bundle?

The package declares `"sideEffects": false` and ships an ES build that keeps
one module per source file, so a bundler that performs tree-shaking removes
what you do not import. Importing `SinglyLinkedList` alone does not pull in
the doubly linked list.

### What does it depend on at runtime?

Nothing. `dependencies` and `peerDependencies` are both absent from
`package.json`; everything under `devDependencies` is build and test tooling.

### What are the version requirements?

`engines` declares Node ≥ 18.12 and npm ≥ 8. The published JavaScript targets
ES2022. TypeScript users need a version that understands the `exports` field —
4.7 or later with `moduleResolution` set to `node16`, `nodenext` or `bundler`.
