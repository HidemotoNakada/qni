require 'application_system_test_case'

class RzGateTest < ApplicationSystemTestCase
  test 'the default angle' do
    visit new_circuit_path

    rz_gate = put_operation('Rz', col: 0, row: 0)

    assert_theta 'π/2', rz_gate
  end

  test 'apply to |0>' do
    visit new_circuit_path
    put_operation '|0>', col: 0, row: 0

    put_operation 'Rz', col: 1, row: 0

    assert_qubit_circles 2
    assert_magnitudes 1, 0
    assert_phases(-45, 0)
  end

  test 'apply to |1>' do
    visit new_circuit_path
    put_operation '|1>', col: 0, row: 0

    put_operation 'Rz', col: 1, row: 0

    assert_qubit_circles 2
    assert_magnitudes 0, 1
    assert_phases 0, 45
  end
end
