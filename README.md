# 命运光谱

命运光谱是一个开源的命理数据产品：输入生辰，调用真实排盘，计算多维度评分，再生成可读的「大运 / 流年 / 星盘 / 解读」报告。

它不是一个单一吉凶总分，而是一组可解释的人生维度光谱。

## 开源目标

本次开源目标是发布一个能被普通开发者安全拉取、快速启动、继续改造的 MVP：

- 一条命令启动前端和可选记忆服务，不要求用户先理解内部架构。
- 默认不携带任何私人命盘、模型密钥、Langfuse 数据或本地数据库。
- 核心报告不是写死文案，而是由排盘、规则评分、结构化 context 和可调 prompt 共同生成。
- AI 只做解释、总结和表达，不拥有排盘事实和数值评分。
- Prompt 可以先放在本地文件里版本管理，也可以接入 Langfuse 做生产调优。

## 迭代路线

当前发布版本优先跑通「原局画像、五行能量谱、当前阶段」三件事，让产品有第一眼可展示的命理光谱感。

下一阶段会继续做：

- 更完整的月令、调候、合冲刑害、三合三会和紫微宫位解释。
- AI 命理师对话，但先不让它直接改分。
- 每日提示、晚间反馈、周报/月报/年报记忆沉淀。
- 基于记忆证据的自适应评分候选，再用可回放测试校验。
- 多模型网关、Langfuse datasets/scores、prompt A/B 和质量评估。

架构的长期目标是把「命盘事实」「规则评分」「AI 表达」「用户反馈」「长期记忆」拆开。这样后续可以调 prompt、换模型、换排盘服务、换存储方案，而不需要把整个产品推倒重来。

## 当前能力

- 生辰配置、模型配置、生成报告的一屏工作台
- 服务端真实排盘 Provider 路径
- 七个维度评分：财富量级、事业推进、生活舒适度、自我价值成就、感情关系、健康能量、风险可控度
- 大运光谱曲线、大运色阶图、流年色阶表
- 八字四柱与紫微十二宫摘要渲染
- DeepSeek 默认模型配置，支持 OpenAI-compatible 形态扩展
- Prompt 本地版本管理，支持 Langfuse `prod` 提示词优先读取
- 可选 FastAPI 本地记忆服务，用 JSON/Markdown 保存命主/缘主资料
- Docker Compose 一键启动

## 截图

![Fate Spectrum OG](./public/og.png)

## 一键启动

普通使用者只需要 Docker。仓库里的 `docker-compose.yml` 已经给出默认值，不需要先创建 `.env`：

```bash
docker compose up -d --build
```

启动后：

- 前端应用：http://localhost:3000
- 本地记忆服务：http://localhost:8000/health

默认行为：

- 首次生成报告时，在页面里填写自己的模型 Key。
- Fate Spectrum 是 BYOK，模型 Key 只随本次请求使用，并默认只缓存在浏览器 sessionStorage。
- 不需要 Langfuse；没有 Langfuse 时会使用仓库内 `prompts/`。
- 不需要提交 `.env`。
- 生成的命主/缘主记忆数据写入 Docker named volume `fate-spectrum-data`。
- 私有数据不会进入 Git，也不会进入 Docker 镜像构建上下文。

查看日志：

```bash
docker compose logs -f fate-spectrum
docker compose logs -f fate-spectrum-api
```

停止服务：

```bash
docker compose down
```

如果要连同本地记忆卷一起删除：

```bash
docker compose down -v
```

## 本地开发

前端开发：

```bash
pnpm install
pnpm dev
```

打开：

```text
http://localhost:3000
```

