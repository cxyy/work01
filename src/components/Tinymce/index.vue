<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container" v-if="uploadImg">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
  </div>
</template>

<script>
  import editorImage from './module/index'
  import plugins from './plugins'
  import toolbar from './toolbar'

  export default {
    name: 'tinymce',
    components: {
      editorImage
    },
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      uploadImg: {
        type: Boolean,
        default: false
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        default: 'file edit insert view format table'
      },
      height: {
        type: Number,
        required: false,
        default: 300
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id || 'vue-tinymce-' + +new Date(),
        fullscreen: false
      }
    },
    methods: {
      initTinymce() {
        const _this = this
        window.tinymce.init({
          language_url: '/static/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: this.menubar,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
          }
        })
      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        return window.tinymce.get(this.tinymceId).getContent()
      },
      imageSuccessCBK(arr) {
        const _this = this
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        })
      }
    },
    mounted() {
      this.initTinymce()
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || '')
          )
        }
      }
    },
    activated() {
      this.initTinymce()
    },
    deactivated() {
      this.destroyTinymce()
    },
    destroyed() {
      this.destroyTinymce()
    }
  }
</script>

<style lang="scss">
  .tinymce-container {
    position: relative;
    .tinymce-textarea {
      visibility: hidden;
      z-index: -1;
    }
    .editor-custom-btn-container {
      position: absolute;
      right: 4px;
      top: 4px;
    }
    .fullscreen .editor-custom-btn-container {
      z-index: 10000;
      position: fixed;
    }
    .editor-upload-btn {
      display: inline-block;
    }
  }
  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }
</style>
