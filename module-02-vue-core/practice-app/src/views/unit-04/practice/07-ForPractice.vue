<script setup>
import { ref } from "vue";

// 购物车列表：数组里放对象，每一条商品都有唯一的 id
const cart = ref([
  { id: 101, name: "机械键盘", price: 299, count: 1 },
  { id: 102, name: "无线鼠标", price: 89, count: 2 },
  { id: 103, name: "显示器支架", price: 169, count: 1 },
]);

// 字符串数组：用来渲染标签
const tags = ["机房 A301", "每周五 14:00", "自备笔记本电脑"];

// 对象：用来渲染规格表，遍历时拿到的是「值、键、下标」
const spec = { 品牌: "某某", 保修: "两年", 产地: "南京" };

// 数字：用来渲染五颗星
const rating = 4;

function increase(item) {
  item.count++;
}

function decrease(item) {
  if (item.count > 1) {
    item.count--;
  }
}

function removeItem(index) {
  cart.value.splice(index, 1);
}

// 合计：这里先用普通函数，模板每渲染一次就执行一次
// 学完计算属性之后再改写成 computed，语义会更清楚
function sum() {
  let total = 0;
  for (let i = 0; i < cart.value.length; i++) {
    total = total + cart.value[i].price * cart.value[i].count;
  }
  return total;
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-for：购物车清单</h3>
    <p class="practice__desc">
      同一段标签结构，按数据里的条数重复渲染出来，数组、对象、数字都能遍历。
    </p>

    <table v-if="cart.length > 0" class="cart">
      <thead>
        <tr>
          <th>商品</th>
          <th>单价</th>
          <th>数量</th>
          <th>小计</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- (元素, 下标) in 数组，:key 用不会重复的 id -->
        <tr v-for="(item, index) in cart" :key="item.id">
          <td>{{ item.name }}</td>
          <td>¥{{ item.price }}</td>
          <td>
            <div class="cart__count">
              <el-button size="small" @click="decrease(item)">-</el-button>
              <span>{{ item.count }}</span>
              <el-button size="small" @click="increase(item)">+</el-button>
            </div>
          </td>
          <!-- 表达式可以直接写在插值里 -->
          <td class="cart__sub">¥{{ item.price * item.count }}</td>
          <td>
            <el-button
              size="small"
              type="danger"
              plain
              @click="removeItem(index)"
              >删除</el-button
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">合计</td>
          <td colspan="2" class="cart__total">¥{{ sum() }}</td>
        </tr>
      </tfoot>
    </table>

    <el-empty v-else description="购物车已经清空了" />

    <div class="grid">
      <div class="grid__item">
        <div class="grid__head">遍历字符串数组</div>
        <el-tag v-for="tag in tags" :key="tag" class="grid__tag">{{
          tag
        }}</el-tag>
        <pre class="grid__code">v-for="tag in tags" :key="tag"</pre>
      </div>

      <div class="grid__item">
        <div class="grid__head">遍历对象</div>
        <ul class="spec">
          <li v-for="(value, key, index) in spec" :key="key">
            {{ index }}. {{ key }}：{{ value }}
          </li>
        </ul>
        <pre class="grid__code">v-for="(value, key, index) in spec"</pre>
      </div>

      <div class="grid__item">
        <div class="grid__head">遍历数字</div>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            :class="['star', n <= rating ? 'star--on' : '']"
            >★</span
          >
          <span class="stars__text">{{ rating }}.0 分</span>
        </div>
        <pre class="grid__code">v-for="n in 5"（从 1 数到 5）</pre>
      </div>
    </div>

    <el-alert type="warning" :closable="false" show-icon class="practice__note">
      <template #title>:key 要给一个唯一且稳定的值</template>
      这里用商品 id，不用下标。列表中间发生插入或删除时，下标会整体位移，Vue
      认不出「原来是哪一行」，就可能把上一行的输入内容或选中状态错位到别的行上。
    </el-alert>
  </div>
</template>

<style scoped>
.cart {
  width: 100%;
  max-width: 700px;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 20px;
}

.cart th,
.cart td {
  padding: 10px 12px;
  border: 1px solid #e4e7ed;
  text-align: left;
}

.cart th {
  background: #fafafa;
  color: #303133;
  font-weight: 600;
}

.cart td {
  color: #303133;
}

.cart__count {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart__sub {
  color: #f56c6c;
}

.cart__total {
  color: #f56c6c;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.grid__item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fff;
}

.grid__head {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 10px;
}

.grid__tag {
  margin: 0 6px 6px 0;
}

.grid__code {
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 6px;
  background: #f5f7fa;
  color: #303133;
  font-size: 12px;
  overflow-x: auto;
}

.spec {
  margin: 0 0 4px;
  padding-left: 18px;
  font-size: 13px;
  color: #303133;
  line-height: 1.9;
}

.stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  font-size: 20px;
  color: #dcdfe6;
}

.star--on {
  color: #e6a23c;
}

.stars__text {
  margin-left: 8px;
  font-size: 13px;
  color: #303133;
}
</style>
