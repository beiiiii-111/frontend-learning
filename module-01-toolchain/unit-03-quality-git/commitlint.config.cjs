// 提交信息校验规则：Conventional Commits + 单元 scope
// 配合 husky 的 commit-msg 钩子使用：pnpm dlx commitlint --edit "$1"

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 只认这七个，避免出现 update / modify 这类含糊的词
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'chore', 'test'],
    ],
    // scope 统一写单元号 u01 ~ u12，方便按单元回溯
    'scope-enum': [
      1,
      'always',
      [
        'u01', 'u02', 'u03', 'u04', 'u05', 'u06',
        'u07', 'u08', 'u09', 'u10', 'u11', 'u12',
      ],
    ],
    // subject 不能为空，也不能以句号结尾
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // 标题一行讲完，超长自动换行由 body 承担
    'header-max-length': [2, 'always', 72],
  },
}
