### 项目概述
Next.js + TypeScript + Tailwind CSS搭建的个人博客
网站地址：[https://startrails.site](https://startrails.site)

### 运行说明
1. 获取凭证
- 你需要先获取Google OAuth和Mongo DB的凭证并添加到环境变量中才可以运行
- 图片存储功能需要CloudFlare R2的凭证
- AI功能需要Gemini密钥
- 项目环境变量参考.env.example

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

### 测试方案
1. 安装MongoDB并运行服务，然后运行test.mjs脚本文件插入测试的用户信息。

2. 创建.env.local环境变量文件，测试时可以采用以下值。确保测试的.env.local里的端口设置与启用的MongoDB服务相同。
```
#加密字符串
AUTH_SECRET="e03adbf68e2f240d0ac617645e711861aab5cf06e5fceae9631cd42b2930d563" 

#Auth主机
AUTH_URL=http://localhost:3000

#数据库系统本地连接
MONGODB_URI=mongodb://localhost:27017/star_database
```

3. 项目的登录验证已经被预先更替为测试用例，可以直接以管理员登录身份测试项目，获取凭证后删除测试用例即可。
代码坐标：
[登录验证](https://github.com/Terminal017/next-blog-public/blob/main/src/app/article/%5Bslug%5D/page.tsx#L67)：在`app/article/[slug]/page.tsx`第67行
[评论验证](https://github.com/Terminal017/next-blog-public/blob/main/src/app/api/comment/route.ts#L2)：在`app/api/comment/routs.ts`第2行

4. AI功能在未获取凭证情况下默认不启用。 


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
