interface Binding {
  el: HTMLElement
  value: (event: Event, el: HTMLElement) => void
}

interface Element extends HTMLElement {
  clickOutsideEvent: (event: Event) => void
}

export default {
  created(el: Element, binding: Binding) {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target as Node)) && binding.value) {
        binding.value(event, el)
      }
    }

    document.body.addEventListener('mousedown', el.clickOutsideEvent)
  },

  unmounted(el: Element) {
    document.body.removeEventListener('mousedown', el.clickOutsideEvent)
  },
}
