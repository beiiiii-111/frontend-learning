<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");

  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid ?? '', (info) => {
    console.log("当前版本", info.version);
  });
  // #endif
});
</script>

<style>
/* 全局样式，这里不能加 scoped */
page {
  background: #f5f6f8;
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
}

view,
text,
image {
  box-sizing: border-box;
}
</style>
