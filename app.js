/* ================================================================
 * 吵架练习器 · 本地规则引擎版
 * 五大心法驱动的对手模拟 + 招式实时识别 + 吵后复盘
 * ================================================================ */

/* ---------- 基础数据 ---------- */
const BASE_METHODS = [
  {
    icon: "①",
    name: "只说你，不说我",
    essence: "避免自证 —— 谁解释，谁被动。举证责任永远在指责的人。",
    bad: "「我不是那个意思，我当时其实是……」（越解释越像心虚）",
    good: "「你从哪句话得出的这个结论？」（举证责任抛回去）",
    when: "适用时机：对方给你下定义、贴标签、泼脏水时。",
  },
  {
    icon: "②",
    name: "把问题反弹回去",
    essence: "夺回主动权 —— 提问权就是主动权，对方问什么你别急着答。",
    bad: "认真回答「我为什么单着是因为……」（一答就进对方节奏）",
    good: "「你为什么这么关心我单不单？」（原样打回去）",
    when: "适用时机：对方抛来质问、查户口式连环提问时。",
  },
  {
    icon: "③",
    name: "用「我不懂」装傻",
    essence:
      "逼对方摊牌 —— 不接偷换的前提，逼对方把模糊指控展开，一展开漏洞就露。",
    bad: "顺着对方的车轱辘话辩解（等于接了对方的前提）",
    good: "「我不太懂，你具体指哪一点？」「这个标准是谁定的？」",
    when: "适用时机：对方说车轱辘话、概念模糊、上纲上线时。",
  },
  {
    icon: "④",
    name: "重新定义概念",
    essence: "瓦解对方逻辑 —— 把被偷换的概念拉回阳光下晒一晒。",
    bad: "顺着「你这就是不负责任」的定性辩解（帽子已扣死）",
    good: "「『不负责任』的定义是什么？按这标准你自己达标了吗？」",
    when: "适用时机：对方扣帽子、上价值、玩滑坡谬误时。",
  },
  {
    icon: "⑤",
    name: "提前设防",
    essence: "让架根本吵不起来 —— 大部分架源于边界不清。先声明，后执行。",
    bad: "等对方越界了才被动反击（雷已经炸了）",
    good: "「这个话题我不讨论」「开这种玩笑我不舒服，下次注意」",
    when: "适用时机：进入已知雷区之前，正式开吵之前。",
  },
];

const BASE_SCENES = [
  {
    id: "office",
    em: "🏢",
    name: "职场甩锅侠",
    type: "强势压制型",
    intro: "项目出了问题，他把责任全扣你头上，语气不容分说。",
    soft: "软肋：他要的是你认错息事，你一自证他就得寸进尺。",
    open: ["这个方案出问题了吧？客户现在全在找我，你说怎么办。"],
    attack: [
      "我不管，这锅就得你背，谁让你当时没检查清楚。",
      "你今天必须给我一个说法，不然我只好跟领导反映一下了。",
      "别跟我讲过程，我只看结果，结果就是搞砸了。",
      "反正交付记录上写的是你的名字，你跑不掉。",
    ],
    press: [
      "哦，你解释这么多，说明你心里也清楚自己有问题吧？",
      "行了行了，借口谁不会找？关键是这事怎么收场，你说你怎么办。",
    ],
    wobble: [
      "我……我这怎么叫甩锅？我这不是对事不对人吗。",
      "那你当时怎么不早说？",
      "反正……反正这事你也有责任吧。",
    ],
    mad: ["哟，急了急了？急了就是心虚了啊。"],
    collapse: [
      "算了算了！我去跟客户说再核对一遍，真是的。",
      "行行行，说不过你，我自己再看看吧。",
    ],
  },
  {
    id: "aunt",
    em: "🧧",
    name: "催婚姑妈",
    type: "道德绑架型",
    intro: "年夜饭桌上，她端着长辈架子开始对你的人生指指点点。",
    soft: "软肋：她的弹药是「为你好」，你一接招就输，不接招她就空转。",
    open: ["都这岁数了还不找对象，你是想让你妈操心到什么时候？我这是为你好。"],
    attack: [
      "眼光别太高了，再挑以后有你后悔的。",
      "隔壁小芳孩子都会打酱油了，你呢？工作好有什么用？",
      "我吃的盐比你吃的饭都多，听我的准没错。",
    ],
    press: [
      "我还不是为你好？外人谁管你啊，你这孩子怎么不知好歹。",
      "翅膀硬了是吧？说你两句还不行了？",
    ],
    wobble: [
      "我……我这不是关心你嘛。",
      "现在的年轻人，说不得碰不得。",
      "行行行，我说不过你，反正话我带到了。",
    ],
    mad: ["你看看你这什么态度！我还能害你不成？"],
    collapse: [
      "好好好，不说了不说了，吃饭吃饭。",
      "哎，管不了管不了，随你吧。",
    ],
  },
  {
    id: "troll",
    em: "💻",
    name: "抬杠网友",
    type: "胡搅蛮缠型",
    intro: "你发了个动态，他冲进来一通评价，句句挑事。",
    soft: "软肋：杠精怕的不是你辩，是你让他自己把话说具体。",
    open: ["就这？就这也敢发出来？搁网上纯属丢人。"],
    attack: [
      "你急了你急了，急了就是破防了。",
      "我说一句你回十句，看来是真戳到痛处了。",
      "不可能，绝对不可能，你肯定在编故事。",
      "就这理解能力，建议重修一下语文。",
    ],
    press: ["你解释这么多干嘛？心虚了吧？", "急了急了，看，他又急了。"],
    wobble: [
      "我……我杠怎么了？我这叫较真。",
      "你这人怎么开不起玩笑。",
      "行吧，各有各的看法，懒得跟你说。",
    ],
    mad: ["急成这样，看来是真被我说中了哈哈哈。"],
    collapse: ["啧，没意思，不跟你说了。", "溜了溜了，杠不动杠不动。"],
  },
  {
    id: "passive",
    em: "🍵",
    name: "阴阳怪气同事",
    type: "阴阳怪气型",
    intro: "你刚拿了项目功劳，她端着咖啡飘过来，话里有话。",
    soft: "软肋：阴阳怪气最怕阳光——让她「有话直说」，她就哑火了。",
    open: ["哟，这次又是你功劳最大呀，我们这些干活的都没你厉害呢。"],
    attack: [
      "有些人啊，就会在领导面前表现，啧啧。",
      "也不是我说你，就是有点太爱出风头了。",
      "我这么说可都是为你好，别人可不会当面跟你说哦。",
    ],
    press: [
      "哟，还解释呢？看来真被说中了？",
      "我随便一说你还当真了？这么沉不住气？",
    ],
    wobble: [
      "我……我开玩笑的，你不会当真了吧。",
      "哎呀，你也太敏感了，我就随口一说。",
    ],
    mad: ["看看看，急了吧？我可什么都没说哦。"],
    collapse: [
      "行了行了，不聊了不聊了，喝茶喝茶。",
      "哎呀，不说了不说了，忙去了。",
    ],
  },
  {
    id: "friend",
    em: "🚪",
    name: "越界损友",
    type: "装无辜型",
    intro: "上次借的钱还没还，他又来了，张口就要，不给就是你小气。",
    soft: "软肋：他靠「朋友情分」绑架你，你把规矩摆出来他就没词了。",
    open: [
      "哥们最近手头紧，上次借的三千先缓缓，再借我两千周转下？都是朋友别小气。",
    ],
    attack: [
      "你这人怎么这样，朋友之间提钱多伤感情。",
      "不借就算了，还问东问西的，真没意思。",
      "我人品你还信不过？就周转几天！",
    ],
    press: [
      "你看你看，一提借钱就变脸，果然谈钱伤感情。",
      "就是借个钱而已，你至于吗？",
    ],
    wobble: [
      "我……我这不是实在没办法嘛。",
      "你怎么突然这么较真……以前不都好好的。",
    ],
    mad: ["至于吗你，跟要你命一样，以后还怎么做朋友！"],
    collapse: [
      "行吧行吧，那……那算了，我再想想别的办法。",
      "好吧好吧，我先走了……",
    ],
  },
];

const BASE_DIFFS = [
  { name: "温泉局", rounds: 4, pressure: 6, retreat: 2 },
  { name: "常规局", rounds: 6, pressure: 8, retreat: 2 },
  { name: "硬核局", rounds: 8, pressure: 10, retreat: 1 },
];

const BASE_WEAKNESSES = [
  { id: "slow", em: "🐢", label: "嘴笨反应慢，当场卡壳" },
  { id: "soft", em: "🫠", label: "心软，怕伤和气" },
  { id: "explain", em: "📖", label: "爱解释、爱道歉" },
  { id: "hothead", em: "🌋", label: "一上头就语无伦次" },
  { id: "slowmind", em: "⏰", label: "事后才想起该怎么回" },
  { id: "avoid", em: "🫥", label: "怕冲突，能忍则忍" },
  { id: "quiet", em: "🔈", label: "声音小，没气势" },
];

