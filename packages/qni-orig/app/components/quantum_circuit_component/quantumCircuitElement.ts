import { attr, controller, target, targets } from "@github/catalyst"
import { html, render } from "@github/jtml"
import { CircuitStepElement } from "circuit_step_component/circuitStepElement"
import { PhaseGateElement } from "phase_gate_component/phaseGateElement"
import { RxGateElement } from "rx_gate_component/rxGateElement"
import { RyGateElement } from "ry_gate_component/ryGateElement"

@controller
export class QuantumCircuitElement extends HTMLElement {
  @attr json = ""

  @target body: HTMLElement
  @targets circuitSteps: CircuitStepElement[]

  connectedCallback(): void {
    this.attachShadow({ mode: "open" })
    this.update()
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "data-json" && oldValue !== newValue && this.body) {
      this.body.innerHTML = ""
      this.body.append(this.circuitStepFragment)
    }
  }

  update(): void {
    render(
      html`<style>
          #body {
            display: flex;
            flex-direction: row;
          }
        </style>

        <div id="body" data-target="quantum-circuit.body">
          <slot></slot>
          ${this.circuitStepFragment}
        </div>`,
      this.shadowRoot!,
    )
  }

  h(...qubits: number[]): void {
    this.applySingleGate("h-gate", ...qubits)
  }

  x(...qubits: number[]): void {
    this.applySingleGate("x-gate", ...qubits)
  }

  y(...qubits: number[]): void {
    this.applySingleGate("y-gate", ...qubits)
  }

  z(...qubits: number[]): void {
    this.applySingleGate("z-gate", ...qubits)
  }

  phase(phi: number, ...qubits: number[]): void {
    this.applyAngledSingleGate("phase-gate", phi, ...qubits)
  }

  rnot(...qubits: number[]): void {
    this.applySingleGate("rnot-gate", ...qubits)
  }

  rx(theta: number, ...qubits: number[]): void {
    this.applyAngledSingleGate("rx-gate", theta, ...qubits)
  }

  ry(theta: number, ...qubits: number[]): void {
    this.applyAngledSingleGate("ry-gate", theta, ...qubits)
  }

  private applySingleGate(elementName: string, ...qubits: number[]): void {
    if (qubits.some((each) => each < 0))
      throw new Error(
        "The index of the qubit must be greater than or equal to 0.",
      )
    if (qubits.some((each) => each > 15))
      throw new Error(
        "The index of the qubit must be less than or equal to 15.",
      )

    const circuitStep = document.createElement(
      "circuit-step",
    ) as CircuitStepElement
    circuitStep.setAttribute("data-targets", "quantum-circuit.circuitSteps")

    const nqubit = qubits.sort((a, b) => b - a)[0]

    for (let i = 0; i <= nqubit; i++) {
      const dropzone = document.createElement("circuit-dropzone")
      dropzone.setAttribute("data-targets", "circuit-step.dropzones")
      circuitStep.append(dropzone)
    }

    for (const each of qubits) {
      const gate = document.createElement(elementName)
      circuitStep.dropzones[each].append(gate)
    }

    this.append(circuitStep)
  }

  private applyAngledSingleGate(
    elementName: string,
    angle: number,
    ...qubits: number[]
  ): void {
    if (qubits.some((each) => each < 0))
      throw new Error(
        "The index of the qubit must be greater than or equal to 0.",
      )
    if (qubits.some((each) => each > 15))
      throw new Error(
        "The index of the qubit must be less than or equal to 15.",
      )

    const circuitStep = document.createElement(
      "circuit-step",
    ) as CircuitStepElement
    circuitStep.setAttribute("data-targets", "quantum-circuit.circuitSteps")

    const nqubit = qubits.sort((a, b) => b - a)[0]

    for (let i = 0; i <= nqubit; i++) {
      const dropzone = document.createElement("circuit-dropzone")
      dropzone.setAttribute("data-targets", "circuit-step.dropzones")
      circuitStep.append(dropzone)
    }

    for (const each of qubits) {
      if (elementName === "phase-gate") {
        const gate = document.createElement(elementName) as PhaseGateElement
        gate.phi = angle.toString()
        circuitStep.dropzones[each].append(gate)
      } else if (elementName === "rx-gate") {
        const gate = document.createElement(elementName) as RxGateElement
        gate.theta = angle.toString()
        circuitStep.dropzones[each].append(gate)
      } else if (elementName === "ry-gate") {
        const gate = document.createElement(elementName) as RyGateElement
        gate.theta = angle.toString()
        circuitStep.dropzones[each].append(gate)
      }
    }

    this.append(circuitStep)
  }

  private get circuitStepFragment(): DocumentFragment {
    const frag = document.createDocumentFragment()

    if (this.json === "") return frag

    const jsonData = JSON.parse(this.json)
    for (const step of jsonData.cols) {
      const circuitStep = document.createElement("circuit-step")
      circuitStep.setAttribute("data-targets", "quantum-circuit.circuitSteps")
      for (const instruction of step) {
        const dropzone = document.createElement("circuit-dropzone")
        dropzone.setAttribute("data-targets", "circuit-step.dropzones")

        switch (true) {
          case /^\|0>$/.test(instruction): {
            const writeGate = document.createElement("write-gate")
            writeGate.setAttribute("data-value", "0")
            dropzone.append(writeGate)
            break
          }
          case /^\|1>$/.test(instruction): {
            const writeGate = document.createElement("write-gate")
            writeGate.setAttribute("data-value", "1")
            dropzone.append(writeGate)
            break
          }
          case /^H$/.test(instruction): {
            const hGate = document.createElement("h-gate")
            hGate.setAttribute("data-targets", "circuit-step.controllableGates")
            hGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(hGate)
            break
          }
          case /^X$/.test(instruction): {
            const xGate = document.createElement("x-gate")
            xGate.setAttribute("data-targets", "circuit-step.controllableGates")
            xGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(xGate)
            break
          }
          case /^Y$/.test(instruction): {
            const yGate = document.createElement("y-gate")
            yGate.setAttribute("data-targets", "circuit-step.controllableGates")
            yGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(yGate)
            break
          }
          case /^Z$/.test(instruction): {
            const zGate = document.createElement("z-gate")
            zGate.setAttribute("data-targets", "circuit-step.controllableGates")
            zGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(zGate)
            break
          }
          case /^P$/.test(instruction): {
            const phaseGate = document.createElement("phase-gate")
            phaseGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            phaseGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(phaseGate)
            break
          }
          case /^P\((.+)\)$/.test(instruction): {
            const phaseGate = document.createElement("phase-gate")
            phaseGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            phaseGate.setAttribute("data-target", "circuit-dropzone.draggable")
            phaseGate.setAttribute("data-phi", RegExp.$1)
            dropzone.append(phaseGate)
            break
          }
          case /^X\^½$/.test(instruction): {
            const rootNotGate = document.createElement("rnot-gate")
            rootNotGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            rootNotGate.setAttribute(
              "data-target",
              "circuit-dropzone.draggable",
            )
            dropzone.append(rootNotGate)
            break
          }
          case /^Rx$/.test(instruction): {
            const rxGate = document.createElement("rx-gate")
            rxGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            rxGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(rxGate)
            break
          }
          case /^Rx\((.+)\)$/.test(instruction): {
            const rxGate = document.createElement("rx-gate")
            rxGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            rxGate.setAttribute("data-target", "circuit-dropzone.draggable")
            rxGate.setAttribute("data-theta", RegExp.$1)
            dropzone.append(rxGate)
            break
          }
          case /^Ry$/.test(instruction): {
            const ryGate = document.createElement("ry-gate")
            ryGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            ryGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(ryGate)
            break
          }
          case /^Ry\((.+)\)$/.test(instruction): {
            const ryGate = document.createElement("ry-gate")
            ryGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            ryGate.setAttribute("data-target", "circuit-dropzone.draggable")
            ryGate.setAttribute("data-theta", RegExp.$1)
            dropzone.append(ryGate)
            break
          }
          case /^Rz$/.test(instruction): {
            const rzGate = document.createElement("rz-gate")
            rzGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            rzGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(rzGate)
            break
          }
          case /^Rz\((.+)\)$/.test(instruction): {
            const rzGate = document.createElement("rz-gate")
            rzGate.setAttribute(
              "data-targets",
              "circuit-step.controllableGates",
            )
            rzGate.setAttribute("data-target", "circuit-dropzone.draggable")
            rzGate.setAttribute("data-theta", RegExp.$1)
            dropzone.append(rzGate)
            break
          }
          case /^Swap$/.test(instruction): {
            const swapGate = document.createElement("swap-gate")
            swapGate.setAttribute(
              "data-targets",
              "circuit-step.swapGates circuit-step.controllableGates",
            )
            swapGate.setAttribute("data-target", "circuit-dropzone.draggable")
            dropzone.append(swapGate)
            break
          }
          case /^•$/.test(instruction): {
            const controlGate = document.createElement("control-gate")
            controlGate.setAttribute(
              "data-targets",
              "circuit-step.controlGates",
            )
            controlGate.setAttribute(
              "data-target",
              "circuit-dropzone.draggable",
            )
            dropzone.append(controlGate)
            break
          }
          case /^Bloch$/.test(instruction): {
            const blochDisplay = document.createElement("bloch-display")
            dropzone.append(blochDisplay)
            break
          }
          case /^Measure$/.test(instruction): {
            const measureGate = document.createElement("measurement-gate")
            dropzone.append(measureGate)
            break
          }
          default:
        }
        circuitStep.append(dropzone)
      }
      frag.append(circuitStep)
    }
    return frag
  }
}
