import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "btn"]

  toggle() {
    const expanded = this.contentTarget.classList.toggle("review-body--expanded")
    this.btnTarget.textContent = expanded ? "Mostrar menos ▲" : "Mostrar mais ▼"
  }
}
