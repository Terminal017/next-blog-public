import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  // ESLint 推荐规则
  js.configs.recommended,

  // Next.js 推荐配置
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  ...compat.extends('prettier'),

  // 添加其他规则
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'prefer-const': 'warn', // 使用 const 替代 let
      'no-var': 'error', // 禁止使用 var
      'prefer-template': 'error', // 使用模板字符串
      'prefer-arrow-callback': 'warn', // 使用箭头函数作为回调

      eqeqeq: ['error', 'always'], // 强制使用 === 和 !==
      curly: ['error', 'all'], // 强制大括号
      'dot-notation': 'error', // 使用点符号访问对象属性
      'no-console': 'warning', // 禁止使用 console.log
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 显示any类型
    },
  },
]

export default eslintConfig
