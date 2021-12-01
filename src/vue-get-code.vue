<template>
  <span
    class="vue-get-code"
    v-bind="$attrs"
    :class="[disable && 'disable', enableCountdown && 'enable-countdown']"
    v-on="$listeners"
    @click="click"
  >
    <slot v-if="!enableCountdown" name="default">获取验证码</slot>
    <slot v-if="enableCountdown" name="countdown" :data="{interval, seconds}"
      >{{ interval - seconds }}S</slot
    >
  </span>
</template>

<script>
export default {
  name: 'VueGetCode',
  props: {
    getCode: {
      required: true,
      type: Function
    },
    interval: {
      default: 60,
      type: Number
    },
    // 让外部调用者能控制组件的禁用状态，比如，如果没填手机号码，获取验证码的按钮要禁用
    disable: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      timer: null,
      seconds: 0,
      enableCountdown: false
    }
  },
  watch: {
    disable(newValue) {
      // 倒计时正在运行，外部突然禁用了，就清理计时器等状态
      if (newValue && this.timer) {
        this.reset()
      }
    }
  },
  destroyed() {
    this.reset()
  },
  methods: {
    click() {
      if (this.enableCountdown) return
      if (this.disable) return

      this.seconds = 0
      this.enableCountdown = true

      // vue-sfc-cli 对 async await 的支持还有问题，暂时换成 Promise 写法
      new Promise((resolve, reject) => {
        let result
        try {
          result = this.getCode() // getCode 可能是同步的，也可能是 Promise 异步函数
        } catch (error) {
          reject(error)
        }

        resolve(result)
      })
        .then(() => {
          this.timer = setInterval(() => {
            this.seconds++

            if (this.seconds >= this.interval || this.disable) {
              this.reset()
            }
          }, 1000)
        })
        .catch(() => {
          this.reset()
        })
    },
    reset() {
      clearInterval(this.timer)
      this.timer = null
      this.seconds = 0
      this.enableCountdown = false
    }
  }
}
</script>
