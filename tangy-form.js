import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './cat.js'
import './tangy-form-item.js'
import './tangy-common-styles.js'
import './global-styles.js'
import { tangyFormReducer } from './tangy-form-reducer.js'
// Redux not currently importing correctly. Make it a global.
//window.process = { env: {NODE_ENV: 'production'}}
//import { createStore, compose as origCompose, applyMiddleware, combineReducers } from 'redux';

//   <!-- Tangy Custom Inputs Elements -->
import './tangy-input.js'
import './tangy-timed.js'
import './tangy-checkbox.js'
import './tangy-checkboxes.js'
import './tangy-radio-buttons.js'
import './tangy-select.js'
import './tangy-location.js'
import './tangy-gps.js'
import './tangy-complete-button.js'
import './tangy-overlay.js'
import './tangy-acasi.js';

//   <!-- Dependencies -->
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { TangyFormResponseModel } from './tangy-form-response-model.js';


/**
 * `tangy-form`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export class TangyForm extends PolymerElement {

  static get template() {
    return html`
     
      <style include="tangy-common-styles"></style>
        
      <style>
        :host {
          width: 100%;
          display: block;
          margin: 0px;
          padding: 0px;
        }
        :host([complete]) tangy-form-item[disabled] {
          display: none;
        }
        #previousItemButton,
        #nextItemButton {
            position: relative;
            color: #ffffff;
        }
        
        #previousItemButton[disabled],
        #nextItemButton[disabled] {
            color: #979797;
        }
        #previousItemButton {
          float: left;
        }
        #nextItemButton {
          float: right;
        }
        #markCompleteFab, #lockedFab {
          position: fixed;
          right: 7px;
          top: 24px;
        }

        #markCompleteButton {
          position: fixed;
          right: 7px;
          bottom: 2px;
          color: var(--accent-text-color);
        }

        #markCompleteFab {}
        :host(:not([linear-mode])) #nextItemButton,
        :host(:not([linear-mode])) #previousItemButton
         {
          display: none;
        }
        :host([hide-complete-fab]) #markCompleteFab {
          display: none !important;
        }
        #progress {
          position: fixed;
          bottom: 0px;
        }
        paper-progress {
          width: 100%;
        }
        #bar {
          width:100%;
          background-color: var(--primary-color);
          color: var(--accent-color);
        }
        #bar-filler {
          height: 45px;
        }
      
      #markCompleteButton,
      #previousItemButton,
      #nextItemButton {
        padding: 0;
        color: var(--accent-color);
        --paper-fab-iron-icon: {
          color: var(--accent-color);
          height: 75px;
          width: 75px;
        };
      }
      #markCompleteButton paper-icon-button,
      #previousItemButton paper-icon-button,
      #nextItemButton paper-icon-button, paper-icon-button {
        width: 75px;
        height: 75px;

      }
      paper-fab[disabled] {
        background-color: #cccccc !important;
      }
      paper-fab.pressed {
        background-color: #3c5b8d !important;
      }
      paper-fab.keyboard-focus {
        background-color: #1976d2;
      }
      </style>

      <div id="nav"></div>
      <template is="dom-if" if="{{complete}}">
        <div id="bar">
          <paper-tabs selected="[[tabIndex]]" scrollable>
            <template is="dom-if" if="{{hasSummary}}">
              <paper-tab id="summary-button" on-click="onClickSummaryTab">Summary</paper-tab>
            </template>
            <paper-tab id="response-button" on-click="onClickResponseTab">Response</paper-tab>
          </paper-tabs>
        </div>
      </template>
      <div id="items"></div> 

        `;
  }

  onClickSummaryTab() {
    this.store.dispatch({ type: 'SHOW_SUMMARY' })
    setTimeout(() => {
      this.querySelector('[summary]').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  onClickResponseTab() {
    this.store.dispatch({ type: 'SHOW_RESPONSE' })
    //this.querySelectorAll('tangy-form-item').forEach(el => el.hidden = false)
    this.querySelectorAll('tangy-form-item')[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  static get is() { return 'tangy-form'; }

  static get properties() {
    return {
      complete: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      // Set linear-mode to turn on navigation and turn off item action buttons.
      linearMode: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      // Hide closed items to focus user on current item.
      hideClosedItems: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideCompleteFab: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      tabIndex: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      showResponse: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      showSummary: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hasSummary: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      onSubmit: {
        type: String,
        value: ''
      }
    }
  }

  set response(value) {
    this.responseHasBeenSet = true
    this.store.dispatch({ type: 'FORM_OPEN', response: value })
  }

  get response() {
    return (this.responseHasBeenSet) ? this.store.getState() : null 
  }

  constructor() {
    super()
    this.responseHasBeenSet = false
    // Set up the store.
    this.store = Redux.createStore(
      tangyFormReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  }

  ready() {
    super.ready()
    // Set up and initial response, bind item events, and put initial response in the store.
    let initialResponse = new TangyFormResponseModel() 
    initialResponse.form = this.getProps()
    // Pass the items to the shadow root.
    this.$.items.innerHTML = this.innerHTML
    // Pass events of items to the reducer.
    this.shadowRoot.querySelectorAll('tangy-form-item').forEach((item) => {
      // Pass in the store so on-change and on-open logic can access it.
      item.store = this.store
      if (this.linearMode) item.noButtons = true
      item.addEventListener('ITEM_NEXT', this.onItemNext.bind(this))
      item.addEventListener('ITEM_BACK', this.onItemBack.bind(this))
      item.addEventListener('ITEM_CLOSED', this.onItemClosed.bind(this))
      item.addEventListener('ITEM_OPENED', this.onItemOpened.bind(this))
      item.addEventListener('FORM_RESPONSE_COMPLETE', this.onFormResponseComplete.bind(this))
      initialResponse.items.push(item.getProps())
    })

    // Subscribe to the store to reflect changes.
    this.unsubscribe = this.store.subscribe(this.throttledReflect.bind(this))

    if (!this.responseHasBeenSet) {
      this.response = initialResponse
    }

    // Dispatch events out when state changes.
    this.store.subscribe(state => {
      this.dispatchEvent(new CustomEvent('TANGY_FORM_UPDATE'))
    })

    if (this.onSubmit) {
      this.addEventListener('submit', (event) => {
        let form = this
        eval(this.onSubmit)
      })
    }

    // Flag for first render.
    this.hasNotYetFocused = true

  }

  disconnectedCallback() {
    this.unsubscribe()
  }

  onFormResponseComplete(event) {
    this.store.dispatch({
      type: 'ITEM_SAVE',
      item: event.target.getProps()
    })
    const cancelled = !this.dispatchEvent(new CustomEvent('submit', {cancelable: true}))
    if (cancelled) return
    this.store.dispatch({
      type: 'FORM_RESPONSE_COMPLETE'
    })
    if (this.hasSummary) {
      this.store.dispatch({ type: "SHOW_SUMMARY" })
    } else {
      this.store.dispatch({ type: "SHOW_RESPONSE" })
    }
  }

  onItemNext(event) {
    this.store.dispatch({
      type: 'ITEM_SAVE',
      item: event.target.getProps()
    })
    this.focusOnNextItem()
  }

  onItemBack(event) {
    this.store.dispatch({
      type: 'ITEM_SAVE',
      item: event.target.getProps()
    })
    this.focusOnPreviousItem()
  }

  onItemOpened(event) {
    this.store.dispatch({
      type: 'ITEM_SAVE',
      item: event.target.getProps()
    })
  }

  onItemClosed(event) {
    this.store.dispatch({
      type: 'ITEM_SAVE',
      item: event.target.getProps()
    })
  }

  // Prevent parallel reflects, leads to race conditions.
  throttledReflect(iAmQueued = false) {
    // If there is an reflect already queued, we can quit.
    if (this.reflectQueued && !iAmQueued) return
    if (this.reflectRunning) {
      this.reflectQueued = true
      setTimeout(() => this.throttledReflect(true), 200)
    } else {
      this.reflectRunning = true
      this.reflect()
      this.reflectRunning = false
      if (iAmQueued) this.reflectQueued = false
    }
  }

  // Apply state in the store to the DOM.
  reflect() {

    let state = this.store.getState()
    // Set initial this.previousState
    if (!this.previousState) this.previousState = state

    this.setProps(state.form)

    // Tabs
    if (state.form && state.form.complete) {
      //this.shadowRoot.querySelector('paper-tabs').selected = (state.form.showSummary) ? '0' : '1'
    }

    // Set state in tangy-form-item elements.
    let items = [].slice.call(this.shadowRoot.querySelectorAll('tangy-form-item'))
    items.forEach((item) => {
      let index = state.items.findIndex((itemState) => item.id == itemState.id)
      if (index !== -1) item.setProps(state.items[index])
    })

    // Find item to scroll to.
    if (state.focusIndex !== this.previousState.focusIndex || (this.linearMode && this.hasNotYetFocused && (state.form && !state.form.complete))) {
      this.hasNotYetFocused = false
      setTimeout(() => {
        if (items[state.focusIndex]) items[state.focusIndex].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }

    // Dispatch ALL_ITEMS_CLOSED if all items are now closed.
    let previouslyClosedItemCount = (this.previousState.items.filter(item => !item.open)).length
    let currentlyClosedItemCount = (state.items.filter(item => !item.open)).length
    if (previouslyClosedItemCount !== currentlyClosedItemCount && currentlyClosedItemCount === state.items.length) {
      this.dispatchEvent(new CustomEvent('ALL_ITEMS_CLOSED'))
    }

    // Stash as previous state.
    this.previousState = Object.assign({}, state)

    if (!this.complete) this.fireOnChange()

  }

  fireOnChange() {
    // Register tangy redux hook.
    if (!this.hasAttribute('on-change')) return
    let state = this.store.getState()
    let inputs = {}
    state.inputs.forEach(input => inputs[input.name] = input)
    let items = {}
    state.items.forEach(item => items[item.name] = item)
    // Declare namespaces for helper functions for the eval context in form.on-change.
    // We have to do this because bundlers modify the names of things that are imported
    // but do not update the evaled code because it knows not of it.
    let getValue = (name) => {
      let state = this.store.getState()
      let inputs = []
      state.items.forEach(item => inputs = [...inputs, ...item.inputs])
      //return (inputs[name]) ? inputs[name].value : undefined
      let foundInput = inputs.find(input => (input.name === name) ? input.value : false)
      if (foundInput && typeof foundInput.value === 'object') {
        let values = []
        foundInput.value.forEach(subInput => {
          if (subInput.value) {
            values.push(subInput.name)
          }
        })
        return values
      } else if (foundInput && foundInput.hasOwnProperty('value')) {
        return foundInput.value
      } else {
        return ''
      }

    }

    // on-change hook.
    const itemDisable = (itemId) => { 
        let state = this.store.getState()
        let item = state.items.find(item => itemId === item.id)
        if (item && !item.disabled) this.store.dispatch({ type: 'ITEM_DISABLE', itemId: itemId })
    }
    const itemEnable = (itemId) => {
        let state = this.store.getState()
        let item = state.items.find(item => itemId === item.id)
        if (item && item.disabled) this.store.dispatch({ type: 'ITEM_ENABLE', itemId: itemId })
    }
    eval(this.getAttribute('on-change'))
  }

  focusOnPreviousItem(event) {
    // Dispatch action.
    let state = this.store.getState()
    let item = state.items.find(item => item.open)
    this.store.dispatch({ type: 'ITEM_BACK', itemId: item.id })
  }

  focusOnNextItem(event) {
    // Dispatch action.
    let state = this.store.getState()
    let item = state.items.find(item => item.open)
    this.store.dispatch({ type: 'ITEM_NEXT', itemId: item.id })
  }

  getValue(name) {
    let state = this.store.getState()
    let input = state.inputs.find((input) => input.name == name)
    if (input) return input.value
  }

}


window.customElements.define(TangyForm.is, TangyForm);

