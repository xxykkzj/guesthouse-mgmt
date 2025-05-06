# 客房管理系统 (Guesthouse Management System)

一个完整的客房管理系统，用于管理房间、床位、客户、入住记录和支付等功能。

## 技术栈

### 后端

- Node.js
- Express
- TypeORM
- MySQL
- Redis

### 前端

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Hook Form
- Zustand

## 功能特性

- 房间管理：添加、编辑、删除、查看房间信息
- 床位管理：每个房间可以有多个床位，适用于宿舍式住宿
- 客户管理：管理客户信息和历史记录
- 预订管理：处理房间预订、入住和退房
- 支付管理：记录和管理客户支付信息

## 开发环境设置

### 先决条件

- Node.js 18+
- MySQL 8.0+
- Redis 6.2+
- npm 或 yarn

### 安装步骤

1. 克隆项目仓库

```bash
git clone https://github.com/your-username/guesthouse-mgmt.git
cd guesthouse-mgmt
```

2. 安装依赖

```bash
# 安装根项目依赖
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. 配置环境变量

```bash
# 在后端目录创建 .env 文件
cp backend/src/config/env.example backend/.env

# 根据你的环境配置修改 .env 文件
```

4. 启动开发服务器

```bash
# 启动后端服务器 (在 backend 目录中)
npm run dev

# 启动前端开发服务器 (在 frontend 目录中)
npm run dev
```

5. 访问应用程序

- 后端 API: http://localhost:3000
- 前端应用: http://localhost:5173

## API 文档

后端 API 提供以下主要端点：

- `/api/rooms` - 房间管理
- `/api/beds` - 床位管理
- `/api/guests` - 客户管理
- `/api/staylogs` - 入住记录管理
- `/api/payments` - 支付管理

详细的 API 文档可以通过运行开发服务器并访问 `/api-docs` 查看。

## 项目结构

```
guesthouse-mgmt/
├── backend/                # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── entities/       # 数据模型
│   │   ├── routes/         # 路由定义
│   │   ├── services/       # 业务逻辑
│   │   └── index.ts        # 应用入口
│   └── package.json        # 后端依赖
│
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── layouts/        # 页面布局
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   ├── types/          # 类型定义
│   │   └── App.tsx         # 应用入口
│   └── package.json        # 前端依赖
│
├── docker-compose.yml      # Docker 配置
└── package.json            # 项目依赖
```

## 贡献

欢迎提交 Pull Requests。对于重大更改，请先打开一个 issue 进行讨论。

## 许可证

[MIT](LICENSE)
