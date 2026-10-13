/* Local dictionaries: no network requests, and user-written text is never translated. */
let language = "zh";
let themePreference = "system";
const UI = {
  skip: ["跳转到内容", "Skip to content"],
  brand: ["吵架练习器", "Boundary Lab"],
  safeSpace: ["你的沟通练习空间", "A space to practice communication"],
  workspace: ["练习空间", "YOUR WORKSPACE"],
  navHome: ["首页", "Home"],
  navPractice: ["开始练习", "Practice"],
  navHistory: ["练习记录", "History"],
  navProfile: ["我的档案", "Profile"],
  navSettings: ["设置", "Settings"],
  sidebarNote: [
    "表达有分寸，边界有力量。",
    "Thoughtful words. Strong boundaries.",
  ],
  sidebarFoot: [
    "每天一小步，回应更从容。",
    "Small steps. Calmer conversations.",
  ],
  homeEyebrow: ["沟通，也可以练习", "GOOD COMMUNICATION TAKES PRACTICE"],
  heroLabel: ["把难说的话，说得更好", "Find the words for difficult moments"],
  heroTitle: [
    "从容回应，<br><em>守住你的边界。</em>",
    "Respond calmly.<br><em>Keep your boundaries.</em>",
  ],
  heroDescription: [
    "不用争得面红耳赤。用一次安全的模拟对话，练习清晰表达、应对指责，也学会适时说“不”。",
    "You don’t have to raise your voice to be heard. Practice clear responses, handle criticism, and learn when to say no in a safe simulated conversation.",
  ],
  startGame: ["开始游戏", "Start game"],
  exploreMethods: ["先看看沟通心法", "Explore the toolkit"],
  heroMeta: [
    "无需注册 · 本地模式无需 API Key",
    "No sign-up · No API key needed for local practice",
  ],
  previewLabel: ["一次更好的回应", "A better response"],
  previewOther: [
    "“你怎么连这个都做不好？”",
    "“Why can’t you even get this right?”",
  ],
  previewYou: [
    "“你具体指哪一部分？<br>我们可以一起看事实。”",
    "“Which part do you mean?<br>Let’s look at the facts together.”",
  ],
  previewInsight: [
    "把指责变成具体问题",
    "Turn criticism into a specific question",
  ],
  previewInsightSub: [
    "清晰表达，比急着解释更有力量",
    "Clarity is stronger than a rushed defense",
  ],
  clearBoundary: ["边界感 +1", "Boundaries +1"],
  toolkitEyebrow: ["你的沟通工具箱", "YOUR COMMUNICATION TOOLKIT"],
  methodsTitle: [
    "五个心法，让表达更有底气",
    "Five principles for clearer conversations",
  ],
  methodsCaption: ["先理解，再练习", "Understand. Then practice."],
  gentleNote: [
    "练习的目标是清晰沟通，而不是赢过对方。评分是本地规则的提示，不是对你能力的判断。",
    "The goal is clear communication, not beating someone. Scores are rule-based practice cues, not a judgment of your abilities.",
  ],
  practiceEyebrow: ["从一个熟悉的场景开始", "START WITH A FAMILIAR SITUATION"],
  practiceTitle: ["给自己一次练习的机会", "Give yourself room to practice"],
  practiceDescription: [
    "选择场景与难度。这里没有标准答案，试着说出你的想法。",
    "Choose a situation and difficulty. There is no perfect answer here. Try putting your thoughts into words.",
  ],
  chooseOpponent: ["选择对手", "Choose an opponent"],
  difficulty: ["练习强度", "Choose your pace"],
  easy: ["轻松", "Easy"],
  normal: ["常规", "Normal"],
  hard: ["挑战", "Challenge"],
  easyRounds: ["4 回合", "4 rounds"],
  normalRounds: ["6 回合", "6 rounds"],
  hardRounds: ["8 回合", "8 rounds"],
  boundaryTitle: ["先说清你的边界", "Set an opening boundary"],
  optional: ["可选", "Optional"],
  boundaryHint: [
    "这句话会作为你的开场。也可以留空，在对话中慢慢练习。",
    "This will be your opening response. Leave it blank if you’d rather find your words during the conversation.",
  ],
  boundaryPlaceholder: [
    "例如：我愿意讨论问题，但不接受人身评价。",
    "For example: I’ll discuss the issue, but personal attacks aren’t acceptable.",
  ],
  beginPractice: ["开始这局练习", "Begin practice"],
  practiceTip: [
    "过程中可以随时查看心法或结束复盘",
    "Check the toolkit or end for a review at any time",
  ],
  resumeBattle: ["继续当前练习", "Resume current session"],
  opponentPressure: ["对方气焰", "Opponent intensity"],
  tacticsToggle: [
    "沟通心法 · 需要时看一眼",
    "Your toolkit · A reminder when you need it",
  ],
  switchLocal: [
    "切换本地对手，继续练习",
    "Switch to a local opponent and continue",
  ],
  yourReply: ["你的回应", "Your response"],
  replyPlaceholder: [
    "试着回应，把问题说具体……",
    "Try a response. Make the issue specific…",
  ],
  keyboardHint: [
    "Enter 发送 · Shift + Enter 换行",
    "Enter to send · Shift + Enter for a new line",
  ],
  endBattle: ["结束并复盘 ↗", "End & review ↗"],
  send: ["发送回应", "Send response"],
  historyEyebrow: ["每一次尝试，都算进步", "EVERY ATTEMPT COUNTS"],
  historyTitle: ["看见你的成长", "See how you’re growing"],
  historyDescription: [
    "回看回应与练习趋势，把好用的句子留给下一次。",
    "Revisit responses and practice trends. Keep the words that work for next time.",
  ],
  profileEyebrow: ["找到适合你的表达方式", "FIND YOUR WAY TO SPEAK UP"],
  profileTitle: ["你的沟通档案", "Your communication profile"],
  profileDescription: [
    "选出让你最有共鸣的情况，获得可以直接练习的建议。",
    "Choose the situations that feel familiar to get practical suggestions you can rehearse.",
  ],
  weaknessesTitle: ["你通常在哪一刻卡住？", "What usually holds you back?"],
  profileScene: ["最常遇到的场景", "Your most common situation"],
  profileRole: ["你的身份背景（可选）", "Your background (optional)"],
  rolePlaceholder: [
    "例如：职场新人、学生、父母",
    "For example: new employee, student, parent",
  ],
  saveProfile: ["保存档案，生成建议", "Save profile & get suggestions"],
  profileSaved: ["档案已保存。", "Profile saved."],
  noWeak: [
    "选一个让你有共鸣的情况，就能获得练习建议。",
    "Choose a situation above to see your practice suggestions.",
  ],
  settingsEyebrow: ["让练习更适合你", "MAKE THE SPACE YOUR OWN"],
  settingsTitle: ["偏好与连接", "Preferences & connections"],
  settingsDescription: [
    "本地模式随时可用。接入 AI，获得更灵活的对话与点评。",
    "Local practice is always available. Connect AI for more flexible conversations and feedback.",
  ],
  appearanceTitle: ["外观与语言", "Appearance & language"],
  languageTitle: ["界面语言", "Language"],
  themeTitle: ["主题", "Theme"],
  themeSystem: ["跟随系统", "Follow system"],
  themeLight: ["浅色", "Light"],
  themeDark: ["深色", "Dark"],
  preferencesHint: [
    "偏好自动保存，下次打开依然生效。",
    "Preferences save automatically for your next visit.",
  ],
  privacyNote: [
    "档案和记录保存在当前浏览器。AI 对话会发送到你配置的服务商。",
    "Your profile and history stay in this browser. AI conversations are sent to the provider you configure.",
  ],
  aiTitle: ["AI 对话连接", "AI connection"],
  aiHint: [
    "配置后启用 AI 对手；连接异常会切换本地对手。本地模式不需要密钥。",
    "A complete configuration enables AI opponents. Connection failures fall back to local practice, which needs no key.",
  ],
  storageWarning: [
    "当前浏览器不允许本地存储。配置和偏好仅本次会话有效。",
    "Storage is unavailable in this browser. Settings and preferences will last only for this session.",
  ],
  apiFormat: ["接口格式", "API format"],
  compatible: ["兼容格式", "Compatible"],
  presetsTitle: ["快捷预设", "Quick presets"],
  modelName: ["模型名称", "Model name"],
  showKey: ["显示", "Show"],
  hideKey: ["隐藏", "Hide"],
  saveSettings: ["保存配置", "Save configuration"],
  testConnection: ["保存并测试连接", "Save & test connection"],
  goPractice: ["去开吵 →", "Go to practice →"],
  connectionNote: [
    "密钥保存在本机浏览器，并随请求发送给所选服务商。跨域策略由服务商决定，请勿在共享设备上保留密钥。",
    "Your key is stored in this browser and sent to your chosen provider with API requests. The provider controls cross-origin access. Remove your key on shared devices.",
  ],
  footer: [
    "从容表达，是可以练出来的。",
    "Calmer conversations come with practice.",
  ],
  viewLatestReport: ["查看刚刚的复盘", "View latest review"],
  viewExample: ["查看回应示例", "See response examples"],
  avoidExample: ["容易陷入的回应", "An unhelpful response"],
  betterExample: ["试试这样说", "Try this instead"],
  statSessions: ["已完成练习", "Sessions completed"],
  statSessionsSub: ["每次尝试，都是一步", "Every attempt is a step"],
  statScenarios: ["真实生活场景", "Everyday situations"],
  statScenariosSub: ["从职场到人际关系", "From work to relationships"],
  statMethods: ["沟通心法", "Practical principles"],
  statMethodsSub: ["随时可查，慢慢熟练", "Ready when you need them"],
  localMode: ["本地对手 · 无需连接", "Local opponent · No connection needed"],
  aiMode: ["AI 对手 · {model}", "AI opponent · {model}"],
  round: ["第 {n} / {max} 回合", "Round {n} / {max}"],
  openingBoundary: ["你的开场边界：", "Your opening boundary:"],
  aiEnabled: [
    "已启用 AI 对手（{model}）。连接失败时仍可继续练习。",
    "AI opponent enabled ({model}). You can continue locally if the connection fails.",
  ],
  typing: ["对方正在思考回应…", "Your opponent is thinking…"],
  you: ["你", "You"],
  localSwitched: [
    "已切换本地对手，本局继续练习。",
    "Switched to a local opponent. Let’s continue.",
  ],
  aiFailed: [
    "AI 连接失败，本局改用本地对手：{error}",
    "AI connection failed. This session will continue locally: {error}",
  ],
  opponentRetreat: [
    "对方停止施压。你清楚表达了自己的边界。",
    "Your opponent has stopped pressing. You made your boundaries clear.",
  ],
  clarifyTag: ["澄清追问", "Clarify"],
  reframeTag: ["重定义概念", "Reframe"],
  reflectTag: ["问题反弹", "Reflect the question"],
  evidenceTag: ["让对方举证", "Ask for evidence"],
  boundaryTag: ["亮明边界", "Set a boundary"],
  defendTag: ["急于自证", "Rushed defense"],
  ledTag: ["跟随对方节奏", "Following their lead"],
  madTag: ["情绪升高", "Escalating emotion"],
  apologyTag: ["试试减少道歉", "Consider fewer apologies"],
  neutralTag: ["试试澄清或表达边界", "Try clarifying or setting a boundary"],
  reportEyebrow: [
    "把一次练习，变成下一次的底气",
    "TURN PRACTICE INTO CONFIDENCE",
  ],
  reportTitle: ["这一次，你做得怎么样？", "How did this session go?"],
  resultWin: ["边界守住了", "A clear boundary"],
  resultSmallWin: ["表达更清晰了", "Clearer communication"],
  resultDraw: ["稳住了节奏", "You held your ground"],
  resultLoss: ["还可以再试试", "Room to try again"],
  resultWinSub: [
    "你让对方停止施压，同时清楚地表达了自己的立场。",
    "You made your position clear and your opponent stopped pressing.",
  ],
  resultSmallWinSub: [
    "你找回了一些主动权，可以继续练习更坚定的表达。",
    "You found some of your footing. Keep practicing clear, steady responses.",
  ],
  resultDrawSub: [
    "对话没有完全化解，但你已经迈出了表达的一步。",
    "The tension isn’t fully resolved, but speaking up is a step forward.",
  ],
  resultLossSub: [
    "练习的价值就是找到下一次可以改进的一小步。",
    "Practice helps you find one small thing to try differently next time.",
  ],
  confidence: ["气势", "Confidence"],
  logic: ["逻辑", "Clarity"],
  boundaries: ["边界感", "Boundaries"],
  selfDefense: ["自证次数", "Defenses"],
  beingLed: ["被带节奏", "Following"],
  escalation: ["情绪升高", "Escalations"],
  techniques: ["出招次数", "Techniques"],
  summaryLine: [
    "{scene} · {diff} · {rounds} 次回应 · 终局气焰 {pressure}/10",
    "{scene} · {diff} · {rounds} responses · Final intensity {pressure}/10",
  ],
  principleCheck: ["心法使用情况", "Your toolkit in action"],
  ruleScores: [
    "本地规则评分，仅供练习参考",
    "Rule-based scores for practice guidance only",
  ],
  bestLine: ["本局亮眼回应", "Your standout response"],
  saveLineHint: [
    "保留这个表达，下次可以用自己的方式再说一遍。",
    "Keep this response in mind and make it your own next time.",
  ],
  noLine: [
    "本局还没有回应，下一次试着先问一个具体问题。",
    "No response yet. Try asking one specific question next time.",
  ],
  coachNotes: ["练习建议", "Practice notes"],
  playAgain: ["再练一局", "Practice again"],
  viewHistory: ["查看练习记录", "View history"],
  tipConfidence: [
    "试着把解释换成简短而平静的句子。先停顿，再回应，不必提高音量。",
    "Try a short, calm sentence rather than a long explanation. Pause, then respond. You don’t have to speak louder.",
  ],
  tipLogic: [
    "先把问题问具体：“你指的是哪一点？”比急着回答模糊指责更有帮助。",
    "Ask for specifics first: “Which part do you mean?” It helps more than rushing to answer a vague accusation.",
  ],
  tipBoundary: [
    "用一句话说清你愿意讨论什么、不能接受什么。边界不需要很长的解释。",
    "Say what you’re willing to discuss and what isn’t acceptable. A boundary doesn’t need a long explanation.",
  ],
  tipDefense: [
    "本局自证 {n} 次。下次可以试试：“你是从哪一点得出这个结论的？”",
    "You defended yourself {n} times. Next time, try: “What makes you draw that conclusion?”",
  ],
  tipMad: [
    "情绪升高时，试着深呼吸、放慢语速，再问一个具体问题。",
    "When emotions rise, breathe, slow down, then ask one specific question.",
  ],
  tipLed: [
    "你有时顺着对方的提问走。试着先确认前提，再决定如何回应。",
    "You sometimes followed their framing. Check the premise before deciding how to respond.",
  ],
  tipStable: [
    "表达正在变得稳定。回看好用的回应，或在下一局尝试不同场景。",
    "Your responses are becoming steadier. Revisit what worked or try a different situation next time.",
  ],
  emptyHistoryTitle: ["你的第一步，从这里开始", "Your first step starts here"],
  emptyHistory: [
    "完成一次练习后，这里会记录你的回应和成长轨迹。",
    "Complete a session to see your responses and practice trends here.",
  ],
  historySessions: ["练习场次", "Sessions"],
  historyWins: ["守住边界", "Boundaries held"],
  historyDefense: ["累计自证", "Total defenses"],
  recentTrend: [
    "最近 {n} 局的综合评分走势",
    "Combined scores across your last {n} sessions",
  ],
  moreForTrend: [
    "再完成一局，就能看到变化趋势。",
    "Complete one more session to see a trend.",
  ],
  recordsTitle: ["最近的练习", "Recent sessions"],
  clearHistory: ["清空记录", "Clear history"],
  clearConfirm: [
    "确定清空全部练习记录吗？此操作不可恢复。",
    "Clear all practice records? This cannot be undone.",
  ],
  historyDetails: [
    "{date} · {rounds} 次回应 · 气势 {q} / 逻辑 {l} / 边界 {b}",
    "{date} · {rounds} responses · Confidence {q} / Clarity {l} / Boundaries {b}",
  ],
  unspecified: ["暂不指定", "Not specified"],
  strategyTitle: ["你的专属练习建议", "Your practice suggestions"],
  mainMethod: ["先练这个心法：{name}", "Start with: {name}"],
  weaknessAdvice: ["从你熟悉的困难开始", "Start with your familiar challenges"],
  scenePhrases: ["{name} · 可以试试这样回应", "{name} · Responses to rehearse"],
  roleAdviceTitle: ["结合你的身份", "For your background"],
  roleAdviceGeneral: [
    "把建议放进真实的生活情境里，先在这里练一遍，再用自己的话说出来。",
    "Place this advice in a real situation. Rehearse it here, then say it in your own words.",
  ],
  roleAdviceNew: [
    "作为新人，先确认事实、记录与流程，清楚表达你的责任范围。",
    "As someone new, clarify facts, records and processes. State your responsibilities clearly.",
  ],
  roleAdviceParent: [
    "照顾别人时，也给自己的感受留一点空间。你的边界值得被听见。",
    "While caring for others, make room for your own needs. Your boundaries deserve to be heard.",
  ],
  roleAdviceStudent: [
    "面对模糊评价，先追问具体事实，再决定要不要继续讨论。",
    "Ask for specific facts when faced with vague criticism, then decide whether to continue.",
  ],
  aiReview: ["AI 教练点评", "AI coaching review"],
  aiReviewBusy: ["正在回看这局对话…", "Reviewing your conversation…"],
  aiReviewFailed: [
    "AI 点评暂时不可用：{error}。上面的练习建议仍可参考。",
    "AI review is unavailable: {error}. The practice notes above are still available.",
  ],
  baseOpenAI: [
    "可填写服务商的 Base URL 或完整 /chat/completions 地址。普通兼容服务通常需要 /v1，请以服务商说明为准。",
    "Enter the provider’s Base URL or full /chat/completions endpoint. Generic compatible providers usually need /v1; follow your provider’s instructions.",
  ],
  baseAnthropic: [
    "支持根地址、/v1 或完整 /v1/messages 地址。",
    "Accepts a root URL, /v1, or a complete /v1/messages endpoint.",
  ],
  aiConfigured: [
    "AI 配置已保存 · {model}（连接尚需测试）",
    "AI configured · {model} (test the connection to verify)",
  ],
  localStatus: ["当前使用本地对手", "Using a local opponent"],
  saveSuccess: [
    "配置已保存。建议测试连接；连接异常时仍能继续本地练习。",
    "Configuration saved. Test the connection to verify it. You can still practice locally if it fails.",
  ],
  saved: ["已保存", "Saved"],
  saveIncomplete: [
    "配置已保存，但地址、Key 或模型尚未填全。当前使用本地对手。",
    "Saved, but the URL, key or model is missing. Local opponents will be used.",
  ],
  saveError: [
    "保存失败，请检查浏览器存储权限。",
    "Save failed. Check this browser’s storage permissions.",
  ],
  incomplete: [
    "请先填写地址、API Key 和模型名称。",
    "Enter the URL, API key and model first.",
  ],
  memoryOnly: ["（仅本次会话有效）", "(this session only)"],
  connecting: ["正在测试连接…", "Testing the connection…"],
  connected: [
    "连接成功。模型回复：{reply}",
    "Connection successful. Model reply: {reply}",
  ],
  connectFailed: ["连接失败：{error}", "Connection failed: {error}"],
  corsHint: [
    "请检查接口地址以及服务商是否允许浏览器跨域请求。",
    "Check the endpoint and whether your provider allows browser cross-origin requests.",
  ],
  invalidURL: [
    "接口地址需要是有效的 http:// 或 https:// 地址。",
    "Use a valid http:// or https:// API URL.",
  ],
  apiMissing: ["API 未配置", "API is not configured"],
  timeout: [
    "请求已取消或超时（最长等待 15 秒）",
    "Request cancelled or timed out (15-second limit)",
  ],
  invalidResponse: [
    "模型返回格式异常或内容为空",
    "The model returned an invalid or empty response",
  ],
  http400: [
    "请求格式不被接受，请检查模型名称与接口格式。",
    "The request format was rejected. Check the model and API format.",
  ],
  http401: [
    "API Key 无效或未授权，请检查密钥。",
    "The API key is invalid or unauthorized. Check your key.",
  ],
  http402: [
    "账户余额不足，请检查服务商账户。",
    "Insufficient balance. Check your provider account.",
  ],
  http403: [
    "无权限使用该模型，请检查模型权限。",
    "Access to this model is denied. Check model permissions.",
  ],
  http404: [
    "地址或模型不存在，请检查接口地址和模型名称。",
    "Endpoint or model not found. Check the URL and model name.",
  ],
  http429: [
    "请求太频繁或额度受限，请稍后再试。",
    "Rate or quota limit reached. Please try again later.",
  ],
  http500: [
    "服务商发生故障，请稍后再试。",
    "The provider encountered an error. Try again later.",
  ],
  httpOther: [
    "接口请求失败，请检查服务商返回的信息。",
    "The API request failed. Check the provider’s error details.",
  ],
  switchTheme: ["切换为{theme}主题", "Switch to {theme} theme"],
  languageChanged: [
    "已切换为中文。历史对话保留原文。",
    "Switched to English. Previous messages keep their original wording.",
  ],
  navLabel: ["主导航", "Main navigation"],
  preferencesSaved: ["偏好已保存", "Preferences saved"],
};
function t(key, values = {}) {
  const entry = UI[key];
  const text = entry ? entry[language === "en" ? 1 : 0] : key;
  return text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}

