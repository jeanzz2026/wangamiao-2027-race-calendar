// Recovered application component. See docs/SOURCE_RECOVERY.md.
// Recovered from the published bundle. See docs/SOURCE_RECOVERY.md.
import React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import {
  Jy,
  Xf,
  ti,
  li,
  kn,
  ei,
  Rm,
  kf,
  ky,
  Wy,
  Dc,
  encodeUtf8Base64,
  decodeUtf8Base64,
  $y,
  Py,
  loadCloudState,
  validateGitHubToken,
  saveCloudState,
  Xm,
  wf,
  loadLocalState,
  saveLocalState,
  Vf,
  ev,
  av,
  nv,
  uv,
  iv,
  cv,
  sv,
  fv,
  Hm,
  ov,
  qm,
  rv,
  defaultRaces,
  monthNames,
  defaultPlacements,
  defaultTrainingLibrary,
  Nc,
  Ac,
  $u,
  Bm,
  Ym,
  dv,
  mv,
  wm,
  _e,
  hv,
  yv,
  Mc,
  Ec,
  vv,
  Tc,
  Lm,
  Pu,
  _m,
  un,
  Zf,
  Jn,
  Kf,
  Gm,
  _f,
  Ca,
  Cc,
} from "./lib/application-support.js";
export default function App() {
  const [y, H] = React.useState("race"),
    M = React.useRef(y),
    m = React.useRef({
      race: 0,
      training: 0,
      checkin: 0,
      analysis: 0,
    }),
    Q = (s) => {
      ((m.current[M.current] = window.scrollY), (M.current = s), H(s));
    };
  (React.useEffect(() => {
    const s = () => {
      m.current[M.current] = window.scrollY;
    };
    return (
      window.addEventListener("scroll", s, {
        passive: !0,
      }),
      () => window.removeEventListener("scroll", s)
    );
  }, []),
    React.useLayoutEffect(() => {
      window.scrollTo({
        top: m.current[y] || 0,
        left: 0,
        behavior: "instant",
      });
    }, [y]));
  const [w, k] = React.useState(""),
    [W, q] = React.useState("全部"),
    [T, lt] = React.useState(defaultPlacements),
    [raceEdits, setRaceEdits] = React.useState({}),
    [_, At] = React.useState("hk100"),
    [Pt, tl] = React.useState(null),
    [ft, kt] = React.useState(defaultTrainingLibrary),
    [ll, jl] = React.useState(defaultTrainingLibrary),
    [yt, Ot] = React.useState([]),
    [vt, Wt] = React.useState(() =>
      typeof localStorage < "u" &&
      localStorage.getItem("wamiao_trainView") === "month"
        ? "month"
        : "week",
    );
  React.useEffect(() => {
    try {
      localStorage.setItem("wamiao_trainView", vt);
    } catch {}
  }, [vt]);
  React.useEffect(() => {
    window.__wamiaoSetRaceEdits = setRaceEdits;
  }, [setRaceEdits]);
  const [P, sl] = React.useState(
    () =>
      typeof localStorage < "u" &&
      localStorage.getItem("wamiao_sb_training") === "1",
  );
  React.useEffect(() => {
    try {
      localStorage.setItem("wamiao_sb_training", P ? "1" : "0");
    } catch {}
  }, [P]);
  const [fl, pe] = React.useState(
    () =>
      typeof localStorage < "u" &&
      localStorage.getItem("wamiao_sb_checkin") === "1",
  );
  React.useEffect(() => {
    try {
      localStorage.setItem("wamiao_sb_checkin", fl ? "1" : "0");
    } catch {}
  }, [fl]);
  const [gt, el] = React.useState(new Date()),
    [Fl, Gl] = React.useState(Ca),
    [_t, j] = React.useState("全部"),
    [U, V] = React.useState(null),
    [L, bt] = React.useState(null),
    [d, A] = React.useState(!1),
    [D, B] = React.useState({
      name: "",
      cat: "路跑",
      tone: "amber",
      duration: "",
      desc: "",
    }),
    [F, $] = React.useState(!1),
    [J, Ht] = React.useState({
      id: "",
      name: "",
      cat: "路跑",
      tone: "amber",
      duration: "",
      desc: "",
    }),
    [Rt, Il] = React.useState(!1),
    [Ve, Wn] = React.useState(Ca),
    [Ut, al] = React.useState({
      libId: "",
      name: "",
      cat: "路跑",
      tone: "amber",
      duration: "",
      note: "",
    }),
    [Fn, Se] = React.useState(!1),
    [Ft, xe] = React.useState({
      id: "",
      date: "",
      name: "",
      cat: "路跑",
      tone: "amber",
      duration: "",
      note: "",
    }),
    [ce, $l] = React.useState({}),
    [za, Ze] = React.useState(!1),
    [Yt, Tt] = React.useState({
      uid: "",
      date: "",
      libId: "",
      name: "",
      cat: "路跑",
      tone: "amber",
      duration: "",
      desc: "",
      pct: 100,
      comments: "",
      locked: !1,
    }),
    [ai, Ma] = React.useState(null),
    se = React.useRef(null),
    Ke = React.useRef(null),
    ni = React.useRef(null),
    [Je, In] = React.useState(!1),
    [ui, Da] = React.useState(0),
    [It, Nl] = React.useState(!1),
    [vl, Oc] = React.useState("#182019"),
    [Rc, Uc] = React.useState("#1971c2"),
    fe = React.useRef([]),
    [cn, ke] = React.useState(!1),
    nl = () => {
      (fe.current.push({
        trainings: yt,
        library: ft,
      }),
        fe.current.length > 50 && fe.current.shift(),
        ke(!0));
    },
    sn = () => {
      const s = fe.current.pop();
      if (!s) {
        ke(!1);
        return;
      }
      (Ot(s.trainings),
        kt(s.library),
        ke(fe.current.length > 0),
        gl("已撤销上一步操作"));
    },
    Oa = () => {
      window.confirm(
        "将当前基础训练库的 " +
          ft.length +
          " 项保存为默认设置？之后可一键恢复到此版本。",
      ) && (nl(), jl([...ft]), gl("已保存当前训练库为默认基础训练库 ✓"));
    },
    Hc = () => {
      window.confirm(
        "将训练库恢复为默认基础设置？这会移除你添加的所有自定义训练类型，已排进日历的训练不受影响。",
      ) && (nl(), kt([...ll]), gl("已恢复默认基础训练库"));
    },
    [it, Ra] = React.useState(!1),
    [Ua, oe] = React.useState(!1),
    [$n, Pn] = React.useState(""),
    [tu, fn] = React.useState(!1),
    [on, Ha] = React.useState(""),
    [ii, Pl] = React.useState(!1),
    [ul, il] = React.useState(!1),
    [je, gl] = React.useState(""),
    [Ne, qa] = React.useState(() =>
      typeof localStorage < "u" &&
      localStorage.getItem("wamiao_theme") === "misty"
        ? "misty"
        : "dark",
    );
  React.useEffect(() => {
    Ne === "misty"
      ? document.documentElement.setAttribute("data-theme", "misty")
      : document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("wamiao_theme", Ne);
    } catch {}
  }, [Ne]);
  const te = React.useRef(""),
    We = React.useRef(!1),
    [Ba, Ae] = React.useState(() => ev()),
    [Fe, Ql] = React.useState(!1),
    [re, Lt] = React.useState(""),
    [rn, lu] = React.useState(""),
    [de, Ie] = React.useState(""),
    [ci, eu] = React.useState(!1),
    [au, si] = React.useState(!1),
    [Ya, Ee] = React.useState(""),
    [Xl, Gt] = React.useState(""),
    [La, nu] = React.useState(!1),
    Ga = React.useRef(null);
  (React.useEffect(() => {
    if (!La) return;
    const s = (v) => {
      Ga.current && !Ga.current.contains(v.target) && nu(!1);
    };
    return (
      document.addEventListener("mousedown", s),
      () => document.removeEventListener("mousedown", s)
    );
  }, [La]),
    React.useEffect(() => {
      (async () => {
        try {
          const s = await fetch("itra_data.json", {
            cache: "no-store",
          });
          if (s.ok) {
            const v = await s.json();
            bt(Vf(v));
          }
        } catch {}
      })();
    }, []),
    React.useEffect(() => {
      (async () => {
        const s = loadLocalState();
        let v = !1;
        if (
          (s &&
            (s.placements &&
              lt({
                ...defaultPlacements,
                ...s.placements,
              }),
            Array.isArray(s.trainings) && Ot(s.trainings),
            Array.isArray(s.library) && kt(s.library),
            Array.isArray(s.defaultLibrary) && jl(s.defaultLibrary),
            (s.theme === "misty" || s.theme === "dark") && qa(s.theme),
            $l(
              s.takeaways && typeof s.takeaways == "object"
                ? s.takeaways
                : Cc(Array.isArray(s.trainings) ? s.trainings : []),
            ),
            s.raceEdits && setRaceEdits(s.raceEdits),
            (v = !0)),
          !v)
        ) {
          const C = await loadCloudState();
          if (C) {
            const z = C.state;
            (z.placements &&
              lt({
                ...defaultPlacements,
                ...z.placements,
              }),
              Array.isArray(z.trainings) && Ot(z.trainings),
              Array.isArray(z.library) && kt(z.library),
              Array.isArray(z.defaultLibrary) && jl(z.defaultLibrary),
              (z.theme === "misty" || z.theme === "dark") && qa(z.theme),
              $l(
                z.takeaways && typeof z.takeaways == "object"
                  ? z.takeaways
                  : Cc(Array.isArray(z.trainings) ? z.trainings : []),
              ),
              z.raceEdits && setRaceEdits(z.raceEdits),
              saveLocalState(z),
              (v = !0));
          }
        }
        if (!v) {
          const C = rv();
          if (C)
            try {
              const z = await ov("miao2027", cv);
              if ((await qm(z, C.v)) === sv) {
                const O = JSON.parse(await qm(z, C.d)),
                  at = {
                    placements: O.placements || defaultPlacements,
                    trainings: Array.isArray(O.trainings) ? O.trainings : [],
                    library: Array.isArray(O.library)
                      ? O.library
                      : defaultTrainingLibrary,
                    defaultLibrary: Array.isArray(O.defaultLibrary)
                      ? O.defaultLibrary
                      : defaultTrainingLibrary,
                    theme: O.theme,
                    raceEdits:
                      O.raceEdits && typeof O.raceEdits == "object"
                        ? O.raceEdits
                        : {},
                  };
                (lt({
                  ...defaultPlacements,
                  ...at.placements,
                }),
                  Ot(at.trainings),
                  kt(at.library),
                  jl(at.defaultLibrary),
                  (at.theme === "misty" || at.theme === "dark") && qa(at.theme),
                  $l(Cc(at.trainings)),
                  setRaceEdits(at.raceEdits),
                  saveLocalState(at),
                  (v = !0));
              }
            } catch {}
        }
        try {
          const C = localStorage.getItem(wf);
          C && ((te.current = C), Ra(!0), il(!0), await loadCloudState(C));
        } catch {}
        ((We.current = !0), (window.__wamiaoRaceStateReady = !0));
      })();
    }, []));
  const $e = React.useRef(null);
  React.useEffect(() => {
    if (We.current)
      return (
        $e.current && window.clearTimeout($e.current),
        ($e.current = window.setTimeout(async () => {
          const s = {
              placements: T,
              trainings: yt,
              library: ft,
              defaultLibrary: ll,
              theme: Ne,
              takeaways: ce,
              raceEdits,
            },
            v = saveLocalState(s);
          if (te.current) {
            gl("同步到云端…");
            const C = await saveCloudState(s, te.current);
            gl(
              C.ok
                ? v
                  ? "已保存并同步到云端 ✓"
                  : "已同步云端 ✓"
                : `已存本机，但云端同步失败：${C.reason ?? "请重新连接"}`,
            );
          } else gl(v ? "已保存到本机 ✓" : "本机保存失败");
        }, 800)),
        () => {
          $e.current && window.clearTimeout($e.current);
        }
      );
  }, [T, yt, ft, ll, Ne, ce, raceEdits]);
  const Qa = async () => {
      Ha("");
      const s = $n.trim();
      if (!s) {
        Ha("请输入 GitHub token");
        return;
      }
      fn(!0);
      const v = await validateGitHubToken(s);
      if ((fn(!1), !v)) {
        Ha("token 无效或无该仓库权限");
        return;
      }
      try {
        localStorage.setItem(wf, s);
      } catch {}
      ((te.current = s),
        il(!0),
        Ra(!0),
        oe(!1),
        Pn(""),
        Pl(!0),
        window.setTimeout(() => Pl(!1), 2600),
        gl("已连接 GitHub · 可编辑并同步 ✓"),
        await loadCloudState(s));
    },
    qc = () => {
      try {
        localStorage.removeItem(wf);
      } catch {}
      ((te.current = ""), il(!1), Ra(!1));
    },
    Al = async () => {
      if ((Ee(""), !re.trim() || !rn)) {
        Ee("请输入佳明账号与密码");
        return;
      }
      eu(!0);
      try {
        const s = await fetch(`${Rm}/api/garmin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: re.trim(),
              password: rn,
            }),
          }),
          v = await s.json().catch(() => ({}));
        if (!s.ok || !v.token) {
          Ee(v.error || "登录失败（账号/密码或验证码有误）");
          return;
        }
        (av(v.token), Ae(v.token), Lt(""), lu(""), Ql(!1), Gt("已连接佳明 ✓"));
      } catch {
        Ee("连接 Worker 失败，请检查 GARMIN_API_BASE 配置");
      } finally {
        eu(!1);
      }
    },
    uu = () => {
      (nv(), Ae(""), Gt(""));
    },
    iu = (s) => {
      let v = 0;
      return (
        $l((C) => {
          const z = {
            ...C,
          };
          for (const O of s) {
            const at = Wy(O.type),
              mt = Object.values(z).find(
                (El) => !El.locked && El.date === O.date && El.cat === at,
              );
            if (!mt) continue;
            const Qt = [];
            (O.distanceKm != null &&
              Qt.push(`距离 ${O.distanceKm.toFixed(1)}km`),
              O.movingMin != null &&
                Qt.push(`时长 ${O.movingMin.toFixed(0)}min`),
              O.avgHr != null && Qt.push(`平均心率 ${O.avgHr}bpm`));
            const na = "佳明同步：" + Qt.join(" · "),
              Z = mt.uid;
            ((z[Z] = {
              ...mt,
              pct: 100,
              duration:
                O.movingMin != null
                  ? `${O.movingMin.toFixed(0)}min`
                  : mt.duration,
              comments: yv(mt.comments, na),
              garmin: {
                activityId: O.activityId,
                distanceKm: O.distanceKm,
                avgHr: O.avgHr,
                syncedAt: new Date().toISOString(),
              },
            }),
              v++);
          }
          return z;
        }),
        v
      );
    },
    dn = async (s) => {
      if (s != null) {
        try {
          const v = JSON.parse(s),
            C = iu(v);
          Gt(`手动同步：${C} 条匹配`);
        } catch {
          Gt("JSON 解析失败");
        }
        return;
      }
      if (!Ba) {
        Ql(!0);
        return;
      }
      (si(!0), Gt("同步中…"));
      try {
        const v = Pu(un(new Date(), -180)),
          C = `${Rm}/api/garmin/activities?session=${encodeURIComponent(Ba)}&start=${v}&end=${Ca}`,
          z = await fetch(C),
          O = await z.json().catch(() => ({}));
        if (!z.ok || !O.activities) {
          Gt(O.error || "同步失败");
          return;
        }
        const at = iu(O.activities);
        Gt(`已同步：${at} 条匹配（共 ${O.activities.length} 次活动）`);
      } catch {
        Gt("同步失败：Worker 不可达");
      } finally {
        si(!1);
      }
    },
    [Te, Pe] = React.useState(!1),
    fi = async () => {
      if (!te.current) {
        oe(!0);
        return;
      }
      (Pe(!0), gl("上传到云端…"));
      const v = await saveCloudState(
        {
          placements: T,
          trainings: yt,
          library: ft,
          defaultLibrary: ll,
          theme: Ne,
          takeaways: ce,
          raceEdits,
        },
        te.current,
      );
      (Pe(!1),
        gl(v.ok ? "已上传到云端 ✓" : `上传失败：${v.reason ?? "请重试"}`));
    },
    ta = async () => {
      var C, z;
      if (!window.confirm("从云端下载将用云端数据覆盖当前本机数据，确定继续？"))
        return;
      (Pe(!0), gl("从云端下载…"));
      const s = await loadCloudState(te.current || void 0);
      if (!s) {
        (Pe(!1), gl("下载失败：无法读取云端数据（网络问题或仓库不可达）"));
        return;
      }
      const v = s.state;
      (v.placements &&
        lt({
          ...defaultPlacements,
          ...v.placements,
        }),
        Array.isArray(v.trainings) && Ot(v.trainings),
        Array.isArray(v.library) && kt(v.library),
        Array.isArray(v.defaultLibrary) && jl(v.defaultLibrary),
        (v.theme === "misty" || v.theme === "dark") && qa(v.theme),
        $l(
          v.takeaways && typeof v.takeaways == "object"
            ? v.takeaways
            : Cc(Array.isArray(v.trainings) ? v.trainings : []),
        ),
        v.raceEdits && setRaceEdits(v.raceEdits),
        saveLocalState(v),
        Pe(!1),
        gl(
          `已从云端下载 ✓（库 ${((C = v.library) == null ? void 0 : C.length) ?? 0} / 计划 ${((z = v.trainings) == null ? void 0 : z.length) ?? 0}）`,
        ));
    },
    oi = (s, v) => {
      lt((C) => ({
        ...C,
        [s]: v,
      }));
    },
    ri = React.useMemo(() => {
      const s = w.trim().toLowerCase();
      return defaultRaces.filter((v) => {
        const C =
            !s ||
            [v.name, v.location, v.category, v.signup, v.type]
              .join(" ")
              .toLowerCase()
              .includes(s),
          z =
            W === "全部" ||
            (W === "首选" ? v.role.startsWith("首选") : v.type === W);
        return C && z;
      });
    }, [w, W]),
    bl = defaultRaces.find((s) => s.id === _) || defaultRaces[0],
    cu = () => {
      if (!D.name.trim()) return;
      const s = {
        id: Ec(),
        name: D.name.trim(),
        cat: D.cat,
        tone: D.tone,
        duration: D.duration.trim() || void 0,
        desc: D.desc.trim() || void 0,
        custom: !0,
      };
      (nl(),
        kt((v) => [...v, s]),
        B({
          name: "",
          cat: "路跑",
          tone: "amber",
          duration: "",
          desc: "",
        }),
        A(!1));
    },
    Bc = (s) => {
      window.confirm("从训练库删除该类型？已排进日历的训练不受影响。") &&
        (nl(), kt((v) => v.filter((C) => C.id !== s)));
    },
    Yc = (s) => {
      (Ht({
        id: s.id,
        name: s.name,
        cat: s.cat,
        tone: s.tone,
        duration: s.duration || "",
        desc: s.desc || "",
      }),
        $(!0));
    },
    mn = () => {
      J.name.trim() &&
        (nl(),
        kt((s) =>
          s.map((v) =>
            v.id === J.id
              ? {
                  ...v,
                  name: J.name.trim(),
                  cat: J.cat,
                  tone: J.tone,
                  duration: J.duration.trim() || void 0,
                  desc: J.desc.trim() || void 0,
                }
              : v,
          ),
        ),
        $(!1));
    },
    Ol = (s, v) => {
      yt.filter((z) => z.date === s && !Tc(z.name)).length + (v ? 0 : 1) > 2 &&
        Ma("今天的训练内容太多啦卷卷！🧘🏻‍♀️要好好休息呀宝贝🏖️~");
    },
    hn = (s, v) => {
      const C = ft.find((O) => O.id === s);
      if (!C) return;
      const z = {
        uid: Ec(),
        libId: s,
        name: C.name,
        cat: C.cat,
        tone: C.tone,
        date: v,
        duration: C.duration,
      };
      (Ol(v, Tc(C.name)), nl(), Ot((O) => [...O, z]));
    },
    su = (s, v) => {
      const C = yt.find((z) => z.uid === s);
      (C && Ol(v, Tc(C.name)),
        nl(),
        Ot((z) =>
          z.map((O) =>
            O.uid === s
              ? {
                  ...O,
                  date: v,
                }
              : O,
          ),
        ));
    },
    la = (s) => {
      (nl(), Ot((v) => v.filter((C) => C.uid !== s)));
    },
    Ce = (s) => {
      (al({
        libId: "",
        name: "",
        cat: "路跑",
        tone: "amber",
        duration: "",
        note: "",
      }),
        Wn(s),
        Il(!0));
    },
    di = (s) => {
      if (s === "__custom__") {
        al((C) => ({
          ...C,
          libId: "__custom__",
        }));
        return;
      }
      if (!s) {
        al((C) => ({
          ...C,
          libId: "",
        }));
        return;
      }
      const v = ft.find((C) => C.id === s);
      v &&
        al({
          libId: v.id,
          name: v.name,
          cat: v.cat,
          tone: v.tone,
          duration: v.duration || "",
          note: v.desc || "",
        });
    },
    fu = () => {
      if (!Ut.name.trim()) return;
      const s = Ut.libId && Ut.libId !== "__custom__" ? Ut.libId : "custom",
        v = {
          uid: Ec(),
          libId: s,
          name: Ut.name.trim(),
          cat: Ut.cat,
          tone: Ut.tone,
          date: Ve,
          duration: Ut.duration.trim() || void 0,
          note: Ut.note.trim() || void 0,
        };
      (Ol(Ve, Tc(v.name)),
        nl(),
        Ot((C) => [...C, v]),
        al({
          libId: "",
          name: "",
          cat: "路跑",
          tone: "amber",
          duration: "",
          note: "",
        }),
        Il(!1));
    },
    mi = (s) => {
      U && (U.kind === "new" ? hn(U.libId, s) : su(U.uid, s), V(null));
    },
    Xa = (s, v) => {
      (nl(),
        Ot((C) =>
          C.map((z) =>
            z.uid === s
              ? {
                  ...z,
                  ...v,
                }
              : z,
          ),
        ));
    },
    le = (s) => {
      (xe({
        id: s.uid,
        date: s.date,
        name: s.name,
        cat: s.cat,
        tone: s.tone,
        duration: s.duration || "",
        note: s.note || "",
      }),
        Se(!0));
    },
    ou = () => {
      (Xa(Ft.id, {
        name: Ft.name.trim(),
        cat: Ft.cat,
        tone: Ft.tone,
        duration: Ft.duration.trim() || void 0,
        note: Ft.note.trim() || void 0,
      }),
        Se(!1));
    },
    ea = (s) => {
      const v = ft.find((O) => O.name === s.name),
        C = yt.find((O) => O.uid === s.uid),
        z = v
          ? v.id
          : C &&
              C.libId &&
              C.libId !== "custom" &&
              ft.some((O) => O.id === C.libId)
            ? C.libId
            : "";
      (Tt({
        uid: s.uid,
        date: s.date,
        libId: z,
        name: s.name,
        cat: s.cat,
        tone: s.tone,
        duration: s.duration || "",
        desc: s.desc || "",
        pct: s.pct,
        comments: s.comments || "",
        locked: s.locked || !1,
      }),
        Ze(!0));
    },
    ee = (s) => {
      (Tt({
        uid: "",
        date: s,
        libId: "",
        name: "",
        cat: "路跑",
        tone: "amber",
        duration: "",
        desc: "",
        pct: 100,
        comments: "",
        locked: !1,
      }),
        Ze(!0));
    },
    ru = (s) => {
      const v = se.current;
      if (!v) {
        Tt((z) => ({
          ...z,
          comments: (z.comments || "") + s,
        }));
        return;
      }
      v.focus();
      const C = window.getSelection();
      if (C && C.rangeCount > 0 && v.contains(C.anchorNode)) {
        const z = C.getRangeAt(0);
        z.deleteContents();
        const O = document.createTextNode(s);
        (z.insertNode(O),
          z.setStartAfter(O),
          z.setEndAfter(O),
          C.removeAllRanges(),
          C.addRange(z));
      } else v.appendChild(document.createTextNode(s));
      Tt((z) => ({
        ...z,
        comments: _e(v.innerHTML),
      }));
    },
    ae = (s) => {
      const v = se.current;
      v &&
        (v.focus(),
        document.execCommand(s, !1),
        Tt((C) => ({
          ...C,
          comments: _e(v.innerHTML),
        })));
    },
    yn = (s) => {
      const v = se.current;
      v &&
        (v.focus(),
        document.execCommand("foreColor", !1, s || "#182019"),
        Oc(s || "#182019"),
        Tt((C) => ({
          ...C,
          comments: _e(v.innerHTML),
        })));
    },
    vn = (s) => {
      const v = s.target.files && s.target.files[0];
      if (((s.target.value = ""), !v)) return;
      const C = new FileReader();
      ((C.onload = () => {
        const z = se.current;
        z &&
          (z.focus(),
          document.execCommand("insertImage", !1, C.result),
          Tt((O) => ({
            ...O,
            comments: _e(z.innerHTML),
          })));
      }),
        C.readAsDataURL(v));
    };
  (React.useEffect(() => {
    za && se.current && (se.current.innerHTML = hv(Yt.comments || ""));
  }, [za]),
    React.useEffect(() => {
      if (!Je && !It) return;
      const s = (v) => {
        Ke.current && !Ke.current.contains(v.target) && (In(!1), Nl(!1));
      };
      return (
        document.addEventListener("mousedown", s),
        () => document.removeEventListener("mousedown", s)
      );
    }, [Je, It]));
  const gn = (s) => {
      if (!s) {
        Tt((C) => {
          const z = yt.find((at) => at.uid === C.uid);
          if (!z)
            return {
              ...C,
              libId: "",
            };
          const O = ft.find((at) => at.id === z.libId);
          return {
            ...C,
            libId: "",
            name: z.name,
            cat: z.cat,
            tone: z.tone,
            duration: z.duration || "",
            desc: (O == null ? void 0 : O.desc) || "",
          };
        });
        return;
      }
      const v = ft.find((C) => C.id === s);
      v &&
        Tt((C) => ({
          ...C,
          libId: s,
          name: v.name,
          cat: v.cat,
          tone: v.tone,
          duration: v.duration || "",
          desc: v.desc || "",
        }));
    },
    hi = () => {
      var O;
      const s = Yt.uid || Ec(),
        v = !Yt.uid,
        C = (O = yt.find((at) => at.uid === s)) == null ? void 0 : O.date,
        z = Math.max(0, Math.min(100, Number(Yt.pct) || 0));
      ($l((at) => {
        const mt = at[s];
        return {
          ...at,
          [s]: {
            uid: s,
            date: v
              ? Yt.date
              : (C ?? (mt == null ? void 0 : mt.date) ?? Yt.date),
            name: Yt.name.trim(),
            cat: Yt.cat,
            tone: Yt.tone,
            duration: Yt.duration.trim() || void 0,
            desc: Yt.desc.trim() || void 0,
            pct: z,
            comments: (() => {
              const Qt = Yt.comments.trim();
              return Qt.replace(/<[^>]*>/g, "")
                .replace(/&nbsp;/g, " ")
                .trim()
                ? _e(Qt)
                : void 0;
            })(),
            locked: Yt.locked || !1,
            garmin: mt == null ? void 0 : mt.garmin,
            independent: v ? !0 : mt == null ? void 0 : mt.independent,
          },
        };
      }),
        Ze(!1));
    };
  React.useEffect(() => {
    $l((s) => {
      var C;
      const v = {};
      for (const [z, O] of Object.entries(s)) O.independent && (v[z] = O);
      for (const z of yt) {
        const O = s[z.uid];
        O && !O.independent
          ? (v[z.uid] = {
              ...O,
              date: z.date,
            })
          : (v[z.uid] = {
              uid: z.uid,
              date: z.date,
              name: z.name,
              cat: z.cat,
              tone: z.tone,
              duration: z.duration,
              desc:
                (C = ft.find((at) => at.id === z.libId)) == null
                  ? void 0
                  : C.desc,
              pct: z.date < Ca ? 100 : 0,
              comments: void 0,
            });
      }
      return v;
    });
  }, [yt, ft]);
  const ol = React.useMemo(() => {
      if (vt === "week") {
        const s = Jn(gt);
        return `${s[0].getMonth() + 1}/${s[0].getDate()} – ${s[6].getMonth() + 1}/${s[6].getDate()}`;
      }
      return `${gt.getFullYear()}年${gt.getMonth() + 1}月`;
    }, [vt, gt]),
    me = () =>
      el((s) =>
        vt === "week"
          ? un(s, -7)
          : new Date(s.getFullYear(), s.getMonth() - 1, 1),
      ),
    wa = () =>
      el((s) =>
        vt === "week"
          ? un(s, 7)
          : new Date(s.getFullYear(), s.getMonth() + 1, 1),
      ),
    aa = () => {
      (el(new Date()), Gl(Ca));
    },
    Lc = ft.filter((s) => _t === "全部" || s.cat === _t),
    du = (s) => yt.filter((v) => v.date === s),
    Sl = React.useMemo(() => {
      const s = Object.values(ce),
        v = (Mt) => {
          if (vt === "week") {
            const yi = Jn(gt);
            return Mt >= Pu(yi[0]) && Mt <= Pu(yi[6]);
          }
          const rl = _m(Mt);
          return (
            rl.getFullYear() === gt.getFullYear() &&
            rl.getMonth() === gt.getMonth()
          );
        },
        C = s.length,
        z = C ? Math.round(s.reduce((Mt, rl) => Mt + rl.pct, 0) / C) : 0,
        O = s.filter((Mt) => Mt.pct >= 100).length,
        at = s.filter((Mt) => v(Mt.date)),
        mt = at.length,
        Qt = mt ? Math.round(at.reduce((Mt, rl) => Mt + rl.pct, 0) / mt) : 0,
        na = at.filter((Mt) => Mt.pct >= 100).length,
        Z = new Map();
      for (const Mt of at) {
        const rl = Z.get(Mt.cat) || {
          total: 0,
          sum: 0,
        };
        (rl.total++, (rl.sum += Mt.pct), Z.set(Mt.cat, rl));
      }
      const El = Array.from(Z.entries()).map(([Mt, rl]) => [
        Mt,
        {
          total: rl.total,
          avg: rl.total ? Math.round(rl.sum / rl.total) : 0,
        },
      ]);
      return {
        total: C,
        done: O,
        avg: z,
        periodTotal: mt,
        periodDone: na,
        periodAvg: Qt,
        cats: El,
      };
    }, [ce, vt, gt]),
    he = (s, v, C = "training") => {
      const z = Pu(s),
        O = z === Ca,
        at = z === Fl;
      let mt = {
          length: 0,
        },
        Qt = [];
      if (C === "checkin")
        ((Qt = Object.values(ce).filter((Z) => Z.date === z)),
          _t !== "全部" && (Qt = Qt.filter((Z) => Z.cat === _t)),
          (mt = Qt));
      else {
        const Z = du(z);
        mt = _t === "全部" ? Z : Z.filter((Mt) => Mt.cat === _t);
      }
      const na = Qt.length
        ? Math.round(Qt.reduce((Z, El) => Z + El.pct, 0) / Qt.length)
        : 0;
      return (
        <section
          className={`day-cell ${C === "training" && U ? "drop-ready" : ""} ${at ? "active" : ""} ${O ? "today" : ""}`}
          onDragOver={(Z) => C === "training" && Z.preventDefault()}
          onDrop={() => C === "training" && mi(z)}
          key={z}
        >
          {[
            <header onClick={() => Gl(z)}>
              {[
                <span className={"dnum"}>{s.getDate()}</span>,
                C === "checkin" && z <= Ca && Qt.length > 0 && (
                  <i
                    className={"day-dot"}
                    style={{
                      background: vv(na),
                    }}
                  />
                ),
                v && <h4>{Mc[(s.getDay() + 6) % 7]}</h4>,
                <b>{mt.length}</b>,
              ]}
            </header>,
            <div className={"day-body"}>
              {[
                C === "checkin"
                  ? Qt.map((Z) => (
                      <article
                        className={`training-card tone-${Z.tone} ${Z.pct >= 100 ? "done" : ""} ${it ? "editable" : ""}`}
                        onClick={() => {
                          it ? ea(Z) : oe(!0);
                        }}
                        key={Z.uid}
                      >
                        {[
                          <div className={"tc-head"}>
                            {[
                              <h5 className={"tc-name"}>{Z.name}</h5>,
                              <div className={"tc-meta"}>
                                {<span className={"tc-cat"}>{Z.cat}</span>}
                              </div>,
                            ]}
                          </div>,
                          Z.duration && (
                            <div className={"tc-dur"}>{Z.duration}</div>
                          ),
                          Z.desc && <p className={"tc-note"}>{Z.desc}</p>,
                          Z.comments && (
                            <p
                              className={"tc-comments"}
                              dangerouslySetInnerHTML={{
                                __html: _e(Z.comments),
                              }}
                            />
                          ),
                          <div
                            className={"tc-progress"}
                            onClick={(El) => {
                              (El.stopPropagation(), it ? ea(Z) : oe(!0));
                            }}
                            title={
                              it ? "点击修改完成度与 Comments" : "登录后可记录"
                            }
                          >
                            {[
                              <div className={"tc-bar"}>
                                {
                                  <i
                                    style={{
                                      width: `${Z.pct}%`,
                                    }}
                                  />
                                }
                              </div>,
                              <span className={"tc-pct-val"}>
                                {[Z.pct, "%"]}
                              </span>,
                            ]}
                          </div>,
                        ]}
                      </article>
                    ))
                  : mt.map((Z) => (
                      <article
                        className={`training-card tone-${Z.tone} ${C === "training" && it ? "editable" : ""}`}
                        draggable={C === "training" && it}
                        onDragStart={() =>
                          C === "training" &&
                          it &&
                          V({
                            kind: "move",
                            uid: Z.uid,
                          })
                        }
                        onDragEnd={() => V(null)}
                        onClick={() => {
                          it && le(Z);
                        }}
                        key={Z.uid}
                      >
                        {[
                          <div className={"tc-head"}>
                            {[
                              <h5 className={"tc-name"}>{Z.name}</h5>,
                              <div className={"tc-meta"}>
                                {[
                                  <span className={"tc-cat"}>{Z.cat}</span>,
                                  C === "training" && it && (
                                    <button
                                      className={"tc-del"}
                                      onClick={(El) => {
                                        (El.stopPropagation(), la(Z.uid));
                                      }}
                                      aria-label={"删除"}
                                    >
                                      {"×"}
                                    </button>
                                  ),
                                ]}
                              </div>,
                            ]}
                          </div>,
                          Z.duration && (
                            <div className={"tc-dur"}>{Z.duration}</div>
                          ),
                          Z.note && <p className={"tc-note"}>{Z.note}</p>,
                        ]}
                      </article>
                    )),
                C === "training" && !mt.length && !it && (
                  <div className={"empty"}>{U ? "放到这里" : "休息"}</div>
                ),
                C === "training" && !mt.length && it && (
                  <button
                    className={"day-add-box"}
                    aria-label={"添加训练"}
                    onClick={(Z) => {
                      (Z.stopPropagation(), Ce(z));
                    }}
                  >
                    {[
                      <span className={"plus"}>{"＋"}</span>,
                      <span className={"lbl"}>{"添加训练"}</span>,
                    ]}
                  </button>
                ),
                C === "training" && mt.length > 0 && it && (
                  <button
                    className={"day-add-bar"}
                    aria-label={"添加训练"}
                    onClick={(Z) => {
                      (Z.stopPropagation(), Ce(z));
                    }}
                  >
                    {[<span className={"plus"}>{"＋"}</span>, "添加训练"]}
                  </button>
                ),
                C === "checkin" &&
                  !mt.length &&
                  (it ? (
                    <button
                      className={"day-add-box"}
                      aria-label={"添加记录"}
                      onClick={(Z) => {
                        (Z.stopPropagation(), ee(z));
                      }}
                    >
                      {[
                        <span className={"plus"}>{"＋"}</span>,
                        <span className={"lbl"}>{"添加记录"}</span>,
                      ]}
                    </button>
                  ) : (
                    <div className={"empty"}>{"休息"}</div>
                  )),
                C === "checkin" && mt.length > 0 && it && (
                  <button
                    className={"day-add-bar"}
                    aria-label={"添加记录"}
                    onClick={(Z) => {
                      (Z.stopPropagation(), ee(z));
                    }}
                  >
                    {[<span className={"plus"}>{"＋"}</span>, "添加记录"]}
                  </button>
                ),
              ]}
            </div>,
          ]}
        </section>
      );
    };
  return (
    <main className={"calendar-app"}>
      {[
        <header className={"calendar-header"}>
          {[
            <div className={"brand"}>
              {[
                <div className={"brand-left"}>
                  {[
                    <span>{"WANG A MIAO"}</span>,
                    <b className={"brand-sub"}>{"RACE & TRAINING / 2027"}</b>,
                  ]}
                </div>,
                <div className={"brand-right"}>
                  {[
                    <div className={"auth-box"}>
                      {it ? (
                        <jsxRuntime.Fragment>
                          {
                            <button className={"auth-btn me"} onClick={qc}>
                              {"已登录 · 退出"}
                            </button>
                          }
                        </jsxRuntime.Fragment>
                      ) : (
                        <button
                          className={"auth-btn"}
                          onClick={() => {
                            (Ha(""), oe(!0));
                          }}
                        >
                          {"log in"}
                        </button>
                      )}
                    </div>,
                    <div className={"cloud-actions"}>
                      {[
                        <button
                          className={"auth-btn"}
                          onClick={ta}
                          disabled={Te}
                        >
                          {"从云端下载"}
                        </button>,
                        <button
                          className={"auth-btn save"}
                          onClick={fi}
                          disabled={Te || !it}
                          title={it ? "" : "请先登录 GitHub"}
                        >
                          {"上传到云端"}
                        </button>,
                      ]}
                    </div>,
                    it && je && <span className={"save-status"}>{je}</span>,
                    it && (
                      <div className={"header-settings"} ref={Ga}>
                        {[
                          <button
                            className={"settings-btn"}
                            onClick={() => nu((s) => !s)}
                            aria-expanded={La}
                            aria-label={"设置"}
                          >
                            {"⚙ 设置"}
                          </button>,
                          La && (
                            <div
                              className={"settings-menu"}
                              role={"menu"}
                              aria-label={"设置菜单"}
                            >
                              {[
                                <div className={"settings-row"}>
                                  {[
                                    <span className={"settings-label"}>
                                      {"配色方案"}
                                    </span>,
                                    <select
                                      className={"theme-select"}
                                      value={Ne}
                                      onChange={(s) => qa(s.target.value)}
                                      aria-label={"配色方案"}
                                    >
                                      {[
                                        <option value={"dark"}>
                                          {"狗狗黑"}
                                        </option>,
                                        <option value={"misty"}>
                                          {"喵喵粉"}
                                        </option>,
                                      ]}
                                    </select>,
                                  ]}
                                </div>,
                                <div className={"settings-row"}>
                                  {[
                                    <span className={"settings-label"}>
                                      {"连接你的佳明"}
                                    </span>,
                                    <div className={"garmin-sync"}>
                                      {Ba ? (
                                        <jsxRuntime.Fragment>
                                          {[
                                            <button
                                              className={"garmin-btn"}
                                              onClick={() => dn()}
                                              disabled={au}
                                            >
                                              {au ? "同步中…" : "同步佳明"}
                                            </button>,
                                            <button
                                              className={"garmin-link"}
                                              onClick={uu}
                                              title={"断开佳明连接"}
                                            >
                                              {"断开"}
                                            </button>,
                                          ]}
                                        </jsxRuntime.Fragment>
                                      ) : (
                                        <button
                                          className={"garmin-btn"}
                                          onClick={() => {
                                            (nu(!1), Ql(!0));
                                          }}
                                        >
                                          {"账号登录"}
                                        </button>
                                      )}
                                    </div>,
                                  ]}
                                </div>,
                                Xl && <p className={"settings-status"}>{Xl}</p>,
                              ]}
                            </div>
                          ),
                        ]}
                      </div>
                    ),
                  ]}
                </div>,
              ]}
            </div>,
            <div className={"headline"}>
              {[
                <div>
                  {
                    <h1>
                      {[
                        <span className={"h-line1"}>
                          {
                            <span className={"h-name"}>
                              {[
                                <svg
                                  className={"daisy daisy-mini"}
                                  viewBox={"0 0 120 120"}
                                  aria-hidden={"true"}
                                >
                                  {[
                                    Array.from({
                                      length: 12,
                                    }).map((s, v) => (
                                      <ellipse
                                        cx={"60"}
                                        cy={"26"}
                                        rx={"6.5"}
                                        ry={"23"}
                                        fill={"#ffffff"}
                                        transform={`rotate(${v * 30} 60 60)`}
                                        key={v}
                                      />
                                    )),
                                    <circle
                                      cx={"60"}
                                      cy={"60"}
                                      r={"15"}
                                      fill={"#ffd84d"}
                                    />,
                                    <circle
                                      cx={"60"}
                                      cy={"60"}
                                      r={"15"}
                                      fill={"none"}
                                      stroke={"#f2b705"}
                                      strokeWidth={"2"}
                                    />,
                                  ]}
                                </svg>,
                                "王阿喵",
                                <small className={"h-no"}>{"の"}</small>,
                              ]}
                            </span>
                          }
                        </span>,
                        <em className={"h-plan"}>{"参赛·训练计划"}</em>,
                      ]}
                    </h1>
                  }
                </div>,
                <div className={"year"}>
                  {
                    <div className={"year-main"}>
                      {[
                        <strong>{"2027"}</strong>,
                        <span className={"year-sep"} aria-hidden={"true"} />,
                        <span className={"year-note"}>
                          {["拖拽卡片，", <br />, "安排你的赛季与训练"]}
                        </span>,
                      ]}
                    </div>
                  }
                </div>,
              ]}
            </div>,
            <div className={"stats"}>
              {[
                <div>{[<b>{"5"}</b>, <span>{"目标窗口"}</span>]}</div>,
                <div>{[<b>{"20"}</b>, <span>{"候选赛事"}</span>]}</div>,
                <div>{[<b>{"4"}</b>, <span>{"UTMB分站"}</span>]}</div>,
                <div>{[<b>{ft.length}</b>, <span>{"训练类型"}</span>]}</div>,
              ]}
            </div>,
          ]}
        </header>,
        <nav className={"tabs"} aria-label={"视图切换"}>
          {[
            <button
              className={y === "race" ? "active" : ""}
              onClick={() => Q("race")}
            >
              {
                <span className={"tab-text"}>
                  {["参赛计划", <span className={"en"}>{"RACE PLAN"}</span>]}
                </span>
              }
            </button>,
            <button
              className={y === "training" ? "active" : ""}
              onClick={() => Q("training")}
            >
              {
                <span className={"tab-text"}>
                  {[
                    "训练计划",
                    <span className={"en"}>{"TRAINING PLAN"}</span>,
                  ]}
                </span>
              }
            </button>,
            <button
              className={y === "checkin" ? "active" : ""}
              onClick={() => Q("checkin")}
            >
              {
                <span className={"tab-text"}>
                  {["Takeaway", <span className={"en"}>{"TAKEAWAY"}</span>]}
                </span>
              }
            </button>,
            <button
              className={y === "analysis" ? "active" : ""}
              onClick={() => Q("analysis")}
            >
              {
                <span className={"tab-text"}>
                  {[
                    "数据分析",
                    <span className={"en"}>{"TRAIL RACE LAB"}</span>,
                  ]}
                </span>
              }
            </button>,
          ]}
        </nav>,
        <div className={"view-frame"} key={y}>
          {y === "race" ? (
            <jsxRuntime.Fragment>
              {[
                <section className={"toolbar"} aria-label={"日历查询工具"}>
                  {[
                    <label className={"search"}>
                      {[
                        <span>{"搜索"}</span>,
                        <input
                          value={w}
                          onChange={(s) => k(s.target.value)}
                          placeholder={"赛事、城市、组别、报名时间…"}
                        />,
                        w && (
                          <button onClick={() => k("")} aria-label={"清空搜索"}>
                            {"×"}
                          </button>
                        ),
                      ]}
                    </label>,
                    <div className={"filters"} aria-label={"筛选赛事"}>
                      {["全部", "首选", "UTMB", "全马"].map((s) => (
                        <button
                          className={W === s ? "active" : ""}
                          onClick={() => q(s)}
                          key={s}
                        >
                          {s}
                        </button>
                      ))}
                    </div>,
                    it && (
                      <button
                        className={"reset"}
                        onClick={() => lt(defaultPlacements)}
                      >
                        {"恢复原计划"}
                      </button>
                    ),
                  ]}
                </section>,
                <div className={"workspace"}>
                  {[
                    <section
                      className={"calendar-board"}
                      aria-label={"2027赛事日历"}
                    >
                      {monthNames.map((s, v) => {
                        const C = v + 1,
                          z = ri.filter((O) => T[O.id] === C);
                        return (
                          <section
                            className={`month-cell ${Pt ? "drop-ready" : ""}`}
                            onDragOver={(O) => O.preventDefault()}
                            onDrop={() => {
                              (Pt && oi(Pt, C), tl(null));
                            }}
                            key={s}
                          >
                            {[
                              <header>
                                {[
                                  <span>{String(C).padStart(2, "0")}</span>,
                                  <h2>{s}</h2>,
                                  <b>{z.length}</b>,
                                ]}
                              </header>,
                              <div className={"month-body"}>
                                {[
                                  z.map((O) => (
                                    <article
                                      draggable={it}
                                      className={`race-card ${O.role.startsWith("首选") ? "is-primary" : ""} ${O.type === "UTMB" ? "is-utmb" : ""} ${_ === O.id ? "selected" : ""}`}
                                      onDragStart={() => tl(O.id)}
                                      onDragEnd={() => tl(null)}
                                      onClick={() => At(O.id)}
                                      tabIndex={0}
                                      onKeyDown={(at) => {
                                        at.key === "Enter" && At(O.id);
                                      }}
                                      key={O.id}
                                    >
                                      {[
                                        <div className={"card-top"}>
                                          {[
                                            <span>{O.role}</span>,
                                            <b>{O.type}</b>,
                                          ]}
                                        </div>,
                                        <h3>{O.name}</h3>,
                                        <p>{[O.date, " · ", O.location]}</p>,
                                        <small>{O.category}</small>,
                                      ]}
                                    </article>
                                  )),
                                  !z.length && (
                                    <div className={"empty"}>
                                      {Pt ? "放到这里" : "暂无赛事"}
                                    </div>
                                  ),
                                ]}
                              </div>,
                            ]}
                          </section>
                        );
                      })}
                    </section>,
                    <aside className={"detail-panel"}>
                      {
                        <div className={"detail-sticky"}>
                          {[
                            <p className={"panel-label"}>{"RACE DETAIL"}</p>,
                            <div className={"detail-role"}>
                              {[<span>{bl.role}</span>, <b>{bl.type}</b>]}
                            </div>,
                            <h2>{bl.name}</h2>,
                            <dl>
                              {[
                                <div>
                                  {[<dt>{"比赛日期"}</dt>, <dd>{bl.date}</dd>]}
                                </div>,
                                <div>
                                  {[<dt>{"组别"}</dt>, <dd>{bl.category}</dd>]}
                                </div>,
                                <div>
                                  {[<dt>{"地点"}</dt>, <dd>{bl.location}</dd>]}
                                </div>,
                                <div>
                                  {[
                                    <dt>{"预计报名"}</dt>,
                                    <dd>{bl.signup}</dd>,
                                  ]}
                                </div>,
                              ]}
                            </dl>,
                            <label className={"move-select"}>
                              {[
                                "安排到",
                                <select
                                  value={T[bl.id]}
                                  disabled={!it}
                                  onChange={(s) =>
                                    oi(bl.id, Number(s.target.value))
                                  }
                                >
                                  {monthNames.map((s, v) => (
                                    <option value={v + 1} key={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>,
                              ]}
                            </label>,
                            bl.url ? (
                              <a
                                className={"official-link"}
                                href={bl.url}
                                target={"_blank"}
                                rel={"noreferrer"}
                              >
                                {[
                                  "访问报名官网 ",
                                  <span>{"↗"}</span>,
                                  <small>{bl.official}</small>,
                                ]}
                              </a>
                            ) : (
                              <div className={"official-note"}>
                                {[
                                  <b>{"报名渠道"}</b>,
                                  <span>{bl.official}</span>,
                                ]}
                              </div>
                            ),
                            <p className={"drag-tip"}>
                              {
                                "桌面端可拖动赛事卡片到其他月份；手机端可使用上方“安排到”菜单。"
                              }
                            </p>,
                          ]}
                        </div>
                      }
                    </aside>,
                  ]}
                </div>,
                <section className={"guide"}>
                  {[
                    <img
                      className={
                        "section-mascot section-mascot--bottom section-mascot--left"
                      }
                      src={"mascot-bubbles.svg"}
                      alt={""}
                      aria-hidden={"true"}
                    />,
                    <div className={"sec-head"}>
                      {[
                        <h2>{"报名补充说明"}</h2>,
                        <p className={"panel-label"}>{"REGISTRATION GUIDE"}</p>,
                      ]}
                    </div>,
                    <div className={"guide-grid"}>
                      {[
                        <article>
                          {[
                            <span>{"01"}</span>,
                            <h3>{"数字心动APP"}</h3>,
                            <p>
                              {
                                "兰州、青岛、长春、大连等马拉松可通过赛事官网或官方合作平台报名。具体入口和开放时间请以赛事公告为准。"
                              }
                            </p>,
                          ]}
                        </article>,
                        <article>
                          {[
                            <span>{"02"}</span>,
                            <h3>{"UTMB系列赛"}</h3>,
                            <p>
                              {
                                "高黎贡、云丘山、济州岛、TransLantau需先注册UTMB账户，再进入分站官网完成报名与跑石管理。宁海为非UTMB赛事。"
                              }
                            </p>,
                            <a
                              href={"https://www.utmb.world"}
                              target={"_blank"}
                              rel={"noreferrer"}
                            >
                              {"注册 UTMB 账户 ↗"}
                            </a>,
                          ]}
                        </article>,
                        <article>
                          {[
                            <span>{"03"}</span>,
                            <h3>{"第三方报名平台"}</h3>,
                            <p>
                              {
                                "广州100可在马拉马拉APP搜索报名；深圳100、阳朔100等赛事若官网未开放，可能通过官方公众号或第三方平台发布入口，请以最新公告为准。"
                              }
                            </p>,
                          ]}
                        </article>,
                      ]}
                    </div>,
                    <p className={"disclaimer"}>
                      {
                        "以上网址及日期基于历年信息推测，实际报名请以赛事官方最终通告为准。建议在报名窗口开启前一个月确认官网或订阅邮件通知。"
                      }
                    </p>,
                  ]}
                </section>,
              ]}
            </jsxRuntime.Fragment>
          ) : y === "training" ? (
            <jsxRuntime.Fragment>
              {[
                <section
                  className={"training-toolbar"}
                  aria-label={"训练计划工具"}
                >
                  {[
                    <div className={"tf-left"}>
                      {[
                        <div className={"view-toggle"} aria-label={"视图切换"}>
                          {[
                            <button
                              className={vt === "week" ? "active" : ""}
                              onClick={() => Wt("week")}
                            >
                              {"周视图"}
                            </button>,
                            <button
                              className={vt === "month" ? "active" : ""}
                              onClick={() => Wt("month")}
                            >
                              {"月视图"}
                            </button>,
                          ]}
                        </div>,
                        <div className={"nav"}>
                          {[
                            <button onClick={me} aria-label={"上一页"}>
                              {"‹"}
                            </button>,
                            <span className={"period-label"}>{ol}</span>,
                            <button onClick={wa} aria-label={"下一页"}>
                              {"›"}
                            </button>,
                            <button className={"today"} onClick={aa}>
                              {"今天"}
                            </button>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    <div className={"tf-right"}>
                      {[
                        <div className={"filters"} aria-label={"筛选训练类型"}>
                          {Bm.map((s) => (
                            <button
                              className={_t === s ? "active" : ""}
                              onClick={() => j(s)}
                              key={s}
                            >
                              {s}
                            </button>
                          ))}
                        </div>,
                        it && cn && (
                          <button className={"reset undo-btn"} onClick={sn}>
                            {"↺ 撤销上一步"}
                          </button>
                        ),
                      ]}
                    </div>,
                  ]}
                </section>,
                <div className={"training-workspace" + (P ? " collapsed" : "")}>
                  {[
                    <aside className={"palette" + (P ? " collapsed" : "")}>
                      {[
                        <div className={"palette-head"}>
                          {[
                            <h3>{"基础训练库"}</h3>,
                            !P && (
                              <button
                                className={"rail-toggle"}
                                aria-label={"收起训练库"}
                                onClick={() => sl(!0)}
                                title={"收起"}
                              >
                                {"‹"}
                              </button>
                            ),
                          ]}
                        </div>,
                        <p className={"hint"}>
                          {it
                            ? `点击添加到「${_f(Fl)}」，或拖拽到日历任意日期。训练类型可自定义增删。`
                            : "查看模式 · 登录后可添加与编辑训练"}
                        </p>,
                        it && (
                          <button
                            className={"palette-add"}
                            onClick={() => A(!0)}
                          >
                            {[
                              <span className={"pa-plus"}>{"＋"}</span>,
                              " 新建训练类型",
                            ]}
                          </button>
                        ),
                        Lc.map((s) => (
                          <div
                            className={"tlib"}
                            draggable={it}
                            onDragStart={() =>
                              it &&
                              V({
                                kind: "new",
                                libId: s.id,
                              })
                            }
                            onDragEnd={() => V(null)}
                            onClick={() => it && hn(s.id, Fl)}
                            key={s.id}
                          >
                            {[
                              <span className={`dot tone-${s.tone}`} />,
                              <span className={"nm"}>{s.name}</span>,
                              <span className={"ct"}>{s.cat}</span>,
                              it && (
                                <button
                                  className={"lib-edit"}
                                  aria-label={"编辑训练类型"}
                                  onClick={(v) => {
                                    (v.stopPropagation(), Yc(s));
                                  }}
                                >
                                  {"✎"}
                                </button>
                              ),
                              it && (
                                <button
                                  className={"lib-del"}
                                  aria-label={"删除训练类型"}
                                  onClick={(v) => {
                                    (v.stopPropagation(), Bc(s.id));
                                  }}
                                >
                                  {"×"}
                                </button>
                              ),
                            ]}
                          </div>
                        )),
                        it && (
                          <div className={"palette-actions"}>
                            {[
                              <button className={"reset mini"} onClick={Oa}>
                                {"保存为默认库"}
                              </button>,
                              <button className={"reset mini"} onClick={Hc}>
                                {"恢复默认库"}
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </aside>,
                    P && (
                      <button
                        className={"rail-expand"}
                        onClick={() => sl(!1)}
                        title={"展开基础训练库"}
                      >
                        {"› 基础训练库"}
                      </button>
                    ),
                    <div className={"board-area"}>
                      {[
                        <div className={"month-watermark"} aria-hidden={"true"}>
                          {
                            monthNames[
                              vt === "week"
                                ? Jn(gt)[0].getMonth()
                                : gt.getMonth()
                            ]
                          }
                        </div>,
                        vt === "week" ? (
                          <section
                            className={"week-board"}
                            aria-label={"训练周历"}
                          >
                            {Jn(gt).map((s) => he(s, !0))}
                          </section>
                        ) : (
                          <div className={"month-wrap"}>
                            {[
                              <div
                                className={"month-weekdays"}
                                aria-hidden={"true"}
                              >
                                {Mc.map((s) => (
                                  <span key={s}>{s}</span>
                                ))}
                              </div>,
                              <section
                                className={"week-board month"}
                                aria-label={"训练月历"}
                                style={{
                                  "--weeks": Gm(gt),
                                }}
                              >
                                {Kf(gt).map((s, v) =>
                                  s ? (
                                    he(s, !1)
                                  ) : (
                                    <div
                                      className={"day-cell other"}
                                      key={`o${v}`}
                                    >
                                      {
                                        <span className={"dnum other"}>
                                          {s ? s.getDate() : ""}
                                        </span>
                                      }
                                    </div>
                                  ),
                                )}
                              </section>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>,
                <section className={"training-guide"}>
                  {[
                    <img
                      className={
                        "section-mascot section-mascot--bottom section-mascot--center"
                      }
                      src={"mascot-blossom.svg"}
                      alt={""}
                      aria-hidden={"true"}
                    />,
                    <div className={"sec-head"}>
                      {[
                        <h2>{"基础训练说明"}</h2>,
                        <p className={"panel-label"}>{"TRAINING BASICS"}</p>,
                      ]}
                    </div>,
                    <div className={"tg-grid"}>
                      {ft.map((s) => (
                        <article key={s.id}>
                          {[
                            <div className={"tg-head"}>
                              {[<h3>{s.name}</h3>, <span>{s.cat}</span>]}
                            </div>,
                            <p>{s.desc || "自定义训练类型"}</p>,
                          ]}
                        </article>
                      ))}
                    </div>,
                    <p className={"disclaimer"}>
                      {
                        "以上内容为基础训练类型参考，具体强度、距离与时长请结合个人能力、伤病恢复与教练建议安排。比赛前注意减量恢复。"
                      }
                    </p>,
                  ]}
                </section>,
              ]}
            </jsxRuntime.Fragment>
          ) : y === "checkin" ? (
            <jsxRuntime.Fragment>
              {[
                <section
                  className={"training-toolbar"}
                  aria-label={"Takeaway 工具"}
                >
                  {[
                    <div className={"tf-left"}>
                      {[
                        <div className={"view-toggle"} aria-label={"视图切换"}>
                          {[
                            <button
                              className={vt === "week" ? "active" : ""}
                              onClick={() => Wt("week")}
                            >
                              {"周视图"}
                            </button>,
                            <button
                              className={vt === "month" ? "active" : ""}
                              onClick={() => Wt("month")}
                            >
                              {"月视图"}
                            </button>,
                          ]}
                        </div>,
                        <div className={"nav"}>
                          {[
                            <button onClick={me} aria-label={"上一页"}>
                              {"‹"}
                            </button>,
                            <span className={"period-label"}>{ol}</span>,
                            <button onClick={wa} aria-label={"下一页"}>
                              {"›"}
                            </button>,
                            <button className={"today"} onClick={aa}>
                              {"今天"}
                            </button>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    <div className={"tf-right"}>
                      {[
                        <div className={"filters"} aria-label={"筛选训练类型"}>
                          {Bm.map((s) => (
                            <button
                              className={_t === s ? "active" : ""}
                              onClick={() => j(s)}
                              key={s}
                            >
                              {s}
                            </button>
                          ))}
                        </div>,
                        !it && (
                          <span className={"hint"}>
                            {"登录后点击卡片进度条即可记录完成度与 Comments"}
                          </span>
                        ),
                      ]}
                    </div>,
                  ]}
                </section>,
                <div
                  className={
                    "training-workspace checkin" + (fl ? " collapsed" : "")
                  }
                >
                  {[
                    <aside
                      className={"checkin-stats" + (fl ? " collapsed" : "")}
                    >
                      {[
                        <div className={"cis-head"}>
                          {
                            <div className={"cis-head-row"}>
                              {[
                                <div>
                                  {[
                                    <h3>{"Takeaway 统计"}</h3>,
                                    <p className={"panel-label"}>
                                      {"TAKEAWAY STATS"}
                                    </p>,
                                  ]}
                                </div>,
                                !fl && (
                                  <button
                                    className={"rail-toggle"}
                                    aria-label={"收起统计"}
                                    onClick={() => pe(!0)}
                                    title={"收起"}
                                  >
                                    {"‹"}
                                  </button>
                                ),
                              ]}
                            </div>
                          }
                        </div>,
                        <div className={"cis-hero"}>
                          {[
                            <div className={"cis-hero-num"}>
                              {[<b>{Sl.avg}</b>, <span>{"%"}</span>]}
                            </div>,
                            <div className={"cis-hero-label"}>
                              {[
                                "平均完成度（已完成 ",
                                Sl.done,
                                " / 总 ",
                                Sl.total,
                                " 次）",
                              ]}
                            </div>,
                            <div className={"cis-bar"}>
                              {
                                <i
                                  style={{
                                    width: `${Sl.avg}%`,
                                  }}
                                />
                              }
                            </div>,
                            <div className={"cis-hero-rate"}>
                              {["整体完成度 ", Sl.avg, "%"]}
                            </div>,
                          ]}
                        </div>,
                        <div className={"cis-period"}>
                          {[
                            <div className={"cis-row"}>
                              {[
                                <span>
                                  {vt === "week" ? "本周完成度" : "本月完成度"}
                                </span>,
                                <b>{[Sl.periodAvg, "%"]}</b>,
                              ]}
                            </div>,
                            <div className={"cis-bar sm"}>
                              {
                                <i
                                  style={{
                                    width: `${Sl.periodAvg}%`,
                                  }}
                                />
                              }
                            </div>,
                            <div className={"cis-row"}>
                              {[
                                <span>
                                  {vt === "week" ? "本周已记录" : "本月已记录"}
                                </span>,
                                <b>{[Sl.periodDone, " / ", Sl.periodTotal]}</b>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <div className={"cis-cats"}>
                          {[
                            <p className={"cis-sub"}>{"分类完成度"}</p>,
                            Sl.cats.length === 0 ? (
                              <p className={"cis-empty"}>{"暂无训练数据"}</p>
                            ) : (
                              Sl.cats.map(([s, v]) => (
                                <div className={"cis-cat"} key={s}>
                                  {[
                                    <span className={"cis-cat-name"}>{s}</span>,
                                    <span className={"cis-cat-val"}>
                                      {[v.total, " 次 · ", v.avg, "%"]}
                                    </span>,
                                    <div className={"cis-bar xsm"}>
                                      {
                                        <i
                                          style={{
                                            width: `${v.avg}%`,
                                          }}
                                        />
                                      }
                                    </div>,
                                  ]}
                                </div>
                              ))
                            ),
                          ]}
                        </div>,
                        !it && (
                          <p className={"cis-hint"}>
                            {"登录后点击卡片进度条即可记录完成度与 Comments"}
                          </p>
                        ),
                        <div className={"itra-panel"}>
                          {
                            <div className={"itra-head"}>
                              {[
                                <div className={"itra-title"}>
                                  {[
                                    <h4>{"ITRA"}</h4>,
                                    <p className={"panel-label"}>
                                      {"PERFORMANCE INDEX"}
                                    </p>,
                                  ]}
                                </div>,
                                L ? (
                                  <jsxRuntime.Fragment>
                                    {[
                                      <div className={"itra-who-mini"}>
                                        {[
                                          <img
                                            className={"itra-avatar-img"}
                                            src={"itra-avatar.png"}
                                            alt={""}
                                            aria-hidden={"true"}
                                          />,
                                          <div className={"itra-id-mini"}>
                                            {[
                                              <div className={"itra-name-mini"}>
                                                {L.name}
                                              </div>,
                                              <div className={"itra-meta-mini"}>
                                                {[
                                                  "ITRA ID ",
                                                  L.runnerId,
                                                  " · ",
                                                  L.nationality,
                                                  L.age ? ` · ${L.age}` : "",
                                                ]}
                                              </div>,
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                      <div className={"itra-pi"}>
                                        {[
                                          <div className={"itra-pi-label"}>
                                            {[
                                              "Performance Index",
                                              L.level && (
                                                <span className={"itra-level"}>
                                                  {L.level}
                                                </span>
                                              ),
                                            ]}
                                          </div>,
                                          <div className={"itra-pi-num"}>
                                            {L.performanceIndex ?? "--"}
                                          </div>,
                                        ]}
                                      </div>,
                                      L.worldTop && (
                                        <div className={"itra-worldtop"}>
                                          {["World Top ", L.worldTop]}
                                        </div>
                                      ),
                                      <div className={"itra-grid"}>
                                        {[
                                          L.generalStats.finishedRaces !==
                                            null && (
                                            <div>
                                              {[
                                                <b>
                                                  {L.generalStats.finishedRaces}
                                                </b>,
                                                <span>{"完赛"}</span>,
                                              ]}
                                            </div>
                                          ),
                                          L.generalStats.totalDistance && (
                                            <div>
                                              {[
                                                <b>
                                                  {L.generalStats.totalDistance}
                                                </b>,
                                                <span>{"总距离"}</span>,
                                              ]}
                                            </div>
                                          ),
                                          L.generalStats.totalRaceTime && (
                                            <div>
                                              {[
                                                <b>
                                                  {L.generalStats.totalRaceTime}
                                                </b>,
                                                <span>{"总用时"}</span>,
                                              ]}
                                            </div>
                                          ),
                                          L.generalStats.totalElevation && (
                                            <div>
                                              {[
                                                <b>
                                                  {
                                                    L.generalStats
                                                      .totalElevation
                                                  }
                                                </b>,
                                                <span>{"总爬升"}</span>,
                                              ]}
                                            </div>
                                          ),
                                          L.generalStats
                                            .longestRaceDistance && (
                                            <div>
                                              {[
                                                <b>
                                                  {
                                                    L.generalStats
                                                      .longestRaceDistance
                                                  }
                                                </b>,
                                                <span>{"最长距离"}</span>,
                                              ]}
                                            </div>
                                          ),
                                          L.ranking.bestRaceRanking !==
                                            null && (
                                            <div>
                                              {[
                                                <b>
                                                  {L.ranking.bestRaceRanking ===
                                                  1
                                                    ? "冠军"
                                                    : `No.${L.ranking.bestRaceRanking}`}
                                                </b>,
                                                <span>{"最佳排名"}</span>,
                                              ]}
                                            </div>
                                          ),
                                        ]}
                                      </div>,
                                      <div className={"itra-foot"}>
                                        {[
                                          <div className={"itra-foot-left"}>
                                            {L.ranking.bestRaceRankingTitle && (
                                              <div
                                                className={"itra-best"}
                                                title={
                                                  L.ranking.bestRaceRankingTitle
                                                }
                                              >
                                                {[
                                                  "最佳：",
                                                  L.ranking
                                                    .bestRaceRankingTitle,
                                                  L.ranking
                                                    .bestRaceRankingDate && (
                                                    <div
                                                      className={
                                                        "itra-best-date"
                                                      }
                                                    >
                                                      {
                                                        L.ranking
                                                          .bestRaceRankingDate
                                                      }
                                                    </div>
                                                  ),
                                                ]}
                                              </div>
                                            )}
                                          </div>,
                                          <div className={"itra-foot-right"}>
                                            {[
                                              <div
                                                className={"itra-links-mini"}
                                              >
                                                {
                                                  <a
                                                    className={"itra-link"}
                                                    href={L.profileUrl}
                                                    target={"_blank"}
                                                    rel={"noreferrer"}
                                                  >
                                                    {"Details ↗"}
                                                  </a>
                                                }
                                              </div>,
                                              L.updatedAt && (
                                                <div className={"itra-updated"}>
                                                  {[
                                                    "更新于 ",
                                                    L.updatedAt.slice(0, 10),
                                                  ]}
                                                </div>
                                              ),
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                    ]}
                                  </jsxRuntime.Fragment>
                                ) : (
                                  <div className={"itra-loading"}>
                                    {"加载中…"}
                                  </div>
                                ),
                              ]}
                            </div>
                          }
                        </div>,
                      ]}
                    </aside>,
                    fl && (
                      <button
                        className={"rail-expand"}
                        onClick={() => pe(!1)}
                        title={"展开 Takeaway 统计"}
                      >
                        {"› Takeaway 统计"}
                      </button>
                    ),
                    <div className={"board-area"}>
                      {[
                        <div className={"month-watermark"} aria-hidden={"true"}>
                          {
                            monthNames[
                              vt === "week"
                                ? Jn(gt)[0].getMonth()
                                : gt.getMonth()
                            ]
                          }
                        </div>,
                        vt === "week" ? (
                          <section
                            className={"week-board"}
                            aria-label={"训练周历"}
                          >
                            {Jn(gt).map((s) => he(s, !0, "checkin"))}
                          </section>
                        ) : (
                          <div className={"month-wrap"}>
                            {[
                              <div
                                className={"month-weekdays"}
                                aria-hidden={"true"}
                              >
                                {Mc.map((s) => (
                                  <span key={s}>{s}</span>
                                ))}
                              </div>,
                              <section
                                className={"week-board month"}
                                aria-label={"训练月历"}
                                style={{
                                  "--weeks": Gm(gt),
                                }}
                              >
                                {Kf(gt).map((s, v) =>
                                  s ? (
                                    he(s, !1, "checkin")
                                  ) : (
                                    <div
                                      className={"day-cell other"}
                                      key={`o${v}`}
                                    >
                                      {
                                        <span className={"dnum other"}>
                                          {s ? s.getDate() : ""}
                                        </span>
                                      }
                                    </div>
                                  ),
                                )}
                              </section>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>,
                <section className={"training-guide"}>
                  {[
                    <img
                      className={
                        "section-mascot section-mascot--bottom section-mascot--right"
                      }
                      src={"mascot-buttercup.svg"}
                      alt={""}
                      aria-hidden={"true"}
                    />,
                    <div className={"sec-head"}>
                      {[
                        <h2>{"Takeaway 说明"}</h2>,
                        <p className={"panel-label"}>{"TAKEAWAY"}</p>,
                      ]}
                    </div>,
                    <div className={"tg-grid"}>
                      {[
                        <article>
                          {[
                            <div className={"tg-head"}>
                              {[<h3>{"如何记录"}</h3>, <span>{"记录"}</span>]}
                            </div>,
                            <p>
                              {
                                "点击训练卡片或进度条打开记录弹窗，实际训练内容可从基础训练库下拉选择；非训练日也可点「＋添加记录」手动补记。"
                              }
                            </p>,
                          ]}
                        </article>,
                        <article>
                          {[
                            <div className={"tg-head"}>
                              {[<h3>{"完成度"}</h3>, <span>{"记录"}</span>]}
                            </div>,
                            <p>
                              {
                                "0–100%，过去默认 100%、今天及以后默认 0%，可手动修改。日期旁圆点反映当天平均完成度（100% 绿 → 0% 深红），未来日期不显示。"
                              }
                            </p>,
                          ]}
                        </article>,
                        <article>
                          {[
                            <div className={"tg-head"}>
                              {[<h3>{"Comments"}</h3>, <span>{"记录"}</span>]}
                            </div>,
                            <p>
                              {
                                "记录当天感受、心率区间、配速、可复用经验等，便于赛后复盘与调整训练计划。"
                              }
                            </p>,
                          ]}
                        </article>,
                      ]}
                    </div>,
                    <p className={"disclaimer"}>
                      {
                        "Takeaway 与备注仅用于个人训练记录，请结合自身情况合理安排，注意伤病预防与恢复。"
                      }
                    </p>,
                  ]}
                </section>,
              ]}
            </jsxRuntime.Fragment>
          ) : (
            <section className={"analysis-page"}>
              {
                <div className={"analysis-launch"}>
                  {[
                    <span className={"al-badge"}>{"TRAIL RACE LAB"}</span>,
                    <h3>{"越野赛事数据实验室"}</h3>,
                    <p className={"al-desc"}>
                      {
                        "赛事数据与技术分析由 Trail Race Lab 提供。该应用托管于 Streamlit Community Cloud，平台代理层强制使用 SameSite=Lax 会话 Cookie，浏览器在 iframe 中不予发送，因此无法在本页内嵌加载——请在新标签页打开。"
                      }
                    </p>,
                    <a
                      className={"al-open"}
                      href={"https://trail-race-lab.streamlit.app/"}
                      target={"_blank"}
                      rel={"noopener noreferrer"}
                    >
                      {[
                        "打开 Trail Race Lab",
                        <span aria-hidden={"true"}>{"↗"}</span>,
                      ]}
                    </a>,
                  ]}
                </div>
              }
            </section>
          )}
        </div>,
        d && (
          <div className={"modal-overlay"} onClick={() => A(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"新建训练类型"}</h3>,
                      <button onClick={() => A(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"训练名称"}</label>,
                      <input
                        value={D.name}
                        onChange={(s) =>
                          B({
                            ...D,
                            name: s.target.value,
                          })
                        }
                        placeholder={"如：台阶训练"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"类型"}</label>,
                      <select
                        value={D.cat}
                        onChange={(s) =>
                          B({
                            ...D,
                            cat: s.target.value,
                          })
                        }
                      >
                        {$u.map((s) => (
                          <option value={s} key={s}>
                            {s}
                          </option>
                        ))}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"配色"}</label>,
                      <div className={"swatches"}>
                        {Ac.map((s) => (
                          <span
                            className={`swatch tone-${s} ${D.tone === s ? "sel" : ""}`}
                            onClick={() =>
                              B({
                                ...D,
                                tone: s,
                              })
                            }
                            title={Nc[s]}
                            key={s}
                          />
                        ))}
                      </div>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"默认时长 / 距离（可选）"}</label>,
                      <input
                        value={D.duration}
                        onChange={(s) =>
                          B({
                            ...D,
                            duration: s.target.value,
                          })
                        }
                        placeholder={"如 60min / 15km"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"说明（可选）"}</label>,
                      <input
                        value={D.desc}
                        onChange={(s) =>
                          B({
                            ...D,
                            desc: s.target.value,
                          })
                        }
                        placeholder={"如 提升下肢爆发力"}
                      />,
                    ]}
                  </div>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => A(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={cu}>
                        {"添加到训练库"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        F && (
          <div className={"modal-overlay"} onClick={() => $(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"编辑训练类型"}</h3>,
                      <button onClick={() => $(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"训练名称"}</label>,
                      <input
                        value={J.name}
                        onChange={(s) =>
                          Ht({
                            ...J,
                            name: s.target.value,
                          })
                        }
                        placeholder={"训练名称"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"类型"}</label>,
                      <select
                        value={J.cat}
                        onChange={(s) =>
                          Ht({
                            ...J,
                            cat: s.target.value,
                          })
                        }
                      >
                        {$u.map((s) => (
                          <option value={s} key={s}>
                            {s}
                          </option>
                        ))}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"配色"}</label>,
                      <div className={"swatches"}>
                        {Ac.map((s) => (
                          <span
                            className={`swatch tone-${s} ${J.tone === s ? "sel" : ""}`}
                            onClick={() =>
                              Ht({
                                ...J,
                                tone: s,
                              })
                            }
                            title={Nc[s]}
                            key={s}
                          />
                        ))}
                      </div>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"默认时长 / 距离（可选）"}</label>,
                      <input
                        value={J.duration}
                        onChange={(s) =>
                          Ht({
                            ...J,
                            duration: s.target.value,
                          })
                        }
                        placeholder={"如 60min / 15km"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"说明（可选）"}</label>,
                      <input
                        value={J.desc}
                        onChange={(s) =>
                          Ht({
                            ...J,
                            desc: s.target.value,
                          })
                        }
                        placeholder={"如 提升下肢爆发力"}
                      />,
                    ]}
                  </div>,
                  <p className={"hint"}>
                    {"仅修改基础训练库原始内容，已排进日历的训练不受影响。"}
                  </p>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => $(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={mn}>
                        {"保存"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        Rt && (
          <div className={"modal-overlay"} onClick={() => Il(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{["添加训练 · ", _f(Ve)]}</h3>,
                      <button onClick={() => Il(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>
                        {"基础训练库（下拉选择，带出该训练默认设置）"}
                      </label>,
                      <select
                        className={"lib-select"}
                        value={Ut.libId}
                        onChange={(s) => di(s.target.value)}
                      >
                        {[
                          <option value={""}>{"— 从基础库选择 —"}</option>,
                          ft.map((s) => (
                            <option value={s.id} key={s.id}>
                              {[
                                s.name,
                                " · ",
                                s.cat,
                                s.duration ? ` · ${s.duration}` : "",
                              ]}
                            </option>
                          )),
                          <option value={"__custom__"}>
                            {"✎ 自定义训练"}
                          </option>,
                        ]}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"训练名称"}</label>,
                      <input
                        value={Ut.name}
                        onChange={(s) =>
                          al({
                            ...Ut,
                            name: s.target.value,
                          })
                        }
                        placeholder={"如：乳酸门槛跑"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"类型"}</label>,
                      <select
                        value={Ut.cat}
                        onChange={(s) =>
                          al({
                            ...Ut,
                            cat: s.target.value,
                          })
                        }
                      >
                        {$u.map((s) => (
                          <option value={s} key={s}>
                            {s}
                          </option>
                        ))}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"配色"}</label>,
                      <div className={"swatches"}>
                        {Ac.map((s) => (
                          <span
                            className={`swatch tone-${s} ${Ut.tone === s ? "sel" : ""}`}
                            onClick={() =>
                              al({
                                ...Ut,
                                tone: s,
                              })
                            }
                            title={Nc[s]}
                            key={s}
                          />
                        ))}
                      </div>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"时长 / 距离（可选）"}</label>,
                      <input
                        value={Ut.duration}
                        onChange={(s) =>
                          al({
                            ...Ut,
                            duration: s.target.value,
                          })
                        }
                        placeholder={"如 60min / 15km"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"说明（可编辑）"}</label>,
                      <textarea
                        className={"desc-area"}
                        rows={3}
                        value={Ut.note}
                        onChange={(s) =>
                          al({
                            ...Ut,
                            note: s.target.value,
                          })
                        }
                        placeholder={
                          "从基础库选择后会带出说明，可在此修改；也可留空"
                        }
                      />,
                    ]}
                  </div>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => Il(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={fu}>
                        {"添加"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        Fn && (
          <div className={"modal-overlay"} onClick={() => Se(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{["编辑训练 · ", _f(Ft.date)]}</h3>,
                      <button onClick={() => Se(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"训练名称"}</label>,
                      <input
                        value={Ft.name}
                        onChange={(s) =>
                          xe({
                            ...Ft,
                            name: s.target.value,
                          })
                        }
                        placeholder={"训练名称"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"类型"}</label>,
                      <select
                        value={Ft.cat}
                        onChange={(s) =>
                          xe({
                            ...Ft,
                            cat: s.target.value,
                          })
                        }
                      >
                        {$u.map((s) => (
                          <option value={s} key={s}>
                            {s}
                          </option>
                        ))}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"配色"}</label>,
                      <div className={"swatches"}>
                        {Ac.map((s) => (
                          <span
                            className={`swatch tone-${s} ${Ft.tone === s ? "sel" : ""}`}
                            onClick={() =>
                              xe({
                                ...Ft,
                                tone: s,
                              })
                            }
                            title={Nc[s]}
                            key={s}
                          />
                        ))}
                      </div>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"时长 / 距离（可选）"}</label>,
                      <input
                        value={Ft.duration}
                        onChange={(s) =>
                          xe({
                            ...Ft,
                            duration: s.target.value,
                          })
                        }
                        placeholder={"如 60min / 15km"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"说明 / 备注（可选）"}</label>,
                      <input
                        value={Ft.note}
                        onChange={(s) =>
                          xe({
                            ...Ft,
                            note: s.target.value,
                          })
                        }
                        placeholder={"如 心率区间2"}
                      />,
                    ]}
                  </div>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => Se(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={ou}>
                        {"保存"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        za && (
          <div className={"modal-overlay"} onClick={() => Ze(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"记录 Takeaway"}</h3>,
                      <button onClick={() => Ze(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"实际训练内容"}</label>,
                      <select
                        value={Yt.libId}
                        onChange={(s) => gn(s.target.value)}
                        title={"从基础训练库选择"}
                      >
                        {[
                          <option value={""}>{"（与训练计划一致）"}</option>,
                          ft.map((s) => (
                            <option value={s.id} key={s.id}>
                              {[s.name, s.duration ? ` · ${s.duration}` : ""]}
                            </option>
                          )),
                        ]}
                      </select>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"完成度（0–100%）"}</label>,
                      <input
                        type={"number"}
                        min={0}
                        max={100}
                        value={Yt.pct}
                        onChange={(s) =>
                          Tt({
                            ...Yt,
                            pct: Math.max(
                              0,
                              Math.min(100, Number(s.target.value) || 0),
                            ),
                          })
                        }
                        placeholder={"如 80"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"Comments"}</label>,
                      <div className={"comments-rt-wrap"} ref={Ke}>
                        {[
                          <div
                            className={"rt-toolbar"}
                            role={"toolbar"}
                            aria-label={"文本格式"}
                          >
                            {[
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"加粗"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("bold")}
                              >
                                {<b>{"B"}</b>}
                              </button>,
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"斜体"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("italic")}
                              >
                                {<i>{"I"}</i>}
                              </button>,
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"下划线"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("underline")}
                              >
                                {<u>{"U"}</u>}
                              </button>,
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"删除线"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("strikeThrough")}
                              >
                                {<s>{"S"}</s>}
                              </button>,
                              <span className={"rt-sep"} />,
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"项目符号列表"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("insertUnorderedList")}
                              >
                                {
                                  <svg
                                    width={"16"}
                                    height={"16"}
                                    viewBox={"0 0 16 16"}
                                    fill={"none"}
                                    aria-hidden={"true"}
                                  >
                                    {[
                                      <circle
                                        cx={"2.3"}
                                        cy={"3.4"}
                                        r={"1.15"}
                                        fill={"currentColor"}
                                      />,
                                      <circle
                                        cx={"2.3"}
                                        cy={"8"}
                                        r={"1.15"}
                                        fill={"currentColor"}
                                      />,
                                      <circle
                                        cx={"2.3"}
                                        cy={"12.6"}
                                        r={"1.15"}
                                        fill={"currentColor"}
                                      />,
                                      <line
                                        x1={"5"}
                                        y1={"3.4"}
                                        x2={"14.5"}
                                        y2={"3.4"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                      <line
                                        x1={"5"}
                                        y1={"8"}
                                        x2={"14.5"}
                                        y2={"8"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                      <line
                                        x1={"5"}
                                        y1={"12.6"}
                                        x2={"14.5"}
                                        y2={"12.6"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                    ]}
                                  </svg>
                                }
                              </button>,
                              <button
                                type={"button"}
                                className={"rt-btn"}
                                title={"编号列表"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => ae("insertOrderedList")}
                              >
                                {
                                  <svg
                                    width={"16"}
                                    height={"16"}
                                    viewBox={"0 0 16 16"}
                                    fill={"none"}
                                    aria-hidden={"true"}
                                  >
                                    {[
                                      <text
                                        x={"0.4"}
                                        y={"4.6"}
                                        fontFamily={"Arial, sans-serif"}
                                        fontSize={"4.4"}
                                        fontWeight={"700"}
                                        fill={"currentColor"}
                                      >
                                        {"1"}
                                      </text>,
                                      <text
                                        x={"0.4"}
                                        y={"9.4"}
                                        fontFamily={"Arial, sans-serif"}
                                        fontSize={"4.4"}
                                        fontWeight={"700"}
                                        fill={"currentColor"}
                                      >
                                        {"2"}
                                      </text>,
                                      <text
                                        x={"0.4"}
                                        y={"14.2"}
                                        fontFamily={"Arial, sans-serif"}
                                        fontSize={"4.4"}
                                        fontWeight={"700"}
                                        fill={"currentColor"}
                                      >
                                        {"3"}
                                      </text>,
                                      <line
                                        x1={"5"}
                                        y1={"3.4"}
                                        x2={"14.5"}
                                        y2={"3.4"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                      <line
                                        x1={"5"}
                                        y1={"8"}
                                        x2={"14.5"}
                                        y2={"8"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                      <line
                                        x1={"5"}
                                        y1={"12.6"}
                                        x2={"14.5"}
                                        y2={"12.6"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                      />,
                                    ]}
                                  </svg>
                                }
                              </button>,
                              <span className={"rt-sep"} />,
                              <button
                                type={"button"}
                                className={`rt-btn rt-color ${It ? "on" : ""}`}
                                title={"字体颜色"}
                                style={{
                                  color: vl,
                                }}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => {
                                  (Nl((s) => !s), In(!1));
                                }}
                                aria-expanded={It}
                              >
                                {
                                  <svg
                                    width={"18"}
                                    height={"18"}
                                    viewBox={"0 0 16 16"}
                                    fill={"none"}
                                    aria-hidden={"true"}
                                  >
                                    {[
                                      <text
                                        x={"8"}
                                        y={"10.5"}
                                        textAnchor={"middle"}
                                        fontFamily={"Arial, sans-serif"}
                                        fontSize={"10"}
                                        fontWeight={"800"}
                                        fill={"currentColor"}
                                      >
                                        {"A"}
                                      </text>,
                                      <rect
                                        x={"3"}
                                        y={"12.4"}
                                        width={"10"}
                                        height={"2.6"}
                                        rx={"1.3"}
                                        fill={"currentColor"}
                                      />,
                                    ]}
                                  </svg>
                                }
                              </button>,
                              It && (
                                <div
                                  className={"rt-color-pop"}
                                  role={"dialog"}
                                  aria-label={"字体颜色"}
                                >
                                  {[
                                    <div className={"rt-color-row"}>
                                      {dv.map((s) => (
                                        <button
                                          type={"button"}
                                          className={`rt-color-sw ${vl.toLowerCase() === s.toLowerCase() ? "sel" : ""}`}
                                          style={{
                                            background: s,
                                          }}
                                          title={s}
                                          onMouseDown={(v) =>
                                            v.preventDefault()
                                          }
                                          onClick={() => {
                                            (yn(s), Nl(!1));
                                          }}
                                          key={s}
                                        />
                                      ))}
                                    </div>,
                                    <div className={"rt-color-foot"}>
                                      {[
                                        <label
                                          className={"rt-color-custom"}
                                          title={"自定义颜色"}
                                        >
                                          {[
                                            <input
                                              type={"color"}
                                              value={Rc}
                                              onChange={(s) => {
                                                (Uc(s.target.value),
                                                  yn(s.target.value));
                                              }}
                                            />,
                                            <span>{"自定义"}</span>,
                                          ]}
                                        </label>,
                                        <button
                                          type={"button"}
                                          className={"rt-color-reset"}
                                          onMouseDown={(s) =>
                                            s.preventDefault()
                                          }
                                          onClick={() => {
                                            (yn("#182019"), Nl(!1));
                                          }}
                                        >
                                          {"清除颜色"}
                                        </button>,
                                      ]}
                                    </div>,
                                  ]}
                                </div>
                              ),
                              <button
                                type={"button"}
                                className={"rt-btn rt-img"}
                                title={"插入图片"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => {
                                  var s;
                                  return (s = ni.current) == null
                                    ? void 0
                                    : s.click();
                                }}
                              >
                                {
                                  <svg
                                    width={"16"}
                                    height={"16"}
                                    viewBox={"0 0 16 16"}
                                    fill={"none"}
                                    aria-hidden={"true"}
                                  >
                                    {[
                                      <rect
                                        x={"1.5"}
                                        y={"2.5"}
                                        width={"13"}
                                        height={"11"}
                                        rx={"1.6"}
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                      />,
                                      <circle
                                        cx={"5.4"}
                                        cy={"6"}
                                        r={"1.2"}
                                        fill={"currentColor"}
                                      />,
                                      <path
                                        d={
                                          "M2.5 12 L6 8.4 L9 11.4 L11 9.2 L13.5 12"
                                        }
                                        stroke={"currentColor"}
                                        strokeWidth={"1.3"}
                                        strokeLinecap={"round"}
                                        strokeLinejoin={"round"}
                                      />,
                                    ]}
                                  </svg>
                                }
                              </button>,
                              <input
                                ref={ni}
                                type={"file"}
                                accept={"image/*"}
                                hidden={!0}
                                onChange={vn}
                              />,
                              <span className={"rt-sep"} />,
                              <button
                                type={"button"}
                                className={`rt-btn rt-emoji ${Je ? "on" : ""}`}
                                title={"插入表情"}
                                onMouseDown={(s) => s.preventDefault()}
                                onClick={() => {
                                  (In((s) => !s), Nl(!1));
                                }}
                                aria-expanded={Je}
                              >
                                {"😊"}
                              </button>,
                            ]}
                          </div>,
                          <div
                            className={"comments-rt"}
                            ref={se}
                            contentEditable={!0}
                            suppressContentEditableWarning={!0}
                            data-placeholder={
                              "如 当天感受、心率区间、可复用经验"
                            }
                            onInput={(s) =>
                              Tt({
                                ...Yt,
                                comments: _e(s.currentTarget.innerHTML),
                              })
                            }
                          />,
                          Je && (
                            <div
                              className={"emoji-popover"}
                              role={"dialog"}
                              aria-label={"表情选择器"}
                            >
                              {[
                                <div className={"emoji-tabs"}>
                                  {Ym.map((s, v) => (
                                    <button
                                      type={"button"}
                                      className={`emoji-tab ${ui === v ? "on" : ""}`}
                                      onClick={() => Da(v)}
                                      title={s.name}
                                      aria-label={s.name}
                                      key={s.name}
                                    >
                                      {s.icon}
                                    </button>
                                  ))}
                                </div>,
                                <div className={"emoji-grid"}>
                                  {Ym[ui].emojis.map((s) => (
                                    <button
                                      type={"button"}
                                      className={"emoji-chip"}
                                      onClick={() => ru(s)}
                                      title={s}
                                      key={s}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>,
                              ]}
                            </div>
                          ),
                        ]}
                      </div>,
                    ]}
                  </div>,
                  <div className={"field checkbox"}>
                    {
                      <label className={"cb"}>
                        {[
                          <input
                            type={"checkbox"}
                            checked={!!Yt.locked}
                            onChange={(s) =>
                              Tt({
                                ...Yt,
                                locked: s.target.checked,
                              })
                            }
                          />,
                          " 锁定（Garmin 同步不覆盖此条）",
                        ]}
                      </label>
                    }
                  </div>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => Ze(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={hi}>
                        {"保存"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        Fe && (
          <div className={"modal-overlay"} onClick={() => Ql(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"连接佳明手表"}</h3>,
                      <button onClick={() => Ql(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"佳明账号"}</label>,
                      <input
                        value={re}
                        onChange={(s) => Lt(s.target.value)}
                        placeholder={"邮箱 / 用户名"}
                      />,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"密码"}</label>,
                      <input
                        type={"password"}
                        value={rn}
                        onChange={(s) => lu(s.target.value)}
                        placeholder={"仅本次登录使用，不保存"}
                      />,
                    ]}
                  </div>,
                  Ya && <p className={"garmin-err"}>{Ya}</p>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => Ql(!1)}>{"取消"}</button>,
                      <button className={"save"} disabled={ci} onClick={Al}>
                        {ci ? "连接中…" : "连接"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"garmin-advanced"}>
                    {
                      <details>
                        {[
                          <summary>{"或粘贴活动 JSON 手动同步"}</summary>,
                          <textarea
                            value={de}
                            onChange={(s) => Ie(s.target.value)}
                            rows={4}
                            placeholder={
                              '[{"activityId":"123","date":"2026-09-01","type":"running","distanceKm":5.2,"movingMin":30,"avgHr":148}]'
                            }
                          />,
                          <button className={"save"} onClick={() => dn(de)}>
                            {"解析并匹配"}
                          </button>,
                        ]}
                      </details>
                    }
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        ai && (
          <div className={"modal-overlay"} onClick={() => Ma(null)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"休息提醒"}</h3>,
                      <button onClick={() => Ma(null)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <p className={"rest-warn-text"}>{ai}</p>,
                  <div className={"actions"}>
                    {
                      <button className={"save"} onClick={() => Ma(null)}>
                        {"知道了"}
                      </button>
                    }
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        Ua && (
          <div className={"modal-overlay"} onClick={() => oe(!1)}>
            {
              <div className={"modal"} onClick={(s) => s.stopPropagation()}>
                {[
                  <div className={"modal-head"}>
                    {[
                      <h3>{"连接 GitHub 后编辑"}</h3>,
                      <button onClick={() => oe(!1)} aria-label={"关闭"}>
                        {"×"}
                      </button>,
                    ]}
                  </div>,
                  <div className={"field"}>
                    {[
                      <label>{"GitHub Token"}</label>,
                      <input
                        type={"password"}
                        value={$n}
                        onChange={(s) => Pn(s.target.value)}
                        placeholder={"粘贴 github_pat_... 或 ghp_..."}
                        onKeyDown={(s) => s.key === "Enter" && Qa()}
                      />,
                    ]}
                  </div>,
                  <a
                    className={"token-link"}
                    href={"https://github.com/settings/tokens?type=beta"}
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    {"没有 token？在 GitHub 生成 ↗"}
                  </a>,
                  on && <div className={"auth-err"}>{on}</div>,
                  <div className={"actions"}>
                    {[
                      <button onClick={() => oe(!1)}>{"取消"}</button>,
                      <button className={"save"} onClick={Qa} disabled={tu}>
                        {tu ? "校验中…" : "连接并登录"}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>
            }
          </div>
        ),
        ii && (
          <div className={"welcome-overlay"}>
            {
              <div className={"daisy-wrap"}>
                {[
                  <svg
                    className={"daisy"}
                    viewBox={"0 0 120 120"}
                    width={"120"}
                    height={"120"}
                    aria-hidden={"true"}
                  >
                    {[
                      Array.from({
                        length: 12,
                      }).map((s, v) => (
                        <ellipse
                          cx={"60"}
                          cy={"26"}
                          rx={"6.5"}
                          ry={"23"}
                          fill={"#ffffff"}
                          transform={`rotate(${v * 30} 60 60)`}
                          key={v}
                        />
                      )),
                      <circle cx={"60"} cy={"60"} r={"15"} fill={"#ffd84d"} />,
                      <circle
                        cx={"60"}
                        cy={"60"}
                        r={"15"}
                        fill={"none"}
                        stroke={"#f2b705"}
                        strokeWidth={"2"}
                      />,
                    ]}
                  </svg>,
                  <p className={"welcome-text"}>
                    {"来了喵子，~mua~(*╯3╰)~😘😘😘😘😘"}
                  </p>,
                ]}
              </div>
            }
          </div>
        ),
        <footer>
          {[
            <div className={"dog-footer"} aria-label={"小狗动画"} />,
            <span>{"2027 王阿喵 · 参赛 & 训练计划"}</span>,
            <span>
              {[
                "大黄经纪人工作室专属定制@2026.08",
                <img
                  className={"paw"}
                  src={Jy}
                  alt={""}
                  aria-hidden={"true"}
                />,
              ]}
            </span>,
          ]}
        </footer>,
      ]}
    </main>
  );
}
