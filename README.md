# 吵架练习器 / Quarrel Trainer

## 中文介绍

一个用于练习沟通、应对指责和表达个人边界的中文网页应用。选择对手与难度，在模拟对话中练习回应，再通过复盘改进表达。

## English Introduction

A Chinese-language browser app for practicing responses to criticism, communication and personal boundaries. Choose an opponent and difficulty, try responses in simulated conversations, and review feedback afterward.

## 使用说明 / User Guides

- [中文说明](README.zh-CN.md)
- [English guide](README.en.md)

下方提供完整的中文和英文说明与实际界面截图。 / Full guides and actual screenshots follow.

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

## 图解玩法说明

![心法与开始游戏入口](docs/images/home.png)

### 1. 选对手、定难度

首页点击「开始游戏」或底部「开吵」，选择职场甩锅侠、催婚姑妈、抬杠网友、阴阳怪气同事或越界损友。

![选择对手与难度](docs/images/setup.png)

| 难度 | 回合 | 适合 |
|---|---|---|
| 温泉局 | 4 | 初次体验，练习一句清晰回应 |
| 常规局 | 6 | 练习连续对话与转移提问权 |
| 硬核局 | 8 | 面对更强势的对手，坚持边界 |

「提前设防」可填写开场边界，例如“责任可以讨论，但请先把具体事实说清楚”。留空也可开始。

### 2. 回应与观察反馈

![对话及招式识别](docs/images/battle.png)

输入回应后点击拳头按钮发送，观察回合、对方气焰和识别到的招式。点击「招式锦囊」查看提示。可尝试“你具体指的是哪一项问题？责任是按什么标准划分的？”这样的澄清与追问。

### 3. 结束与复盘

完成设定回合，或点击「结束战斗，去复盘」，查看评分、金句和教练点评。「战绩」查看历史，「我的」设置个人档案与练习软肋。先用本地模式体验，再在「设置」里按需要配置 AI；截图使用本地规则模式。

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

## Illustrated Gameplay Guide

![Principles and Start Game entry](docs/images/home.png)

### 1. Choose an opponent and difficulty

Click Start Game (开始游戏), or the bottom Battle tab (开吵). Opponents include a blame-shifting coworker, a marriage-pressure aunt, an online contrarian, a sarcastic colleague and a boundary-crossing friend.

![Opponent and difficulty selection](docs/images/setup.png)

| Difficulty | Rounds | Suggested use |
|---|---|---|
| Easy / 温泉局 | 4 | First session; practice one clear response |
| Normal / 常规局 | 6 | Sustained conversation and questioning |
| Hardcore / 硬核局 | 8 | Maintain boundaries against stronger pressure |

Optionally enter an opening boundary in 提前设防, such as “We can discuss responsibility, but first specify the facts.” You can leave it empty.

### 2. Respond and read feedback

![Conversation and detected techniques](docs/images/battle.png)

Type a response and click the fist button. Watch the round counter, opponent intensity and detected techniques. Expand 招式锦囊 for tips. A useful approach is to ask which specific issue is being discussed and how responsibility is determined.

### 3. Review the session

Finish the rounds or click 结束战斗，去复盘 to see scores, highlights and coaching feedback. 战绩 shows history; 我的 configures your profile and weak points. Try the local engine first, then optionally configure AI in 设置. These screenshots use local rule mode.
