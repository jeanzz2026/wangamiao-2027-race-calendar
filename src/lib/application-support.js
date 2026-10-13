// Recovered configuration, defaults and helpers. See docs/SOURCE_RECOVERY.md.
export const Jy = "./paw.png",
  Xf = import.meta.env,
  ti = "jeanzz2026",
  li = "wangamiao-2027-race-calendar",
  kn = "main",
  ei = "state.json",
  Rm =
    (Xf == null ? void 0 : Xf.VITE_GARMIN_API_BASE) ||
    "https://garmin-proxy.wangamiao.workers.dev",
  kf = "wamiao_garmin_token",
  ky = {
    running: "路跑",
    trail_running: "越野",
    hiking: "越野",
    cycling: "骑行",
    swimming: "游泳",
    strength_training: "通用",
    fitness_equipment: "通用",
    training: "通用",
    walking: "通用",
  },
  Wy = (y) => ky[y] || "通用";
export let Dc;
export function encodeUtf8Base64(y) {
  const H = new TextEncoder().encode(y);
  let M = "";
  for (const m of H) M += String.fromCharCode(m);
  return btoa(M);
}
export function decodeUtf8Base64(y) {
  const H = atob(y.replace(/\s/g, "")),
    M = new Uint8Array(H.length);
  for (let m = 0; m < H.length; m++) M[m] = H.charCodeAt(m);
  return new TextDecoder().decode(M);
}
export function $y() {
  return [
    `https://api.github.com/repos/${ti}/${li}/contents/${ei}?ref=${kn}`,
    `https://raw.githubusercontent.com/${ti}/${li}/${kn}/${ei}`,
    `https://cdn.jsdelivr.net/gh/${ti}/${li}@${kn}/${ei}`,
  ];
}
export async function Py(y, H = 8e3, M = {}) {
  const m = new AbortController(),
    Q = setTimeout(() => m.abort(), H);
  try {
    return await fetch(y, {
      headers: {
        Accept: "application/json",
        ...M,
      },
      signal: m.signal,
    });
  } finally {
    clearTimeout(Q);
  }
}
export async function loadCloudState(y) {
  const H = y
    ? {
        Authorization: `Bearer ${y}`,
      }
    : {};
  for (const M of $y())
    try {
      const m = await Py(M, 8e3, M.includes("api.github.com") ? H : {});
      if (!m.ok) continue;
      const Q = await m.text();
      let w = Q,
        k;
      if (M.includes("api.github.com")) {
        const q = JSON.parse(Q);
        if (!q.content) continue;
        ((w = decodeUtf8Base64(q.content)), (k = q.sha));
      }
      const W = JSON.parse(w);
      return (
        (Dc = k ?? Dc),
        {
          state: W,
          sha: k,
        }
      );
    } catch {}
  return null;
}
export async function validateGitHubToken(y) {
  const H = `https://api.github.com/repos/${ti}/${li}/contents/${ei}?ref=${kn}`;
  try {
    const M = await fetch(H, {
      headers: {
        Authorization: `Bearer ${y}`,
        Accept: "application/vnd.github+json",
      },
    });
    return M.status === 200 || M.status === 404;
  } catch {
    return !1;
  }
}
export async function saveCloudState(y, H, M = Dc) {
  const m = encodeUtf8Base64(JSON.stringify(y, null, 2)),
    Q = `https://api.github.com/repos/${ti}/${li}/contents/${ei}`,
    w = (k) => {
      const W = {
        message: "Update race plan state (via app)",
        content: m,
        branch: kn,
      };
      return (
        k && (W.sha = k),
        fetch(Q, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${H}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify(W),
        })
      );
    };
  try {
    let k = await w(M);
    if (k.status === 409 && M) {
      const q = await fetch(`${Q}?ref=${kn}`, {
        headers: {
          Authorization: `Bearer ${H}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (q.ok) {
        const T = await q.json();
        T.sha && (k = await w(T.sha));
      }
    }
    if (!k.ok)
      return {
        ok: !1,
        reason:
          k.status === 403
            ? "无写入权限（请确认 PAT 对该仓库 Contents 有 Read and write 权限）"
            : k.status === 401
              ? "token 已失效，请重新连接"
              : `HTTP ${k.status}`,
      };
    const W = await k.json();
    return (
      W.content && W.content.sha && (Dc = W.content.sha),
      {
        ok: !0,
      }
    );
  } catch {
    return {
      ok: !1,
      reason: "网络错误",
    };
  }
}
export const Xm = "wamiao_state_v2",
  wf = "wamiao_gh_token";
export function loadLocalState() {
  try {
    const y = localStorage.getItem(Xm);
    return y ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
export function saveLocalState(y) {
  try {
    return (localStorage.setItem(Xm, JSON.stringify(y)), !0);
  } catch {
    return !1;
  }
}
export function Vf(y) {
  if (typeof y == "string") {
    if (!y.includes("&")) return y;
    const H = document.createElement("textarea");
    return ((H.innerHTML = y), H.value);
  }
  if (Array.isArray(y)) return y.map(Vf);
  if (y && typeof y == "object") {
    const H = {};
    for (const M of Object.keys(y)) H[M] = Vf(y[M]);
    return H;
  }
  return y;
}
export const ev = () => {
    try {
      return localStorage.getItem(kf) || "";
    } catch {
      return "";
    }
  },
  av = (y) => {
    try {
      localStorage.setItem(kf, y);
    } catch {}
  },
  nv = () => {
    try {
      localStorage.removeItem(kf);
    } catch {}
  },
  uv = "wangamiao_vault_v1",
  iv = 15e4,
  cv = "6fc1590708e37cacef45b39cefd92f05",
  sv = "WANGAMIAO_VERIFY_V1";
export function fv(y) {
  const H = new Uint8Array(y.length / 2);
  for (let M = 0; M < H.length; M++) H[M] = parseInt(y.substr(M * 2, 2), 16);
  return H;
}
export function Hm(y) {
  const H = atob(y),
    M = new Uint8Array(H.length);
  for (let m = 0; m < H.length; m++) M[m] = H.charCodeAt(m);
  return M;
}
export async function ov(y, H) {
  const M = fv(H),
    m = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(y),
      "PBKDF2",
      !1,
      ["deriveKey"],
    );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: M,
      iterations: iv,
      hash: "SHA-256",
    },
    m,
    {
      name: "AES-GCM",
      length: 256,
    },
    !1,
    ["encrypt", "decrypt"],
  );
}
export async function qm(y, H) {
  const M = H.split(".");
  if (M.length !== 2) throw new Error("bad payload");
  const m = Hm(M[0]),
    Q = Hm(M[1]),
    w = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: m,
      },
      y,
      Q,
    );
  return new TextDecoder().decode(w);
}
export function rv() {
  try {
    const y = localStorage.getItem(uv);
    return y ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
export const defaultRaces = [
    {
      id: "hk100",
      role: "首选",
      name: "Vibram香港100",
      category: "56km / 33km",
      date: "1月15–17日周末",
      location: "香港",
      signup: "2026年12月",
      official: "hk100ultra.com",
      url: "https://hk100ultra.com/",
      month: 1,
      type: "越野",
    },
    {
      id: "gz100",
      role: "备选1",
      name: "广州100越野赛",
      category: "60km",
      date: "1月上中旬",
      location: "广州",
      signup: "2026年11–12月",
      official: "马拉马拉APP；公众号“广州100越野赛”",
      month: 1,
      type: "越野",
    },
    {
      id: "sz100",
      role: "备选2",
      name: "深圳100越野赛",
      category: "50km",
      date: "1月",
      location: "深圳",
      signup: "2026年12月",
      official: "公众号“深圳100越野赛”发布报名链接",
      month: 1,
      type: "越野",
    },
    {
      id: "glg",
      role: "备选3",
      name: "高黎贡超级山径赛 by UTMB",
      category: "50km",
      date: "3月初",
      location: "云南腾冲",
      signup: "2026年12月–2027年1月",
      official: "UTMB官网 utmb.world；公众号“高黎贡超级山径赛”",
      url: "https://utmb.world",
      month: 3,
      type: "UTMB",
    },
    {
      id: "lanzhou",
      role: "首选",
      name: "兰州马拉松",
      category: "全程马拉松",
      date: "5月23日 / 30日（周日）",
      location: "兰州",
      signup: "2027年3–4月",
      official: "lzmarathon.com",
      url: "http://www.lzmarathon.com",
      month: 5,
      type: "全马",
    },
    {
      id: "qingdao",
      role: "备选3",
      name: "青岛马拉松",
      category: "全程马拉松",
      date: "5月上旬（通常5.4）",
      location: "青岛",
      signup: "2027年1–2月",
      official: "qd-mls.com",
      url: "http://www.qd-mls.com",
      month: 5,
      type: "全马",
    },
    {
      id: "changchun",
      role: "备选4",
      name: "长春马拉松",
      category: "全程马拉松",
      date: "5月下旬",
      location: "长春",
      signup: "2027年4月",
      official: "changchunmarathon.com",
      url: "http://www.changchunmarathon.com",
      month: 5,
      type: "全马",
    },
    {
      id: "dalian",
      role: "备选5",
      name: "大连马拉松",
      category: "全程马拉松",
      date: "5月下旬",
      location: "大连",
      signup: "2027年3–4月",
      official: "数字心动APP；公众号“大连马拉松”",
      month: 5,
      type: "全马",
    },
    {
      id: "wuxi",
      role: "备选1",
      name: "无锡马拉松",
      category: "全程马拉松",
      date: "3月下旬",
      location: "无锡",
      signup: "2026年12月–2027年1月",
      official: "wuximarathon.com",
      url: "http://www.wuximarathon.com",
      month: 3,
      type: "全马",
    },
    {
      id: "xiamen",
      role: "备选2",
      name: "厦门马拉松",
      category: "全程马拉松",
      date: "1月初",
      location: "厦门",
      signup: "2026年9–10月",
      official: "xmim.org",
      url: "https://www.xmim.org",
      month: 1,
      type: "全马",
    },
    {
      id: "chongli",
      role: "首选（二选一）",
      name: "崇礼168超级越野赛",
      category: "TTC 50km / ETC 30km",
      date: "7月9–11日周末",
      location: "河北崇礼",
      signup: "2027年4–5月",
      official: "公众号“崇礼168超级越野赛”；马拉马拉APP",
      month: 7,
      type: "越野",
    },
    {
      id: "qilian",
      role: "备选1",
      name: "野性祁连越野跑",
      category: "50km",
      date: "7月中下旬",
      location: "甘肃",
      signup: "2027年5–6月",
      official: "公众号“山与山体育”",
      month: 7,
      type: "越野",
    },
    {
      id: "wulong",
      role: "备选2",
      name: "武隆国际越野赛",
      category: "50km",
      date: "7月下旬",
      location: "重庆武隆",
      signup: "2027年5–6月",
      official: "公众号“武隆国际越野赛”",
      month: 7,
      type: "越野",
    },
    {
      id: "siguniang",
      role: "首选（二选一）",
      name: "四姑娘山云间花径越野跑",
      category: "44km",
      date: "8月上旬",
      location: "四川阿坝",
      signup: "2027年6月",
      official: "公众号“深行户外”",
      month: 8,
      type: "越野",
    },
    {
      id: "ninghai",
      role: "备选2",
      name: "宁海越野赛（非UTMB）",
      category: "50km",
      date: "10月15–17日周末",
      location: "浙江宁海",
      signup: "2027年5–6月",
      official: "公众号“宁海100”",
      month: 10,
      type: "越野",
    },
    {
      id: "jeju",
      role: "备选1",
      name: "济州岛 by UTMB",
      category: "50km",
      date: "10月中旬",
      location: "韩国济州",
      signup: "2027年4–5月",
      official: "jejubyutmb.com",
      url: "https://www.jejubyutmb.com",
      month: 10,
      type: "UTMB",
    },
    {
      id: "yunqiu",
      role: "首选",
      name: "云丘山 by UTMB",
      category: "50km",
      date: "9月下旬",
      location: "山西临汾",
      signup: "2027年5–6月",
      official: "公众号“云丘山100”；UTMB官网 utmb.world",
      url: "https://utmb.world",
      month: 9,
      type: "UTMB",
    },
    {
      id: "wugong",
      role: "备选3",
      name: "武功山越野赛",
      category: "50km",
      date: "9月中下旬",
      location: "江西萍乡",
      signup: "2027年6–7月",
      official: "公众号“武功山越野赛”",
      month: 9,
      type: "越野",
    },
    {
      id: "lantau",
      role: "首选",
      name: "TransLantau by UTMB（大屿山）",
      category: "50km",
      date: "11月上旬",
      location: "香港",
      signup: "2027年5–6月",
      official: "公众号“TransLantau”；UTMB官网 utmb.world",
      url: "https://utmb.world",
      month: 11,
      type: "UTMB",
    },
    {
      id: "mogan",
      role: "备选1",
      name: "凯乐石莫干山跑山赛",
      category: "50km",
      date: "11月中旬",
      location: "浙江德清",
      signup: "2027年6–7月",
      official: "公众号“朗途体育”",
      month: 11,
      type: "越野",
    },
    {
      id: "yangshuo",
      role: "备选2",
      name: "阳朔100国际越野赛",
      category: "50km",
      date: "11月中下旬",
      location: "广西阳朔",
      signup: "2027年7–8月",
      official: "关注“阳朔100”官方公众号",
      month: 11,
      type: "越野",
    },
  ],
  monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  defaultPlacements = Object.fromEntries(
    defaultRaces.map((y) => [y.id, y.month]),
  ),
  defaultTrainingLibrary = [
    {
      id: "interval",
      name: "间歇",
      cat: "路跑",
      tone: "orange",
      duration: "8×400m",
      desc: "高强度重复跑，提升最大摄氧与速度能力",
    },
    {
      id: "tempo",
      name: "节奏跑",
      cat: "路跑",
      tone: "amber",
      duration: "40min",
      desc: "接近乳酸阈值的稳定配速，提升耐力门槛",
    },
    {
      id: "longrun",
      name: "长距离",
      cat: "路跑",
      tone: "acid",
      duration: "25km",
      desc: "稳定低强度长距离，夯实有氧基础",
    },
    {
      id: "easy",
      name: "轻松跑",
      cat: "路跑",
      tone: "acid",
      duration: "45min",
      desc: "恢复性慢跑，促进血液循环与恢复",
    },
    {
      id: "hill",
      name: "爬坡",
      cat: "越野",
      tone: "purple",
      duration: "10×坡",
      desc: "坡道重复训练，强化下肢力量与心肺",
    },
    {
      id: "trail",
      name: "越野长距离",
      cat: "越野",
      tone: "purple",
      duration: "30km",
      desc: "山地技术地形长距离，模拟比赛场景",
    },
    {
      id: "strength",
      name: "力量",
      cat: "通用",
      tone: "blue",
      duration: "40min",
      desc: "核心与下肢力量训练，预防伤病",
    },
    {
      id: "stretch",
      name: "拉伸",
      cat: "通用",
      tone: "green",
      duration: "15min",
      desc: "动态/静态拉伸，提升关节活动度",
    },
    {
      id: "recovery",
      name: "恢复",
      cat: "通用",
      tone: "green",
      duration: "休息日",
      desc: "休息 / 瑜伽 / 泡沫轴，主动恢复",
    },
  ],
  Nc = {
    acid: "酸黄",
    orange: "珊瑚",
    amber: "琥珀",
    purple: "紫",
    blue: "蓝",
    green: "浅绿",
    muted: "灰",
    ink: "墨绿",
    pink: "浅粉",
    rose: "玫瑰粉",
    red: "珊瑚红",
    crimson: "车厘红",
  },
  Ac = [
    "acid",
    "orange",
    "amber",
    "purple",
    "blue",
    "green",
    "muted",
    "pink",
    "rose",
    "red",
    "crimson",
  ],
  $u = ["路跑", "越野", "通用", "交叉训练", "游泳", "骑行", "比赛"],
  Bm = ["全部", ...$u],
  Ym = [
    {
      name: "常用",
      icon: "⭐",
      emojis: [
        "🏃",
        "🏃‍♀️",
        "🏃‍♂️",
        "💪",
        "🔥",
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🤎",
        "🖤",
        "🤍",
        "⭐",
        "✨",
        "✅",
        "🎯",
        "🚀",
        "😊",
        "😅",
        "😌",
        "🥵",
        "💦",
        "⏱️",
        "📈",
        "📉",
        "🐶",
        "🐱",
        "🌟",
        "💯",
        "👍",
        "👏",
        "🙏",
        "🎉",
        "💡",
      ],
    },
    {
      name: "笑脸",
      icon: "😀",
      emojis: [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😊",
        "😍",
        "😘",
        "😎",
        "🤩",
        "😅",
        "😏",
        "😢",
        "😭",
        "😤",
        "😡",
        "🥺",
        "😴",
        "🙃",
        "😇",
        "🤔",
        "😉",
        "😋",
        "😜",
        "🤪",
        "😬",
        "😐",
        "😶",
        "🙄",
        "😮",
        "🤯",
        "😳",
        "🥰",
        "😱",
        "😨",
        "🤗",
        "😪",
        "😷",
        "🤒",
        "🥳",
        "😈",
        "👿",
        "💀",
        "☠️",
        "🤡",
        "👻",
        "😵",
        "💋",
        "💔",
        "❤️‍🔥",
        "🤠",
        "🥱",
      ],
    },
    {
      name: "人物",
      icon: "🧑",
      emojis: [
        "👶",
        "👧",
        "👩",
        "👨",
        "👵",
        "👴",
        "🧑",
        "🧔",
        "👱",
        "👮",
        "👷",
        "💂",
        "🕵",
        "🤵",
        "👰",
        "🎅",
        "🤶",
        "🧑‍🚀",
        "🧑‍🔧",
        "🧑‍🎨",
        "🧑‍⚕️",
        "🧑‍🏫",
        "🧑‍💻",
        "👩‍🔬",
        "🧑‍🍳",
        "👨‍🎓",
        "👩‍🎤",
        "🦸",
        "🦹",
        "🧜",
        "🧚",
        "👼",
        "🤰",
        "🧓",
        "👲",
        "👳",
        "👸",
        "🤴",
        "👨‍👩‍👧",
        "👩‍👦",
        "🧑‍🤝‍🧑",
        "🙇",
        "💁",
        "🙅",
        "🙆",
        "🤷",
        "🤦",
        "💪",
        "🫶",
        "👋",
        "🤙",
        "✌️",
        "🤞",
        "🤟",
        "👌",
        "👈",
        "👉",
        "👆",
        "👇",
        "✋",
        "🤚",
        "🖐️",
        "👏",
        "🙌",
        "🤝",
        "💅",
        "👀",
      ],
    },
    {
      name: "动物自然",
      icon: "🐶",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
        "🦄",
        "🐝",
        "🦋",
        "🐢",
        "🐍",
        "🐙",
        "🦀",
        "🐠",
        "🐬",
        "🐳",
        "🦌",
        "🐎",
        "🐑",
        "🐘",
        "🦒",
        "🐊",
        "🐅",
        "🐆",
        "🦓",
        "🦛",
        "🐫",
        "🦚",
        "🌲",
        "🌳",
        "🌿",
        "🍃",
        "🌸",
        "🌻",
        "🌹",
        "🌺",
        "🌞",
        "🌝",
        "🌚",
        "⛰️",
        "🌊",
        "🍀",
        "🌈",
        "☘️",
        "🍂",
        "🍁",
        "🌵",
        "🐚",
        "🌴",
      ],
    },
    {
      name: "食物",
      icon: "🍔",
      emojis: [
        "🍎",
        "🍌",
        "🍊",
        "🍉",
        "🍇",
        "🍓",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥑",
        "🍔",
        "🍟",
        "🍕",
        "🌭",
        "🍿",
        "🍜",
        "🍣",
        "🍱",
        "🥗",
        "🍰",
        "🍩",
        "🍪",
        "🍫",
        "🍵",
        "☕",
        "🍺",
        "🍷",
        "🥛",
        "🍦",
        "🧁",
        "🥨",
        "🍞",
        "🥪",
        "🌶️",
        "🥕",
        "🍅",
        "🥦",
        "🧄",
        "🧅",
        "🍄",
        "🥜",
        "🍯",
        "🥖",
        "🍳",
        "🥚",
        "🍠",
        "🥟",
        "🍤",
        "🍙",
        "🍚",
        "🥘",
        "🍲",
        "🥣",
      ],
    },
    {
      name: "运动",
      icon: "⚽",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🎾",
        "🏐",
        "🏉",
        "🎱",
        "🏓",
        "🏸",
        "🥅",
        "🏒",
        "🏏",
        "🥊",
        "🥋",
        "⛳",
        "🎿",
        "🛷",
        "🏂",
        "🏋️",
        "🤸",
        "🤾",
        "🏌️",
        "🏇",
        "🚴",
        "🏊",
        "🤽",
        "🏄",
        "🧘",
        "💃",
        "🤺",
        "⛸️",
        "🏹",
        "🎣",
        "🥍",
        "🎽",
        "🛹",
        "🛼",
        "🏆",
        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🎖️",
        "🏵️",
        "🎗️",
        "🎫",
        "🎯",
        "🎲",
        "♟️",
        "🎮",
        "🎨",
        "🎭",
      ],
    },
    {
      name: "旅行",
      icon: "✈️",
      emojis: [
        "🚗",
        "🚕",
        "🚌",
        "🚆",
        "✈️",
        "🚀",
        "🏝️",
        "🏔️",
        "🗻",
        "🌋",
        "🏕️",
        "🏖️",
        "🌃",
        "🌉",
        "🏙️",
        "🗽",
        "🌍",
        "🌏",
        "🌎",
        "🧭",
        "🗺️",
        "🏠",
        "🏰",
        "⛺",
        "🎡",
        "🎢",
        "🎠",
        "⛲",
        "🏟️",
        "🛤️",
        "🚉",
        "🛳️",
        "⚓",
        "🗿",
        "🕌",
        "🏛️",
        "🏗️",
        "🌁",
        "🌄",
        "🌅",
        "🏞️",
        "🛣️",
        "🛰️",
        "⛵",
        "🚤",
        "🛥️",
        "🚲",
        "🚏",
        "🗼",
        "🎪",
        "🏬",
      ],
    },
    {
      name: "物件符号",
      icon: "💡",
      emojis: [
        "⌚",
        "📱",
        "💻",
        "⌨️",
        "🖱️",
        "🎧",
        "🔋",
        "🔌",
        "💡",
        "📷",
        "🎥",
        "📺",
        "✏️",
        "📝",
        "📌",
        "📎",
        "✂️",
        "🔧",
        "🔨",
        "💰",
        "💎",
        "🔑",
        "🚩",
        "🎯",
        "✅",
        "❌",
        "⚠️",
        "❓",
        "❗",
        "💯",
        "🌟",
        "💫",
        "🔔",
        "📢",
        "📈",
        "📉",
        "🆗",
        "♻️",
        "✔️",
        "➡️",
        "⬆️",
        "⬇️",
        "🔁",
        "🔄",
        "⏰",
        "⌛",
        "💤",
        "📍",
        "📦",
        "🎁",
        "🎈",
        "🎀",
        "💌",
        "📚",
        "🔍",
        "🧭",
        "⚙️",
        "🧯",
        "🛡️",
      ],
    },
  ],
  dv = [
    "#182019",
    "#5b5b5b",
    "#c92a2a",
    "#e8590c",
    "#f08c00",
    "#f2b705",
    "#2f9e44",
    "#0c8599",
    "#1971c2",
    "#6741d9",
    "#9c36b5",
    "#e64980",
  ],
  mv = new Set([
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "S",
    "STRIKE",
    "BR",
    "DIV",
    "P",
    "UL",
    "OL",
    "LI",
    "SPAN",
    "FONT",
    "IMG",
  ]),
  wm = (y) =>
    y.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  _e = (y) => {
    const H = document.createElement("div");
    H.innerHTML = y;
    const M = (Q) =>
        Q.split(";")
          .map((w) => w.trim())
          .filter(
            (w) => /^color:/i.test(w) || /^background(?:-color)?:/i.test(w),
          )
          .join("; "),
      m = (Q) => {
        const w = [];
        (Q.childNodes.forEach((k) => {
          if (k.nodeType === 1) {
            const W = k;
            if (!mv.has(W.tagName)) w.push(W);
            else {
              for (const q of Array.from(W.attributes)) {
                const T = q.name.toLowerCase(),
                  lt = q.value;
                if (T.startsWith("on") || T === "href")
                  W.removeAttribute(q.name);
                else if (W.tagName === "IMG" && T === "src")
                  !/^https?:\/\//i.test(lt) &&
                    !/^data:image\//i.test(lt) &&
                    W.removeAttribute(q.name);
                else if (T === "style")
                  if (W.tagName === "SPAN" || W.tagName === "FONT") {
                    const _ = M(lt);
                    _ ? W.setAttribute("style", _) : W.removeAttribute(q.name);
                  } else W.removeAttribute(q.name);
              }
              m(W);
            }
          }
        }),
          w.forEach((k) =>
            k.replaceWith(document.createTextNode(k.textContent || "")),
          ));
      };
    return (m(H), H.innerHTML);
  },
  hv = (y) =>
    y ? (/<[a-z]/.test(y) ? _e(y) : wm(y).replace(/\n/g, "<br>")) : "",
  yv = (y, H) => {
    const M = wm(H),
      m = y && y.trim() ? _e(y) : "";
    return m ? `${m}<br>${M}` : M;
  },
  Mc = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  Ec = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
  vv = (y) =>
    y >= 100
      ? "#37b24d"
      : y > 70
        ? "#94d82d"
        : y > 50
          ? "#fcc419"
          : y > 30
            ? "#ff922b"
            : y > 0
              ? "#e03131"
              : "#c92a2a",
  Tc = (y) => /恢复|全休|休息|拉伸|瑜伽|泡沫轴|放松|按摩/.test(y),
  Lm = (y) => String(y).padStart(2, "0"),
  Pu = (y) => `${y.getFullYear()}-${Lm(y.getMonth() + 1)}-${Lm(y.getDate())}`,
  _m = (y) => {
    const [H, M, m] = y.split("-").map(Number);
    return new Date(H, M - 1, m);
  },
  un = (y, H) => {
    const M = new Date(y);
    return (M.setDate(M.getDate() + H), M);
  },
  Zf = (y) => {
    const H = y.getDay() === 0 ? -6 : 1 - y.getDay();
    return un(new Date(y.getFullYear(), y.getMonth(), y.getDate()), H);
  },
  Jn = (y) => {
    const H = Zf(y);
    return Array.from(
      {
        length: 7,
      },
      (M, m) => un(H, m),
    );
  },
  Kf = (y) => {
    const H = new Date(y.getFullYear(), y.getMonth(), 1),
      M = Zf(H),
      m = new Date(y.getFullYear(), y.getMonth() + 1, 0),
      Q = un(Zf(m), 6),
      w = Math.round((Q.getTime() - M.getTime()) / 864e5) + 1;
    return Array.from(
      {
        length: w,
      },
      (k, W) => {
        const q = un(M, W);
        return q.getMonth() === y.getMonth() ? q : null;
      },
    );
  },
  Gm = (y) => Kf(y).length / 7,
  _f = (y) => {
    const H = _m(y);
    return `${H.getMonth() + 1}月${H.getDate()}日 ${Mc[(H.getDay() + 6) % 7]}`;
  },
  Ca = Pu(new Date()),
  Cc = (y) => {
    const H = {};
    for (const M of y)
      !M ||
        !M.uid ||
        (H[M.uid] = {
          uid: M.uid,
          date: M.date,
          name: M.name,
          cat: M.cat,
          tone: M.tone,
          duration: M.duration,
          desc: M.desc,
          pct: typeof M.pct == "number" ? M.pct : M.date < Ca ? 100 : 0,
          comments: M.comments,
        });
    return H;
  };
