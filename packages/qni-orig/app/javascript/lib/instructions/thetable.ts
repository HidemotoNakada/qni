import { Constructor } from "./constructor"
import { InstructionWithElement } from "./instructionWithElement"
import { attributeNameFor, Util } from "lib/base"
import { parseFormula, PARSE_COMPLEX_TOKEN_MAP_RAD } from "lib/math"

export declare class Thetable {
  get theta(): string
  set theta(value: string)
}

export const isThetable = (arg: unknown): arg is Thetable =>
  typeof arg === "object" &&
  arg !== null &&
  typeof (arg as Thetable).theta === "string"

export function ThetableMixin<
  TBase extends Constructor<InstructionWithElement>,
>(Base: TBase): Constructor<Thetable> & TBase {
  class ThetableMixinClass extends Base {
    get theta(): string {
      const theta = this.element.getAttribute(
        attributeNameFor("instruction:theta"),
      )
      Util.notNull(theta)
      parseFormula<number>(theta, PARSE_COMPLEX_TOKEN_MAP_RAD)
      return theta
    }

    set theta(theta: string) {
      parseFormula<number>(theta, PARSE_COMPLEX_TOKEN_MAP_RAD)
      this.element.setAttribute(attributeNameFor("instruction:theta"), theta)
      this.element.dataset.gateLabel = theta.replace(/pi/g, "π")
    }
  }

  return ThetableMixinClass as Constructor<Thetable> & TBase
}
