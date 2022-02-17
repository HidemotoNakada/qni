# frozen_string_literal: true

module Jekyll
  class MarginNoteTagBlock < Liquid::Block
    def initialize(tag_name, note_name, tokens)
      super
      @note_id = "margin-note-#{note_name.strip}"
    end

    def render(context)
      text = super
      %(<label for="#{@note_id}" class="margin-note-toggle"></label>) +
        %(<input type="checkbox" id="#{@note_id}" class="margin-note-toggle">) +
        %(<span class="margin-note">#{text}</span>)
    end
  end
end

Liquid::Template.register_tag('margin_note', Jekyll::MarginNoteTagBlock)
