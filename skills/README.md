# 应用内风格技能 / In-app style skills

在「开始练习 → 回怼实验室」导入 JSON、Markdown 或纯文本文件。也可以直接选择四个内置技能：本色应战、冷面辩手、脱口秀嘴替、市井直球。

这些是本应用的风格与提示词数据包。应用读取文字规则和预置台词，不执行插件代码，也不会加载 Markdown 中引用的其他文件。

角色使用原创虚构设定。技能规则请描述一般性格与表达技巧，不要求模仿真人或影视人物、不复制现成名台词、不暗示真人代言；仅导入自有或已获授权的内容。AI 开场、示范与接话会附带同一套原创性约束，这些约束不构成自动的权利来源验证。

## JSON 技能

[reviewer.json](reviewer.json) 是完整的中英文示例。字段如下：

| 字段                    | 内容                                                   |
| ----------------------- | ------------------------------------------------------ |
| `version`               | 固定为 `1`                                             |
| `name`                  | 技能名，字符串或含 `zh`、`en` 的对象，单项最多 80 字符 |
| `description`           | 可选描述，字符串或中英文对象，最多 300 字符            |
| `instructions`          | AI 风格规则，字符串或中英文对象，单项最多 12,000 字符  |
| `local.zh` / `local.en` | 可选的离线台词对象                                     |

离线对象可含 `opening`、`reply`、`example`，每项最多 1,000 字符。`opening` 和 `reply` 中的 `{line}` 会被替换成所选场景的原始台词；`example` 是展示给练习者的回怼示范。

```json
{
  "version": 1,
  "name": "冷面反问",
  "description": "用一个短问题，让对方把事实说清楚。",
  "instructions": "Use short, calm questions that expose unsupported assumptions. Follow the selected profanity level.",
  "local": {
    "zh": {
      "opening": "先把话说明白。{line}",
      "reply": "这个结论的依据呢？{line}",
      "example": "你说得这么确定，具体依据哪一点？"
    }
  }
}
```

无 API 时使用技能的离线台词；缺少对应语言的离线台词时，界面会提示并使用默认预置。嘴辣程度会叠加到离线表达中；难度单独控制回合与初始压力。

## Markdown 技能

直接导入 `.md` 或 `.txt` 文件，首个一级标题作为技能名，正文作为 AI 文字规则。例如：

```markdown
# 冷面反问

每次最多两句，先指出一个逻辑缺口，再用一个具体问题追问。
遵循当前选择的粗俗程度，不照搬现成台词。
```

Markdown 本身不包含离线台词，因此需要 AI 才能按照文字规则生成新内容。文件上限 64 KB，最多保存 20 个导入技能；同名技能会更新。可以导出所选技能为 JSON，或移除导入的技能。当前正在进行的对话保留开局时的技能设置。

## English

Import a JSON, Markdown or text skill in Practice → Comeback lab. These are in-app style/data packs, not executable extensions. Referenced supporting files are not loaded.

Characters are original fictional archetypes. Describe general traits and delivery techniques, not real people or franchise characters. Do not request recognizable catchphrases or imply endorsement. Import only content you created or have permission to use. Shared originality rules apply to examples, openings and replies, but they do not automatically verify rights.

JSON requires `version: 1`, `name` and `instructions`. Names, descriptions and instructions accept plain strings or `{ "zh": "…", "en": "…" }`. Optional `local.zh` and `local.en` provide `opening`, `reply` and `example` strings. `{line}` substitutes the scenario’s preset line. See [reviewer.json](reviewer.json) for a complete bilingual example.

Without an API, a skill uses its offline lines. Missing offline lines use default presets with a visible explanation. Markdown/text imports supply AI instructions only. Difficulty and profanity are independent settings. Files are limited to 64 KB; up to 20 imported skills are saved in the browser. Same-name imports update the existing skill. Export selected skills as JSON or remove imported ones.
