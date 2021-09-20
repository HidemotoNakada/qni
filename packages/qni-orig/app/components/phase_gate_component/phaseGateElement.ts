import {
  DisableableMixin,
  DraggableMixin,
  HelpableMixin,
  IconableMixin,
  IfableMixin,
  JsonableMixin,
  LabelableMixin,
  SizeableMixin,
  WireableMixin,
} from "mixins"
import { TemplateResult, html, render } from "@github/jtml"
import { attr, controller } from "@github/catalyst"

@controller
export class PhaseGateElement extends DraggableMixin(
  WireableMixin(
    LabelableMixin(
      IfableMixin(
        DisableableMixin(
          IconableMixin(
            HelpableMixin(SizeableMixin(JsonableMixin(HTMLElement))),
          ),
        ),
      ),
    ),
  ),
) {
  @attr iconType = "circle"
  @attr phi = ""

  static create({
    phi = "",
    draggable = false,
  }: Partial<{ phi: string; draggable: boolean }> = {}): PhaseGateElement {
    const el = document.createElement("phase-gate") as PhaseGateElement
    el.phi = phi
    el.draggable = draggable
    return el
  }

  connectedCallback(): void {
    if (this.shadowRoot !== null) return
    this.attachShadow({ mode: "open" })
    this.update()
    this.initDraggable()
  }

  update(): void {
    render(
      html`${this.sizeableStyle} ${this.wiresStyle} ${this.iconStyle}
        ${this.draggableStyle} ${this.disabledStyle} ${this.labelStyle}

        <div
          id="body"
          data-phi="${this.phi}"
          data-action="mouseenter:phase-gate#showHelp mousedown:phase-gate#grab mouseup:phase-gate#unGrab"
        >
          ${this.wiresSvg} ${this.iconSvg}
        </div>`,
      this.shadowRoot!,
    )
  }

  toJson(): string {
    if (this.phi === "") {
      return '"P"'
    } else {
      return `"P(${this.phi})"`
    }
  }

  get iconSvg(): TemplateResult {
    return html`<svg
      id="icon"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
    >
      <path d="M17 24A7 7 0 1 0 31 24A7 7 0 1 0 17 24M19 34L29 13" />
    </svg>`
  }
}
