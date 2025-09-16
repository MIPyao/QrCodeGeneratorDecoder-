<script setup lang="ts">
import { countries } from '@/api'
import { user } from '@/store'
import { storeToRefs } from 'pinia'

// 定义 API 响应数据的类型
interface CountryData {
  cn_name: string;
  flag: string;
}

interface CountriesResponse {
  [key: string]: CountryData;
}

// 响应式状态
const count = ref<number>(0)
const data = ref<CountriesResponse | null>(null)
const country = reactive<{ value: CountriesResponse }>({ value: {} })

// Pinia store
const piniaStore = user()
let {name} =  storeToRefs(piniaStore)

// 更改状态、触发更新的函数
function increment() {
  count.value++
  piniaStore.setName(name.value + count.value)
  //或者patch方法
  // piniaStore.$patch({
  //   name: 'daming'
  // })
}

// 定义组件 Props
const props = defineProps<{
  msg: string
}>()

// 生命周期钩子
onMounted(() => {
  console.log(`计数器初始值为 ${count.value}。`)
  console.log(`属性 msg: ${props.msg}`)
})

// 获取国家数据
countries().then(res => {
  data.value = res.data.data as CountriesResponse
  country.value = res.data.data as CountriesResponse
  console.log(data.value)
  console.log(country.value)
})
</script>
<template>
  <div class="greetings">
    <el-button type="primary" @click="increment">用户 {{name}} 点击了：{{ count }} 次</el-button>
    <p v-if="data">{{ data.US.cn_name + data.US.flag}}</p>
    <p v-if="country.value.CN">{{ country.value.CN.cn_name + country.value.CN.flag}}</p>
    <h1 class="purple">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 30px;
  top: -10px;
}
p{
  font-size: 24px;
}
h3 {
  font-size: 20px;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
