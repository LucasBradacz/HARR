// Tests use small DOM fixtures, not a real browser or Rails runtime.
// Run from the Rails root: node --test test/javascript/rubens_frontend_test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const directory = new URL('../../app/javascript/controllers/', import.meta.url)
const modules = new Map()
async function moduleUrl(name) {
  if (modules.has(name)) return modules.get(name)
  let code = await readFile(new URL(`${name}.js`, directory), 'utf8')
  for (const match of [...code.matchAll(/from "controllers\/([^"]+)"/g)]) {
    code = code.replace(match[0], `from "${await moduleUrl(match[1])}"`)
  }
  code = code.replace('import { Controller } from "@hotwired/stimulus"', 'class Controller {}')
  const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  modules.set(name, url)
  return url
}
async function load(name) { return import(await moduleUrl(name)) }

function catalogFixture() {
  const nodes = Object.fromEntries(['#pesquisa','#filtro-ano','#filtro-avaliacao','#filtro-genero','#filtro-popular','#filmes .movies-grid','#resultados','#limpar-filtros'].map(key => [key, { value: '', focus() {} }]))
  const controls = Object.keys(nodes).filter(key => key.startsWith('#filtro')).map(key => nodes[key])
  const handlers = new Map()
  return {
    nodes, handlers,
    context: {
      root: { querySelector: key => nodes[key] || null, querySelectorAll: () => controls },
      usuario: { favoritos: [], assistir: [] },
      asset: name => `/assets/rubens/digest-${name}`,
      on: (element, event, callback) => handlers.set(element, callback)
    }
  }
}

test('search handles accents and combines year, rating and genre', async () => {
  const { catalog } = await load('rubens/catalog')
  const { nodes, context } = catalogFixture()
  const { filtrarFilmes } = catalog(context)
  nodes['#pesquisa'].value = 'missao'
  nodes['#filtro-ano'].value = '2014'
  nodes['#filtro-avaliacao'].value = '4'
  nodes['#filtro-genero'].value = 'Ficção científica'
  filtrarFilmes()
  assert.match(nodes['#resultados'].textContent, /^1 de 10/)
  assert.match(nodes['#filmes .movies-grid'].innerHTML, /digest-interstellar.jpg/)
  nodes['#filtro-ano'].value = '1900'
  filtrarFilmes()
  assert.match(nodes['#filmes .movies-grid'].innerHTML, /Nenhum filme encontrado/)
  nodes['#filtro-ano'].value = ''; nodes['#filtro-genero'].value = ''
  nodes['#pesquisa'].value = 'origem'
  filtrarFilmes()
  assert.match(nodes['#filmes .movies-grid'].innerHTML, /A Origem/)
})

test('reset clears all filters and returns the complete catalogue', async () => {
  const { catalog } = await load('rubens/catalog')
  const { nodes, context, handlers } = catalogFixture()
  catalog(context)
  nodes['#pesquisa'].value = 'inexistente'
  nodes['#filtro-genero'].value = 'Drama'
  handlers.get(nodes['#limpar-filtros'])()
  assert.equal(nodes['#pesquisa'].value, '')
  assert.equal(nodes['#filtro-genero'].value, '')
  assert.match(nodes['#resultados'].textContent, /^10 de 10/)
})

test('manual banner wraps both ways with digested asset URLs', async () => {
  const { home } = await load('rubens/home')
  const nodes = Object.fromEntries(['#banner-content','#banner-position','#banner-prev','#banner-next'].map(key=>[key,{}]))
  const handlers = new Map()
  home({ root: { querySelector: key=>nodes[key], querySelectorAll: ()=>[] }, on: (element,event,callback)=>handlers.set(element,callback), asset: name=>`/assets/digest-${name}`, filtrarFilmes() {} })
  assert.equal(nodes['#banner-position'].textContent, '1 / 3')
  handlers.get(nodes['#banner-prev'])()
  assert.equal(nodes['#banner-position'].textContent, '3 / 3')
  handlers.get(nodes['#banner-next'])()
  assert.equal(nodes['#banner-position'].textContent, '1 / 3')
  assert.match(nodes['#banner-content'].innerHTML, /digest-dune.jpg/)
})

test('connect/disconnect does not accumulate dialogs, toasts or click handlers', async () => {
  class Element extends EventTarget {
    children = []
    classList = { add() {}, remove() {} }
    setAttribute() {}
    querySelector() { return null }
    querySelectorAll() { return [] }
    append(element) { element.parent = this; this.children.push(element) }
    remove() { this.parent.children = this.parent.children.filter(x => x !== this) }
  }
  globalThis.document = { createElement: ()=>new Element() }
  globalThis.localStorage = { getItem: ()=>null }
  const Controller = (await load('rubens_frontend_controller')).default
  const c = new Controller()
  c.element = new Element(); c.assetsValue = {}; c.moviesUrlValue = '/movies'
  for (let i=0; i<3; i++) {
    c.connect()
    assert.equal(c.element.children.length, 2)
    const signal = c.abortController.signal
    c.cleanup(); c.disconnect()
    assert.equal(signal.aborted, true)
    assert.equal(c.element.children.length, 0)
  }
  delete globalThis.document; delete globalThis.localStorage
})
