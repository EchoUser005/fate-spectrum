# 测试环境与发布环境

Fate Spectrum 的发布包不应该携带用户数据、模型密钥或本地数据库。代码、镜像、配置模板可以进仓库；真实运行时数据必须来自环境变量、Docker volume 或外部托管服务。

## 当前项目现状

Docker Compose 已经做到“镜像不带数据”：

- `fate-spectrum`：Next.js 前端与 API，不写入用户数据到镜像。
- `fate-spectrum-api`：FastAPI 记忆服务。
- `fate-spectrum-data`：Docker named volume，挂载到 `/data/fate-spectrum`。

FastAPI 记忆服务没有手工初始化步骤。程序第一次写入命主、缘主、周报或月报时，会自动创建目录和 JSON/Markdown 文件。

这意味着：

- 发版构建镜像不会带上你的本地数据。
- 本地 Docker volume 不会进 GitHub。
- 生产环境需要单独创建自己的 volume 或对象存储。
- 如果运行 `docker compose down -v`，volume 会被删除，数据也会一起清掉。

## 推荐环境拆分

| 环境 | 配置 | 数据 |
| --- | --- | --- |
| local | `.env.local` 或 `.env` | 本机 localStorage、Docker volume、可选本机 Langfuse |
| staging | 部署平台 secrets | 独立 volume/数据库，独立 Langfuse project 或 key |
| production | 部署平台 secrets | 生产 volume/数据库，生产 Langfuse project 或 key |

不要复用同一个数据目录给 staging 和 production。

## Langfuse 地址

当前项目默认示例指向美国区：

```env
LANGFUSE_BASE_URL="https://us.cloud.langfuse.com"
```

真实 `LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY` 只放 `.env`、`.env.local` 或部署平台 secrets，不提交到仓库。

## 后续如果换自托管 Langfuse

只需要把应用环境变量切到你的自托管域名：

```env
LANGFUSE_BASE_URL="https://langfuse.your-domain.com"
```

Prompt 同步脚本和运行时 trace 都走同一个 `LANGFUSE_BASE_URL`。