const EN_METHODS = [
  {
    icon: "①",
    name: "Ask for evidence",
    essence:
      "Keep the focus on the claim. The person making an accusation should explain what supports it.",
    bad: "“I didn’t mean that! What I actually did was…” — a long defense gives the accusation more attention.",
    good: "“Which part makes you draw that conclusion?” — invite specifics instead of defending a label.",
    when: "Use when someone labels you or makes a vague accusation.",
  },
  {
    icon: "②",
    name: "Reflect the question",
    essence:
      "You can ask a question before answering one. Take a moment to understand why it is being asked.",
    bad: "“The reason I’m still single is…” — you accept their premise without checking it.",
    good: "“Why is my relationship status so important to you?”",
    when: "Use when intrusive questions put you on the spot.",
  },
  {
    icon: "③",
    name: "Ask for clarity",
    essence:
      "Don’t fill in the blanks for a vague claim. Ask the other person to explain exactly what they mean.",
    bad: "Arguing against a broad claim before understanding what it refers to.",
    good: "“I’m not sure what you mean. Which part specifically?”",
    when: "Use when the claim is vague or the assumptions are unclear.",
  },
  {
    icon: "④",
    name: "Reframe the claim",
    essence:
      "Bring loaded words back to concrete facts. Clarify the standard before accepting the judgment.",
    bad: "Defending yourself against “You’re irresponsible” without questioning the label.",
    good: "“What does ‘irresponsible’ mean here? What standard are we using?”",
    when: "Use when labels, generalizations or shifting standards take over.",
  },
  {
    icon: "⑤",
    name: "Set a boundary early",
    essence:
      "Say what is acceptable before the conversation goes too far. A clear boundary can prevent escalation.",
    bad: "Waiting until you are overwhelmed before saying anything.",
    good: "“I’m not discussing that topic.” / “That joke isn’t comfortable for me. Please stop.”",
    when: "Use before a difficult topic or as soon as a boundary is crossed.",
  },
];
const EN_SCENES = [
  {
    id: "office",
    em: "🏢",
    name: "The blame-shifter",
    type: "Workplace pressure",
    intro:
      "A project hits a problem. A coworker puts all the responsibility on you.",
    soft: "Ask for records and specific responsibilities. Avoid defending a vague accusation.",
    open: [
      "The project went wrong and the client is calling me. What are you going to do about it?",
    ],
    attack: [
      "This is on you. You should have checked it more carefully.",
      "Give me an answer today or I’ll have to take it to the manager.",
      "I don’t care about the process. The result is a mess.",
      "Your name is on the delivery record. You can’t get out of this.",
    ],
    press: [
      "All that explaining makes it sound like you know you’re at fault.",
      "Anyone can make excuses. What are you going to do now?",
    ],
    wobble: [
      "I’m not shifting blame. I’m just talking about the issue.",
      "Why didn’t you mention that earlier?",
      "Well… surely you have some responsibility too.",
    ],
    mad: ["Getting angry? That makes it look like you have something to hide."],
    collapse: [
      "Fine. I’ll go through the records with the client again.",
      "All right. Let’s check who handled what.",
    ],
  },
  {
    id: "aunt",
    em: "🧧",
    name: "The intrusive aunt",
    type: "Family expectations",
    intro: "At a family dinner, your aunt starts directing your personal life.",
    soft: "Acknowledge the concern without handing over your personal choices.",
    open: [
      "Still not seeing anyone? How long will you keep your parents worrying? I only want what’s best for you.",
    ],
    attack: [
      "Don’t be so picky. You’ll regret waiting.",
      "Your neighbor already has children. What about you?",
      "I’ve lived longer. You should listen to me.",
    ],
    press: [
      "I’m only trying to help! Why can’t you appreciate it?",
      "So I can’t even say a few words to you anymore?",
    ],
    wobble: [
      "I was just showing that I care.",
      "Young people are so difficult to talk to.",
      "Fine. I’ve said my piece.",
    ],
    mad: ["Look at that attitude. Do you really think I’d hurt you?"],
    collapse: [
      "All right, we’ll drop it. Let’s eat.",
      "Fine. You can make your own decision.",
    ],
  },
  {
    id: "troll",
    em: "💻",
    name: "The online contrarian",
    type: "Unhelpful criticism",
    intro: "You share a post. A stranger replies with dismissive comments.",
    soft: "Ask for one specific issue. You don’t have to respond to vague provocation.",
    open: ["Seriously? You actually thought this was worth posting?"],
    attack: [
      "You’re upset because you know I’m right.",
      "One comment and you write an essay. Must have hit a nerve.",
      "That can’t be true. You made it up.",
      "You clearly don’t understand what you’re talking about.",
    ],
    press: [
      "Why explain so much? Feeling guilty?",
      "There you go, getting upset again.",
    ],
    wobble: [
      "I’m just being precise.",
      "Can’t you take a joke?",
      "Fine. We see it differently.",
    ],
    mad: ["So angry! Guess I was right after all."],
    collapse: [
      "Whatever. I’m done here.",
      "Fine, I have nothing specific to add.",
    ],
  },
  {
    id: "passive",
    em: "🍵",
    name: "The sarcastic colleague",
    type: "Passive-aggressive remarks",
    intro:
      "You get recognition for a project. A colleague makes a pointed remark.",
    soft: "Bring the implication into the open. Ask them to say what they mean.",
    open: [
      "Oh, you get all the credit again. The rest of us just do the work, I guess.",
    ],
    attack: [
      "Some people really know how to impress the boss.",
      "You do seem to love the spotlight.",
      "I’m telling you for your own good. Others won’t say it to your face.",
    ],
    press: [
      "Still explaining? Sounds like I was right.",
      "I said one thing and you take it so seriously.",
    ],
    wobble: ["It was only a joke.", "You’re reading too much into it."],
    mad: ["See? You’re worked up and I haven’t said anything."],
    collapse: [
      "Fine, let’s leave it there.",
      "All right. I’ll get back to work.",
    ],
  },
  {
    id: "friend",
    em: "🚪",
    name: "The boundary-crossing friend",
    type: "Pressure disguised as friendship",
    intro: "A friend who hasn’t repaid a loan asks for more money.",
    soft: "State a clear rule. Caring about a friend doesn’t require agreeing to every request.",
    open: [
      "I’m short on money. Can the last loan wait? Could you lend me some more? We’re friends, don’t be stingy.",
    ],
    attack: [
      "Talking about money ruins friendships.",
      "Forget it. Why do you have to ask so many questions?",
      "Don’t you trust me? It’s only for a few days.",
    ],
    press: [
      "See how you change as soon as money comes up?",
      "It’s just a loan. Why make such a big deal?",
    ],
    wobble: [
      "I just don’t have any other options.",
      "Why are you suddenly so strict?",
    ],
    mad: [
      "You act like I’m asking for your life. What kind of friend is that?",
    ],
    collapse: [
      "All right. I’ll find another way.",
      "Okay. We can talk about repaying the last loan first.",
    ],
  },
];
const EN_WEAKNESSES = [
  { id: "slow", em: "", label: "I freeze and can’t find the words" },
  { id: "soft", em: "", label: "I worry about hurting the relationship" },
  { id: "explain", em: "", label: "I over-explain or apologize" },
  { id: "hothead", em: "", label: "I lose my words when I get upset" },
  { id: "slowmind", em: "", label: "I think of a response only afterward" },
  { id: "avoid", em: "", label: "I avoid conflict and put up with it" },
  { id: "quiet", em: "", label: "I find it hard to speak firmly" },
];
const EN_WEAK_STRATEGY = {
  slow: {
    main: 2,
    text: [
      "“What do you mean?” is a complete response. It gives you time to think while asking for clarity.",
      "You don’t have to speak quickly. A calm pause can make your response more deliberate.",
    ],
  },
  soft: {
    main: 0,
    text: [
      "Describe the behavior rather than attacking the person: “That comment crosses a boundary for me.”",
      "Respecting the relationship includes speaking honestly about what doesn’t work for you.",
    ],
  },
  explain: {
    main: 0,
    text: [
      "Try replacing “I didn’t…” with “What makes you think that?”",
      "Apologize when you have caused harm, rather than using an apology to end every disagreement.",
    ],
  },
  hothead: {
    main: 1,
    text: [
      "Breathe, slow down, then ask a question. It creates space to think.",
      "You can take a break and return to the conversation when you feel steadier.",
    ],
  },
  slowmind: {
    main: 2,
    text: [
      "Revisit useful responses in your history and rehearse them in your own words.",
      "“I need time to think. I’ll come back to this” is a valid response.",
    ],
  },
  avoid: {
    main: 4,
    text: [
      "State a boundary early, before the conversation gets uncomfortable.",
      "Try “Please don’t do that again” instead of quietly accepting the situation.",
    ],
  },
  quiet: {
    main: 0,
    text: [
      "Steadiness matters more than volume. Try a short sentence and a calm pause.",
      "Keep the response to one clear point. You don’t have to explain everything at once.",
    ],
  },
};
const EN_SCENE_TACTICS = {
  office: [
    "The record shows who handled each part. Shall we look at it together?",
    "If there’s a specific issue, please show me the evidence.",
  ],
  aunt: [
    "I appreciate your concern. I’ll make my own decisions.",
    "This is my choice, and I’m not discussing it at dinner.",
  ],
  troll: [
    "Which part specifically? I’m happy to discuss a concrete point.",
    "We see it differently. I’ll leave it there.",
  ],
  passive: [
    "Please say directly what you mean.",
    "If there’s a specific concern, let’s discuss it clearly.",
  ],
  friend: [
    "I’m not lending more money while the earlier loan is unpaid.",
    "Let’s agree on repayment of the last loan first.",
  ],
};
