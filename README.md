Observer Registry
-----------------

[![CircleCI](https://circleci.com/gh/wearebraid/observer-registry.svg?style=svg)](https://circleci.com/gh/wearebraid/observer-registry)

Observer Registry is a lightweight (1.8KB or 709B gzip!) library to make interacting with the
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
a little more pleasant by allowing you to specify callbacks for each element you
are observing. ObserverRegistry will handle instantiating any
`IntersectionObservers` while using the fewest instances to accomplish your
observation needs.

## Installation

Install the package from npm:

```sh
npm install observer-registry
```

## Usage

The first step to using ObserverRegistry is creating an instance. You should
really only ever need once instance of the `ObserverRegistry`, it will maintain
any and all instances of `IntersectionObserver` in order to give you the
desired results.

### Observing an element

Observing an element is simple, you just pass the element and a callback to be
notified when it changes.

```js
import ObserverRegistry from 'observer-registry'

const observer = new ObserverRegistry()
const element = document.getElementById('my-element')

observer.addElement(element, event => alert('element visibility changed!'))
```

You can pass as many elements into an instance of  `ObserverRegistry` as you want:

```js
const callback = () => alert('An element has been seen!')
const header = document.getElementById('header')
const menu = document.getElementById('menu')
const body = document.getElementById('body')
const footnote = document.getElementById('footnote')
const footer = document.getElementById('footer')
// Or call addElement as many times as you want (with chaining)
observer.addElement(header, callback).addElement(menu, callback)
// You can register an array of elements
observer.addElement([body footnote, footer], callback)
// Or with a NodeList
observer.addElement(document.querySelectorAll('.pictures'), callback)
```

### Removing an element

To stop watching for intersection events on an element remove it from the registry.

```js
observer.removeElement(element)
```

### Observe an element with custom margins

The `addElement` method accepts a third argument `options`. Included in the
list of available options are the three options provided by the native
`IntersectionObserver` class `root`, `rootMargin`, and `threshold`. For a full
list of options see the table below.

```js
observer.addElement(element, () => alert('Using a margin'), {
    rootMargin: '-100px'
})
```

### Observe an element with custom root

```js
const element = document.getElementById('my-element')
observer.addElement(element, () => `element within margin!`, {
    root: document.getElementById('my-scroll-window')
})
```
### Observe only once

Perfect for times when you only need to know when an item comes into view, you
can choose to automatically remove an element after its first observed event.
This is ideal for things like lazy loading images or performing entrance
animations on scroll where you don't need the effect to be repeated.

```js
observer.addElement(element, () => alert('do this once!'), { once: true })
```

## `addElement` options

The third argument of `addElement` can be an options object.

Key         | Description                       | Default Value
------------|-----------------------------------|--------------
once        | Only trigger the callback once    | `false`
root        | `IntersectionObserver` root       | `null` (binds to the viewport)
rootMargin  | `IntersectionObserver` rootMargin | `0px`
threshold   | `IntersectionObserver` threshold  | `0.0`

## Limitations

There are a few known limitations, happy to accept pull requests for these or
any others you might find.

### One instance of each element

Currently it is only possible for any given element to be observed by one
IntersectionObserver meaning that if the same element is registered twice, the
first registered callback will be called.

```js
const element = document.getElementById('my-element')
observer.addElement(element, event => alert(`element is${event.visibility ? ' ' : ' not '}visible`))
observer.addElement(element, event => alert('do some other activity'))
// alert(`element is visible`)
```

### `IntersectionObserver` support

Truth of the matter is that IntersectionObserver does not have spectacular
[browser support](https://caniuse.com/#search=intersectionobserver) (lookin' at you Safari).
So depending on your needs, this utility may require a polyfill. The good news
is that w3c has [provided one](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).
