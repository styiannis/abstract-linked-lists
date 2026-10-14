# Getting started

From an empty project to a list you can add to, walk in both directions, and
remove from wherever a node sits.

**Last verified:** 2026-10-14 · v1.3.0 · Node ≥ 18.12

## Install

```bash
npm install abstract-linked-lists
```

The package has no runtime dependencies. It ships an ES build, a CommonJS build
and type definitions, so TypeScript needs no additional configuration and
JavaScript works with either module system.

## Put your own objects in a list

The first thing to know is that this library does not store values. It links
nodes, and a node is whatever you extend `DoublyLinkedListNode` with. Your class
becomes the node, rather than being wrapped by one.

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

`pushNode` appends and `unshiftNode` prepends, both in constant time. Pass your
class as the generic parameter, the way `DoublyLinkedList<Job>` does above:
`head`, `tail`, `nodeAt` and the iterators then hand back a `Job` rather than a
bare node.

## Walk it

A list is iterable in the usual way, and the iterator takes an argument for the
other direction.

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

`nodeAt` on a doubly linked list starts from whichever end is closer, so
reaching index `k` costs `O(min(k, n - k))`. An index outside the list returns
`undefined`. The library does not throw.

## Remove a node you are already holding

A node in a doubly linked list carries both of its neighbours, so holding the
node is holding its position. You kept a reference to `first` when you queued
it, so cancelling that job does not require searching for it.

The list has no method for it. A node between two others is unlinked by its own
`detach()`, and the list's `size` is yours to decrement. A node at either end
goes through `shiftNode` or `popNode`, which also move `head` or `tail`:

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

function remove<N extends DoublyLinkedListNode>(
  list: DoublyLinkedList<N>,
  node: N
) {
  if (node === list.head) {
    return list.shiftNode();
  }

  if (node === list.tail) {
    return list.popNode();
  }

  node.detach();
  list.size -= 1;

  return node;
}

const queue = new DoublyLinkedList<Job>();

const first = new Job('j1', 'resize');

queue.pushNode(first);
queue.pushNode(new Job('j2', 'upload'));
queue.unshiftNode(new Job('j0', 'authenticate'));

const cancelled = remove(queue, first);

console.log(cancelled === first); // true
console.log(cancelled?.payload); // resize
console.log([...queue].map((job) => job.id)); // [ 'j0', 'j2' ]
console.log(queue.size); // 2
console.log(first.previous, first.next); // null null
```

On a doubly linked list each branch is constant time, wherever the node sits —
`first` above was in the middle of the queue, not an end. The node comes back
isolated, so it can be pushed straight into another list.

`remove` assumes the node is in `list`. Nothing checks it, and a node from
another list would be unlinked from that one while this one's `size` drops.
[The FAQ](faq.md) covers what `detach()` alone leaves behind.

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

Both return the node they removed, or `undefined` on an empty list. On a doubly
linked list both are constant time.

## Choose singly or doubly

The two classes expose the same methods, so the choice is one of cost.
`pushNode`, `unshiftNode`, `shiftNode` and forward iteration are unchanged on a
`SinglyLinkedList`. `popNode`, `nodeAt`, reverse iteration and removal from the
middle are not.

Use `SinglyLinkedList` when you add at either end, remove only at the head, and
walk forward. It costs one pointer less per node, and that is the whole of the
difference in its favour.

Everything else favours the doubly linked list. On a singly linked list `nodeAt`
always walks from `head`, since without `previous` pointers there is no nearer
end to start from, and reverse iteration builds a stack of every node instead of
following those pointers. `popNode` walks the whole list to reach the
predecessor of the last node. A node in the middle is unlinked by
`detach(predecessor)`, so the caller has to hold its predecessor, or walk from
`head` to find it:

```typescript
import { SinglyLinkedList, SinglyLinkedListNode } from 'abstract-linked-lists';

class Item extends SinglyLinkedListNode {
  constructor(public readonly value: number) {
    super();
  }
}

const list = new SinglyLinkedList<Item>();

[1, 2, 3].forEach((value) => list.pushNode(new Item(value)));

const first = list.nodeAt(0)!;
const second = list.nodeAt(1)!;

second.detach(first);
list.size -= 1;

console.log(
  list.size,
  [...list].map((item) => item.value)
); // 2 [ 1, 3 ]
```

With the predecessor in hand, as `first` is here, the unlinking is constant time.
Without it, the walk that finds it is `O(n)`, and that walk is what the doubly
linked `previous` pointer saves. Had `second` been the tail, `list.tail` would
have needed `first` as well, and `popNode` would have walked to find it.

## The same operations without the classes

Apart from `Symbol.iterator`, every method shown above is one line:
`DoublyLinkedList.popNode` is `return popNode(this)`, and the rest have that
shape too. The functions the classes delegate to are exported, so the whole API
is available over plain objects, with no class involved and the same
complexity:

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

console.log(dll.nodeAt(list, 1)?.key); // y
console.log(dll.popNode(list)?.key); // z
console.log(
  list.size,
  [...iterators.inOrder(list.head)].map((n) => n.key)
); // 2 [ 'x', 'y' ]
```

A core list is the plain object `{ size, head, tail }`, with no
`Symbol.iterator` on it. The classes add that member, over `iterators.inOrder`
and `iterators.inReverseOrder`. Hence `iterators.inOrder(list.head)` above,
where the class form would be `for...of`.

Neither form is the wrapper of the other: they operate on the same shapes, so a
class instance can be passed to these functions, and an object like `Entry`
satisfies `IDoublyLinkedListNode` structurally and can be handed to
`doublyLinkedList.list` unmodified. Which one you use is a question of the style
your project is written in — with one case where it is not a preference,
described in [Architecture and API](architecture-and-api.md#two-layers).

## What this page did not cover

[The FAQ](faq.md) covers the behaviour this page has only touched — what
`clear()` does to your nodes, what happens when a node is pushed into two lists,
and which module system resolves to which build.
[Architecture and API](architecture-and-api.md) explains why the library is
split into these two layers and what the abstract classes are for.