如果要在本地同时调试命主/缘主记忆服务，可以另开一个终端。Python venv 是开源项目的通用写法；维护者也可以使用自己的 conda 环境：

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
FATE_DATA_DIR=../data/dev uvicorn app.main:app --host 0.0.0.0 --port 8000
```

然后让 Next.js 服务端代理到本地 FastAPI：

```bash
FATE_MEMORY_API_URL="http://127.0.0.1:8000" pnpm dev
```

说明：本机 conda 环境只适合作为维护者自己的开发工具，不是开源用户的标准路径。公开项目的标准入口是 Docker Compose、Node/pnpm、Python `requirements.txt` 和 `.env.example`。

常用验证：

```bash
openspec validate --all --strict --no-interactive
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## 环境变量

开源项目里建议这样分工：

- `.env` / `.env.local`：本地私有密钥和私有服务地址，不提交
- `.env.example`：公开变量模板，可以提交
- `docker-compose.yml`：服务编排，可以提交
- `prompts/`、`docs/`、未来的 `config/*.yaml`：非密钥配置，可以提交

环境与数据边界详见 `docs/environments.md`。当前 Docker Compose 使用 named volume 保存 FastAPI 记忆数据，镜像和 GitHub 仓库不会携带本机数据。

复制模板：

```bash
cp .env.example .env
```

常用变量：

```env
DEEPSEEK_BASE_URL="https://api.deepseek.com"
DEFAULT_DEEPSEEK_MODEL="deepseek-v4-pro"
OPENAI_COMPATIBLE_BASE_URL="https://api.openai.com/v1"
DEFAULT_OPENAI_COMPATIBLE_MODEL="gpt-4o-mini"

LANGFUSE_BASE_URL="https://us.cloud.langfuse.com"
LANGFUSE_PUBLIC_KEY=""
LANGFUSE_SECRET_KEY=""
LANGFUSE_PROMPT_LABEL="prod"
LANGFUSE_TRACE_ENABLED="true"
LANGFUSE_TRACE_CONTENT="redacted"

FATE_MEMORY_API_URL="http://127.0.0.1:8000"
```

注意：

- 普通用户不需要把模型 Key 写入 `.env`；页面会在生成时要求填写。
- 不要把真实密钥写进代码、README、issue、测试 fixture、Dockerfile、截图或 prompt 示例。
- 不要使用 `NEXT_PUBLIC_` 暴露模型密钥。
- 普通开源用户不需要配置 Langfuse；Langfuse 是维护者调 prompt 和看 trace 的可选设施。
- `.dockerignore` 会排除 `.env`、`data/`、`.git/`、测试报告和本机缓存，避免它们进入镜像构建上下文。

## Langfuse 与 Prompt 流水线

本项目的 prompt 目录结构：

```text
prompts/fate-spectrum/<ai-function>/
  prompt.json
  system.md
  user.md
```

运行时策略：

1. 如果服务端配置了 Langfuse，优先读取 Langfuse 上 `prod` 标签的 prompt。
2. 如果 Langfuse 不可用或未配置，使用本地 `prompts/`。
3. 如果 Langfuse 可用但缺少某个 prompt，可以用脚本 seed 本地 MVP prompt。
4. 你在 Langfuse 控制台调优后，只要标记为 `prod`，运行时就会优先使用远端版本。
5. 启用 Langfuse 后，每次 LLM 报告生成会写入一个 `fate-spectrum/report-generation` trace；各 prompt 模块是 trace 下的 generation。

检查本地和远端 prompt 状态：

```bash
pnpm prompts:check
```

只创建远端缺失的 prompt，不覆盖已经存在的 `prod`：

```bash
pnpm prompts:seed
```

显式把本地 prompt 发布成新的远端版本：

```bash
pnpm prompts:sync
```

把 Langfuse 上调好的 `prod` 拉回本地文件：

```bash
pnpm prompts:pull
```

当前 MVP prompt 功能：

- `fate-spectrum/portrait`
- `fate-spectrum/overview`
- `fate-spectrum/element-energy`
- `fate-spectrum/current-environment`
- `fate-spectrum/dimensions`
- `fate-spectrum/windows`
- `fate-spectrum/daily-guidance`
- `fate-spectrum/daily-feedback-summary`
- `fate-spectrum/weekly-daily`
- `fate-spectrum/monthly-rollup`
- `fate-spectrum/yearly-memory`
- `fate-spectrum/adaptive-score-candidate`
- `fate-spectrum/relationship-context`

