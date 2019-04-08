/**
 * @file ObserverRegistry.js
 *
 * Creates an intersection observer with a registry of elements that allows for
 * allow for change notifications via callback.
 */
function ObserverRegistry () {
  this.observers = new Map()
  this.registry = new Map()
  this.visible = new Set()
}

/**
 * Returns an existing IntersectionObserver with matching options or
 * creates a new instance.
 * @param {Element|null} root
 * @param {String} rootMargin
 * @param {Array|String} threshold
 */
ObserverRegistry.prototype.getObserver = function (root = null, rootMargin = null, threshold = null) {
  const byMargin = (this.observers.has(root) ? this.observers : this.observers.set(root, new Map())).get(root)
  const byThreshold = (byMargin.has(rootMargin) ? byMargin : byMargin.set(rootMargin, new Map())).get(rootMargin)
  if (!byThreshold.has(threshold)) {
    byThreshold.set(threshold, new IntersectionObserver(this.triggered.bind(this), {
      root,
      rootMargin,
      threshold
    }))
  }
  return byThreshold.get(threshold)
}

/**
 * An array of entries that
 * @param {Array} entries
 */
ObserverRegistry.prototype.triggered = function (entries) {
  this.visible.clear()
  this.updateVisibility(entries).notify()
}

/**
 * Given a set of IntersectionObserverEntry objects, set the current visible
 * registrants.
 * @param {Array} entries An array of IntersectionObserverEntry
 */
ObserverRegistry.prototype.updateVisibility = function (entries) {
  const that = this
  entries.forEach(function (entry) {
    if (that.registry.has(entry.target)) {
      const registrant = that.registry.get(entry.target)
      Object.assign(registrant, {
        visibility: entry.isIntersecting,
        previousVisibility: registrant.visibility,
        entry
      })
      that.visible.add(entry.target)
    }
  })
  return this
}

/**
 * Notify all registrants of any status changes.
 */
ObserverRegistry.prototype.notify = function () {
  const that = this
  this.registry.forEach(function (registrant, el) {
    if (registrant.visibility !== registrant.previousVisibility) {
      registrant.callback(registrant.visibility)
      if (registrant.once) {
        that.removeElement(el)
      }
    }
  })
}

/**
 * Bind a dom element to our observations
 * @param {Element} el
 */
ObserverRegistry.prototype.addElement = function (el, callback, options = { root: null, rootMargin: '0px', threshold: 0.0 }) {
  const that = this
  if (Array.isArray(el) || el instanceof NodeList) {
    el.forEach(function (element) {
      that.addElement(element, callback, options)
    })
    return this
  }
  if (!this.registry.has(el)) {
    const observer = this.getObserver(options.root, options.rootMargin, options.threshold)
    this.registry.set(el, Object.assign(options, {
      callback,
      observer,
      visibility: false,
      previousVisibility: false
    }))
    observer.observe(el)
  }
  return this
}

/**
 * Remove a dom element from observation.
 * @param {Element} el
 */
ObserverRegistry.prototype.removeElement = function (el) {
  if (this.registry.has(el)) {
    const registrant = this.registry.get(el)
    const observer = this.getObserver(registrant.root, registrant.rootMargin, registrant.threshold)
    this.visible.delete(el)
    this.registry.delete(el)
    observer.unobserve(el)
  }
}

module.exports = ObserverRegistry
