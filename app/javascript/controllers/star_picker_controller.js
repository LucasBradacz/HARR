import { Controller } from "@hotwired/stimulus"

// Hover ilumina até a estrela hovered.
// Click seleciona e persiste a iluminação.
// Mouseleave volta para a estrela selecionada (ou apaga se nenhuma).
export default class extends Controller {
  static targets = ["label"]

  connect() {
    // Restaura estado visual se já houver um radio marcado (ex: volta da validação)
    const checked = this.element.querySelector("input[type=radio]:checked")
    if (checked) this.#paintUpTo(this.#indexOfInput(checked))
  }

  hover({ currentTarget }) {
    const index = this.labelTargets.indexOf(currentTarget)
    this.#paintUpTo(index)
  }

  leave() {
    const checked = this.element.querySelector("input[type=radio]:checked")
    const index = checked ? this.#indexOfInput(checked) : -1
    this.#paintUpTo(index)
  }

  select({ currentTarget }) {
    const index = this.labelTargets.indexOf(currentTarget)
    this.#paintUpTo(index)
    // O radio nativo já foi marcado pelo clique no label — só persiste o visual
    this.selectedIndex = index
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
