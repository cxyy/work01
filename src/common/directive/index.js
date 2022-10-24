import Vue from 'vue'
Vue.directive('auto-title', {
  bind: function (el, binding, vnode) {
    updateTitle(el, binding, vnode)
  },
  update: function (el, binding, vnode) {
    updateTitle(el, binding, vnode)
  }
})

function updateTitle (el, binding, vnode) {
  el.classList.add('auto-title')
  el.onmouseenter = function () {
    if (el.clientWidth < el.scrollWidth) {
      el.title = el.innerText
    } else {
      el.title = ''
    }
  }
}