const BASE_WEAK_STRATEGY = {
  slow: {
    main: 3,
    mainName: "装傻追问",
    text: [
      "「什么意思？」是你的万能回——不需要快嘴，不需要急智，一句话把回合抛回给对方，还给自己争取思考时间。",
      "记住：吵架不考语速，考「不接招」。你可以慢慢说，甚至可以停顿——停顿反而有压迫感。",
    ],
  },
  soft: {
    main: 1,
    mainName: "只说你不说我",
    text: [
      "守住边界不等于伤害对方。描述对方的行为（「你这句话越界了」），而不是发泄情绪、人身攻击。",
      "沉默的「老好人」才是关系的隐形炸弹：你每一次咽下去，都是在教对方可以这么对你。",
    ],
  },
  explain: {
    main: 1,
    mainName: "只说你不说我",
    text: [
      "自证检测训练：把每一句「我不是……」改成「你是从哪得出的？」",
      "道歉只在真的做错时出现，它不是用来息事宁人的工具。",
    ],
  },
  hothead: {
    main: 2,
    mainName: "反弹回去",
    text: [
      "上头三件套：深呼吸 → 降语速 → 用反问代替陈述。反问句天然自带缓冲，让你边说边想。",
      "记住一条铁律：谁的情绪先崩，谁先输。",
    ],
  },
  slowmind: {
    main: 3,
    mainName: "装傻追问",
    text: [
      "建立你的「金句库」：每一局复盘里系统都会存下你的最佳表现，定期去战绩页回看，形成肌肉记忆。",
      "吵架不追「当下满分」——「这话我先不接，想好了再回你」也是完全合法的操作，没有人规定必须秒回。",
    ],
  },
  avoid: {
    main: 5,
    mainName: "提前设防",
    text: [
      "你适合打「预防战」：大部分冲突应该在边界声明期就终结。",
      "忍让不会让越界者自觉，只会让他觉得你接受。把「算了」换成「下次注意」。",
    ],
  },
  quiet: {
    main: 1,
    mainName: "只说你不说我",
    text: [
      "气势不靠音量靠「稳」：短句 + 停顿 + 直视。句号永远比感叹号更有力量。",
      "把每句话砍到 15 字以内试试——短句自带气场。",
    ],
  },
};

const BASE_SCENE_TACTICS = {
  office: [
    "「这部分谁负责，记录里写得清清楚楚，需要我现在调出来吗？」",
    "「你有证据就拿出来，没有的话，这话我当没听见。」",
  ],
  aunt: [
    "「姑妈关心我，我领了。我的事我自己有数。」",
    "「这是我的课题，您就别操心了。」",
  ],
  troll: [
    "「你具体指哪一点？说不出来就是纯情绪，我不接。」",
    "「你说得对=你对，不用回了。」",
  ],
  passive: [
    "「有话请直说，阴阳怪气的部分我就当没听见。」",
    "「哦，你先喝完这杯，我忙去了。」",
  ],
  friend: [
    "「钱的事我的规矩是：救急不救穷，这规矩对谁都一样，包括你。」",
    "「先还上次的，我们再谈下次。」",
  ],
};

let METHODS = BASE_METHODS,
  SCENES = BASE_SCENES,
  DIFFS = BASE_DIFFS;
let WEAKNESSES = BASE_WEAKNESSES,
  WEAK_STRATEGY = BASE_WEAK_STRATEGY,
  SCENE_TACTICS = BASE_SCENE_TACTICS;
// Strategy indices are zero-based, just like the methods array.
Object.entries({
  slow: 2,
  soft: 0,
  explain: 0,
  hothead: 1,
  slowmind: 2,
  avoid: 4,
  quiet: 0,
}).forEach(([id, index]) => (BASE_WEAK_STRATEGY[id].main = index));
/* ---------- 存储 ---------- */
/* ---- 安全存储层：localStorage 不可用（沙箱 iframe/隐私模式/file 协议）时降级内存存储 ---- */
const LS_KEY = "quarrel_trainer_v1";
let storageOK = true;
const memStore = {};
(function probeStorage() {
  try {
    const t = "__qt_probe__";
    localStorage.setItem(t, "1");
    localStorage.removeItem(t);
  } catch (e) {
    storageOK = false;
  }
})();
function loadData() {
  if (storageOK) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== "object" || Array.isArray(data)) return {};
      memStore.data = JSON.stringify(data);
      return data;
    } catch (e) {
      storageOK = false;
    }
  }
  return memStore.data ? JSON.parse(memStore.data) || {} : {};
}
function saveData(d) {
  const str = JSON.stringify(d);
  memStore.data = str;
  if (storageOK) {
    try {
      localStorage.setItem(LS_KEY, str);
      return;
    } catch (e) {
      storageOK = false;
    }
  }
  memStore.data = str;
}
function getHistory() {
  const h = loadData().history;
  return Array.isArray(h) ? h : [];
}
function getProfile() {
  const p = loadData().profile;
  if (!p || typeof p !== "object") return null;
  return {
    weak: (Array.isArray(p.weak) ? p.weak : []).filter(
      (id) => WEAK_STRATEGY[id],
    ),
    scene: SCENES.some((s) => s.id === p.scene) ? p.scene : "",
    role: typeof p.role === "string" ? p.role : "",
  };
}
function getSettings() {
  return loadData().settings || {};
}
function hasLLM() {
  const s = getSettings();
  return !!(s.baseUrl && s.apiKey && s.model);
}

/* ---------- LLM 对接（两种主流格式：OpenAI 兼容 / Anthropic，用户自配 Key，未配置自动回落本地引擎） ---------- */
const PRESETS = [
  {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
    fmt: "openai",
  },
  {
    name: "智谱 GLM",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    fmt: "openai",
  },
  {
    name: "月之暗面",
    baseUrl: "https://api.moonshot.cn/v1",
    model: "kimi-k2-0905k",
    fmt: "openai",
  },
  {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    fmt: "openai",
  },
  {
    name: "Gemini(兼容端点)",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.5-flash",
    fmt: "openai",
  },
  {
    name: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen2.5-7B-Instruct",
    fmt: "openai",
  },
  {
    name: "本地 Ollama",
    baseUrl: "http://localhost:11434/v1",
    model: "qwen2.5:7b",
    fmt: "openai",
  },
  {
    name: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com",
    model: "claude-sonnet-4-5",
    fmt: "anthropic",
  },
];

/* 把内部统一的消息数组转成 Anthropic 载荷（system 拆到顶层、首条必须是 user） */
function toAnthropicPayload(messages) {
  const sys = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const msgs = messages
    .filter((m) => m.role !== "system" && m.content)
    .map((m) => ({ role: m.role, content: m.content }));
  if (msgs.length && msgs[0].role === "assistant") {
    msgs.unshift({
      role: "user",
      content: "（场景已开始，请直接以对手身份继续对话）",
    });
  }
  return { sys, msgs };
}

/* 把服务商返回的 HTTP 错误翻译成人话 */
function httpError(res, detail) {
  const key = UI["http" + res.status]
    ? "http" + res.status
    : res.status >= 500
      ? "http500"
      : "httpOther";
  return new Error(
    "HTTP " + res.status + " " + t(key) + (detail ? " (" + detail + ")" : ""),
  );
}

function llmEndpoint(baseUrl, format) {
  const base = baseUrl.trim().replace(/\/+$/, "");
  if (format === "anthropic") {
    return (
      base.replace(/\/(?:v1\/)?messages$/i, "").replace(/\/v1$/i, "") +
      "/v1/messages"
    );
  }
  return base.replace(/\/chat\/completions$/i, "") + "/chat/completions";
}

async function callLLM(messages, temperature, signal, maxTokens) {
  const ctrl = new AbortController();
  const abort = () => ctrl.abort();
  if (signal) {
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  }
  const timer = setTimeout(abort, 15000);
  try {
    return await requestLLM(messages, temperature, ctrl.signal, maxTokens);
  } catch (e) {
    if (e.name === "AbortError") throw new Error(t("timeout"));
    throw e;
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", abort);
  }
}

