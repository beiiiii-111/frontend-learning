/**
 * 敏感词过滤：命中后拒绝发布
 * 只做基础演示：中文常见垃圾广告 / 辱骂 / 违规引流词，命中即拦截
 */
export const SENSITIVE_WORDS: string[] = [
  // 辱骂 / 人身攻击
  '傻逼',
  '智障',
  '脑残',
  '去死',
  '垃圾人',
  // 广告引流
  '加微信',
  '加vx',
  '私聊靠谱',
  '代刷',
  '刷单',
  '兼职日入',
  '点击链接',
  '扫码进群',
  '免费送号',
  '低价出售',
  // 违规内容
  '赌博',
  '博彩',
  '六合彩',
  '翻墙',
  '代开发票',
  '银行卡出售',
  '烟草专卖',
  '迷药',
  '私彩',
  '色情'
]

/** 归一化：去掉空白和常见干扰符号，防止"加-微-信"绕过 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\-_*·.、,，。!！?？~+=\\]/g, '')
}

/**
 * 检测命中的敏感词
 * @returns 命中的违禁词数组，为空表示通过
 */
export function checkSensitive(text: string): string[] {
  if (!text) return []
  const target = normalize(text)
  return SENSITIVE_WORDS.filter((word) => target.includes(normalize(word)))
}

/** 命中提示文案 */
export function sensitiveTip(words: string[]): string {
  if (words.length === 0) return ''
  return `内容中包含敏感词：${words.join('、')}。请修改后再发布。`
}
