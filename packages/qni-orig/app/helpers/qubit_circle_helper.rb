# frozen_string_literal: true

module QubitCircleHelper
  def qubit_circle(*options)
    render QubitCircleComponent.new(*options)
  end

  def qubit_circle_popup
    component 'qubit_circle_popup'
  end
end
