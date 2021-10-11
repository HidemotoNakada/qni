import { Simulator } from "lib/simulator.ts"

self.addEventListener(
  "message",
  function (e) {
    const nqubit = e.data.nqubit
    const steps = e.data.steps
    const kets = e.data.kets
    const simulator = new Simulator("0".repeat(nqubit), kets)

    steps.forEach((instructions, i) => {
      simulator.runStep(instructions)

      self.postMessage({
        type: "step",
        step: i,
        amplitudes: simulator.amplitudes,
        blochVectors: simulator.blochVectors,
        measuredBits: simulator.measuredBits,
        flags: simulator.flags,
      })
    })

    self.postMessage({ type: "finish" })
  },
  false,
)