async function requestLLM(messages, temperature, signal, maxTokens) {
  const s = getSettings();
  if (!s.baseUrl || !s.apiKey || !s.model) throw new Error(t("apiMissing"));
  const fmt = s.apiFormat || "openai";
  if (fmt === "anthropic") {
    const url = llmEndpoint(s.baseUrl, fmt);
    const p = toAnthropicPayload(messages);
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": s.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: s.model,
        system: p.sys || undefined,
        messages: p.msgs,
        max_tokens: maxTokens || 400,
        temperature: temperature == null ? 0.8 : temperature,
      }),
    });
    if (!res.ok) {
      let detail = "";
      try {
        detail = (await res.text()).slice(0, 120);
      } catch (e) {}
      throw httpError(res, detail);
    }
    const data = await res.json();
    const c =
      data && Array.isArray(data.content)
        ? data.content
            .filter((x) => x.type === "text")
            .map((x) => x.text)
            .join("")
            .trim()
        : "";
    if (!c) throw new Error(t("invalidResponse"));
    return c;
  }
  // OpenAI 兼容格式（绝大多数服务商与中转站）
  const url = llmEndpoint(s.baseUrl, fmt);
  const res = await fetch(url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + s.apiKey,
    },
    body: JSON.stringify({
      model: s.model,
      messages,
      temperature: temperature == null ? 0.8 : temperature,
    }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 120);
    } catch (e) {}
    throw httpError(res, detail);
  }
  const data = await res.json();
  const c =
    data &&
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;
  if (!c) throw new Error(t("invalidResponse"));
  if (!String(c).trim()) throw new Error(t("invalidResponse"));
  return String(c).trim();
}

