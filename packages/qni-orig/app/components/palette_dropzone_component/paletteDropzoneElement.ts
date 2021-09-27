import { html, render } from "@github/jtml"
import { Operation } from "mixins"
import { controller } from "@github/catalyst"

@controller
export class PaletteDropzoneElement extends HTMLElement {
  connectedCallback(): void {
    this.attachShadow({ mode: "open" })
    this.update()
  }

  update(): void {
    render(
      html`<style>
          :host {
            position: relative;
            height: ${Operation.size.base.height};
            width: ${Operation.size.base.width};
          }

          ::slotted(*) {
            position: absolute;
          }
        </style>

        <div data-action="draggable.grab:palette-dropzone#newOperation">
          <slot></slot>
        </div>`,
      this.shadowRoot!,
    )
  }

  newOperation(event: Event): void {
    const operation = event.target as HTMLElement
    const newOperation = document.createElement(operation.tagName)

    if (operation.tagName === "WRITE-GATE") {
      const value = operation.getAttribute("data-value")
      newOperation.setAttribute("data-value", value!)
    } else if (operation.tagName === "PHASE-GATE") {
      const phi = operation.getAttribute("data-phi")
      newOperation.setAttribute("data-phi", phi!)
    } else if (
      operation.tagName === "RX-GATE" ||
      operation.tagName === "RY-GATE" ||
      operation.tagName === "RZ-GATE"
    ) {
      const theta = operation.getAttribute("data-theta")
      newOperation.setAttribute("data-theta", theta!)
    }

    this.append(newOperation)
  }
}
