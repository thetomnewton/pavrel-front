<script>
import { Editor, EditorContent, BubbleMenu, VueRenderer } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Dropcursor from '@tiptap/extension-dropcursor'
import Heading from '@tiptap/extension-heading'
import Img from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import tippy from 'tippy.js'
import IdeaShortcutList from './IdeaShortcutList.vue'
import MentionList from './MentionList.vue'
import { mapState, mapGetters } from 'vuex'
import { PluginKey } from 'prosemirror-state'
import FontBoldIcon from '../components/FormatBoldIcon.vue'
import FontItalicIcon from '../components/FormatItalicIcon.vue'
import FontStrikeIcon from '../components/FormatStrikeIcon.vue'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import php from 'highlight.js/lib/languages/php'
import { lowlight } from 'lowlight'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)
lowlight.registerLanguage('php', php)

async function uploadImage(file) {
  const data = new FormData()
  data.append('file', file)
  return axios.post('/documents/image/upload', data)
}

export default {
  components: {
    EditorContent,
    BubbleMenu,
    FontBoldIcon,
    FontItalicIcon,
    FontStrikeIcon,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    noHeadings: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Add description...',
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      editor: null,
      reader: new FileReader(),
    }
  },

  computed: {
    ...mapState('base', ['users', 'user', 'ideas']),
    ...mapGetters('base', ['getIdeaTeamSlug']),
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) return

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    const vm = this
    const HashExtension = Mention.extend({
      name: 'hash',

      addKeyboardShortcuts() {
        return {
          'Mod-Enter': e => vm.$emit('save'),
        }
      },
    })

    this.editor = new Editor({
      content: this.modelValue,

      editable: this.editable,

      extensions: [
        Blockquote,
        BulletList,
        OrderedList,
        ListItem,
        Dropcursor,
        Document,
        Text,
        Paragraph,
        Bold,
        Italic,
        Strike,
        Code,
        Heading.configure({
          levels: this.noHeadings ? [] : [1, 2, 3, 4, 5, 6],
        }),

        Placeholder.configure({
          placeholder: this.placeholder,
        }),

        Img.configure({
          inline: true,
          allowBase64: true,
        }),

        Link.configure({
          openOnClick: false,
        }),

        CodeBlockLowlight.configure({ lowlight }),

        HashExtension.configure({
          HTMLAttributes: { class: 'tag' },

          renderLabel: ({ options, node }) => {
            const idea = this.ideas.find(idea => idea.id === node.attrs.id)
            if (!idea) return `${options.suggestion.char}unknown`
            else return `${options.suggestion.char}${this.getIdeaTeamSlug(idea).toUpperCase()}-${idea.team_idea_id}`
          },

          suggestion: {
            pluginKey: new PluginKey('hash'),
            char: '#',

            items: ({ query }) =>
              (this.ideas || []).filter(idea =>
                `${this.getIdeaTeamSlug(idea).toLowerCase()}-${idea.team_idea_id.toString()}`.includes(
                  query.toString().toLowerCase()
                )
              ),

            render: () => {
              let component
              let popup

              return {
                onStart: props => {
                  component = new VueRenderer(IdeaShortcutList, {
                    props,
                    editor: props.editor,
                  })

                  if (!props.clientRect) return

                  popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  })
                },

                onUpdate(props) {
                  component.updateProps(props)

                  if (!props.clientRect) return

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  })
                },

                onKeyDown(props) {
                  if (props.event.key === 'Escape') {
                    popup[0].hide()
                    props.event.stopPropagation()

                    return true
                  }

                  return component.ref?.onKeyDown(props)
                },

                onExit() {
                  popup[0].destroy()
                  component.destroy()
                },
              }
            },
          },
        }),

        Mention.configure({
          HTMLAttributes: { class: 'mention' },

          renderLabel({ options, node }) {
            return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          },

          suggestion: {
            items: ({ query }) => {
              return (this.users || [])
                .filter(({ id }) => id !== this.user.id)
                .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
            },

            render: () => {
              let component
              let popup

              return {
                onStart: props => {
                  component = new VueRenderer(MentionList, {
                    props,
                    editor: props.editor,
                  })

                  if (!props.clientRect) return

                  popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  })
                },

                onUpdate(props) {
                  component.updateProps(props)

                  if (!props.clientRect) return

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  })
                },

                onKeyDown(props) {
                  if (props.event.key === 'Escape') {
                    popup[0].hide()
                    props.event.stopPropagation()

                    return true
                  }

                  return component.ref?.onKeyDown(props)
                },

                onExit() {
                  popup[0].destroy()
                  component.destroy()
                },
              }
            },
          },
        }),
      ],

      editorProps: {
        handleDrop: function (view, event, slice, moved) {
          if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            // if dropping external files
            let file = event.dataTransfer.files[0] // the dropped file
            let filesize = (file.size / 1024 / 1024).toFixed(4) // get the filesize in MB
            if ((file.type === 'image/jpeg' || file.type === 'image/png') && filesize < 10) {
              // check valid image type under 10MB
              // check the dimensions
              let _URL = window.URL || window.webkitURL
              let img = new Image() /* global Image */
              img.src = _URL.createObjectURL(file)
              img.onload = function () {
                if (this.width > 5000 || this.height > 5000) {
                  window.alert('Your images need to be less than 5000 pixels in height and width.') // display alert
                } else {
                  // valid image so upload to server
                  //  upload the image to the server or s3 bucket somewhere
                  uploadImage(file)
                    .then(function (response) {
                      // place the now uploaded image in the editor where it was dropped
                      // const { schema } = view.state
                      // const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                      // const node = schema.nodes.image.create({ src: response }) // creates the image element
                      // const transaction = view.state.tr.insert(coordinates.pos, node) // places it in the correct position
                      // return view.dispatch(transaction)
                    })
                    .catch(function (error) {
                      if (error) {
                        window.alert('There was a problem uploading your image, please try again.')
                      }
                    })
                }
              }
            } else {
              window.alert('Images need to be in jpg or png format and less than 10mb in size.')
            }
            return true // handled
          }
          return false // not handled use default behaviour
        },
      },

      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },

      onFocus: () => {
        this.$emit('focus')
      },

      onBlur: () => {
        this.$emit('blur')
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },

  methods: {
    focusEditor() {
      this.$nextTick(() => {
        this.editor.view.dom.focus()
      })
    },
  },
}
</script>

