# 分析生命周期与优先级

Fate Spectrum 的第一版不做“AI 命理师”和完整数据飞轮，先把原局与当前阶段跑顺，让 prompt 可以在 Langfuse 里持续调优。

## P0：发布前必须跑通

| 模块 | Prompt | 生成时机 | 是否应每日重跑 | 说明 |
| --- | --- | --- | --- | --- |
| 原局格局画像 | `fate-spectrum/portrait` | 命主初始化后生成 | 否 | 稳定画像，除非出生信息、排盘源或 prompt 主版本变化，否则不自动重跑。 |
| 五行能量谱 | `fate-spectrum/element-energy` | 命主初始化后生成 | 否 | 对应喜忌的结构化表达，稳定性强；prompt 调优后可手动刷新文案。 |
| 当前阶段 | `fate-spectrum/current-environment` | 命主初始化后生成，并随观察日期更新 | 可按流年/流月重跑 | 结合原局、大运、流年/流月，只输出当前最强的 2-4 个象。 |
| Langfuse trace | `report-generation` trace | 每次 LLM 生成 | 是 | 记录模块、prompt 名称/版本、模型、输出和错误，默认脱敏输入。 |

## P1：单用户跑顺后的关系功能

| 模块 | Prompt | 生成时机 | 说明 |
| --- | --- | --- | --- |
| 缘主 CRUD | API/前端状态 | 添加缘主时 | 创建、列出、读取指定缘主。 |
| 关系上下文 | `fate-spectrum/relationship-context` | 命主与缘主都存在后 | 不阻塞单用户初始化，可手动触发。 |

## P2/P3：后续飞轮

| 模块 | Prompt | 暂不做的原因 |
| --- | --- | --- |
| 每日能量观测 | `fate-spectrum/daily-guidance` | 每日会变，适合在 P0 稳定后再接。 |
| 反馈总结 | `fate-spectrum/daily-feedback-summary` | 需要用户反馈入口和评分口径。 |
| 权重飞轮 | `adaptive-score-candidate` | 当前不引入权重更新，先保留架构位置。 |

## 最小交互闭环

1. 用户创建或读取唯一命主。
2. 后端排盘并生成规则分数。
3. P0 prompt 按模块生成：格局画像、五行能量谱、当前阶段。
4. 每个模块生成一条 Langfuse generation，整次报告生成归入同一个 trace。
5. 前端展示 P0 模块；失败模块显示规则 fallback，并可在 trace 中定位失败原因。
6. Prompt 在 `prompts/fate-spectrum/*` 本地维护，使用 `pnpm prompts:sync` 同步到 Langfuse。

默认 `LANGFUSE_TRACE_CONTENT=redacted`，会隐藏姓名、出生日期、出生时间、城市和联系方式，但保留四柱、大运、prompt 名称、模型和生成结果，方便调优且降低隐私风险。需要完整调试上下文时，可在本地 `.env.local` 显式设置 `LANGFUSE_TRACE_CONTENT=full`。
