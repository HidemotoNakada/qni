import {TemplateResult, html, render} from '@github/jtml'
import {controller, target} from '@github/catalyst'
import {iconReload} from './icon'

const ovalLoaderIcon = html`<style>
    .oval-loader-icon {
      display: none;
      height: 60%;
      width: 60%;
    }

    #button:disabled > .oval-loader-icon {
      stroke: currentColor;
      color: rgb(255, 255, 255);
      display: block;
    }
  </style>

  <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="oval-loader-icon">
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="2">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>`

export class RunCircuitButtonElement extends HTMLElement {
  @target button!: HTMLInputElement

  runSimulator(): void {
    this.disable()
    this.dispatchEvent(new Event('run-circuit-button-click', {bubbles: true}))
  }

  disable(): void {
    this.button.disabled = true
  }

  enable(): void {
    this.button.disabled = false
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'})
    this.update()
  }

  update(): void {
    render(
      html`<button
        id="button"
        part="button"
        type="button"
        data-action="click:run-circuit-button#runSimulator"
        data-target="run-circuit-button.button"
        aria-label="Run circuit"
      >
        ${this.iconReloadHtml} ${ovalLoaderIcon}
      </button>`,
      this.shadowRoot!
    )
  }

  private get iconReloadHtml(): TemplateResult {
    return html([iconReload.data] as unknown as TemplateStringsArray)
  }
}

controller(RunCircuitButtonElement)
