require 'test_helper'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium_chrome_headless

  def palette(locator)
    first("#palette #{locator}")
  end

  def quantum_circuit(locator)
    find("quantum-circuit #{locator}")
  end

  def decoded_current_path
    URI.decode_www_form_component(current_path)
  end

  def second(locator)
    all(locator)[1]
  end

  def third(locator)
    all(locator)[2]
  end
end
