import { Controller } from "@hotwired/stimulus"

// Hover ilumina estrelas da 1ª até a hovered.
// O clique é tratado pelo radio button nativo — sem JS no submit.
export default class extends Controller {
  static targets = ["label"]

  hover({ currentTarget }) {
    const index = this.labelTargets.indexOf(currentTarget)
    this.labelTargets.forEach((label, i) => {
      label.classList.toggle("star-pick-label--on", i <= index)
    })
  }

  leave() {
    const checked = this.element.querySelector("input[type=radio]:checked")
    const checkedIndex = checked
      ? this.labelTargets.findIndex(l => l.querySelector("input") === checked)
      : -1
    this.labelTargets.forEach((label, i) => {
      label.classList.toggle("star-pick-label--on", i <= checkedIndex)
    })
  }
}
