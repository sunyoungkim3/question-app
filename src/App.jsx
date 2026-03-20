import { useState, useMemo, useEffect } from "react";

const BIRTH_DATE = new Date(2024, 3, 11);

function getAgeMonths(from = new Date()) {
  const y = from.getFullYear() - BIRTH_DATE.getFullYear();
  const m = from.getMonth() - BIRTH_DATE.getMonth();
  const d = from.getDate() - BIRTH_DATE.getDate();
  return y * 12 + m + (d < 0 ? -1 : 0);
}

function getNextUpdateDate(from = new Date()) {
  let y = from.getFullYear(), m = from.getMonth();
  if (from.getDate() >= 10) m += 1;
  if (m > 11) { m = 0; y += 1; }
  return new Date(y, m, 10);
}

const DEV_CRITERIA = {
  range_23_24: {
    label: "23–24개월",
    overview: "2단어 조합 발화, 상징적 사고 시작, 평행놀이 → 초기 협력놀이 전환기",
    questionTypes: [
      { id:1, name:"감정 질문", example:"동그라미 놀이 재미있었어?", area:"사회정서", purpose:"감정 언어·감정 이해·사건 회상", basis:"Reese & Fivush (1993)" },
      { id:2, name:"또래 관계 질문", example:"오늘 어떤 친구랑 놀았어?", area:"사회정서", purpose:"사회적 인지·이름-얼굴 매칭·사회적 언어", basis:"Tomasello (2003)" },
      { id:3, name:"경험 회상 질문", example:"오늘 어린이집에서 뭐 했어?", area:"언어", purpose:"사건 설명 능력·경험 언어화·기억 회상", basis:"Nelson (1996)" },
      { id:4, name:"탐색 질문", example:"종이를 찢으니까 뭐가 나왔어?", area:"인지", purpose:"원인-결과 이해·탐색 행동 언어화", basis:"Gopnik (2009)" },
      { id:5, name:"예측·관찰 질문", example:"종이를 뿌리면 어떻게 내려왔어?", area:"인지", purpose:"관찰 언어·물리적 세계 이해·초기 과학적 사고", basis:"Baillargeon (2004)" },
      { id:6, name:"선택형 질문", example:"큰 동그라미였어? 작은 동그라미였어?", area:"언어", purpose:"동사 어휘·언어 산출·선택 표현", basis:"Hoff (2006)" },
      { id:7, name:"신체 감각 질문", example:"공을 차니까 발이 어땠어?", area:"신체", purpose:"신체 인식·감각 표현·동작 언어", basis:"Iverson (2010)" },
      { id:8, name:"자기 행동 질문", example:"안이가 스스로 공 넣었어?", area:"인지", purpose:"자기효능감·자기 행동 인식·자기조절", basis:"Vygotsky (1978)" },
      { id:9, name:"감각 표현 질문", example:"종이가 눈처럼 떨어질 때 어땠어?", area:"언어", purpose:"감각 언어·감정 표현·상징적 언어", basis:"Bloom (2000)" },
    ]
  },
  range_24_26: {
    label: "24–26개월",
    overview: "3단어 조합 발화 시작, '왜?' 질문 등장, 역할 놀이 확장, 자아 주장 강화",
    questionTypes: [
      { id:1, name:"감정 질문", example:"오늘 제일 재미있었던 게 뭐야?", area:"사회정서", purpose:"감정 어휘 확장·감정 원인 이해·사건 평가", basis:"Reese & Fivush (1993)" },
      { id:2, name:"이유 질문", example:"왜 그게 좋았어?", area:"인지", purpose:"초기 인과 언어·'왜' 개념 형성·설명 능력", basis:"Gopnik (2009)" },
      { id:3, name:"순서 질문", example:"밥 먹고 나서 뭐 했어?", area:"언어", purpose:"사건 순서화·시간 개념·서사 구조 형성", basis:"Nelson (1996)" },
      { id:4, name:"역할 놀이 질문", example:"오늘 인형이랑 뭐 했어?", area:"사회정서", purpose:"상징적 사고·역할 개념·pretend play 언어화", basis:"Piaget / Vygotsky" },
      { id:5, name:"탐색 질문", example:"그걸 눌렀을 때 어떻게 됐어?", area:"인지", purpose:"원인-결과 이해·탐색 행동 언어화", basis:"Gopnik (2009)" },
      { id:6, name:"선택·비교 질문", example:"사과랑 바나나 중에 어느 게 더 좋아?", area:"언어", purpose:"비교 언어·선호 표현·어휘 확장", basis:"Hoff (2006)" },
      { id:7, name:"신체 감각 질문", example:"밖에 나가니까 바람이 어땠어?", area:"신체", purpose:"신체 인식·환경 감각 표현·형용사 어휘", basis:"Iverson (2010)" },
      { id:8, name:"자기 행동 질문", example:"안이가 스스로 해봤어?", area:"인지", purpose:"자기효능감·자기 행동 인식·자율성 강화", basis:"Vygotsky (1978)" },
      { id:9, name:"친구 감정 질문", example:"친구가 울었을 때 어땠어?", area:"사회정서", purpose:"공감 능력·타인 감정 인식·초기 조망수용", basis:"Tomasello (2003)" },
    ]
  },
  range_26_28: {
    label: "26–28개월",
    overview: "3~4단어 문장 사용, 이야기 구조 형성 시작, 규칙·역할 이해, 상상 놀이 복잡화",
    questionTypes: [
      { id:1, name:"이야기 구성 질문", example:"처음엔 뭐부터 했어?", area:"언어", purpose:"narrative 구성·시간 순서·사건 설명 능력", basis:"Nelson (1996)" },
      { id:2, name:"이유·원인 질문", example:"왜 그렇게 됐을까?", area:"인지", purpose:"인과 추론·설명 언어·논리적 사고 초기", basis:"Gopnik (2009)" },
      { id:3, name:"규칙·역할 질문", example:"그 놀이는 어떻게 하는 거야?", area:"사회정서", purpose:"규칙 이해·역할 개념·사회적 지식", basis:"Vygotsky" },
      { id:4, name:"상상 질문", example:"만약에 새처럼 날 수 있으면 어디 가고 싶어?", area:"인지", purpose:"상상력·반사실적 사고 초기·창의 언어", basis:"Harris (2000)" },
      { id:5, name:"비교·분류 질문", example:"이거랑 저거 어떻게 달라?", area:"인지", purpose:"범주화·비교 언어·분류 사고", basis:"Piaget 전조작기" },
      { id:6, name:"감정 원인 질문", example:"왜 기뻤어?", area:"사회정서", purpose:"감정 원인 설명·감정 어휘 심화·자기 이해", basis:"Reese & Fivush (1993)" },
      { id:7, name:"타인 관점 질문", example:"친구는 어떤 기분이었을까?", area:"사회정서", purpose:"조망수용·공감·Theory of Mind 초기", basis:"Wellman (1992)" },
      { id:8, name:"신체·운동 질문", example:"달리기 할 때 몸이 어떤 느낌이었어?", area:"신체", purpose:"신체 인식·운동 감각 언어·자기 신체 이해", basis:"Iverson (2010)" },
      { id:9, name:"선호·의견 질문", example:"어떤 게 더 좋았어? 왜?", area:"언어", purpose:"의견 표현·선호 언어·자기 주장 발달", basis:"Hoff (2006)" },
    ]
  },
  range_28_30: {
    label: "28–30개월",
    overview: "4~5단어 문장, 과거·미래 시제 사용, Theory of Mind 발달, 협력 놀이 활발",
    questionTypes: [
      { id:1, name:"서사 질문", example:"오늘 있었던 일 다 얘기해줄 수 있어?", area:"언어", purpose:"narrative 구성·사건 평가·언어 유창성", basis:"Nelson (1996)" },
      { id:2, name:"미래 예측 질문", example:"내일은 뭐 하고 싶어?", area:"인지", purpose:"미래 시제 이해·계획 언어·자기 목표 표현", basis:"Suddendorf & Corballis (2007)" },
      { id:3, name:"마음 읽기 질문", example:"친구가 왜 그렇게 했을까?", area:"사회정서", purpose:"Theory of Mind·의도 이해·타인 행동 해석", basis:"Wellman (1992)" },
      { id:4, name:"문제 해결 질문", example:"어떻게 하면 됐어?", area:"인지", purpose:"문제 해결 언어·전략 설명·자기 효능감", basis:"Gopnik (2009)" },
      { id:5, name:"감정 조절 질문", example:"속상했을 때 어떻게 했어?", area:"사회정서", purpose:"정서 조절 언어·coping strategy·자기조절", basis:"Gross (2002)" },
      { id:6, name:"비교·분류 질문", example:"동물이랑 자동차는 뭐가 달라?", area:"인지", purpose:"범주 비교·추론·언어 복잡성", basis:"Piaget 전조작기" },
      { id:7, name:"협력 놀이 질문", example:"친구랑 같이 만들 때 어떻게 나눴어?", area:"사회정서", purpose:"협력·역할 분담 이해·사회적 언어", basis:"Tomasello (2003)" },
      { id:8, name:"감각·환경 질문", example:"오늘 밖에 날씨가 어땠어?", area:"신체", purpose:"환경 인식·기상 어휘·감각 언어 확장", basis:"Bloom (2000)" },
      { id:9, name:"의견·이유 질문", example:"안이는 왜 그게 좋아?", area:"언어", purpose:"의견 표현·이유 설명·메타인지 초기", basis:"Hoff (2006)" },
    ]
  },
  range_30_36: {
    label: "30–36개월",
    overview: "5단어 이상 문장, 과거·현재·미래 시제 구사, Theory of Mind 완성 단계, 협상·설득 언어 등장",
    questionTypes: [
      { id:1, name:"스토리텔링 질문", example:"오늘 일을 이야기처럼 말해줄 수 있어?", area:"언어", purpose:"완전한 narrative 구성·기승전결 구조·언어 유창성", basis:"Nelson (1996)" },
      { id:2, name:"반사실 가정 질문", example:"만약 선생님이 없었으면 어떻게 됐을까?", area:"인지", purpose:"counterfactual thinking·상상 추론·창의 언어", basis:"Harris (2000)" },
      { id:3, name:"Theory of Mind 질문", example:"친구는 그게 뭔지 알았을까?", area:"사회정서", purpose:"false belief 이해·타인 지식 상태 추론·사회 인지", basis:"Wellman (1992)" },
      { id:4, name:"협상·설득 질문", example:"친구한테 같이 하자고 어떻게 말했어?", area:"사회정서", purpose:"설득 언어·사회적 문제 해결·협상 전략", basis:"Tomasello (2003)" },
      { id:5, name:"메타인지 질문", example:"그걸 어떻게 알았어?", area:"인지", purpose:"메타인지 초기·앎의 과정 인식·인식론적 사고", basis:"Flavell (1979)" },
      { id:6, name:"감정 조절 전략 질문", example:"화났을 때 어떻게 하면 좋을까?", area:"사회정서", purpose:"정서 조절 전략·문제 해결 사고·자기조절", basis:"Gross (2002)" },
      { id:7, name:"도덕·규칙 질문", example:"그건 왜 하면 안 돼?", area:"사회정서", purpose:"규칙 이해·도덕 추론 초기·사회 규범 언어화", basis:"Turiel (1983)" },
      { id:8, name:"계획·순서 질문", example:"내일 어린이집 가면 뭐부터 할 거야?", area:"인지", purpose:"계획 수립·미래 순서 언어·실행 기능", basis:"Suddendorf & Corballis (2007)" },
      { id:9, name:"창의 확장 질문", example:"그 놀이를 더 재미있게 하려면 어떻게 하면 좋을까?", area:"인지", purpose:"창의적 사고·문제 개선·언어 복잡성", basis:"Gopnik (2009)" },
    ]
  },
};

