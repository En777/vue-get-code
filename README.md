# vue-get-code (获取短信验证码的 vue 组件)

[![NPM Version](https://badge.fury.io/js/vue-get-code.svg)](https://www.npmjs.com/package/vue-get-code)
[![NPM License](https://badgen.net/npm/license/vue-get-code)](https://github.com/En777/vue-get-code/blob/main/LICENSE)
[![NPM Download](https://badgen.net/npm/dm/vue-get-code)](https://www.npmjs.com/package/vue-get-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/En777/vue-get-code/pulls)

## Table of Contents 目录

- [Introduction](#introduction)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Links](#links)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Introduction 介绍

获取短信验证码的 vue 组件（封装了发送验证码、倒计时，倒计时完成后可以重新发送……）。

非常简单，用起来很方便，非常灵活，支持复杂的场景。

获取短信验证码、获取邮件验证码，都可以使用这个组件。

## Features 特点

vue-get-code 是一个非常灵活的获取短信验证码组件。

支持灵活的配置：

- 倒计时的秒数，默认 60 秒，可按需设置
- 发送验证码需要 ajax 调用接口，可以在 getCode() 函数中实现，过程由开发者实现，非常灵活，返回一个 Promise 对象即可，组件会等待函数，成功后会开始倒计时，失败了会结束倒计时。在此函数中，也可以做表单验证，真的非常灵活。
- 调用者可以控制组件是否禁用
- 发送验证码前、倒计时、禁用，多个状态都有对应 class，控制样式非常方便
- 可以定制发验证码之前的文字
- 可以定制倒计时的文案
- 倒计时有事件触发(countdownBegin/countdownUpdate/countdownEnd)
- 获取验证码接口报错有事件触发(getCodeError)

## Install 安装

`npm install vue-get-code`

## Usage 使用

### 基本用法

```vue
<template>
  <form>
    <input placeholder="phone" />
    <vue-get-code :getCode="getCode" />
  </form>
</template>

<script>
import VueGetCode from 'vue-get-code'

export default {
  components: {
    VueGetCode
  },
  methods: {
    // 调用获取验证码的接口，此函数请返回 Promise 对象
    getCode() {
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

### 修改配置，把倒计时改为 120 秒

```vue
<template>
  <form>
    <input placeholder="phone" />
    <vue-get-code :getCode="getCode" :interval="120" />
  </form>
</template>

<script>
export default {
  methods: {
    getCode() {
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

vue-get-code 组件的 props 参数

```
// 发送验证码的 ajax 实现，函数请返回 Promise 对象
getCode: {
  required: true,
  type: Function
},
// 倒计时的时长，单位：秒
interval: {
  default: 60,
  type: Number
},
// 禁用，禁止点击
disable: {
  default: false,
  type: Boolean
}
```

vue-get-code 组件的 event 事件

```
countdownBegin
countdownUpdate
countdownEnd
getCodeError
```

### 修改默认文案，如果已经获取过一次验证码，显示“重新获取”

```vue
<template>
  <form>
    <input placeholder="phone" />
    <vue-get-code :getCode="getCode" :interval="3">
      <template v-slot:default="child">
        {{ child.data.count <= 0 ? '获取验证码' : '重新获取' }}
      </template>
    </vue-get-code>
  </form>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    getCode() {
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

### 高级：配置默认文字、倒计时文字、表单验证与获取验证码结合、event 事件

```vue
<template>
  <form>
    <input v-model="form.phone" placeholder="phone" />

    <vue-get-code
      :getCode="getCode"
      :interval="5"
      :disable="!form.phone"
      @countdownBegin="log('begin', arguments)"
      @countdownUpdate="log('update', arguments)"
      @countdownEnd="log('end', arguments)"
    >
      <template v-slot:default
        >获取验证码(输入手机后才能点击获取验证码)</template
      >
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
        phone: ''
      }
    }
  },
  methods: {
    getCode() {
      if (this.form.phone.length < 7) {
        alert('请填写正确的手机号码')
        throw '请填写正确的手机号码' // 抛出错误，中断 Promise chain
      }

      let mockApi = 'https://cdn.jsdelivr.net/npm/vue@2/package.json'
      return fetch(mockApi)
    },
    log() {
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

## Links

- [docs](https://En777.github.io/vue-get-code/)

## Contributing 参与开发贡献

工程基于 https://github.com/FEMessage/vue-sfc-cli 创建的。

简单使用示例：

```
# Install dependency
yarn

# Develop component
yarn dev

# Build
yarn build

# Ready to publish!
# Or use `npm publish`
yarn publish
```

For those who are interested in contributing to this project, such as:

- report a bug
- request new feature
- fix a bug
- implement a new feature

Please refer to our [contributing guide](https://github.com/FEMessage/.github/blob/main/CONTRIBUTING.md).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](./LICENSE)
