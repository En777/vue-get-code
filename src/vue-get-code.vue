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
    async click() {
      if (this.enableCountdown) return
      if (this.disable) return

      this.seconds = 0
      this.enableCountdown = true
      this.timer = setInterval(() => {
        this.seconds++

        if (this.seconds >= this.interval || this.disable) {
          this.reset()
        }
      }, 1000)

      await this.getCode().catch(() => {
        alert('ca')
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

<style lang="less"></style>