function getCriteria(months) {
  if (months < 24) return DEV_CRITERIA.range_23_24;
  if (months < 26) return DEV_CRITERIA.range_24_26;
  if (months < 28) return DEV_CRITERIA.range_26_28;
  if (months < 30) return DEV_CRITERIA.range_28_30;
  return DEV_CRITERIA.range_30_36;
}

const AREA_STYLE = {
  "언어":    { bg:"#FEF3E8", color:"#93550A", dot:"#F4845F" },
  "인지":    { bg:"#E8F1FD", color:"#1A4F8B", dot:"#4A90D9" },
  "사회정서": { bg:"#EAF3DE", color:"#3B6D11", dot:"#5BAD3A" },
  "신체":    { bg:"#F3EAF8", color:"#6B2B8B", dot:"#A855D4" },
};

const STORAGE_KEY = "anyi_history_v1";

async function loadHistory() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function saveHistory(list) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(list));
  } catch (e) { console.error("storage error", e); }
}

export default function App() {
  const today = new Date();
  const ageMonths = getAgeMonths(today);
  const nextUpdate = getNextUpdateDate(today);
  const criteria = getCriteria(ageMonths);
  const todayStr = today.toISOString().slice(0, 10);

  const [tab, setTab] = useState("generate");
  const [note, setNote] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [useManualTopic, setUseManualTopic] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadHistory().then(h => { setHistory(h); setHistoryLoading(false); });
  }, []);

  // 최근 3일 이내 선택된 대화 주제 목록
  const recentActivities = useMemo(() => {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 3);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return history
      .filter(h => h.date >= cutoffStr)
      .map(h => h.result?.selected_activity)
      .filter(Boolean);
  }, [history, todayStr]);

  const systemPrompt = useMemo(() => {
    const types = criteria.questionTypes.map(q =>
      `[${q.id}. ${q.name}] 발달목표: ${q.purpose} / 근거: ${q.basis}`
    ).join("\n");
    const avoidBlock = recentActivities.length > 0
      ? `\n\n⚠️ 최근 3일 이내 이미 선택한 대화 주제 (반드시 피할 것):\n${recentActivities.map((a, i) => `- ${a}`).join("\n")}\n위 주제와 동일하거나 매우 유사한 활동은 선택하지 마세요. 알림장에 해당 활동만 있어도 다른 활동을 찾거나, 같은 활동이라도 완전히 다른 측면(예: 밥 먹기 → 식재료 탐색이 아닌 친구와의 대화)을 주제로 설정하세요.`
      : "";
    const manualBlock = (useManualTopic && manualTopic.trim())
      ? `\n\n✅ 부모가 직접 지정한 대화 주제: "${manualTopic.trim()}"\n위 주제를 selected_activity로 반드시 사용하세요. 알림장 내용에서 이 주제와 관련된 장면이나 맥락을 찾아 질문을 구성하세요. 관련 내용이 없더라도 이 주제로 질문을 만드세요.`
      : "";
    return `당신은 영유아 발달 전문가입니다. 현재 안이(${ageMonths}개월)의 발달 단계에 맞춰 부모-자녀 대화 질문을 설계합니다.
발달 단계 (${criteria.label}): ${criteria.overview}
질문 유형:
${types}${avoidBlock}${manualBlock}
반드시 JSON만 출력. 마크다운 코드블록 없이:
{"selected_activity":"활동명","activity_description":"한 줄 요약","questions":[{"question":"질문 (안이에게 말하는 말투)","type_name":"질문 유형명","purpose":"발달 목표","tip":"부모 대처법","development_area":"언어 또는 인지 또는 사회정서 또는 신체"}]}`;
  }, [ageMonths, criteria, recentActivities, manualTopic, useManualTopic]);

  const generate = async () => {
    if (!note.trim() || loading) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role:"user", content:`다음 키즈노트 알림장에서 대화하기 좋은 활동 1개 선택 후, ${ageMonths}개월 안이 발달을 위한 질문 5개를 JSON으로만 출력하세요.\n\n${note}` }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content || []).map(c => c.text || "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      const entry = { id: Date.now(), date: todayStr, ageMonths, note: note.slice(0, 200), result: parsed };
      const updated = [entry, ...history].slice(0, 60);
      setHistory(updated);
      await saveHistory(updated);
    } catch (e) {
      setError("오류: " + (e.message || "다시 시도해주세요."));
    } finally { setLoading(false); }
  };

  const groupedHistory = useMemo(() => {
    const g = {};
    history.forEach(item => {
      const ym = item.date.slice(0, 7);
      if (!g[ym]) g[ym] = [];
      g[ym].push(item);
    });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [history]);

  const QCards = ({ questions }) => (
    <div>
      {(questions || []).map((q, i) => {
        const s = AREA_STYLE[q.development_area] || AREA_STYLE["언어"];
        return (
          <div key={i} style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:12, padding:"14px 16px", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:9 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:"#F4845F", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:s.bg, color:s.color }}>{q.development_area}</span>
              {q.type_name && <span style={{ fontSize:10, color:"#9E8E85" }}>{q.type_name}</span>}
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:"#2D2420", lineHeight:1.55, marginBottom:10 }}>"{q.question}"</div>
            <div style={{ borderTop:"1px solid #F0EBE7", paddingTop:9, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", gap:7, fontSize:11.5, lineHeight:1.5 }}>
                <span style={{ fontWeight:700, color:"#9E8E85", whiteSpace:"nowrap" }}>발달 목표</span>
                <span style={{ color:"#5A504A" }}>{q.purpose}</span>
              </div>
              <div style={{ display:"flex", gap:7, fontSize:11.5, lineHeight:1.5 }}>
                <span style={{ fontWeight:700, color:"#9E8E85", whiteSpace:"nowrap" }}>부모 팁</span>
                <span style={{ color:"#5A504A" }}>{q.tip}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const nextUpdateStr = `${nextUpdate.getMonth()+1}월 ${nextUpdate.getDate()}일`;

  return (
    <div style={{ fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif", maxWidth:580, margin:"0 auto", padding:"20px 16px 56px", background:"#FDFAF7", minHeight:"100vh", color:"#2D2420" }}>

      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:30 }}>🌱</span>
          <div>
            <div style={{ fontSize:19, fontWeight:700, letterSpacing:"-0.4px" }}>안이의 발달 대화 질문</div>
            <div style={{ fontSize:12, color:"#9E8E85", marginTop:2 }}>키즈노트 알림장 → 개월수 맞춤 발달 질문</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#E8621A", background:"#FFF0E6", border:"1px solid #F4C4A6", borderRadius:20, padding:"4px 11px" }}>👶 {ageMonths}개월 · {criteria.label}</span>
          <span style={{ fontSize:11, color:"#3B6D11", background:"#F0F9E8", border:"1px solid #C0DD97", borderRadius:20, padding:"4px 11px" }}>🔄 다음 업데이트 {nextUpdateStr}</span>
          <span style={{ fontSize:11, color:"#1A4F8B", background:"#E8F1FD", border:"1px solid #B5D4F4", borderRadius:20, padding:"4px 11px" }}>📅 기록 {history.length}개</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", marginBottom:16, background:"#F0EBE7", borderRadius:10, padding:3 }}>
        {[["generate","✨ 질문 만들기"],["history","📅 히스토리"],["criteria","📋 발달 기준"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:"9px 4px", fontSize:12, fontWeight:tab===k ? 700 : 500, background:tab===k ? "#fff" : "transparent", color:tab===k ? "#2D2420" : "#9E8E85", border:"none", borderRadius:8, cursor:"pointer", transition:"all 0.15s" }}>{l}</button>
        ))}
      </div>

      {/* ── GENERATE ── */}
      {tab === "generate" && (
        <div>
          {recentActivities.length > 0 && (
            <div style={{ background:"#FFF8E8", border:"1px solid #F4E4A0", borderRadius:12, padding:"11px 14px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>🚫</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#7A6A40", marginBottom:5 }}>최근 3일 내 사용한 주제 — 자동 제외됩니다</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {recentActivities.map((a, i) => (
                    <span key={i} style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:"#F0E8C8", color:"#7A6A40", fontWeight:600, textDecoration:"line-through" }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:14, padding:"14px 16px", marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <button onClick={() => { setUseManualTopic(v => !v); setManualTopic(""); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:15 }}>✏️</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#2D2420" }}>주제 직접 입력하기</span>
                {useManualTopic && manualTopic.trim() && (
                  <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"#E8F1FD", color:"#1A4F8B" }}>적용 중</span>
                )}
              </div>
              <span style={{ fontSize:12, color:"#9E8E85" }}>{useManualTopic ? "▲" : "▼"}</span>
            </button>
            {useManualTopic && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:12, color:"#9E8E85", marginBottom:8, lineHeight:1.5 }}>대화하고 싶은 주제를 직접 입력하면 알림장에서 그 주제에 맞는 질문을 뽑아드려요. 알림장에 해당 내용이 없어도 괜찮아요.</div>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={manualTopic} onChange={e => setManualTopic(e.target.value)}
                    placeholder="예) 점심 먹기, 친구와 블록 쌓기, 낮잠 자기..."
                    style={{ flex:1, border:"1.5px solid #DDD8D4", borderRadius:10, padding:"9px 12px", fontSize:13, background:"#FDFAF7", color:"#2D2420", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  />
                  {manualTopic.trim() && (
                    <button onClick={() => setManualTopic("")} style={{ padding:"9px 12px", background:"#F5F2F0", border:"none", borderRadius:10, fontSize:12, color:"#9E8E85", cursor:"pointer" }}>✕</button>
                  )}
                </div>
                {manualTopic.trim() && (
                  <div style={{ marginTop:8, fontSize:12, color:"#1A4F8B", background:"#E8F1FD", borderRadius:8, padding:"7px 10px" }}>
                    "{manualTopic.trim()}" 주제로 질문을 만들게요. AI가 자동 선택하지 않아요.
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:14, padding:18, marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#4A3F3A", marginBottom:8 }}>오늘 선생님이 써주신 알림장 내용</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={5}
              placeholder="예시) 오늘 바깥 놀이 시간에 모래놀이를 했어요. 안이가 '차가워!'라고 말하며 좋아했어요..."
              style={{ width:"100%", border:"1.5px solid #DDD8D4", borderRadius:10, padding:"10px 12px", fontSize:13, lineHeight:1.7, resize:"vertical", background:"#FDFAF7", color:"#2D2420", fontFamily:"inherit", boxSizing:"border-box" }}
            />
            <button onClick={generate} disabled={!note.trim() || loading}
              style={{ marginTop:12, width:"100%", padding:"13px 0", background:(!note.trim()||loading) ? "#E0D8D4" : "#F4845F", color:"white", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:(!note.trim()||loading) ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading
                ? <><span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />분석 중...</>
                : useManualTopic && manualTopic.trim()
                  ? `✏️ "${manualTopic.trim()}" 주제로 질문 만들기`
                  : `✨ ${ageMonths}개월 맞춤 질문 만들기`}
            </button>
          </div>

          {error && <div style={{ background:"#FEE8E8", border:"1px solid #FACACA", borderRadius:10, padding:"11px 14px", color:"#C0392B", fontSize:13, marginBottom:12 }}>{error}</div>}

          {result && (
            <div>
              <div style={{ background:"linear-gradient(135deg,#F4845F,#E8621A)", borderRadius:14, padding:"18px 20px", marginBottom:12, color:"white" }}>
                <div style={{ fontSize:11, fontWeight:600, opacity:0.8, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:5 }}>오늘의 대화 주제</div>
                <div style={{ fontSize:18, fontWeight:800, marginBottom:4, letterSpacing:"-0.4px" }}>{result.selected_activity}</div>
                <div style={{ fontSize:13, opacity:0.9, lineHeight:1.5 }}>{result.activity_description}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#4A3F3A", marginBottom:10 }}>💬 {ageMonths}개월 맞춤 발달 질문 5가지</div>
              <QCards questions={result.questions} />
              <div style={{ background:"#FFFBF0", border:"1px solid #F4E4A0", borderRadius:12, padding:"12px 14px", fontSize:12, color:"#7A6A40", lineHeight:1.7, marginTop:4 }}>
                📌 아이가 대답 못해도 괜찮아요. 3~5초 기다린 후 부모가 먼저 짧게 모델링해 주세요. ✅ 히스토리에 자동 저장됩니다.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab === "history" && (
        <div>
          {historyLoading ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"#9E8E85", fontSize:14 }}>불러오는 중...</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign:"center", padding:"56px 20px" }}>
              <div style={{ fontSize:42, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:15, fontWeight:700, color:"#4A3F3A", marginBottom:6 }}>아직 기록이 없어요</div>
              <div style={{ fontSize:13, color:"#9E8E85" }}>질문 만들기 탭에서 알림장을 분석하면 여기에 저장돼요</div>
            </div>
          ) : (
            <div>
              {/* 통계 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  ["총 기록", `${history.length}개`],
                  ["이번 달", `${history.filter(h => h.date.slice(0,7) === todayStr.slice(0,7)).length}개`],
                  ["최근 기록", history[0] ? `${parseInt(history[0].date.slice(8))}일` : "-"],
                ].map(([label, val]) => (
                  <div key={label} style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:10, padding:"12px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:"#F4845F" }}>{val}</div>
                    <div style={{ fontSize:11, color:"#9E8E85", marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {groupedHistory.map(([ym, items]) => {
                const [yr, mo] = ym.split("-");
                return (
                  <div key={ym} style={{ marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#4A3F3A" }}>{yr}년 {parseInt(mo)}월</div>
                      <div style={{ flex:1, height:"0.5px", background:"#DDD8D4" }} />
                      <div style={{ fontSize:11, color:"#9E8E85" }}>{items.length}회</div>
                    </div>

                    {items.map(item => {
                      const isOpen = expandedId === item.id;
                      const r = item.result;
                      const areas = [...new Set((r?.questions || []).map(q => q.development_area))];
                      const day = parseInt(item.date.slice(8));

                      return (
                        <div key={item.id} style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:14, marginBottom:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                          {/* Row */}
                          <button onClick={() => setExpandedId(isOpen ? null : item.id)}
                            style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                            <div style={{ width:40, height:40, borderRadius:10, background:"#FFF0E6", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <div style={{ fontSize:16, fontWeight:800, color:"#E8621A", lineHeight:1 }}>{day}</div>
                              <div style={{ fontSize:9, color:"#F4845F", fontWeight:600, marginTop:1 }}>{parseInt(mo)}월</div>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                                <span style={{ fontSize:14, fontWeight:700, color:"#2D2420", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r?.selected_activity || "활동"}</span>
                                <span style={{ fontSize:10, color:"#9E8E85", background:"#F5F2F0", borderRadius:6, padding:"1px 6px", flexShrink:0 }}>{item.ageMonths}개월</span>
                              </div>
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                {areas.map(a => {
                                  const s = AREA_STYLE[a] || AREA_STYLE["언어"];
                                  return <span key={a} style={{ fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:20, background:s.bg, color:s.color }}>{a}</span>;
                                })}
                              </div>
                            </div>
                            <span style={{ fontSize:12, color:"#C0B8B0", flexShrink:0 }}>{isOpen ? "▲" : "▼"}</span>
                          </button>

                          {/* Expanded */}
                          {isOpen && (
                            <div style={{ borderTop:"1px solid #F0EBE7", padding:"14px 16px 16px" }}>
                              {item.note && (
                                <div style={{ background:"#FDFAF7", border:"1px solid #EDE8E4", borderRadius:9, padding:"10px 12px", marginBottom:12 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:"#9E8E85", marginBottom:4 }}>📝 알림장 원문</div>
                                  <div style={{ fontSize:12, color:"#5A504A", lineHeight:1.65 }}>{item.note}{item.note.length >= 200 ? "..." : ""}</div>
                                </div>
                              )}
                              <div style={{ background:"linear-gradient(135deg,#F4845F,#E8621A)", borderRadius:10, padding:"12px 14px", marginBottom:12, color:"white" }}>
                                <div style={{ fontSize:10, opacity:0.8, marginBottom:3 }}>대화 주제</div>
                                <div style={{ fontSize:15, fontWeight:800 }}>{r?.selected_activity}</div>
                                <div style={{ fontSize:12, opacity:0.9, marginTop:2 }}>{r?.activity_description}</div>
                              </div>
                              <QCards questions={r?.questions} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{ textAlign:"center", fontSize:11, color:"#C0B8B0", paddingTop:4 }}>최근 60개까지 저장됩니다</div>
            </div>
          )}
        </div>
      )}

      {/* ── CRITERIA ── */}
      {tab === "criteria" && (
        <div>
          <div style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#9E8E85", marginBottom:3 }}>현재 적용 기준</div>
            <div style={{ fontSize:17, fontWeight:700, color:"#2D2420", marginBottom:6 }}>{criteria.label}</div>
            <div style={{ fontSize:13, color:"#5A504A", lineHeight:1.6, background:"#FDFAF7", borderRadius:8, padding:"10px 12px" }}>{criteria.overview}</div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:"#4A3F3A", marginBottom:10 }}>📚 이번 달 질문 유형 9가지</div>
          {criteria.questionTypes.map(q => {
            const s = AREA_STYLE[q.area] || AREA_STYLE["언어"];
            return (
              <div key={q.id} style={{ background:"#fff", border:"1px solid #EDE8E4", borderRadius:12, padding:"14px 16px", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:s.dot, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0 }}>{q.id}</div>
                  <span style={{ fontSize:13, fontWeight:700, color:"#2D2420" }}>{q.name}</span>
                  <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:s.bg, color:s.color, marginLeft:"auto" }}>{q.area}</span>
                </div>
                <div style={{ fontSize:13, color:"#6B5F58", fontStyle:"italic", marginBottom:6, paddingLeft:28 }}>예) "{q.example}"</div>
                <div style={{ paddingLeft:28 }}>
                  <div style={{ fontSize:12, color:"#5A504A", marginBottom:3 }}><span style={{ fontWeight:600, color:"#9E8E85" }}>발달 목표 </span>{q.purpose}</div>
                  <div style={{ fontSize:11, color:"#9E8E85" }}>{q.basis}</div>
                </div>
              </div>
            );
          })}
          <div style={{ background:"#F0F9E8", border:"1px solid #C0DD97", borderRadius:12, padding:"13px 15px", fontSize:12, color:"#3B6D11", lineHeight:1.7, marginTop:4 }}>
            🔄 다음 기준 업데이트: <strong>{nextUpdateStr}</strong> ({ageMonths+1}개월 기준으로 자동 전환됩니다)
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus { outline: none; border-color: #F4845F !important; }
        textarea::placeholder { color: #C0B8B0; }
      `}</style>
    </div>
  );
}
