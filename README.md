### 项目概述

Next.js + TypeScript + Tailwind CSS搭建的个人博客

网站地址：[https://startrails.site](https://startrails.site)

### 运行环境

- Node.js：>= 18.18
- 包管理器：npm >= 9
- MongoDB

### 运行说明

1. 安装依赖

```shell
npm install
```

2. 启动数据库并初始化数据库数据

```shell
# 检查本地数据库是否启用
mongosh
# 初始化数据
npm run db:init
```

3. 启动开发服务器

```shell
npm run dev
```

4. 访问构建版本

```shell
# 构建生产包
npm run build
# 创建构建版本
npm start
```

### 测试与生产说明

1. 项目默认为测试状态，以管理员身份Admin登录，拥有任何权限。<br/>

2. 额外功能启用的前置条件：获取凭证并添加到环境变量（.env.local中），完整格式参考.env.example

- Google登录功能：需要获取Google OAuth凭证，前往[谷歌云控制台](https://console.cloud.google.com/apis/dashboard)
- 图片存储功能：需要获取CloudFlare R2的凭证，前往[Cloudflare仪表盘](https://dash.cloudflare.com/)
- AI功能：需要获取Gemini API密钥，前往[Google AI Studio](https://aistudio.google.com/app/api-keys)
  <br/>

3. 获取凭证后，需要构建完整生产版本前清理测试代码
   代码坐标：

- [登录验证](https://github.com/Terminal017/next-blog-public/blob/main/src/app/article/%5Bslug%5D/page.tsx#L67)：在`app/article/[slug]/page.tsx`第67行
- [评论验证](https://github.com/Terminal017/next-blog-public/blob/main/src/app/api/comment/route.ts#L2)：在`app/api/comment/routs.ts`第2行
- [中控台](https://github.com/Terminal017/next-blog-public/blob/main/src/app/control/page.tsx#L7)：`app/control/page.tsx`第7行
- [中控台API](https://github.com/Terminal017/next-blog-public/blob/main/src/app/api/control/article/route.ts#L4)：`app/api/control/route.ts`第4行

### 目录说明

```
src/
├── app/ 主要页面路由
    ├── api/        api路由，存放所有api函数
    ├── about/      关于页面
    ├── control/    管理页面
    ├── friendlink/ 友链页面
    ├── article/    文章列表页
        ├── [slug]/    文章详情页页面
    ├── page.tsx     主页
├── components/  所有通用组件
├── features/    所有业务相关函数
├── lib/         所有非业务的可复用工具函数
├── styles/      样式和主题
├── auth.ts/     Auth配置
├── .env.local   本地开发环境变量
```
