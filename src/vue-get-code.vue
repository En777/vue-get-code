<template>
  <span
    class="vue-get-code"
    :class="[disable && 'disable', enableCountdown && 'enable-countdown']"
    @click="click"
  >
    <slot v-if="!enableCountdown" name="default" :data="{interval, seconds, count}">获取验证码</slot>
    <slot v-if="enableCountdown" name="countdown" :data="{interval, seconds}">{{ interval - seconds }}S</slot>
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
      enableCountdown: false,
      // 发送验证码的次数
      count: 0
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
        .catch(error => {
          this.$emit('getCodeError', error)
          this.reset()
        })
        .then(() => {
          this.count++
          this.$emit('countdownBegin', this.seconds, this.interval)

          this.timer = setInterval(() => {
            this.seconds++
            if (this.disable) {
              this.reset()
              return
            }

            this.$emit('countdownUpdate', this.seconds, this.interval)

            if (this.seconds >= this.interval) {
              this.$emit('countdownEnd', this.seconds, this.interval)
              this.reset()
            }
          }, 1000)
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
