# 吵架练习器 / Quarrel Trainer

## 中文介绍

一个用于练习沟通、应对指责和表达个人边界的中文网页应用。选择对手与难度，在模拟对话中练习回应，再通过复盘改进表达。

## English Introduction

A Chinese-language browser app for practicing responses to criticism, communication and personal boundaries. Choose an opponent and difficulty, try responses in simulated conversations, and review feedback afterward.

## 使用说明 / User Guides

- [中文说明（独立文档）](README.zh-CN.md)
- [English guide (separate document)](README.en.md)

下方提供完整的中文和英文说明。 / Complete Chinese and English instructions are included below.

---

# 中文说明

## 功能

- 多种对手与场景、可选难度和提前设防。
- 五大沟通心法、回应练习、评分与赛后点评。
- 个人档案、沟通软肋分析、专属策略及应急话术。
- 对战记录与战绩统计。
- 默认本地规则引擎；可在设置中接入 OpenAI 兼容接口或 Anthropic 格式接口，启用 AI 对手及教练点评。

## 快速开始

```sh
git clone https://github.com/Crazy4Lamb/quarrel-trainer.git
cd quarrel-trainer
```

用完整浏览器窗口打开 index.html 即可使用本地规则模式，无需构建、npm 依赖或后端服务。

也可通过静态服务器访问，例如已安装 Python 时：

```sh
python -m http.server 8080
```

打开 http://localhost:8080。

## 使用流程

1. 选择对手、难度和可选的边界设定。
2. 输入回应并完成模拟对话。
3. 查看本局评分、金句和教练点评。
4. 在个人档案中设置常见场景和软肋，生成针对性的练习策略。

## 可选 AI 与存储

在设置页填写接口地址、模型和 API Key。AI 请求由浏览器直接发送给你选择的服务商；对话与认证信息会用于该请求，服务商的计费和跨域策略由其决定。出现 CORS / Failed to fetch 时，检查接口是否允许当前浏览器来源。

配置、个人档案和记录使用浏览器 localStorage；存储不可用时降级为内存，刷新可能丢失。更换浏览器、访问地址或清除网站数据后，原记录可能不可见。共享电脑上请清除 API Key。应用没有独立的中转后端。

## 项目结构与开发

index.html 包含 HTML、CSS、JavaScript、本地规则和 AI 接口逻辑。修改后刷新浏览器，检查场景选择、对话、点评和存储行为即可。

当前网页界面为中文；README 提供中英文说明。本地练习不需要 API Key，密钥不应写入源码或提交到 Git。

---

# English Guide

## Features

- Multiple opponents/scenarios, difficulty settings and optional proactive boundary setting.
- Five communication principles, response practice, scoring and post-session feedback.
- Personal profiles, weak-point analysis, tailored strategies and ready-to-use phrases.
- Session history and performance statistics.
- A local rule engine by default; optional OpenAI-compatible or Anthropic-format APIs for AI opponents and coaching.

## Getting started

```sh
git clone https://github.com/Crazy4Lamb/quarrel-trainer.git
cd quarrel-trainer
```

Open index.html in a full browser window. Local rule mode requires no build, npm dependencies or backend.

Alternatively, serve the directory with a static server. With Python installed:

```sh
python -m http.server 8080
```

Open http://localhost:8080.

## Workflow

1. Choose an opponent, difficulty and optional boundary settings.
2. Type responses and complete a simulated conversation.
3. Review scores, highlighted responses and coaching feedback.
4. Customize your profile and recurring difficulties for targeted strategies.

## Optional AI and storage

Enter an endpoint, model and API key in Settings. The browser sends AI requests directly to your selected provider, including conversation content and authentication information. Provider billing and cross-origin policies apply. For CORS / Failed to fetch errors, check whether the endpoint accepts your browser origin.

Settings, profiles and history use browser localStorage. When storage is unavailable, the app falls back to memory and may lose data on refresh. Changing browsers/origins or clearing site data can make prior records unavailable. Remove saved API keys on shared computers. There is no separate proxy backend.

## Structure and development

index.html contains the HTML, CSS, JavaScript, local rules and AI integration. Edit it, refresh the browser and check scenario selection, conversations, feedback and storage.

The application UI is Chinese; repository documentation is available in Chinese and English. Local practice does not need an API key. Keep actual keys out of source code and Git.
