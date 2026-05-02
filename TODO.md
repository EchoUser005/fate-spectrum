# TODO

## P0 - Must have before public demo

- [x] 接入并实测真实排盘 Provider。
- [ ] 补充真实排盘请求代码的生产级错误处理和重试策略。
- [x] 校准真实排盘 response mapping，确认 `data.zw`、`data.bz`、`data.output` 的字段完整性。
- [x] 确认 DeepSeek V4 model list：默认 `deepseek-v4-flash`，可选 `deepseek-v4-pro`，`deepseek-chat` 为 legacy alias。
- [ ] 补充真实品牌 OG 图。
- [ ] 部署到 Vercel。
- [ ] 绑定域名。
- [x] GitHub remote 已由用户推送到 `https://github.com/EchoUser005/fate-spectrum`。
- [x] 第三轮视觉报告重构：普通用户界面隐藏技术术语，报告回到维度评分、大运光谱、流年色阶。
- [x] sample-paipan golden profile 对齐最初 Excel 目标分数。

## P1 - Good for v0.2

- [ ] 实现农历输入到真实 provider 的历法转换。
- [ ] 实现海外时区换算策略。
- [ ] 实现真太阳时经纬度校正。
- [x] 允许当前浏览器会话用 `sessionStorage` 缓存 LLM Key，并提供清除动作。
- [ ] 校准更多真实样例盘和评分规则。
- [ ] 将 visual screenshot capture 升级为像素级视觉回归。
- [ ] 增加 CI 到自有服务器的自动发布方案。

## P2 - Future

- [ ] 历史报告保存。
- [ ] PDF 导出。
- [ ] 多语言。
- [ ] 更多排盘 Provider adapter。
- [ ] 更完整的可视化主题和品牌资产。

## User-owned Inputs

- [x] 真实排盘接口 endpoint：`https://www.shenjige.cn/api/ziwei/getPlateArrangement`。
- [x] 请求 method：`POST`。
- [x] headers：`User-Agent: Mozilla/5.0`、`Content-Type: application/x-www-form-urlencoded; charset=UTF-8`。
- [x] request body mapping：已按用户提供 Python 等价实现。
- [x] response mapping：当前直接按 PaipanResponse 透传/包装，仍需真实响应校准。
- [ ] 是否使用真太阳时算法：后续实现，MVP 仅保留字段。
- [ ] 是否支持农历输入：后续历法库转换，MVP 真实 provider 暂不支持。
- [ ] 是否支持海外时区：后续实现，MVP 保留字段。
- [ ] 域名：用户后续自办。
- [ ] 是否启用历史报告保存：默认不启用。
- [x] 是否允许用户 sessionStorage 保存 Key：允许当前浏览器会话缓存，UI 可清除，不写入后端。
- [ ] 是否后续做 PDF 导出：列入 P2。
- [ ] 是否后续做多语言：列入 P2。
