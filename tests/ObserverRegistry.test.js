const ObserverRegistry = require('../src/ObserverRegistry')

window.IntersectionObserver = jest.fn().mockImplementation((callback, options) => {
  return {
    observe: jest.fn(),
    unobserve: jest.fn()
  }
})

const createEntry = function (el, overrides = {}) {
  return Object.assign({
    target: el,
    isIntersecting: true
  }, overrides)
}

test('can instantiate class', () => {
  expect(new ObserverRegistry()).toBeInstanceOf(ObserverRegistry)
})

test('can add an element', () => {
  const observer = new ObserverRegistry()
  let element = {name: 'fauxelement'}
  observer.addElement(element)
  expect(observer.registry.has(element)).toBe(true)
})

test('can add an array of elements', () => {
  const observer = new ObserverRegistry()
  let element = {name: 'fauxelement'}
  let element2 = {name: 'fauxelement2'}
  observer.addElement([element, element2])
  expect(observer.registry.has(element) && observer.registry.has(element2)).toBe(true)
})

test('does trigger a callback', () => {
  const observer = new ObserverRegistry()
  let element = {name: 'fauxelement'}
  let callback = jest.fn()
  observer.addElement(element, callback)
  observer.triggered([createEntry(element)])
  expect(callback).toBeCalled()
})

test('can add an element with a custom root', () => {
  const observer = new ObserverRegistry()
  let element = {name: 'fauxelement'}
  let callback = jest.fn()
  observer.addElement(element, callback, {root: {custom: 'root'}})
  observer.triggered([createEntry(element)])
  expect(callback).toBeCalled()
})

test('elements with different roots have different IntersectionObservers)', () => {
  const observer = new ObserverRegistry()
  let elementA = {name: 'Element-A'}
  let elementB = {name: 'Element-B'}
  let callback = jest.fn()
  observer.addElement(elementA, callback)
  observer.addElement(elementB, callback, {root: {custom: 'root'}})
  expect(observer.observers.size).toBe(2)
})
