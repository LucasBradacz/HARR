import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["label"]

  connect() {
    const checked = this.element.querySelector("input[type=radio]:checked")
    if (checked) this.#paintUpTo(this.#indexOfInput(checked))
  }

  hover({ currentTarget }) {
    this.#paintUpTo(this.labelTargets.indexOf(currentTarget))
  }

  // Chamado pelo evento change no radio — dispara DEPOIS do radio ser marcado
  pick({ currentTarget }) {
    this.#paintUpTo(this.#indexOfInput(currentTarget))
  }

  leave() {
    const checked = this.element.querySelector("input[type=radio]:checked")
    this.#paintUpTo(checked ? this.#indexOfInput(checked) : -1)
  }

  #paintUpTo(index) {
    this.labelTargets.forEach((label, i) => {
      label.classList.toggle("star-pick-label--on", i <= index)
    })
  }

  #indexOfInput(input) {
    return this.labelTargets.findIndex(l => l.querySelector("input") === input)
  }
}
