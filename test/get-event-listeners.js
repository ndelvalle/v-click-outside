function getDocumentEventListeners() {
  return Array.From(document.querySelectorAll('*'))
    .map((element) => {
      const listeners = window.getEventListeners(element)

      return {
        element,
        listeners: Object.keys(listeners).map((key) => ({
          event: key,
          listeners: listeners[key],
        })),
      }
    })
    .filter((item) => item.listeners.length)
}

export default getDocumentEventListeners
