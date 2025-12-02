### 项目概述
Next.js + TypeScript + Tailwind CSS搭建的个人博客
网站地址：[https://startrails.site](https://startrails.site)

### 运行说明
1. 获取凭证
- 你需要先获取Google OAuth和Mongo DB的凭证并添加到环境变量中才可以运行
- 图片存储功能需要CloudFlare R2的凭证

2. 安装依赖

```
npm install
```

3. 启动开发服务器

```
npm run dev
```

4. 构建生产包

```
npm run build
```

5. 访问构建版本

```
npm start
```

6. 运行ESLint检测

```
npm run lint
```

### 目录说明
```
src/
├── app/ 主要页面路由
    ├── api/    api路由，存放所有api函数
    ├── other/  其他页面路由
├── components/  所有通用组件
├── features/    所有业务相关函数
├── lib/         所有非业务的可复用工具函数
├── styles/      样式和主题
```
