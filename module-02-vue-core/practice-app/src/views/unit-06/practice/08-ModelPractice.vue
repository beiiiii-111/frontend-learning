<script setup>
import { ref } from "vue";

// 一份报名表的数据：每种表单控件绑定的数据类型都不一样
const form = ref({
  name: "",
  intro: "",
  gender: "男",
  interests: ["前端"],
  grade: "2024",
  dorm: false,
  agree: false,
});

// 手写双向绑定：不用 v-model，自己用 :value 加 @input 拼一份
const handWritten = ref("");
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-model：一份报名表</h3>
    <p class="practice__desc">
      左边填表，右下角实时显示每个字段的真实值和数据类型。文本框、单选、多选、下拉、开关绑定的类型各不相同。
    </p>

    <div class="layout">
      <el-form label-width="86px" class="layout__form">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model="form.intro"
            type="textarea"
            :rows="3"
            placeholder="一句话介绍自己"
          />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="感兴趣方向">
          <!-- 一组复选框绑定到数组，勾中的值会被塞进数组 -->
          <el-checkbox-group v-model="form.interests">
            <el-checkbox value="前端">前端</el-checkbox>
            <el-checkbox value="后端">后端</el-checkbox>
            <el-checkbox value="测试">测试</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="入学年份">
          <el-select v-model="form.grade" style="width: 160px">
            <el-option label="2024 级" value="2024" />
            <el-option label="2025 级" value="2025" />
            <el-option label="2026 级" value="2026" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否住宿">
          <!-- 开关绑定布尔值 -->
          <el-switch v-model="form.dorm" />
        </el-form-item>

        <el-form-item label=" ">
          <!-- 单个复选框也绑定布尔值 -->
          <el-checkbox v-model="form.agree">我已阅读并同意实训须知</el-checkbox>
        </el-form-item>
      </el-form>

      <div class="layout__preview">
        <div class="preview__head">实时数据</div>
        <table class="preview">
          <thead>
            <tr>
              <th>字段</th>
              <th>值</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>name</td>
              <td>{{ JSON.stringify(form.name) }}</td>
              <td>{{ typeof form.name }}</td>
            </tr>
            <tr>
              <td>intro</td>
              <td>{{ JSON.stringify(form.intro) }}</td>
              <td>{{ typeof form.intro }}</td>
            </tr>
            <tr>
              <td>gender</td>
              <td>{{ JSON.stringify(form.gender) }}</td>
              <td>{{ typeof form.gender }}</td>
            </tr>
            <tr>
              <td>interests</td>
              <td>{{ JSON.stringify(form.interests) }}</td>
              <td>
                {{
                  Array.isArray(form.interests)
                    ? "array"
                    : typeof form.interests
                }}
              </td>
            </tr>
            <tr>
              <td>grade</td>
              <td>{{ JSON.stringify(form.grade) }}</td>
              <td>{{ typeof form.grade }}</td>
            </tr>
            <tr>
              <td>dorm</td>
              <td>{{ JSON.stringify(form.dorm) }}</td>
              <td>{{ typeof form.dorm }}</td>
            </tr>
            <tr>
              <td>agree</td>
              <td>{{ JSON.stringify(form.agree) }}</td>
              <td>{{ typeof form.agree }}</td>
            </tr>
          </tbody>
        </table>
        <div class="preview__tip">
          多选是数组，单选和下拉是字符串，开关和单个复选框是布尔值。写提交逻辑时按这些类型取数据。
        </div>
      </div>
    </div>

    <h4 class="practice__subtitle">v-model 到底做了什么</h4>
    <p class="practice__desc">
      下面两个输入框效果完全一样：右边没用
      v-model，而是自己绑定值、自己监听输入事件。v-model
      就是把这两件事合起来写。
    </p>

    <div class="sugar">
      <div class="sugar__item">
        <div class="sugar__head">写法一：v-model</div>
        <input
          v-model="handWritten"
          class="native-input"
          placeholder="随便输点内容"
        />
        <pre class="sugar__code">&lt;input v-model="handWritten"&gt;</pre>
      </div>

      <div class="sugar__item">
        <div class="sugar__head">写法二：手动绑定</div>
        <!-- :value 负责把数据显示到输入框，@input 负责把用户输入写回数据 -->
        <input
          :value="handWritten"
          class="native-input"
          placeholder="随便输点内容"
          @input="handWritten = $event.target.value"
        />
        <pre class="sugar__code">
&lt;input :value="handWritten" @input="handWritten = $event.target.value"&gt;</pre
        >
      </div>
    </div>

    <div class="practice__log">当前值：{{ JSON.stringify(handWritten) }}</div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(280px, 1fr);
  gap: 20px;
  align-items: start;
}

.layout__preview {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.preview__head {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
}

.preview {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.preview th,
.preview td {
  padding: 6px 10px;
  border-bottom: 1px solid #f2f3f5;
  text-align: left;
  word-break: break-all;
}

.preview th {
  color: #303133;
  font-weight: 500;
}

.preview td {
  color: #303133;
  font-family: Menlo, Consolas, monospace;
}

.preview__tip {
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.7;
  color: #303133;
  border-top: 1px dashed #ebeef5;
}

.sugar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.sugar__item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fff;
}

.sugar__head {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
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

.sugar__code {
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 6px;
  background: #f5f7fa;
  color: #303133;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.practice__log {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 13px;
  color: #303133;
  font-family: Menlo, Consolas, monospace;
}

.practice__subtitle {
  margin: 24px 0 8px;
  font-size: 14px;
  color: #303133;
}
</style>
