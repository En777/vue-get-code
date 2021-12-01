
### 基本用法
```vue
<template>
  <form>
    <input placeholder="phone">
    <vue-get-code :getCode="getCode"/>
  </form>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 调用获取验证码的接口，此函数请返回 Promise 对象
    getCode () {
      let mockApi = 'https://cdn.jsdelivr.net/npm/vue@2/package.json'
      return fetch(mockApi)
    }
  }
}
</script>

<style>
.vue-get-code {
  color: #1092ed;
  cursor: pointer;
}
.vue-get-code.enable-countdown {
  cursor: not-allowed;
}
</style>
```

### 配置倒计时为120秒
```vue
<template>
  <form>
    <input placeholder="phone">
    <vue-get-code :getCode="getCode" :interval="120" />
  </form>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    getCode () {
      let mockApi = 'https://cdn.jsdelivr.net/npm/vue@2/package.json'
      return fetch(mockApi)
    }
  }
}
</script>

<style>
.vue-get-code {
  color: #1092ed;
  cursor: pointer;
}
.vue-get-code.enable-countdown {
  cursor: not-allowed;
}
</style>
```

### 高级：配置默认文字、倒计时文字、表单验证与获取验证码结合、event事件
```vue
<template>
  <form>
    <input v-model="form.phone" placeholder="phone">

    <vue-get-code :getCode="getCode" :interval="5" :disable="!form.phone" @countdownBegin="log('begin', arguments)" @countdownUpdate="log('update', arguments)" @countdownEnd="log('end', arguments)">
      <template v-slot:default>获取验证码(输入手机后才能点击获取验证码)</template>
      <template v-slot:countdown="child">
        请等待{{ child.data.interval - child.data.seconds }}秒
      </template>
    </vue-get-code>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        phone: '',
      }
    }
  },
  methods: {
    getCode () {
      if (this.form.phone.length < 7) {
        alert('请填写正确的手机号码')
        throw '请填写正确的手机号码' // 抛出错误，中断 Promise chain
      }

      let mockApi = 'https://cdn.jsdelivr.net/npm/vue@2/package.json'
      return fetch(mockApi)
    },
    log () {
      console.log(JSON.stringify(arguments))
    }
  }
}
</script>

<style>
.vue-get-code {
  color: #1092ed;
  cursor: pointer;
}
.vue-get-code.disable {
  color: gray;
  cursor: not-allowed;
}
.vue-get-code.enable-countdown {
  cursor: not-allowed;
}
</style>
```
