import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { t } from '../util/t.js'
import '../util/html-element-props.js'
import './tangy-radio-button.js'
import '../style/tangy-element-styles.js';
import '../style/tangy-common-styles.js'
/**
 * `tangy-radio-buttons`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TangyRadioButtons extends PolymerElement {

  static get is() { return 'tangy-radio-buttons'; }

  constructor() {
    super()
    this.value = []
    this.t = {
      'selectOnlyOne': t('Select only one')
    }
  }

  static get template() {
    return html`
      <style include="tangy-element-styles"></style>
      <style include="tangy-common-styles"></style>

      <style>
        table {
          table-layout: fixed;
        }
        span {
          font-size: .75em;
          display: block;
        }
        :host([columns]) tangy-radio-button {
          padding: 0px;
          margin: 15px 0px 0px;
        }
        :host([hide-buttons]) tangy-radio-button {
          border: 5px solid white;
        }
        :host([hide-buttons]) tangy-radio-button[value="on"] {
          border: 5px solid green;
        }
        :host([no-margin]) tangy-radio-button {
          padding: 0px;
          margin: 0px 0px !important;
          border: 0px;
        }
        :host([columns="0"]) tangy-radio-button {
          display: block;
        }
        :host(:not([columns="0"])) tangy-radio-button {
          display: inline-block;
        }
      </style>

      <style>
      #error-text {
        padding: 10px 10px 10px 0px;
        font-size: medium;
        font-weight: bold;
        color: var(--error-color);
      }
    
      #container {
        margin-left:30px;
      }
  
      #hint-text {
        color: gray;
        font-size: 1em;
        font-weight: lighter;
      }
      .container {
        margin-left:30px;
      }
  
   
      </style>
      <div>
        <div id="qnum" style="float:left;"></div>
        <div class="container">
          <label id="label" for="group"></label>
          <label id="hint-text"></label>
        
          <div id="container"></div>
     
            <label id="error-text"></label>

        </div>

      </div>
    
     
    `;
  }

  static get properties() {
    return {
      hideButtons: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideHelpText: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      name: {
        type: String,
        value: '',
        observer: 'reflect',
        reflectToAttribute: true
      },
      value: {
        type: Array,
        value: [],
        observer: 'reflect',
        reflectToAttribute: true
      },
      hintText: {
        type: String,
        value: ''
      },
      required: {
        type: Boolean,
        value: false,
        observer: 'reflect',
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        value: false,
        observer: 'reflect',
        reflectToAttribute: true
      },
      label: {
        type: String,
        value: '',
        observer: 'reflect',
        reflectToAttribute: true
      },
      hidden: {
        type: Boolean,
        value: false,
        observer: 'reflect',
        reflectToAttribute: true
      },
      invalid: {
        type: Boolean,
        value: false,
        observer: 'reflect',
        reflectToAttribute: true
      },
      incomplete: {
        type: Boolean,
        value: true,
        observer: 'reflect',
        reflecttoattribute: true
      },
      columns: {
        type: Number,
        value: 0,
        observer: 'render',
        reflectToAttribute: true
      },
      noMargin: {
        type: Boolean,
        value: false,
        observer: 'reflect',
        reflecttoattribute: true
      },
      questionNumber: {
        type: String,
        value: '',
        observer: 'reflect',
        reflectToAttribute: true
      },
      errorText: {
        type: String,
        value: '',
        observer: 'reflect',
        reflectToAttribute: true
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.render()
    this.reflect()
  }

  reflect() {
    this.shadowRoot.querySelectorAll('tangy-radio-button').forEach(el => {
      let matchingState = this.value.find(state => el.name == state.name)
      el.setProps(matchingState)
      el.disabled = this.disabled
      el.hidden = this.hidden
    })
  }

  render() {

    this.$.qnum.innerHTML = `<label>${this.questionNumber}</label>`;
    this.$.label.innerHTML = this.label
    this.$['hint-text'].innerHTML = this.hintText
    this.$.container.innerHTML = ''
    // Populate options as tangy-radio-button elements
    let options = this.querySelectorAll('option')
    let i = 0
    let table = document.createElement('table')
    let tr = document.createElement('tr')
    for (let option of options) {
      let button = document.createElement('tangy-radio-button')
      button.hideButton = this.hideButtons ? true : false
      button.name = option.value
      button.innerHTML = option.innerHTML
      if (this.columns > 0) {
        let td = document.createElement('td')
        td.style.width = `${Math.floor(100*(1/this.columns))}%`
        td.appendChild(button)
        if ((i+1)%this.columns === 0) {
          tr.appendChild(td)
          table.appendChild(tr)
          tr = document.createElement('tr')
        } else {
          tr.appendChild(td)
        }
        if (i+1 === options.length) this.$.container.appendChild(table)
        i++
      } else {
        this.$.container.appendChild(button)
      }
    }



    let newValue = []
    this
      .shadowRoot
      .querySelectorAll('tangy-radio-button')
      .forEach((el) => {
        el.addEventListener('change', this.onRadioButtonChange.bind(this))
        newValue.push(el.getProps())
      })
    if (!this.value || (typeof this.value === 'object' && this.value.length < newValue.length)) {
      this.value = newValue
    }

  }

  onRadioButtonChange(event) {
    let targetButton = event.target
    if (targetButton.value = 'on') {
      this
        .$
        .container
        .querySelectorAll('tangy-radio-button')
        .forEach(el => {
          if (el.name !== targetButton.name && targetButton.value == 'on') {
            el.value = ''
          }
        })
    }

    let newValue = []
    this.shadowRoot
      .querySelectorAll('tangy-radio-button')
      .forEach(el => newValue.push(el.getProps()))
    this.value = newValue
    this.dispatchEvent(new CustomEvent('change'))

  }

  validate() {
    let foundOne = false
    this.shadowRoot.querySelectorAll('[name]').forEach(el => {
      if (el.value === 'on') foundOne = true
    })
    if (this.required && !this.hidden && !this.disabled && !foundOne) {
      this.invalid = true
      this.$['error-text'].innerHTML =  `
      ${(this.errorText !== "" ? `<div style="float:left;margin-right:10px;"><iron-icon icon="error""></iron-icon></div><div style="margin-left:35px;">` : '')}
      ${this.errorText}</div>`


      return false
    } else {
      this.$['error-text'].innerHTML = ""
      this.invalid = false
      return true
    }
  }

}
window.customElements.define(TangyRadioButtons.is, TangyRadioButtons);
