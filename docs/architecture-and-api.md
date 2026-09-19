# Architecture and API

**Last verified:** 2026-09-19 · v2.0.0

## One pointer as the whole base

`ISinglyLinkedListNode` declares a single property:

```typescript
export interface ISinglyLinkedListNode {
  next: ISinglyLinkedListNode | null;
}
```

`IDoublyLinkedListNode` adds `previous` and nothing else. There is no value
field, no key, no identifier and no reference back to the containing list.
Everything the library offers is built on top of that, and the size of the
abstraction is the point: a node small enough to carry no assumptions is a
node that any object can become by extending it.

The cost is small and measurable. On 64-bit Node.js, a singly linked node
carrying one number retains 40 bytes, and a doubly linked one 48. The 8 bytes
between them are the second pointer.

Because the node is the caller's own object, the caller never has to search
for it. On a doubly linked list, nothing else is needed either: the node's
`previous` and `next` are the two neighbours to relink, so removal is a few
pointer assignments. A singly linked node knows only its `next`. The list still
has to find the node's predecessor, by walking from `head`, which makes the same
removal `O(n)` — see [Complexity](#complexity-as-implemented).

What the node does not hold is a reference to its list, so `detach()` cannot
update the list's `size`, `head` or `tail`. `removeNode` covers that from the
other side: it is a method on the list and is handed the node, so it can update
both. The reference is left out on purpose, because it would add another
pointer to every node.

## Two layers

`src/` divides into `core/` and `classes/`, and the division is a method
rather than a convention.

`core/` is written as small independent functions over plain objects, each
one short enough that what happens inside it can be read off the page, **and
so can the resources it requires**. A function that allocates says so by
allocating in front of you. `singlyLinkedList.list.popNode` fits on one
screen, and its `O(n)` walk is the `while` loop in the middle of it. The
classes, the generics and the tooling sit on top of that layer, where they
cost nothing in verifiability.

```
src/
├── core/
│   ├── singly-linked-list/{node,list,iterators}.ts
│   └── doubly-linked-list/{node,list,iterators}.ts
├── classes/
│   ├── abstract/       five abstract classes
│   └── {Singly,Doubly}LinkedList{,Node}.ts
└── types.ts            the five interfaces
```

The `classes/` layer contains no algorithm. `DoublyLinkedList.popNode` is
`return popNode(this)`; every method is that shape. What the layer adds is the
generic parameter that carries your node subclass through the API, the
`Symbol.iterator` implementation, and prototypes for code that prefers them.

The two layers interoperate directly, because the classes satisfy the same
interfaces the functions accept:

```typescript
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
  doublyLinkedList,
} from 'abstract-linked-lists';

class Item extends DoublyLinkedListNode {
  constructor(public readonly v: number) {
    super();
  }
}

const list = new DoublyLinkedList<Item>();

doublyLinkedList.list.pushNode(list, new Item(1));

console.log(doublyLinkedList.list.nodeAt(list, 0)?.v); // 1
```

Because they interoperate, which of the two a caller uses is normally a matter
of the style the surrounding code is written in. The one case where it is not
is inheritance. A class extends one base, so an object already extending
something else cannot also extend `DoublyLinkedListNode` — but it can still
carry a `next` and `previous` field, satisfy `IDoublyLinkedListNode`
structurally, and be handed to `doublyLinkedList.list` unmodified:

```typescript
import {
  doublyLinkedList,
  IDoublyLinkedList,
  IDoublyLinkedListNode,
} from 'abstract-linked-lists';

class Widget {
  constructor(public readonly label: string) {}
}

class WidgetNode extends Widget implements IDoublyLinkedListNode {
  next: WidgetNode | null = null;
  previous: WidgetNode | null = null;
}

const widgets = doublyLinkedList.list.create<IDoublyLinkedList<WidgetNode>>();

doublyLinkedList.list.pushNode(widgets, new WidgetNode('a'));
doublyLinkedList.list.pushNode(widgets, new WidgetNode('b'));

console.log(widgets.size, widgets.head?.label, widgets.tail?.label); // 2 a b
```

`core/doubly-linked-list/iterators.inOrder` shows the same reuse one level
down: forward traversal of a doubly linked list is forward traversal of a
singly linked list, so the function delegates to it instead of restating the
loop.

## The public surface

The package root exports the classes, the core namespaces and the interfaces.
Each core module is additionally published as a subpath —
`abstract-linked-lists/doubly-linked-list/list` and its seven siblings.

| Export                                                         | Kind      |
| -------------------------------------------------------------- | --------- |
| `SinglyLinkedList<N>` `DoublyLinkedList<N>`                    | class     |
| `SinglyLinkedListNode` `DoublyLinkedListNode`                  | class     |
| `AbstractLinkedList<N>`                                        | abstract  |
| `AbstractSinglyLinkedList<N>` `AbstractDoublyLinkedList<N>`    | abstract  |
| `AbstractSinglyLinkedListNode` `AbstractDoublyLinkedListNode`  | abstract  |
| `singlyLinkedList` `doublyLinkedList`                          | namespace |
| `ILinkedList<N>` `ISinglyLinkedList<N>` `IDoublyLinkedList<N>` | interface |
| `ISinglyLinkedListNode` `IDoublyLinkedListNode`                | interface |

Each namespace holds `list`, `node` and `iterators`. `list` provides `create`,
`clear`, `nodeAt`, `pushNode`, `unshiftNode`, `removeNode`, `removeNodeAfter`,
`popNode` and `shiftNode`; `node` provides `create` and `detach`; `iterators`
provides `inOrder` and `inReverseOrder`.

## Complexity, as implemented

| Operation         | Singly                        | Doubly                |
| ----------------- | ----------------------------- | --------------------- |
| `pushNode`        | `O(1)`                        | `O(1)`                |
| `unshiftNode`     | `O(1)`                        | `O(1)`                |
| `removeNode`      | `O(n)`                        | `O(1)`                |
| `removeNodeAfter` | `O(1)`                        | `O(1)`                |
| `shiftNode`       | `O(1)`                        | `O(1)`                |
| `popNode`         | `O(n)`                        | `O(1)`                |
| `nodeAt(k)`       | `O(k)`                        | `O(min(k, n - k))`    |
| `clear`           | `O(n)`                        | `O(n)`                |
| `detach`          | `O(1)`, given the predecessor | `O(1)`                |
| `inOrder`         | `O(n)` / `O(1)` space         | `O(n)` / `O(1)` space |
| `inReverseOrder`  | `O(n)` / `O(n)` space         | `O(n)` / `O(1)` space |

Three of these are worth reading twice. `popNode` on a singly linked list walks
from the head to find the predecessor of the tail, so a stack built on one
pushes and pops at the head, where both are `O(1)`; one that pops at the tail
pays `O(n)` per pop. `inReverseOrder` on a singly linked list allocates an array
of every node, which is the only allocation the library makes that grows with
the data. And the two removal functions differ by what the caller supplies
rather than by what they do: `removeNode` is handed a node and, on a singly
linked list, walks from the head to find what precedes it, while
`removeNodeAfter` is handed that position directly and is constant time on both
structures. The walk is not overhead that better code would avoid — it is the
predecessor lookup a singly linked node cannot perform, and `O(1)` removal is
available only to a caller who already holds the predecessor.

Traversal is where a linked list loses to an array, whatever the notation
says. Both walks are `O(n)`, but contiguous memory wins the constant: in one
measured run, five passes over 1,000,000 nodes averaged 32.2 ms each, against
5.6 ms for an `Array` of the same objects.

Read those two figures as a ratio, not as speeds. The absolute timings depend
on the machine and drift from run to run. What holds across runs is that
walking the list costs several times as much as scanning the array. The memory
figures [above](#one-pointer-as-the-whole-base) are different: they reproduce
from run to run, so they can be read as they are.

## Extending

Three routes, for three different intentions.

**Subclass a concrete class** when the structure is right and the API is
missing something. What the list deliberately has no notion of is a lookup —
`pushNode` takes a node and nothing indexes it — so that is the common
addition, layered over the removal the list already performs:

```typescript
import { DoublyLinkedList, DoublyLinkedListNode } from 'abstract-linked-lists';

class IndexedList<
  N extends DoublyLinkedListNode & { key: string },
> extends DoublyLinkedList<N> {
  private readonly index = new Map<string, N>();

  override pushNode(node: N) {
    this.index.set(node.key, node);
    super.pushNode(node);
  }

  override unshiftNode(node: N) {
    this.index.set(node.key, node);
    super.unshiftNode(node);
  }

  removeByKey(key: string) {
    const node = this.index.get(key);
    if (!node) {
      return;
    }
    this.index.delete(key);
    return this.removeNode(node);
  }
}

class Entry extends DoublyLinkedListNode {
  constructor(public readonly key: string) {
    super();
  }
}

const cache = new IndexedList<Entry>();

cache.pushNode(new Entry('a'));
cache.pushNode(new Entry('b'));

console.log(cache.removeByKey('a')?.key, cache.size); // a 1
console.log(cache.removeByKey('a')); // undefined
```

The `Map` answers the question the list cannot — which node carries this key —
and `removeNode` does the rest in constant time and returns the node, so
`removeByKey` inherits the shape of the call it delegates to. Nothing here
re-implements any part of the list. What it does not cover is every way out:
`popNode`, `shiftNode`, `removeNodeAfter`, `clear` and a bare `removeNode` all
bypass the two overrides above, so a node removed through one of them stays in
the index until `removeByKey` looks it up, hands back a node that has already
left the list, and decrements `size` a second time. A subclass that must stay
correct under every mutator overrides all of them; this one shows the
delegation, not the whole maintenance burden.

**Implement an abstract class** when the storage or the invariants are your
own — a list that maintains sorted order on insertion, or one whose nodes are
not objects of yours at all. `AbstractLinkedList<N>` requires
`[Symbol.iterator]`, `clear`, `nodeAt`, `pushNode`, `unshiftNode`, `popNode`,
`shiftNode`, `removeNode(node)` and `removeNodeAfter(predecessor)`, the last two
returning `N | undefined`. `AbstractSinglyLinkedList` and
`AbstractDoublyLinkedList` add nothing but the node-type constraint: every list
member is common to both structures, and where the two differ it is in what an
operation costs, not in what it is called or what it is passed. Note that the
abstract signature declares `[Symbol.iterator](reversed: boolean)`, so an
implementation accepts the argument even though `for...of` never passes it.

The interfaces are the third route and the lightest: a type that satisfies
`IDoublyLinkedList<N>` can be passed to every function in the
`doublyLinkedList` namespace without inheriting from anything.

## Tooling

TypeScript 5.9 in `strict` mode with `exactOptionalPropertyTypes` and
`noUncheckedIndexedAccess`. Rollup runs four times: the ES build, the CommonJS
build, and a declaration tree for each of them. All four run with
`preserveModules`, so the output mirrors `src/` file for file, and all four
label their output by extension — `.mjs` and `.d.mts` on the ES side, `.cjs`
and `.d.cts` on the CommonJS side.

Two scripts check the result. `check-declared-paths` verifies that
every path `package.json` declares exists in the build and carries the
extension the condition above it implies; `check-dist-loads` loads the two
built entries the way a consumer would, the CommonJS one with `require` and the
ES one with `import`. Jest covers both layers, and `npm run verify` runs the
type check, the linter, the build and both checks in sequence.
