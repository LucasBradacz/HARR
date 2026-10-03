import { Controller } from "@hotwired/stimulus"

// Intercepta Tab no textarea e insere 5 espaços em vez de sair do campo
export default class extends Controller {
  indent(event) {
    if (event.key !== "Tab") return
    event.preventDefault()

    const el = event.target
    const start = el.selectionStart
    const end = el.selectionEnd
    const spaces = "     " // 5 espaços

    el.value = el.value.substring(0, start) + spaces + el.value.substring(end)
    el.selectionStart = el.selectionEnd = start + spaces.length
  }
}