<template>
  <div class="flex flex-1">
    <BubbleMenu class="bubble-menu" :tippy-options="{ duration: 100 }" :editor="editor" v-if="editor">
      <button
        type="button"
        class="rounded-l"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <FontBoldIcon />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <FontItalicIcon />
      </button>

      <button
        type="button"
        class="rounded-r"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <FontStrikeIcon />
      </button>
    </BubbleMenu>

    <EditorContent class="flex w-full" :editor="editor" />
  </div>
</template>

<style>
@import '../assets/css/prose.css';
div[data-tippy-root] > div {
  border: none !important;
}

.bubble-menu {
  @apply flex space-x-1 rounded-md border-none bg-slate-800 pl-4 shadow-sm dark:bg-zinc-900;
  padding: 0.2rem;
}
.bubble-menu button {
  @apply mb-px ml-px appearance-none border-none bg-none px-1 py-1 text-sm font-medium text-white;
}
.bubble-menu button:hover {
  @apply bg-slate-600 dark:bg-zinc-600;
}
.bubble-menu button.is-active {
  @apply bg-white text-slate-800 dark:text-zinc-800;
}

.ProseMirror .tag,
.ProseMirror .mention {
  @apply cursor-default font-medium;
}
.ProseMirror .tag {
  @apply text-blue-500;
}
.tippy-box {
  @apply rounded-md border bg-white shadow-md;
}
.tippy-box .items {
  @apply flex min-w-[140px] flex-col py-1;
}
.tippy-box .item {
  @apply cursor-default px-[10px] text-left text-[.8125rem] leading-8 hover:bg-slate-100 active:bg-slate-200;
}
.tippy-box .item.is-selected {
  @apply bg-slate-100 active:bg-slate-200;
}
</style>