/* ---------- 视图切换 ---------- */
function go(v) {
  const target = document.getElementById("view-" + v);
  if (!target) return;
  document
    .querySelectorAll(".view")
    .forEach((x) => x.classList.toggle("active", x === target));
  document.querySelectorAll("nav button").forEach((b) => {
    const active =
      b.dataset.v === v ||
      (["battle", "report"].includes(v) && b.dataset.v === "setup");
    b.classList.toggle("active", active);
    if (active) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  if (v === "setup") renderSetup();
  if (v === "history") renderHistory();
  if (v === "me") renderMe();
  if (v === "home") renderHomeStats();
  if (v === "settings") renderSettings();
  window.scrollTo({ top: 0, behavior: "instant" });
  document.getElementById("main").focus({ preventScroll: true });
}
document
  .querySelectorAll("nav button")
  .forEach((b) => (b.onclick = () => go(b.dataset.v)));

function renderMethods() {
  const open = [...document.querySelectorAll("#methods details")].map(
    (el) => el.open,
  );
  document.getElementById("methods").innerHTML = METHODS.map(
    (m, i) => `
    <article class="card method"><div class="method-top"><span class="method-number">${String(i + 1).padStart(2, "0")}</span><h3>${m.name}</h3></div><p class="ess">${m.essence}</p>
    <details ${open[i] ? "open" : ""}><summary>${t("viewExample")}</summary><div class="pair bad"><b>${t("avoidExample")}</b>${m.bad}</div><div class="pair good"><b>${t("betterExample")}</b>${m.good}</div><p class="when">${m.when}</p></details></article>`,
  ).join("");
  document.getElementById("tactic-drawer").innerHTML = METHODS.map(
    (m) => `<div class="tk"><b>${m.icon} ${m.name}</b>${m.good}</div>`,
  ).join("");
}
function renderHomeStats() {
  document.getElementById("home-stats").innerHTML = [
    [getHistory().length, "statSessions", "statSessionsSub"],
    [SCENES.length, "statScenarios", "statScenariosSub"],
    [METHODS.length, "statMethods", "statMethodsSub"],
  ]
    .map(
      ([n, title, sub]) =>
        `<div class="home-stat"><strong>${String(n).padStart(2, "0")}</strong><div><span>${t(title)}</span><small>${t(sub)}</small></div></div>`,
    )
    .join("");
}
let selScene = SCENES[0].id,
  selDiff = 1;
function renderSetup() {
  const grid = document.getElementById("scene-grid");
  grid.innerHTML = SCENES.map(
    (s) =>
      `<button type="button" class="scene ${s.id === selScene ? "sel" : ""}" data-id="${s.id}" aria-pressed="${s.id === selScene}"><span class="em" aria-hidden="true">${s.em}</span><span class="nm">${s.name}</span><span class="tp">${s.type}</span><span class="scene-intro">${s.intro}</span></button>`,
  ).join("");
  grid.querySelectorAll(".scene").forEach(
    (el) =>
      (el.onclick = () => {
        selScene = el.dataset.id;
        renderSetup();
        grid
          .querySelector('[data-id="' + selScene + '"]')
          .focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll("#diff-seg button").forEach((b) => {
    b.classList.toggle("sel", +b.dataset.d === selDiff);
    b.setAttribute("aria-pressed", +b.dataset.d === selDiff);
  });
  document.getElementById("practice-mode").innerHTML =
    '<span class="mode-dot"></span>' +
    escapeHtml(
      hasLLM() ? t("aiMode", { model: getSettings().model }) : t("localMode"),
    );
  const resume = document.getElementById("btn-resume");
  resume.hidden = !battle;
  resume.textContent = t(battle?.over ? "viewLatestReport" : "resumeBattle");
  resume.onclick = () => go(battle?.over ? "report" : "battle");
}
document.querySelectorAll("#diff-seg button").forEach(
  (b) =>
    (b.onclick = () => {
      selDiff = +b.dataset.d;
      renderSetup();
    }),
);
document.getElementById("btn-tactics").onclick = () => {
  const open = document
    .getElementById("tactic-drawer")
    .classList.toggle("show");
  document.getElementById("btn-tactics").setAttribute("aria-expanded", open);
};

/* ---------- 分析引擎 ---------- */
const INSULTS = [
  "傻逼",
  "你有病",
  "神经病",
  "去死",
  "废物",
  "脑残",
  "智障",
  "白痴",
  "有毛病",
  "垃圾人",
  "滚蛋",
  "混蛋",
];
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function analyze(text) {
  const t = text.trim();
  const youN = (t.match(/你|\b(?:you|your|yours)\b/gi) || []).length;
  const woN = (t.match(/我|\b(?:i|me|my|mine)\b/gi) || []).length;
  const hasQ = /[?？]/.test(t);
  const r = {
    tactics: [],
    selfVerify: false,
    led: false,
    mad: false,
    apolo: false,
    boundary: false,
    hasQ,
    youN,
    woN,
    len: /[\u4e00-\u9fff]/.test(t)
      ? t.length
      : (t.match(/\b[\w']+\b/g) || []).length * 2,
    tags: [],
  };
  // 招式识别
  if (
    hasQ &&
    /我不懂|不懂|什么意思|没听懂|说清楚|具体.{0,5}(指|是|哪|说)|哪个|什么叫|定义|标准是什|谁定的|what do you mean|which (?:part|point)|specifically|what standard|can you clarify|be specific|what exactly/i.test(
      t,
    )
  ) {
    r.tactics.push("③装傻追问");
  }
  if (
    /照你这么说|按你这个逻辑|照这个逻辑|所以.{0,12}(都|就)算|偷换|上纲上线|你这是.{0,6}绑架|by (?:that|your) logic|what does .+ mean|define |definition|double standard|generaliz|what counts as/i.test(
      t,
    )
  ) {
    r.tactics.push("④重定义概念");
  }
  if (
    hasQ &&
    /你为什么|那你|你说|你倒是|请问你|你凭什么|你自己|why (?:do|are|would|did) you|what makes you|how (?:do|did) you/i.test(
      t,
    )
  ) {
    r.tactics.push("②问题反弹");
  }
  if (youN >= 1 && woN === 0) {
    r.tactics.push("①只说你不说我");
  }
  // 自证（注意：以「我不懂/我不知道」开头的装傻招式不算自证）
  r.selfVerify =
    /^(我不是|我没有|不是的|别误会|其实|真的)/.test(t) ||
    /我解释|你听我说|不是你想的那样|我真不是|^i (?:am not|did not|didn't|was not|wasn't)|let me explain|you misunderstood|i can explain/i.test(
      t,
    ) ||
    (woN >= 2 &&
      woN > youN &&
      !hasQ &&
      r.len > 40 &&
      !/我不懂|我不知道|不明白|i (?:don't|do not) (?:understand|know)/i.test(
        t,
      ));
  // 边界词（需在被带节奏判定之前算好）
  r.boundary =
    /我不接受|到此为止|越界|我没必要|跟你没关系|这个话题.{0,4}(不|别)|免谈|打住|我不想听|你停一下|i (?:won't|will not|don't|do not) discuss|not (?:comfortable|acceptable)|please stop|(?:cross|respect).{0,12}boundar|i (?:don't|do not) accept|personal attacks|leave it (?:there|at that)|i (?:won't|will not|am not) lend/i.test(
      t,
    );
  if (r.boundary) r.selfVerify = false;
  // 被带节奏：没招式、没提问、没亮边界、顺着对方话头走了较长内容
  r.led = !r.tactics.length && !hasQ && r.len >= 12 && !r.boundary;
  // 上头
  r.mad =
    (t.match(/[!！]/g) || []).length >= 2 ||
    INSULTS.some((w) => t.includes(w)) ||
    /\b(?:idiot|stupid|moron|shut up|fuck you)\b/i.test(t);
  // 道歉
  r.apolo = /对不起|抱歉|不好意思|\b(?:sorry|apologize|apologise)\b/i.test(t);

  // 计分
  let q = 5,
    l = 3,
    b = 4; // 气势 逻辑 边界感
  let dP = 0; // 对方气焰变化
  r.tactics.forEach(() => {
    l = clamp(l + 3, 0, 10);
    q = clamp(q + 1, 0, 10);
    dP -= 1.5;
  });
  if (
    hasQ &&
    (r.tactics.includes("②问题反弹") || r.tactics.includes("③装傻追问"))
  ) {
    q = clamp(q + 2, 0, 10);
    dP -= 0.5;
  }
  if (r.youN > r.woN) {
    b = clamp(b + 2, 0, 10);
    dP -= 0.5;
  }
  if (r.youN === 0 && r.woN === 0 && r.len <= 30) {
    b = clamp(b + 1, 0, 10);
  }
  if (r.boundary) {
    b = clamp(b + 3, 0, 10);
    q = clamp(q + 1, 0, 10);
    dP -= 1.5;
  }
  if (r.selfVerify) {
    q = clamp(q - 2, 0, 10);
    b = clamp(b - 3, 0, 10);
    l = clamp(l - 2, 0, 10);
    dP += 2;
  }
  if (r.led) {
    q = clamp(q - 1, 0, 10);
    l = clamp(l - 1, 0, 10);
    dP += 1;
  }
  if (r.mad) {
    q = 3;
    l = clamp(l - 2, 0, 10);
    dP += 2.5;
  }
  if (r.apolo) {
    q = clamp(q - 2, 0, 10);
    b = clamp(b - 2, 0, 10);
    dP += 1.5;
  }
  if (r.len <= 20 && r.len >= 4 && !r.selfVerify && !r.mad) {
    q = clamp(q + 1, 0, 10);
  }
  r.score = { q, l, b };
  r.dP = dP;

  // Technique identifiers stay language-independent; only their labels change.
  const names = {
    "③装傻追问": "clarifyTag",
    "④重定义概念": "reframeTag",
    "②问题反弹": "reflectTag",
    "①只说你不说我": "evidenceTag",
  };
  r.tactics.forEach((x) => r.tags.push({ cls: "ok", key: names[x] }));
  if (r.boundary) r.tags.push({ cls: "ok", key: "boundaryTag" });
  if (r.selfVerify) r.tags.push({ cls: "warn", key: "defendTag" });
  if (r.led) r.tags.push({ cls: "warn", key: "ledTag" });
  if (r.mad) r.tags.push({ cls: "bad", key: "madTag" });
  if (r.apolo) r.tags.push({ cls: "warn", key: "apologyTag" });
  if (!r.tags.length) r.tags.push({ cls: "warn", key: "neutralTag" });
  return r;
}

/* ---------- 战斗 ---------- */
let battle = null;
function pick(pool, used) {
  const avail = pool.map((_, i) => i).filter((i) => !used.has(i));
  const idx = avail.length
    ? avail[Math.floor(Math.random() * avail.length)]
    : Math.floor(Math.random() * pool.length);
  used.add(idx);
  return pool[idx];
}

function startBattle() {
  if (
    battle &&
    !battle.over &&
    battle.turn &&
    !confirm(
      language === "en"
        ? "Start over? The current session will be replaced."
        : "重新开始？当前未结束的练习将被替换。",
    )
  )
    return;
  if (battle && battle.request) battle.request.abort();
  if (battle && battle.reviewRequest) battle.reviewRequest.abort();
  const scene = SCENES.find((s) => s.id === selScene);
  const diff = DIFFS[selDiff];
  const boundary = document.getElementById("boundary-input").value.trim();
  battle = {
    scene,
    diff,
    maxRounds: diff.rounds,
    pressure: diff.pressure,
    turn: 0,
    used: {
      open: new Set(),
      attack: new Set(),
      press: new Set(),
      wobble: new Set(),
      mad: new Set(),
      collapse: new Set(),
      fallback: new Set(),
    },
    msgs: [],
    scores: [],
    stats: {
      selfVerify: 0,
      led: 0,
      mad: 0,
      apolo: 0,
      tacticCount: 0,
      boundary: 0,
    },
    bestLine: null,
    bestScore: -1,
    over: false,
    boundaryFirst: !!boundary,
    chatLog: [],
    llmMsgs: null,
    busy: false,
    request: null,
    language,
    difficulty: selDiff,
  };
  setBusy(false);
  document.getElementById("reply-input").value = "";
  document.getElementById("b-av").textContent = scene.em;
  document.getElementById("b-nm").textContent = scene.name;
  document.getElementById("b-tp").textContent =
    scene.type + " · " + scene.intro;
  updateHUD();
  const chat = document.getElementById("chat");
  chat.innerHTML = "";
  addMsg("sys", scene.soft);
  const openingLine = pick(scene.open, battle.used.open);
  addMsg("op", openingLine);
  if (hasLLM()) {
    battle.llmMsgs = [
      { role: "system", content: buildOpponentSystem(false, null) },
      { role: "assistant", content: openingLine },
    ];
    addMsg("sys", t("aiEnabled", { model: getSettings().model }));
  }
  go("battle");
  if (boundary) {
    addMsg("sys", t("openingBoundary"));
    handleUserTurn(boundary, true);
  }
  if (matchMedia("(min-width: 601px)").matches)
    document.getElementById("reply-input").focus({ preventScroll: true });
}

function updateHUD() {
  const p = Math.round(battle.pressure);
  document.getElementById("pressure-bar").style.width =
    battle.pressure * 10 + "%";
  document.getElementById("pressure-txt").textContent = p + " / 10";
  document.getElementById("b-round").textContent = t("round", {
    n: Math.min(battle.turn + 1, battle.maxRounds),
    max: battle.maxRounds,
  });
  document.querySelector(".pressure").setAttribute("aria-valuenow", p);
}

function addMsg(who, text, tags) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  if (who === "sys") {
    div.className = "sysline";
    div.textContent = text;
  } else if (who === "op") {
    div.className = "msg op";
    div.innerHTML = `<div class="face">${battle ? battle.scene.em : "😠"}</div><div class="body"><div class="bubble"></div></div>`;
    div.querySelector(".bubble").textContent = text;
  } else {
    div.className = "msg me";
    const tagsHtml =
      tags && tags.length
        ? `<div class="tags">${tags.map((x) => `<span class="tag ${x.cls}" ${x.key ? 'data-tag="' + x.key + '"' : ""}>${escapeHtml(x.key ? t(x.key) : x.txt)}</span>`).join("")}</div>`
        : "";
    div.innerHTML = `<div class="face">${t("you")}</div><div class="body"><div class="bubble"></div>${tagsHtml}</div>`;
    div.querySelector(".bubble").textContent = text;
  }
  chat.appendChild(div);
  if (battle && battle.chatLog && (who === "op" || who === "me"))
    battle.chatLog.push({ who, text });
  if (document.getElementById("view-battle").classList.contains("active")) {
    chat.scrollIntoView({ block: "end", behavior: "smooth" });
    window.scrollTo(0, document.body.scrollHeight);
  }
}

/* ---- 忙碌状态（LLM 请求中禁发 + 输入中提示） ---- */
function setBusy(b) {
  battle.busy = b;
  const btn = document.getElementById("btn-send");
  btn.disabled = b;
  btn.textContent = b ? "…" : "↑";
  btn.setAttribute("aria-label", t("send"));
  btn.setAttribute("aria-busy", b);
  document.getElementById("btn-local-opponent").hidden = !b;
  const chat = document.getElementById("chat");
  const old = document.getElementById("typing-row");
  if (old) old.remove();
  if (b) {
    const tp = document.createElement("div");
    tp.id = "typing-row";
    tp.className = "msg op";
    tp.innerHTML = `<div class="face">${battle.scene.em}</div><div class="body"><div class="bubble" style="color:var(--ink2)">${t("typing")}</div></div>`;
    chat.appendChild(tp);
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function useLocalOpponent() {
  if (!battle || !battle.llmMsgs) return;
  battle.llmMsgs = null;
  if (battle.request) battle.request.abort();
}
document.getElementById("btn-local-opponent").onclick = useLocalOpponent;

/* ---- LLM 对手 prompt ---- */
function buildOpponentSystem(collapse, ev) {
  const sc = battle.scene;
  let react = "";
  if (ev) {
    const parts = [];
    if (ev.tactics && ev.tactics.length)
      parts.push("对方刚使出了" + ev.tactics.join("、") + "，招式凌厉");
    if (ev.boundary) parts.push("对方刚亮明了边界");
    if (ev.selfVerify) parts.push("对方刚才在自证辩解");
    if (ev.led) parts.push("对方刚才被你带节奏了");
    if (ev.mad) parts.push("对方刚才情绪上头骂人了");
    if (ev.apolo) parts.push("对方刚才在道歉");
    react = parts.length
      ? "系统判定：" + parts.join("；") + "。"
      : "系统判定：对方这轮平淡接招，没出招。";
  }
  const p = battle.pressure.toFixed(1);
  return `你在「吵架练习器」应用中扮演吵架对手，陪用户实战练习吵架。用户知道这是练习，你只管把架吵真、吵活。

# 角色设定
- 场景：${sc.name}（${sc.type}）
- 背景：${sc.intro}
- 你的软肋：${sc.soft}
- 台词风格参考（学习语气，不要照抄）：${sc.attack.join("｜")}

# 当前状态
- 你的气焰值：${p} / 10（10=极其嚣张进逼；≤${battle.diff.retreat}=你已经撑不住了）
${react}

# 表演规则
1. 每轮只说 1~2 句，口语化，贴合人设；只输出台词本身，不要旁白、引号、动作描写、心理活动。
2. 气焰值高（>6）就嚣张进攻；中等（3~6）被对方问住时要动摇、找补、心虚，但还嘴硬；${collapse ? "现在气焰值已跌破阈值：你必须认怂收场——找台阶、转移话题、偃旗息鼓，只说一句认怂台词。" : "系统判定对方招式凌厉时，你要演出被问住、逻辑动摇的样子。"}
3. 对方自证、被你带节奏，你得寸进尺；对方上头骂人，你阴阳怪气拱火，但不跟他对骂脏话。
4. 吵得真实，但不输出歧视性、越界的人身攻击。使用${battle.language === "en" ? "英文" : "中文"}输出。`;
}

async function llmOpponentReply(collapse, ev, currentBattle) {
  currentBattle.llmMsgs[0].content = buildOpponentSystem(collapse, ev);
  const ctrl = new AbortController();
  currentBattle.request = ctrl;
  try {
    const out = await callLLM(
      currentBattle.llmMsgs,
      collapse ? 0.6 : 0.95,
      ctrl.signal,
      400,
    );
    if (out && currentBattle.llmMsgs)
      currentBattle.llmMsgs.push({ role: "assistant", content: out });
    return out;
  } finally {
    if (currentBattle.request === ctrl) currentBattle.request = null;
  }
}

/* ---- 对手回合：LLM 优先，失败/未配置回落本地规则引擎 ---- */
async function opponentTurn(ev) {
  if (battle.over) return;
  const currentBattle = battle;
  const s = battle.scene,
    u = battle.used;
  const useLLM = !!battle.llmMsgs;
  if (battle.pressure <= battle.diff.retreat) {
    let line = pick(s.collapse, u.collapse);
    if (useLLM) {
      setBusy(true);
      try {
        const ll = await llmOpponentReply(true, ev, currentBattle);
        if (ll && currentBattle.llmMsgs) line = ll;
      } catch (e) {
        currentBattle.llmMsgs = null;
      }
      if (battle !== currentBattle || currentBattle.over) return;
      setBusy(false);
    }
    addMsg("op", line);
    addMsg("sys", t("opponentRetreat"));
    finishBattle(true);
    return;
  }
  let line = null;
  if (useLLM) {
    setBusy(true);
    try {
      line = await llmOpponentReply(false, ev, currentBattle);
    } catch (e) {
      if (battle !== currentBattle || currentBattle.over) return;
      const switched = !currentBattle.llmMsgs;
      currentBattle.llmMsgs = null;
      addMsg(
        "sys",
        switched ? t("localSwitched") : t("aiFailed", { error: e.message }),
      );
    }
    if (battle !== currentBattle || currentBattle.over) return;
    if (!currentBattle.llmMsgs) line = null;
    setBusy(false);
  }
  if (line) {
    addMsg("op", line);
  } else {
    if (ev.mad) {
      line = pick(s.mad, u.mad);
    } else if (ev.selfVerify || ev.led) {
      line = pick(s.press, u.press);
      battle.pressure = clamp(battle.pressure + 0.5, 0, 10);
    } else if (ev.tactics.length) {
      line = pick(s.wobble, u.wobble);
    } else {
      line = pick(s.attack, u.attack);
    }
    addMsg("op", line);
  }
  if (battle.turn >= battle.maxRounds) {
    finishBattle(false);
  }
}

function handleUserTurn(text, isBoundary) {
  if (!battle || battle.over || battle.busy) return;
  const ev = analyze(text);
  if (!battle.usedTag) battle.usedTag = new Set();
  ev.tactics.forEach((t) => battle.usedTag.add(t));
  battle.scores.push(ev.score);
  battle.stats.selfVerify += ev.selfVerify ? 1 : 0;
  battle.stats.led += ev.led ? 1 : 0;
  battle.stats.mad += ev.mad ? 1 : 0;
  battle.stats.apolo += ev.apolo ? 1 : 0;
  battle.stats.tacticCount += ev.tactics.length;
  battle.stats.boundary += ev.boundary || isBoundary ? 1 : 0;
  if (isBoundary) ev.score.b = clamp(ev.score.b + 2, 0, 10);
  const comp = ev.score.q + ev.score.l + ev.score.b;
  if (comp > battle.bestScore) {
    battle.bestScore = comp;
    battle.bestLine = text;
  }
  battle.pressure = clamp(battle.pressure + ev.dP, 0, 10);
  if (battle.llmMsgs) battle.llmMsgs.push({ role: "user", content: text });
  addMsg("me", text, ev.tags);
  battle.turn++;
  updateHUD();
  opponentTurn(ev);
}

document.getElementById("btn-send").onclick = () => {
  if (battle && battle.busy) return;
  const inp = document.getElementById("reply-input");
  const text = inp.value.trim();
  if (!text) return;
  inp.value = "";
  handleUserTurn(text, false);
};
document.getElementById("reply-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
    e.preventDefault();
    document.getElementById("btn-send").click();
  }
});
document.getElementById("btn-end").onclick = () => finishBattle(false);
document.getElementById("btn-start").onclick = startBattle;

function finishBattle(wonEarly) {
  if (!battle || battle.over) return;
  battle.over = true;
  if (battle.request) battle.request.abort();
  setBusy(false);
  const n = battle.scores.length;
  const avg = n
    ? {
        q: Math.round(battle.scores.reduce((a, s) => a + s.q, 0) / n),
        l: Math.round(battle.scores.reduce((a, s) => a + s.l, 0) / n),
        b: Math.round(battle.scores.reduce((a, s) => a + s.b, 0) / n),
      }
    : { q: 3, l: 3, b: 3 };
  const p = battle.pressure;
  let result;
  if (p <= battle.diff.retreat)
    result = {
      em: "🏆",
      tt: "完胜！",
      sub: "对方偃旗息鼓，你吵出了高度、吵出了水平。",
      tone: "good",
    };
  else if (p <= 5)
    result = {
      em: "✊",
      tt: "小胜！",
      sub: "边界守住了，主动权大部分在你手里。",
      tone: "good",
    };
  else if (p <= 7)
    result = {
      em: "🤝",
      tt: "平局",
      sub: "不了了之，但你没有丢掉气势。",
      tone: "mid",
    };
  else
    result = {
      em: "💪",
      tt: "这局没守住",
      sub: "没关系——复盘的价值正在于此，看看下面哪些自证标签。",
      tone: "bad",
    };
  const total = n;
  const rec = {
    date: new Date().toLocaleString("zh-CN"),
    timestamp: Date.now(),
    sceneId: battle.scene.id,
    difficulty: battle.difficulty,
    resultCode:
      result.tone === "good"
        ? p <= battle.diff.retreat
          ? "win"
          : "smallWin"
        : result.tone === "mid"
          ? "draw"
          : "loss",
    scene: battle.scene.name,
    em: battle.scene.em,
    diff: battle.diff.name,
    result: result.tt,
    scores: avg,
    rounds: total,
    stats: { ...battle.stats },
    bestLine: battle.bestLine,
    pressure: Math.round(p),
  };
  const d = loadData();
  d.history = d.history || [];
  d.history.unshift(rec);
  saveData(d);
  battle.report = { result, avg, rec };
  renderReport(result, avg, rec);
  if (document.getElementById("view-battle").classList.contains("active"))
    go("report");
}

/* ---------- 复盘 ---------- */
function resultText(rec) {
  const code =
    rec.resultCode ||
    { "完胜！": "win", "小胜！": "smallWin", 平局: "draw", 这局没守住: "loss" }[
      rec.result
    ] ||
    "draw";
  const suffix = {
    win: "Win",
    smallWin: "SmallWin",
    draw: "Draw",
    loss: "Loss",
  }[code];
  return {
    title: t("result" + suffix),
    sub: t("result" + suffix + "Sub"),
    won: ["win", "smallWin"].includes(code),
  };
}
function renderReport(result, avg, rec) {
  const s = battle.stats,
    summary = resultText(rec);
  const scene = SCENES.find((x) => x.id === rec.sceneId) || battle.scene;
  const diff = DIFFS[rec.difficulty ?? battle.difficulty];
  const dims = [
    ["confidence", avg.q],
    ["logic", avg.l],
    ["boundaries", avg.b],
  ];
  const lowest = dims.slice().sort((a, b) => a[1] - b[1])[0];
  const advice = [];
  if (lowest[1] < 7)
    advice.push(
      t(
        {
          confidence: "tipConfidence",
          logic: "tipLogic",
          boundaries: "tipBoundary",
        }[lowest[0]],
      ),
    );
  if (s.selfVerify >= 2) advice.push(t("tipDefense", { n: s.selfVerify }));
  if (s.mad) advice.push(t("tipMad"));
  if (s.led >= 2) advice.push(t("tipLed"));
  if (!advice.length) advice.push(t("tipStable"));
  const ids = ["①只说你不说我", "②问题反弹", "③装傻追问", "④重定义概念"];
  document.getElementById("view-report").innerHTML = `
    <div class="page-eyebrow">${t("reportEyebrow")}</div><h1 class="page-title">${t("reportTitle")}</h1><p class="rule-label">${t("ruleScores")}</p>
    <div class="report-grid"><div><div class="card"><div class="result-badge"><div class="em">${result.em}</div><div class="tt" style="color:var(--red-deep)">${summary.title}</div><p class="sub">${summary.sub}</p><p class="sub">${escapeHtml(t("summaryLine", { scene: scene.name, diff: diff.name, rounds: rec.rounds, pressure: rec.pressure }))}</p></div>
    <div class="stat-row">${[
      ["selfDefense", s.selfVerify],
      ["beingLed", s.led],
      ["escalation", s.mad],
      ["techniques", s.tacticCount],
    ]
      .map(([key, n]) => `<div class="stat-chip"><b>${n}</b>${t(key)}</div>`)
      .join("")}</div>
    <ul class="dim-list">${dims.map(([key, n]) => `<li><span class="lb">${t(key)}</span><div class="bar"><i style="width:${n * 10}%"></i></div><span class="sc">${n}/10</span></li>`).join("")}</ul><div style="display:grid;place-items:center">${radarSvg(avg)}</div></div>
    <div class="card"><h2 class="sec">${t("principleCheck")}</h2><div class="tactic-check">${METHODS.map(
      (m, i) => {
        const used = i === 4 ? s.boundary > 0 : battle.usedTag?.has(ids[i]);
        return `<div class="tc ${used ? "on" : ""}">${used ? "✓" : "○"} ${m.name}</div>`;
      },
    ).join("")}</div></div></div>
    <div><div class="card"><h2 class="sec">${t("bestLine")}</h2>${battle.bestLine ? `<div class="quote">${escapeHtml(battle.bestLine)}</div><p class="hint">${t("saveLineHint")}</p>` : `<p class="hint">${t("noLine")}</p>`}</div><div class="card"><h2 class="sec">${t("coachNotes")}</h2>${advice.map((x) => `<p class="sug">${escapeHtml(x)}</p>`).join("")}</div><div id="llm-review-box"></div></div></div>
    <div class="report-actions"><button class="btn" onclick="go('setup')">${t("playAgain")} →</button><button class="btn ghost" onclick="go('history')">${t("viewHistory")}</button></div>`;
  maybeLLMReview(rec);
}
function roleAdvice(role) {
  if (/新人|实习|应届|new|intern/i.test(role)) return t("roleAdviceNew");
  if (/妈|母|家|parent|mother|father/i.test(role)) return t("roleAdviceParent");
  if (/学生|student/i.test(role)) return t("roleAdviceStudent");
  return t("roleAdviceGeneral");
}
function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function radarSvg(avg) {
  const cx = 110,
    cy = 95,
    R = 62;
  const pts = [
    [cx, cy - R * (avg.q / 10)],
    [cx + R * 0.87 * (avg.l / 10), cy + R * 0.5 * (avg.l / 10)],
    [cx - R * 0.87 * (avg.b / 10), cy + R * 0.5 * (avg.b / 10)],
  ];
  const grid = [0.33, 0.66, 1]
    .map((k) => {
      const p = [
        [cx, cy - R * k],
        [cx + R * 0.87 * k, cy + R * 0.5 * k],
        [cx - R * 0.87 * k, cy + R * 0.5 * k],
      ];
      return `<polygon points="${p.map((x) => x.join(",")).join(" ")}" fill="none" class="radar-grid" stroke="var(--grid)" stroke-width="1"/>`;
    })
    .join("");
  return `<svg width="220" height="190" viewBox="0 0 220 190">
    ${grid}
    <polygon points="${pts.map((x) => x.join(",")).join(" ")}" fill="var(--accent-soft)" stroke="var(--red)" stroke-width="2"/>
    ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--red)"/>`).join("")}
    <text x="${cx}" y="${cy - R - 8}" text-anchor="middle" font-size="11" fill="var(--ink2)">${t("confidence")} ${avg.q}</text>
    <text x="${cx + R * 0.95}" y="${cy + R * 0.62}" text-anchor="middle" font-size="11" fill="var(--ink2)">${t("logic")} ${avg.l}</text>
    <text x="${cx - R * 0.95}" y="${cy + R * 0.62}" text-anchor="middle" font-size="11" fill="var(--ink2)">${t("boundaries")} ${avg.b}</text>
  </svg>`;
}

/* ---------- 战绩页 ---------- */
function historyScene(h) {
  return (
    SCENES.find(
      (s) =>
        s.id === h.sceneId ||
        BASE_SCENES.find((x) => x.id === s.id)?.name === h.scene ||
        EN_SCENES.find((x) => x.id === s.id)?.name === h.scene,
    )?.name || h.scene
  );
}
function historyDiff(h) {
  return (
    DIFFS[h.difficulty ?? BASE_DIFFS.findIndex((d) => d.name === h.diff)]
      ?.name || h.diff
  );
}
function renderHistory() {
  const hist = getHistory(),
    sum = document.getElementById("hist-summary"),
    list = document.getElementById("hist-list");
  if (!hist.length) {
    sum.innerHTML = "";
    list.innerHTML = `<div class="empty"><div class="empty-symbol">↗</div><h2>${t("emptyHistoryTitle")}</h2><p>${t("emptyHistory")}</p><button class="btn" onclick="go('setup')">${t("beginPractice")} →</button></div>`;
    return;
  }
  const n = hist.length;
  const avg = {
    q: Math.round(hist.reduce((a, h) => a + h.scores.q, 0) / n),
    l: Math.round(hist.reduce((a, h) => a + h.scores.l, 0) / n),
    b: Math.round(hist.reduce((a, h) => a + h.scores.b, 0) / n),
  };
  sum.innerHTML = `<div class="card"><div class="stat-row">${[
    ["historySessions", n],
    ["historyWins", hist.filter((h) => resultText(h).won).length],
    ["historyDefense", hist.reduce((a, h) => a + h.stats.selfVerify, 0)],
  ]
    .map(
      ([key, value]) => `<div class="stat-chip"><b>${value}</b>${t(key)}</div>`,
    )
    .join(
      "",
    )}</div><div style="display:grid;place-items:center">${radarSvg(avg)}</div>${trendSvg(hist)}<p class="hint centered">${t("recentTrend", { n: Math.min(n, 12) })}</p><button class="btn ghost sm" onclick="clearHistory()">${t("clearHistory")}</button></div>`;
  list.innerHTML =
    '<h2 class="sec">' +
    t("recordsTitle") +
    "</h2>" +
    hist
      .map(
        (h) =>
          `<article class="card hist-item"><div class="h1"><span>${escapeHtml(historyScene(h))} <small style="font-weight:400;color:var(--ink2)">${escapeHtml(historyDiff(h))}</small></span><span style="color:var(--red-deep)">${resultText(h).title}</span></div><div class="h2">${escapeHtml(t("historyDetails", { date: h.timestamp ? new Date(h.timestamp).toLocaleString(language === "en" ? "en-US" : "zh-CN") : h.date, rounds: h.rounds, q: h.scores.q, l: h.scores.l, b: h.scores.b }))}</div>${h.bestLine ? `<div class="h2">“${escapeHtml(h.bestLine.slice(0, 100))}${h.bestLine.length > 100 ? "…" : ""}”</div>` : ""}</article>`,
      )
      .join("");
}

function trendSvg(hist) {
  const arr = hist.slice(0, 12).reverse();
  if (arr.length < 2)
    return `<div class="hint centered">${t("moreForTrend")}</div>`;
  const W = 280,
    H = 70,
    pad = 10;
  const vals = arr.map((h) => h.scores.q + h.scores.l + h.scores.b);
  const maxV = Math.max(...vals, 10),
    minV = Math.min(...vals, 0);
  const pts = vals.map((v, i) => [
    pad + ((W - 2 * pad) * i) / (vals.length - 1),
    H - pad - ((H - 2 * pad) * (v - minV)) / (maxV - minV || 1),
  ]);
  return `<svg width="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="max-height:80px;">
    <polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="var(--red)" stroke-width="2"/>
    ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="var(--red)"/>`).join("")}
  </svg>`;
}
function clearHistory() {
  if (!confirm(t("clearConfirm"))) return;
  const d = loadData();
  d.history = [];
  saveData(d);
  renderHistory();
}

/* ---------- 我的档案 ---------- */
function profileFromForm() {
  return {
    weak: [...document.querySelectorAll("#weak-list input:checked")].map(
      (x) => x.value,
    ),
    scene: document.getElementById("profile-scene").value,
    role: document.getElementById("profile-role").value.trim(),
  };
}
function renderMe(draft) {
  const p = draft || getProfile() || { weak: [], scene: "", role: "" };
  document.getElementById("weak-list").innerHTML = WEAKNESSES.map(
    (w) =>
      `<label><input type="checkbox" value="${w.id}" ${p.weak.includes(w.id) ? "checked" : ""}><span>${w.label}</span></label>`,
  ).join("");
  document.getElementById("profile-scene").innerHTML =
    `<option value="">${t("unspecified")}</option>` +
    SCENES.map(
      (s) =>
        `<option value="${s.id}" ${p.scene === s.id ? "selected" : ""}>${s.name}</option>`,
    ).join("");
  document.getElementById("profile-role").value = p.role || "";
  document.getElementById("strategy-box").innerHTML = strategyHtml(
    getProfile() || { weak: [] },
  );
}
document.getElementById("btn-save-profile").onclick = () => {
  const p = profileFromForm(),
    d = loadData();
  d.profile = p;
  saveData(d);
  document.getElementById("strategy-box").innerHTML = strategyHtml(p);
  document.getElementById("profile-feedback").textContent = t("profileSaved");
  showToast(t("profileSaved"));
};
function strategyHtml(p) {
  if (!p.weak?.length)
    return (
      '<div class="empty"><div class="empty-symbol">✦</div><p>' +
      t("noWeak") +
      "</p></div>"
    );
  const counts = {};
  p.weak.forEach((id) => {
    const main = WEAK_STRATEGY[id].main;
    counts[main] = (counts[main] || 0) + 1;
  });
  const m =
    METHODS[Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]];
  let html = `<h2 class="sec">${t("strategyTitle")}</h2><div class="strategy-card"><h4>${t("mainMethod", { name: m.name })}</h4><p>${m.essence}</p><p>${m.good}</p><div class="st">${t("weaknessAdvice")}</div><ul>`;
  p.weak.forEach((id) => {
    const w = WEAKNESSES.find((x) => x.id === id);
    html += `<li><b>${w.label}</b><br>${WEAK_STRATEGY[id].text.join("<br>")}</li>`;
  });
  html += "</ul>";
  if (p.scene) {
    const s = SCENES.find((x) => x.id === p.scene);
    if (s)
      html += `<div class="st">${t("scenePhrases", { name: s.name })}</div><ul>${SCENE_TACTICS[s.id].map((line) => "<li>" + line + "</li>").join("")}</ul>`;
  }
  if (p.role)
    html += `<div class="st">${t("roleAdviceTitle")}</div><p>${escapeHtml(p.role)}: ${roleAdvice(p.role)}</p>`;
  return html + "</div>";
}

/* ---------- AI 深度复盘（配置了 API Key 时启用，失败回落规则点评） ---------- */
async function maybeLLMReview(rec) {
  const box = document.getElementById("llm-review-box");
  if (!box || !hasLLM() || !battle?.chatLog?.length) return;
  const snapshot = battle;
  // A language switch may redraw this review; reuse completed results and guard stale writes.
  if (snapshot.review?.language === language && snapshot.review.text) {
    box.innerHTML = reviewHtml(snapshot.review.text);
    return;
  }
  if (snapshot.reviewRequest) snapshot.reviewRequest.abort();
  const ctrl = new AbortController();
  snapshot.reviewRequest = ctrl;
  box.innerHTML = `<div class="card"><h2 class="sec">${t("aiReview")}</h2><p class="hint">${t("aiReviewBusy")}</p></div>`;
  const reviewLanguage = language;
  try {
    const transcript = snapshot.chatLog
      .map((m) => (m.who === "op" ? "Opponent: " : "Learner: ") + m.text)
      .join("\n");
    const sys =
      "You are a communication coach. Focus on clarity, facts, calm responses and healthy boundaries. Do not encourage hostility. Reply in " +
      (reviewLanguage === "en" ? "English" : "Simplified Chinese") +
      ".";
    const prompt =
      "Review this practice session. Scores from a local rule engine: " +
      JSON.stringify(rec.scores) +
      ". Give one thing that worked, one improvement with a sample response, and a small next step. Use plain language, about 150 words or 200 Chinese characters, without Markdown. Transcript:\n" +
      transcript;
    const out = await callLLM(
      [
        { role: "system", content: sys },
        { role: "user", content: prompt },
      ],
      0.7,
      ctrl.signal,
      1000,
    );
    snapshot.review = { language: reviewLanguage, text: out };
    if (box.isConnected && battle === snapshot && language === reviewLanguage)
      box.innerHTML = reviewHtml(out);
  } catch (e) {
    if (!ctrl.signal.aborted && box.isConnected && battle === snapshot)
      box.innerHTML = `<div class="card"><h2 class="sec">${t("aiReview")}</h2><p class="hint">${escapeHtml(t("aiReviewFailed", { error: e.message }))}</p></div>`;
  } finally {
    if (snapshot.reviewRequest === ctrl) snapshot.reviewRequest = null;
  }
}
function reviewHtml(text) {
  return `<div class="card"><h2 class="sec">${t("aiReview")}</h2><p style="white-space:pre-wrap;font-size:12px;line-height:1.9">${escapeHtml(text)}</p></div>`;
}

/* ---------- 设置页 ---------- */
let selFmt = "openai";
let connectionFeedback = null;
function connectionMessage(key, values = {}, suffixKey = "") {
  connectionFeedback = { key, values, suffixKey };
  document.getElementById("test-result").textContent =
    t(key, values) + (suffixKey ? " " + t(suffixKey) : "");
}
function updateFmtUI() {
  document.querySelectorAll("#fmt-seg button").forEach((b) => {
    b.classList.toggle("sel", b.dataset.f === selFmt);
    b.setAttribute("aria-pressed", b.dataset.f === selFmt);
  });
  const anthropic = selFmt === "anthropic";
  document.getElementById("set-baseurl").placeholder = anthropic
    ? "https://api.anthropic.com"
    : "https://api.deepseek.com";
  document.getElementById("set-model").placeholder = anthropic
    ? "claude-sonnet-4-5"
    : "deepseek-chat";
  document.getElementById("baseurl-hint").textContent = t(
    anthropic ? "baseAnthropic" : "baseOpenAI",
  );
}
function renderSettings(draft) {
  const s = draft || getSettings();
  selFmt = s.apiFormat || "openai";
  updateFmtUI();
  document.getElementById("storage-warn").hidden = storageOK;
  document.getElementById("set-baseurl").value = s.baseUrl || "";
  document.getElementById("set-apikey").value = s.apiKey || "";
  document.getElementById("set-model").value = s.model || "";
  document.getElementById("set-apikey").type = "password";
  document.getElementById("btn-show-key").textContent = t("showKey");
  renderConnectionStatus();
  const chips = document.getElementById("preset-chips");
  const names = {
    "智谱 GLM": "Zhipu GLM",
    月之暗面: "Moonshot",
    "Gemini(兼容端点)": "Gemini",
    硅基流动: "SiliconFlow",
    "本地 Ollama": "Local Ollama",
  };
  chips.innerHTML = PRESETS.map(
    (p, i) =>
      `<button type="button" data-i="${i}">${language === "en" ? names[p.name] || p.name : p.name}</button>`,
  ).join("");
  chips.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        const p = PRESETS[+b.dataset.i];
        selFmt = p.fmt;
        updateFmtUI();
        document.getElementById("set-baseurl").value = p.baseUrl;
        document.getElementById("set-model").value = p.model;
      }),
  );
  document.getElementById("pref-language").value = language;
  document.getElementById("pref-theme").value = themePreference;
}
function renderConnectionStatus() {
  document.getElementById("llm-status").innerHTML =
    `<span class="tag ${hasLLM() ? "ok" : "warn"}">${escapeHtml(hasLLM() ? t("aiConfigured", { model: getSettings().model }) : t("localStatus"))}</span>`;
}
function captureSettingsForm() {
  return {
    apiFormat: selFmt,
    baseUrl: document
      .getElementById("set-baseurl")
      .value.trim()
      .replace(/\/+$/, ""),
    apiKey: document.getElementById("set-apikey").value.trim(),
    model: document.getElementById("set-model").value.trim(),
  };
}
function saveSettingsFromForm() {
  const s = captureSettingsForm();
  if (s.baseUrl) {
    let url;
    try {
      url = new URL(s.baseUrl);
    } catch (_) {
      throw new Error(t("invalidURL"));
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      throw new Error(t("invalidURL"));
  }
  const d = loadData();
  d.settings = s;
  saveData(d);
  renderConnectionStatus();
  document.getElementById("storage-warn").hidden = storageOK;
  return s;
}
document.querySelectorAll("#fmt-seg button").forEach(
  (b) =>
    (b.onclick = () => {
      selFmt = b.dataset.f;
      updateFmtUI();
    }),
);
document.getElementById("btn-show-key").onclick = () => {
  const input = document.getElementById("set-apikey");
  input.type = input.type === "password" ? "text" : "password";
  document.getElementById("btn-show-key").textContent = t(
    input.type === "password" ? "showKey" : "hideKey",
  );
};
document.getElementById("btn-save-settings").onclick = () => {
  const result = document.getElementById("test-result");
  try {
    const s = saveSettingsFromForm(),
      back = getSettings();
    const verified = ["baseUrl", "apiKey", "model", "apiFormat"].every(
      (key) => s[key] === back[key],
    );
    connectionMessage(
      !verified ? "saveError" : hasLLM() ? "saveSuccess" : "saveIncomplete",
      {},
      !storageOK ? "memoryOnly" : "",
    );
    if (verified) showToast(t("saved"));
  } catch (e) {
    connectionMessage("invalidURL");
  }
};
let connectionTest = null;
document.getElementById("btn-test-settings").onclick = async () => {
  const result = document.getElementById("test-result"),
    btn = document.getElementById("btn-test-settings");
  let s;
  try {
    s = saveSettingsFromForm();
  } catch (e) {
    connectionMessage("invalidURL");
    return;
  }
  if (!(s.baseUrl && s.apiKey && s.model)) {
    connectionMessage("incomplete");
    return;
  }
  const ctrl = new AbortController();
  connectionTest = ctrl;
  btn.disabled = true;
  connectionMessage("connecting");
  try {
    const out = await callLLM(
      [{ role: "user", content: "Reply only with: Connection successful" }],
      0,
      ctrl.signal,
      50,
    );
    connectionMessage("connected", { reply: out.slice(0, 60) });
  } catch (e) {
    connectionMessage(
      "connectFailed",
      { error: e.message },
      /fetch|CORS|NetworkError/i.test(e.message) ? "corsHint" : "",
    );
  } finally {
    if (connectionTest === ctrl) connectionTest = null;
    btn.disabled = false;
  }
};

/* ---------- Preferences and initialization ---------- */
let toastTimer;
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
function showToast(message) {
  const box = document.getElementById("toast");
  box.textContent = message;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (box.hidden = true), 2500);
}
function savePreferences() {
  const data = loadData();
  data.preferences = { language, theme: themePreference };
  saveData(data);
  document.getElementById("storage-warn").hidden = storageOK;
}
function applyTheme() {
  const resolved =
    themePreference === "system"
      ? systemTheme.matches
        ? "dark"
        : "light"
      : themePreference;
  document.documentElement.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]').content =
    resolved === "dark" ? "#151620" : "#f7f8fc";
  const next = resolved === "dark" ? "light" : "dark";
  const button = document.getElementById("btn-theme");
  button.setAttribute(
    "aria-label",
    t("switchTheme", {
      theme: t(next === "dark" ? "themeDark" : "themeLight"),
    }),
  );
  button.title = button.getAttribute("aria-label");
  document.getElementById("theme-icon").innerHTML =
    resolved === "dark"
      ? '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
      : '<path d="M20 14.3A8 8 0 0 1 9.7 4a8 8 0 1 0 10.3 10.3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';
  document.getElementById("pref-theme").value = themePreference;
}
function applyLanguage() {
  METHODS = language === "en" ? EN_METHODS : BASE_METHODS;
  SCENES = language === "en" ? EN_SCENES : BASE_SCENES;
  WEAKNESSES = language === "en" ? EN_WEAKNESSES : BASE_WEAKNESSES;
  WEAK_STRATEGY = language === "en" ? EN_WEAK_STRATEGY : BASE_WEAK_STRATEGY;
  SCENE_TACTICS = language === "en" ? EN_SCENE_TACTICS : BASE_SCENE_TACTICS;
  DIFFS = BASE_DIFFS.map((diff, i) => ({
    ...diff,
    name: t(["easy", "normal", "hard"][i]),
  }));
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title =
    language === "en"
      ? "Boundary Lab · Practice calmer conversations"
      : "吵架练习器 · 从容表达，守住边界";
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
  document
    .querySelectorAll("[data-placeholder]")
    .forEach((el) => (el.placeholder = t(el.dataset.placeholder)));
  document.getElementById("main-nav").setAttribute("aria-label", t("navLabel"));
  document
    .querySelector(".pressure")
    .setAttribute("aria-label", t("opponentPressure"));
  document.getElementById("btn-send").setAttribute("aria-label", t("send"));
  document
    .getElementById("btn-language")
    .setAttribute(
      "aria-label",
      language === "en" ? "切换为中文" : "Switch to English",
    );
  document.getElementById("language-label").textContent =
    language === "en" ? "中文" : "EN";
  document.getElementById("pref-language").value = language;
  document
    .querySelectorAll("[data-tag]")
    .forEach((el) => (el.textContent = t(el.dataset.tag)));
  if (connectionFeedback)
    connectionMessage(
      connectionFeedback.key,
      connectionFeedback.values,
      connectionFeedback.suffixKey,
    );
  if (document.getElementById("profile-feedback").textContent)
    document.getElementById("profile-feedback").textContent = t("profileSaved");
  if (document.getElementById("typing-row"))
    document.querySelector("#typing-row .bubble").textContent = t("typing");
  renderMethods();
  renderHomeStats();
  renderSetup();
  applyTheme();
  if (battle) {
    battle.scene = SCENES.find((s) => s.id === battle.scene.id);
    battle.language = language;
    document.getElementById("b-nm").textContent = battle.scene.name;
    document.getElementById("b-tp").textContent =
      battle.scene.type + " · " + battle.scene.intro;
    updateHUD();
  }
}
function changeLanguage(next) {
  const current = document.querySelector(".view.active").id;
  const settingsDraft =
    current === "view-settings" ? captureSettingsForm() : null;
  const profileDraft = current === "view-me" ? profileFromForm() : null;
  language = next === "en" ? "en" : "zh";
  applyLanguage();
  savePreferences();
  if (settingsDraft) renderSettings(settingsDraft);
  if (profileDraft) renderMe(profileDraft);
  if (current === "view-history") renderHistory();
  if (current === "view-report" && battle?.report)
    renderReport(battle.report.result, battle.report.avg, battle.report.rec);
  showToast(t("languageChanged"));
}
function initializeUi() {
  const prefs = loadData().preferences || {};
  language = prefs.language === "en" ? "en" : "zh";
  themePreference = ["system", "light", "dark"].includes(prefs.theme)
    ? prefs.theme
    : "system";
  applyLanguage();
  renderMe();
  renderSettings();
  document.getElementById("btn-language").onclick = () =>
    changeLanguage(language === "zh" ? "en" : "zh");
  document.getElementById("pref-language").onchange = (e) =>
    changeLanguage(e.target.value);
  document.getElementById("btn-theme").onclick = () => {
    themePreference =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme();
    savePreferences();
  };
  document.getElementById("pref-theme").onchange = (e) => {
    themePreference = e.target.value;
    applyTheme();
    savePreferences();
  };
  systemTheme.addEventListener("change", () => {
    if (themePreference === "system") applyTheme();
  });
  document
    .querySelector('nav button[data-v="home"]')
    .setAttribute("aria-current", "page");
}
initializeUi();
