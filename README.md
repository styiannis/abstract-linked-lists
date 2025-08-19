# Abstract Linked Lists

[![NPM Version](https://img.shields.io/npm/v/abstract-linked-lists)](https://www.npmjs.com/package/abstract-linked-lists)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/styiannis/abstract-linked-lists)](https://coveralls.io/github/styiannis/abstract-linked-lists?branch=main)

A TypeScript library that provides implementations of singly and doubly linked lists, designed to support both object-oriented and functional programming paradigms.

## Key Features

- 🔧 **Dual Programming Support**: Facilitates both object-oriented and functional programming approaches, allowing developers to choose the style that best fits their project requirements.

- 🔒 **Type Safety**: Utilizes Typescript generics and strict typing to ensure type correctness and reduce runtime errors.

- ⚡ **Performance Optimization**: Implements efficient memory usage and optimized operations to enhance performance.

- 📐 **Modular Architecture**: Enables tree-shakeable imports, allowing developers to include only the necessary modules and minimize bundle size.

- 🏗️ **Extensibility**: Provides abstract base classes and interfaces that can be extended to create custom linked list implementations tailored to specific needs.

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Using Class-Based Implementation](#using-class-based-implementation)
  - [Using Functional Implementation](#using-functional-implementation)
- [Importing Modules](#importing-modules)
  - [Importing the Entire Package](#importing-the-entire-package)
  - [Importing Specific List Types](#importing-specific-list-types)
  - [Importing Individual Functions](#importing-individual-functions)
- [Code documentation](#code-documentation)
- [Issues and Support](#issues-and-support)
- [License](#license)

## System Requirements

| Package     | Version    |
| ----------- | ---------- |
| **Node.js** | ≥ `18.0.0` |
| **npm**     | ≥ `8.0.0`  |

## Installation

### Install via npm

```bash
npm install abstract-linked-lists
```

### Install via yarn

```bash
yarn add abstract-linked-lists
```

### Install via pnpm

```bash
pnpm install abstract-linked-lists
```

## Getting Started

Here's a quick guide to help you get started with the library.

### Using Class-Based Implementation

```typescript
import { SinglyLinkedList, SinglyLinkedListNode } from 'abstract-linked-lists';

// Create a new list
const list = new SinglyLinkedList();

// Create node instances
const node_a = new SinglyLinkedListNode();
const node_b = new SinglyLinkedListNode();

// Add nodes to the list
list.pushNode(node_a);
list.pushNode(node_b);

// Iterate over list nodes
for (const node of list) {
  console.log(node);
}
```

### Using Functional Implementation

```typescript
import { singlyLinkedList } from 'abstract-linked-lists';

const { create: createNode } = singlyLinkedList.node;
const { create: createList, pushNode } = singlyLinkedList.list;
const { inOrder } = singlyLinkedList.iterators;

// Create a new list
const list = createList();

// Create node instances
const node_a = createNode();
const node_b = createNode();

// Add nodes to the list
pushNode(list, node_a);
pushNode(list, node_b);

// Iterate over list nodes
for (const node of inOrder(list.head)) {
  console.log(node);
}
```

## Importing Modules

The library offers flexible import options to suit different development needs. You can import everything at once, focus on specific list types, or select individual functions as needed.

### Importing the Entire Package

To access all classes, interfaces, and functional APIs:

```typescript
import {
  // Concrete Classes
  SinglyLinkedList,
  SinglyLinkedListNode,
  DoublyLinkedList,
  DoublyLinkedListNode,

  // Abstract Base Classes
  AbstractLinkedList,
  AbstractSinglyLinkedList,
  AbstractSinglyLinkedListNode,
  AbstractDoublyLinkedList,
  AbstractDoublyLinkedListNode,

  // Interfaces
  ILinkedList,
  ISinglyLinkedList,
  ISinglyLinkedListNode,
  IDoublyLinkedList,
  IDoublyLinkedListNode,

  // Functional APIs
  singlyLinkedList,
  doublyLinkedList,
} from 'abstract-linked-lists';
```

This approach is convenient when you need a broad range of functionalities from the library.

### Importing Specific List Types

If you're working with a particular type of linked list, you can import related modules directly.

#### For Singly Linked List

```typescript
import {
  node,
  list,
  iterators,
} from 'abstract-linked-lists/singly-linked-list';
```

#### For Doubly Linked List

```typescript
import {
  node,
  list,
  iterators,
} from 'abstract-linked-lists/doubly-linked-list';
```

This method helps keep your bundle size small by only including necessary modules.

### Importing Individual Functions

For maximum control and minimal footprint, import individual functions or operations.

#### Singly Linked List Functions

```typescript
// Node operations
import {
  create as createNode,
  detach,
} from 'abstract-linked-lists/singly-linked-list/node';

// List operations
import {
  create as createList,
  clear,
  nodeAt,
  popNode,
  pushNode,
  shiftNode,
  unshiftNode,
} from 'abstract-linked-lists/singly-linked-list/list';

// Iterators
import {
  inOrder,
  inReverseOrder,
} from 'abstract-linked-lists/singly-linked-list/iterators';
```

#### Doubly Linked List Functions

```typescript
// Node operations
import {
  create as createNode,
  detach,
} from 'abstract-linked-lists/doubly-linked-list/node';

// List operations
import {
  create as createList,
  clear,
  nodeAt,
  popNode,
  pushNode,
  shiftNode,
  unshiftNode,
} from 'abstract-linked-lists/doubly-linked-list/list';

// Iterators
import {
  inOrder,
  inReverseOrder,
} from 'abstract-linked-lists/doubly-linked-list/iterators';
```

By importing only what you need, you optimize performance and maintain a clean codebase.

## Code documentation

The complete API reference of the library is available at the [code documentation site](https://styiannis.github.io/abstract-linked-lists/).

## Issues and Support

If you encounter any issues or have questions, please [open an issue](https://github.com/styiannis/abstract-linked-lists/issues).

## License

This project is licensed under the [MIT License](https://github.com/styiannis/abstract-linked-lists?tab=MIT-1-ov-file#readme).
