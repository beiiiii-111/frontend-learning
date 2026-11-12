/**
 * 把 chooseImage 拿到的临时图片转成本地持久文件。
 * 小程序的临时路径在下次冷启动后会被清理，必须 saveFile 才能长期显示；
 * H5 没有这套文件系统，直接用 blob 链接。
 */
export function persistFile(tempPath: string): Promise<string> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    uni.saveFile({
      tempFilePath: tempPath,
      success: (res) => resolve(res.savedFilePath),
      fail: () => resolve(tempPath)
    })
  })
  // #endif
  // #ifndef MP-WEIXIN
  return Promise.resolve(tempPath)
  // #endif
}
