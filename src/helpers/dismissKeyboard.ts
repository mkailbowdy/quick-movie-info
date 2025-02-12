export function dismissKeyboard() {
  // Dismiss keyboard by blurring the active element
  const activeElement = document.activeElement as HTMLElement
  if (activeElement) {
    activeElement.blur()
  }
}
