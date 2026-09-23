<script setup>
import { ref } from "vue";

// 结算页的几个字段，故意用不同的修饰符写法做对照
const priceWrong = ref("12"); // 不加修饰符
const priceRight = ref(12); // 加了 .number
const count = ref(2);
const code = ref(""); // .trim
const remark = ref(""); // .lazy
const remarkTyping = ref(""); // 用来记录正在输入的内容

const shipping = 5; // 运费，固定值

function onRemarkInput(event) {
  remarkTyping.value = event.target.value;
}

// 小计：两个都能算对，因为乘法会把字符串偷偷转成数字
function subtotal() {
  return priceRight.value * count.value;
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-model 的三个修饰符：结算页的价格输入</h3>
    <p class="practice__desc">
      修饰符写在 v-model
      后面，用来改掉默认的同步行为。下面每栏都显示了数据的真实值和类型。
    </p>

    <h4 class="practice__subtitle">.number：把输入值转成数字</h4>
    <div class="layout">
      <div class="layout__item">
        <div class="layout__head layout__head--warn">
          不加修饰符：v-model="priceWrong"
        </div>
        <input v-model="priceWrong" class="native-input" />
        <ul class="readout">
          <li>值：{{ JSON.stringify(priceWrong) }}</li>
          <li>类型：{{ typeof priceWrong }}</li>
          <li class="readout__bad">
            加 5 元运费：{{ priceWrong + shipping }}（字符串拼接，错了）
          </li>
        </ul>
      </div>

      <div class="layout__item">
        <div class="layout__head">
          加了 .number：v-model.number="priceRight"
        </div>
        <input v-model.number="priceRight" class="native-input" />
        <ul class="readout">
          <li>值：{{ JSON.stringify(priceRight) }}</li>
          <li>类型：{{ typeof priceRight }}</li>
          <li class="readout__good">
            加 5 元运费：{{ priceRight + shipping }}（正常相加）
          </li>
        </ul>
      </div>
    </div>

    <p class="practice__desc">
      两个框里都输入
      <code>12</code>
      试试。不加修饰符时拿到的是字符串，用它做加法就变成了首尾相接。另外，如果输入的内容不是合法数字（比如输入
      <code>abc</code>
      ），.number 会原样保留字符串，不会强行变成 NaN。
    </p>

    <h4 class="practice__subtitle">.trim：去掉首尾空格</h4>
    <div class="layout">
      <div class="layout__item">
        <div class="layout__head">v-model.trim="code"</div>
        <input
          v-model.trim="code"
          class="native-input"
          placeholder="前后各敲几个空格再输入内容"
        />
        <ul class="readout">
          <li>值：{{ JSON.stringify(code) }}</li>
          <li class="readout__good">前后空格已经被自动删掉了</li>
        </ul>
      </div>

      <div class="layout__item">
        <div class="layout__head">适用场合</div>
        <ul class="readout readout--plain">
          <li>优惠码、邀请码：用户复制粘贴时很容易带空格</li>
          <li>用户名、邮箱：避免"看起来一样其实不相等"的账号</li>
          <li>它只管首尾，中间的空格会保留</li>
        </ul>
      </div>
    </div>

    <h4 class="practice__subtitle">.lazy：内容失焦时才同步</h4>
    <div class="layout">
      <div class="layout__item">
        <div class="layout__head">v-model.lazy="remark"</div>
        <!-- 同一个输入框再加一个 @input，用来对比"正在输入"和"已同步"的差别 -->
        <input
          v-model.lazy="remark"
          class="native-input"
          placeholder="输入后不要点别处，直接看下面的对比"
          @input="onRemarkInput"
        />
        <ul class="readout">
          <li>正在输入的内容：{{ JSON.stringify(remarkTyping) }}</li>
          <li
            :class="remark === remarkTyping ? 'readout__good' : 'readout__warn'"
          >
            已同步到数据：{{ JSON.stringify(remark) }}
          </li>
        </ul>
      </div>

      <div class="layout__item">
        <div class="layout__head">默认行为与 .lazy 的区别</div>
        <ul class="readout readout--plain">
          <li>默认：每敲一个字就同步一次，数据会跟着变很多次</li>
          <li>.lazy：光标离开输入框时才同步一次</li>
          <li>适合备注、简介、大段文本这类不需要实时响应的输入</li>
        </ul>
      </div>
    </div>

    <div class="practice__log">
      数量 {{ count }} 件 × 单价 {{ priceRight }} 元 = 小计 {{ subtotal() }} 元
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-bottom: 8px;
}

.layout__item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fff;
}

.layout__head {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 10px;
}

.layout__head--warn {
  color: #e6a23c;
}

.native-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  color: #303133;
  outline: none;
}

.native-input:focus {
  border-color: #409eff;
}

.readout {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
  line-height: 1.9;
  color: #303133;
  font-family: Menlo, Consolas, monospace;
}

.readout--plain {
  font-family: inherit;
  font-size: 13px;
  line-height: 1.9;
}

.readout__bad {
  color: #f56c6c;
}

.readout__good {
  color: #67c23a;
}

.readout__warn {
  color: #e6a23c;
}

.practice__log {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 13px;
  color: #303133;
  font-family: Menlo, Consolas, monospace;
}

.practice__subtitle {
  margin: 20px 0 10px;
  font-size: 14px;
  color: #303133;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #c7254e;
  font-size: 12px;
}
</style>
