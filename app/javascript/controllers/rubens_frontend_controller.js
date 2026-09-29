import { Controller } from "@hotwired/stimulus"
import { state } from "controllers/rubens/state"
import { catalog } from "controllers/rubens/catalog"
import { comments } from "controllers/rubens/comments"
import { movie_dialog } from "controllers/rubens/movie_dialog"
import { home } from "controllers/rubens/home"
import { profile } from "controllers/rubens/profile"

// All state belongs to this mounted page. Turbo may connect it more than once.
export default class extends Controller {
  static values = { assets: Object, moviesUrl: String }

  connect() {
    this.cleanup()
    this.abortController = new AbortController()
    this.disposers = []
    const context = {
      root: this.element,
      moviesUrl: this.moviesUrlValue,
      asset: name => this.assetsValue[name] || "",
      on: (element, event, callback) => element?.addEventListener(event, callback, {
        signal: this.abortController.signal
      }),
      onCleanup: callback => this.disposers.push(callback)
    }
    Object.assign(context, state(context))
    Object.assign(context, catalog(context))
    Object.assign(context, comments(context))
    movie_dialog(context)
    home(context)
    profile(context)
  }

  cleanup() {
    this.abortController?.abort()
    this.disposers?.reverse().forEach(dispose => dispose())
    this.disposers = []
  }

  disconnect() { this.cleanup() }
}