P0 发布链路优先跑通 `portrait`、`element-energy` 和 `current-environment`。这三个 prompt 已内置匿名样例 `壬申 己酉 戊申 未知`，用于在 Langfuse 里继续调优表达风格；默认 trace 会脱敏姓名、出生日期、出生时间、城市和联系方式。需要完整本地调试上下文时，才把 `LANGFUSE_TRACE_CONTENT` 改成 `full`。

## 命主与缘主接口

Docker Compose 会启动 FastAPI 记忆服务，默认端口 `8000`。

前端页面不会直接硬编码后端地址；浏览器访问同源的 `/api/profiles...`，Next.js 服务端再通过 `FATE_MEMORY_API_URL` 转发到 FastAPI。这样本地开发、Docker Compose 和未来部署可以使用同一套前端代码。

健康检查：

```bash
curl http://127.0.0.1:8000/health
```

创建或更新命主：

```bash
curl -X PUT http://127.0.0.1:8000/profiles/owner \
  -H "Content-Type: application/json" \
  -d '{"nickname":"demo-owner","birth":{"calendar":"solar"},"notes":"主命盘"}'
```

添加缘主：

```bash
curl -X POST http://127.0.0.1:8000/profiles/guests \
  -H "Content-Type: application/json" \
  -d '{"nickname":"demo-guest","birth":{"calendar":"solar"},"notes":"关系观察"}'
```

读取全部资料：

```bash
curl http://127.0.0.1:8000/profiles
```

读取命主：

```bash
curl http://127.0.0.1:8000/profiles/owner
```

读取缘主列表：

```bash
curl http://127.0.0.1:8000/profiles/guests
```

## 数据飞轮规划

当前已经设计好长期架构，文档见：

```text
docs/memory-flywheel.md
```

目标闭环：

```text
初始命盘
-> 每日提示
-> 晚间反馈
-> 每日记忆摘要
-> 周报
-> 月报
-> 年度记忆
-> 自适应评分候选
-> 重新生成报告上下文
```

评分原则：

- `baseScore`：排盘与规则引擎生成的基础分
- `adaptiveScore`：未来由记忆证据产生的自适应候选分
- `finalScore`：未来展示的混合分

默认提案：

```text
finalScore = baseScore * 0.7 + adaptiveScore * 0.3
```

硬约束：

- LLM 不能直接改分
- 每个自适应调整都必须有证据 ID
- 基础分始终可查看
- 数据飞轮必须能 replay 测试

## 部署到 Vercel

Vercel 适合部署无本地记忆服务的前端和 Next.js API。

步骤：

1. 在 Vercel 导入 GitHub 仓库。
2. Framework 选择 Next.js。
3. Install command 使用：

```bash
pnpm install --frozen-lockfile
```

4. Build command 使用：

```bash
pnpm build
```

如果需要长期私有记忆，优先使用 Docker Compose 自部署。

## 安全边界

- 用户模型 Key 只用于请求，不写入后端持久化文件。
- Langfuse Key 只放在 `.env`、`.env.local` 或部署 secrets。
- 原始真实排盘响应不要提交到仓库。
- 生成的私人命主/缘主数据默认被 Git 忽略。
- 模型只负责解释和总结，不能作为排盘或评分的唯一来源。
- 健康、财富、法律、心理相关内容只做参考提示，不构成专业建议。

## 免责声明

本工具输出属于传统命理与模型生成内容，仅供自我洞察、娱乐和规划参考，不构成医疗、法律、投资、心理诊断或其他专业建议。

健康能量维度不是医学诊断。如有身体不适，请咨询具备资质的医疗专业人士。

财富量级维度不是投资建议，不构成买卖任何资产或金融产品的依据。

## License

MIT
