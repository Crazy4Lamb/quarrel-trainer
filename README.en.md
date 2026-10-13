# Quarrel Trainer

[项目首页 / Overview](README.md) | [中文说明](README.zh-CN.md) | [English guide](README.en.md)

A Chinese/English browser app for practicing responses to criticism, communication and personal boundaries. Choose an opponent and difficulty, try responses in simulated conversations, and review feedback afterward.

## Features

- Multiple opponents/scenarios, difficulty settings and optional proactive boundary setting.
- Five communication principles, response practice, scoring and post-session feedback.
- Personal profiles, weak-point analysis, tailored strategies and ready-to-use phrases.
- Session history and performance statistics.
- Chinese/English interfaces, scenario dialogue and feedback; light, dark and system themes with saved preferences.
- Desktop sidebar and mobile bottom navigation, expandable examples and session resuming.
- A local rule engine by default; optional OpenAI-compatible or Anthropic-format APIs for AI opponents and coaching.

## Getting started

```sh
git clone https://github.com/Crazy4Lamb/quarrel-trainer.git
cd quarrel-trainer
```

Open index.html in a full browser window. Local rule mode requires no build, npm dependencies or backend. Keep styles.css, i18n.js and app.js alongside index.html.

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

## Appearance and language

Use the top-right language and theme buttons, or Settings → Appearance & language. The system theme responds to your device preference. English mode includes English opponents, response detection and reviews. Existing messages and user input retain their original wording; switching preserves the current session and unsaved form drafts.

## Optional AI and storage

Enter an endpoint, model and API key in Settings. The browser sends AI requests directly to your selected provider, including conversation content and authentication information. Provider billing and cross-origin policies apply. For CORS / Failed to fetch errors, check whether the endpoint accepts your browser origin.

Settings, language/theme preferences, profiles and history use browser localStorage. When storage is unavailable, the app falls back to memory and may lose data on refresh. Changing browsers/origins or clearing site data can make prior records unavailable. Remove saved API keys on shared computers. There is no separate proxy backend.

## Structure and development

index.html is the page entry; styles.css defines responsive layouts and themes; i18n.js contains translations and English practice data; app.js handles scoring, AI, storage and interactions.

With Playwright installed, run `node tests/browser.cjs` for browser regression checks (Edge on Windows by default; BROWSER_CHANNEL can select another installed Chromium channel). Tests use mocked APIs and fake keys and refresh the documentation images.

Both the interface and documentation support Chinese and English. Scores use local heuristic rules and are practice cues, not a measure of real communication ability. Local practice does not need an API key. Keep actual keys out of source code and Git.

## Illustrated Gameplay Guide

![Principles and Start Game entry](docs/images/home.png)

### 1. Choose an opponent and difficulty

Click Start Game (开始游戏), or Practice (开始练习) in the navigation. Opponents include a blame-shifting coworker, a marriage-pressure aunt, an online contrarian, a sarcastic colleague and a boundary-crossing friend.

![Opponent and difficulty selection](docs/images/setup.png)

| Difficulty       | Rounds | Suggested use                                 |
| ---------------- | ------ | --------------------------------------------- |
| Easy / 轻松      | 4      | First session; practice one clear response    |
| Normal / 常规    | 6      | Sustained conversation and questioning        |
| Challenge / 挑战 | 8      | Maintain boundaries against stronger pressure |

Optionally enter an opening boundary in Set an opening boundary (先说清你的边界), such as “We can discuss responsibility, but first specify the facts.” You can leave it empty.

### 2. Respond and read feedback

![Conversation and detected techniques](docs/images/battle.png)

Type a response and click the up-arrow button (or press Enter on desktop; Shift + Enter inserts a line break). Watch the round counter, opponent intensity and detected techniques. Expand Your toolkit (沟通心法) for tips. A useful approach is to ask which specific issue is being discussed and how responsibility is determined.

### 3. Review the session

Finish the rounds or click End & review (结束并复盘) to see scores, highlights and coaching feedback. History (练习记录) shows past sessions; Profile (我的档案) configures your profile and weak points. AI errors or timeouts fall back to local opponents for the rest of the session; you can also switch manually while waiting. Try the local engine first, then optionally configure AI in 设置. These screenshots use local rule mode.
