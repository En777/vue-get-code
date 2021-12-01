(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueGetCode = {}));
}(this, (function (exports) { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script = {
    name: 'VueGetCode',
    props: {
      getCode: {
        required: true,
        type: Function
      },
      interval: {
        "default": 60,
        type: Number
      },
      // 让外部调用者能控制组件的禁用状态，比如，如果没填手机号码，获取验证码的按钮要禁用
      disable: {
        "default": false,
        type: Boolean
      }
    },
    data: function data() {
      return {
        timer: null,
        seconds: 0,
        enableCountdown: false
      };
    },
    watch: {
      disable: function disable(newValue) {
        // 倒计时正在运行，外部突然禁用了，就清理计时器等状态
        if (newValue && this.timer) {
          this.reset();
        }
      }
    },
    destroyed: function destroyed() {
      this.reset();
    },
    methods: {
      click: function click() {
        var _this = this;

        if (this.enableCountdown) return;
        if (this.disable) return;
        this.seconds = 0;
        this.enableCountdown = true;
        this.timer = setInterval(function () {
          _this.seconds++;

          if (_this.seconds >= _this.interval || _this.disable) {
            _this.reset();
          }
        }, 1000); // vue-sfc-cli 对 async await 的支持还有问题，暂时换成 Promise 写法

        new Promise(function (resolve, reject) {
          var result;

          try {
            result = _this.getCode(); // getCode 可能是同步的，也可能是 Promise 异步函数
          } catch (error) {
            reject(error);
          }

          resolve(result);
        })["catch"](function () {
          _this.reset();
        });
      },
      reset: function reset() {
        clearInterval(this.timer);
        this.timer = null;
        this.seconds = 0;
        this.enableCountdown = false;
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  var __vue_script__ = script;
  /* template */

  var __vue_render__ = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c("span", _vm._g(_vm._b({
      staticClass: "vue-get-code",
      "class": [_vm.disable && "disable", _vm.enableCountdown && "enable-countdown"],
      on: {
        click: _vm.click
      }
    }, "span", _vm.$attrs, false), _vm.$listeners), [!_vm.enableCountdown ? _vm._t("default", function () {
      return [_vm._v("获取验证码")];
    }) : _vm._e(), _vm._v(" "), _vm.enableCountdown ? _vm._t("countdown", function () {
      return [_vm._v(_vm._s(_vm.interval - _vm.seconds) + "S")];
    }, {
      data: {
        interval: _vm.interval,
        seconds: _vm.seconds
      }
    }) : _vm._e()], 2);
  };

  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;
  /* style */

  var __vue_inject_styles__ = undefined;
  /* scoped */

  var __vue_scope_id__ = undefined;
  /* module identifier */

  var __vue_module_identifier__ = undefined;
  /* functional template */

  var __vue_is_functional_template__ = false;
  /* style inject */

  /* style inject SSR */

  var Component = normalizeComponent_1({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

  // Import vue component
  // the same plugin more than once,
  // so calling it multiple times on the same plugin
  // will install the plugin only once

  Component.install = function (Vue) {
    Vue.component(Component.name, Component);
  }; // To auto-install when vue is found


  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(Component);
  } // To allow use as module (npm/webpack/etc.) export component
  // also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
  // export const RollupDemoDirective = component;

  exports.default = Component;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
