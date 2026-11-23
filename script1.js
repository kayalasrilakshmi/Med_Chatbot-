/* ============ 1. KNOWLEDGE ============
   key: [label, emoji, words to detect,
         [[follow-up question, short name, red-flag? (1 = yes)], ...],
         possible causes, self-care tips] */
const RAW = {
  fever:["Fever","🤒","fever|temperature|chills",[["Do you have chills or body aches too?","chills / body aches",0],["Any stiff neck, skin rash or confusion?","stiff neck / rash / confusion",1]],"Viral infection, flu, bacterial infection, dengue or malaria","Drink plenty of fluids|Rest and wear light clothes|Paracetamol can help – follow the label"],
  cold:["Cold / blocked nose","🤧","cold|runny nose|sneez|stuffy|blocked nose|congestion",[["Do you have a sore throat or cough too?","sore throat / cough",0],["Any difficulty breathing or wheezing?","breathing difficulty",1]],"Common cold, allergy, sinus infection","Sip warm fluids|Steam inhalation|Rest well"],
  cough:["Cough","😷","cough",[["Do you have a fever with the cough?","fever",0],["Any wheezing, breathlessness or blood in phlegm?","breathlessness / blood in phlegm",1]],"Viral infection, allergy, asthma, acid reflux, bronchitis","Warm water with honey (adults only)|Avoid smoke and dust|Keep your head raised when sleeping"],
  throat:["Sore throat","😖","sore throat|throat",[["Is it very painful to swallow, with fever?","painful swallowing + fever",0],["Any trouble swallowing saliva or breathing?","trouble swallowing / breathing",1]],"Viral infection, tonsillitis, strep throat","Gargle with warm salt water|Warm fluids|Avoid cold and spicy food"],
  headache:["Headache","🤕","headache|head ache|migraine|head hurts",[["Is there nausea or sensitivity to light?","nausea / light sensitivity",0],["Is it a sudden, severe headache, or with stiff neck or vision changes?","sudden severe pain / vision change",1]],"Tension, dehydration, poor sleep, eye strain, migraine","Rest in a quiet dark room|Drink water|Limit screen time"],
  dizzy:["Dizziness","😵","dizz|vertigo|light-?headed",[["Does it happen mostly when you stand up?","dizzy on standing",0],["Any fainting, chest pain or weakness on one side?","fainting / chest pain / weakness",1]],"Low blood pressure, dehydration, anaemia, inner-ear problem","Sit or lie down at once|Drink fluids and eat something|Stand up slowly"],
  stomach:["Stomach pain","😣","stomach ache|stomach pain|abdominal|belly|tummy",[["Do you also have vomiting or loose motion?","vomiting / loose motion",0],["Is the pain severe, or is the belly hard or tender on the lower right?","severe / lower-right pain",1]],"Gas, indigestion, infection, ulcer, gallbladder or appendix problem","Sip warm water|Eat light food|Avoid oily and spicy meals"],
  nausea:["Nausea / vomiting","🤢","nausea|vomit|puke|throwing up",[["Have you vomited more than 3 times today?","repeated vomiting",1],["Do you also have loose motion or stomach pain?","loose motion / stomach pain",0]],"Stomach bug, food poisoning, migraine, pregnancy","Sip ORS or clear fluids in small amounts|Eat bland food (toast, banana)|Rest your stomach for an hour"],
  diarrhea:["Diarrhoea","🚽","diarrh|loose motion|loose stool",[["Is there blood in the stool?","blood in stool",1],["Do you feel very weak, dizzy or extremely thirsty?","dehydration signs",1]],"Stomach infection, food poisoning, food intolerance","Take ORS often|Eat rice, banana, curd|Wash hands well"],
  constipation:["Constipation","😬","constipat|hard stool",[["Is there stomach pain or bloating with it?","pain / bloating",0],["Any blood in the stool, or no motion for over a week?","blood / no motion for a week",1]],"Low fibre or water, inactivity, medicines","Drink more water|Eat fruit, vegetables and fibre|Walk daily"],
  acidity:["Acidity / gas","🔥","acidity|heartburn|reflux|gas\\b|bloating|indigestion",[["Does it burn mostly after meals?","burning after meals",0],["Any chest pain, black stools or trouble swallowing?","chest pain / black stools",1]],"Acid reflux, gastritis, spicy or late meals","Eat smaller meals|Avoid lying down after eating|Limit spicy food, tea and coffee"],
  body:["Body ache","💪","body ache|body pain|muscle|myalgia",[["Do you have a fever too?","fever",0],["Any swelling or severe muscle weakness?","swelling / severe weakness",1]],"Viral illness, overexertion, vitamin D deficiency","Rest and gentle stretching|Warm compress|Stay hydrated"],
  joint:["Joint pain","🦴","joint|knee pain|arthritis",[["Is the joint swollen or red?","swollen / red joint",0],["Can't you move it or put weight on it after an injury?","can't move after injury",1]],"Strain, arthritis, injury, uric acid","Rest the joint|Warm or cold pack|Light movement as comfortable"],
  back:["Back / neck pain","🧍","back pain|backache|neck pain|spine",[["Does the pain spread down your leg or arm?","radiating pain",0],["Any numbness, weakness or loss of bladder control?","numbness / weakness",1]],"Poor posture, muscle strain, disc problem","Fix your sitting posture|Gentle stretches|Warm compress"],
  fatigue:["Tiredness","😴","tired|fatigue|weak|exhausted|no energy",[["Have you been sleeping badly lately?","poor sleep",0],["Any weight loss, breathlessness or pale skin?","weight loss / breathlessness / pallor",1]],"Poor sleep, anaemia, thyroid problem, infection, stress","Sleep 7–8 hours|Eat regular balanced meals|Take short breaks"],
  rash:["Skin rash","🔴","rash|hives|red spots|skin",[["Is the rash itchy?","itchy rash",0],["Any fever, swollen face or lips, or trouble breathing?","fever / swelling / breathing trouble",1]],"Allergy, eczema, heat rash, fungal or viral infection","Keep the area clean and dry|Avoid scratching|Wear loose cotton clothes"],
  itch:["Itching","🖐️","itch",[["Is there a rash with the itching?","rash",0],["Any swelling of the lips or face?","lip / face swelling",1]],"Dry skin, allergy, fungal infection, insect bite","Moisturise skin|Avoid harsh soaps|Keep nails short"],
  allergy:["Allergy","🌼","allerg|hay fever|watery eyes",[["Does it get worse near dust, pollen or pets?","trigger-linked",0],["Any wheezing or swelling of face or lips?","wheezing / swelling",1]],"Pollen, dust, pet dander, food","Avoid the trigger|Rinse nose with saline|Keep windows closed in pollen season"],
  eye:["Eye problem","👁️","eye|vision|pink eye",[["Is there redness or sticky discharge?","redness / discharge",0],["Any loss of vision or severe eye pain?","vision loss / severe pain",1]],"Conjunctivitis, dry eyes, allergy, eye strain","Don't rub your eyes|Wash hands often|Rest from screens"],
  ear:["Ear pain","👂","ear ?ache|ear pain|ear infection",[["Is there discharge or reduced hearing?","discharge / reduced hearing",0],["Any high fever or swelling behind the ear?","fever / swelling behind ear",1]],"Ear infection, wax, water in the ear","Keep the ear dry|Warm cloth outside the ear|Don't put anything inside"],
  tooth:["Tooth / gum pain","🦷","tooth|gum|dental",[["Is your gum or face swollen?","swelling",0],["Any fever or trouble opening your mouth?","fever / can't open mouth",1]],"Cavity, gum infection, sensitivity","Rinse with warm salt water|Brush gently|Avoid very hot or cold food"],
  urine:["Burning urination","🚻","burning urin|urin|burning pee",[["Do you need to pass urine more often than usual?","frequent urination",0],["Any fever, back pain or blood in the urine?","fever / back pain / blood",1]],"Urinary tract infection, dehydration","Drink plenty of water|Don't hold urine|Maintain hygiene"],
  anxiety:["Stress / anxiety","😟","anxiety|anxious|stress|panic|worried|depress|low mood",[["Is it affecting your sleep or appetite?","sleep / appetite affected",0],["Are you having thoughts of harming yourself?","self-harm",1]],"Stress, poor sleep, anxiety disorder, low mood","Slow breathing: in 4s, out 6s|Talk to someone you trust|Short walk outdoors"],
  sleep:["Poor sleep","🌙","insomnia|can'?t sleep|cannot sleep|sleepless",[["Do you use your phone or screens late at night?","late screen use",0],["Do you also feel sad or anxious most days?","low mood / anxiety",1]],"Stress, caffeine, screens, irregular routine","Fixed bedtime|No screens an hour before bed|Avoid caffeine after noon"],
  period:["Period pain","🩸","period pain|menstrual|period cramps",[["Is the bleeding heavier than usual?","heavy bleeding",1],["Is the pain so severe that you feel faint?","severe pain / faintness",1]],"Normal menstrual cramps, hormonal changes, fibroids or endometriosis","Heat pad on the lower belly|Gentle exercise|Stay hydrated"],
  injury:["Minor injury / bite","🩹","wound|sprain|injur|bite|sting|minor burn",[["Is the wound deep or bleeding a lot?","deep / heavy bleeding",1],["Any swelling, pus or warmth around it?","swelling / pus",1]],"Cuts, sprains, insect bites, small burns","Rinse with clean water|Cover with a clean dressing|Rest and elevate a sprain"],
};
const S = {};
for (const k in RAW) {
  const [n, e, w, q, c, t] = RAW[k];
  S[k] = { n, e, q, c, t: t.split("|"), rx: new RegExp("\\b(?:" + w + ")", "i") };
}
const KEYS = Object.keys(S);

/* Conditions I will NOT give home advice for – doctor only */
const SPEC = [
  ["fissure|piles|h(a)?emorrhoid|blood in (stool|motion)", "Fissure / piles / rectal bleeding", "a general surgeon or colorectal specialist"],
  ["hernia|lump|kidney stone|gallstone|appendic", "Hernia / lump / stone / appendix problem", "a general physician or surgeon"],
  ["epilep|\\bfits\\b|faint|numb|paraly", "Nerve-related symptom", "a neurologist (go to hospital if it is sudden)"],
  ["diabet|thyroid|jaundice|yellow (skin|eyes)", "Hormone or liver-related problem", "a physician (tests are usually needed)"],
  ["blood in urine|palpitation|chest tight", "Heart or urinary warning sign", "a doctor promptly"],
  ["pregnan|breastfeed", "Pregnancy-related concern", "your gynaecologist before taking any medicine"],
].map(([r, n, d]) => [new RegExp(r, "i"), n, d]);

const EMERGENCY = /chest pain|can'?t breathe|cannot breathe|difficulty breathing|short(ness)? of breath|not breathing|unconscious|seizure|severe bleeding|vomiting blood|coughing blood|stroke|face droop|slurred speech|suicid|overdose|poison/i;

const CONDS = [["diabetes", "Diabetes", /diabet|sugar (problem|patient)/i], ["bp", "High BP", /\bbp\b|hypertens|blood pressure (problem|patient|medicine|tablet)/i],
  ["asthma", "Asthma", /asthma/i], ["heart", "Heart disease", /heart (disease|problem|patient|condition)|cardiac/i],
  ["preg", "Pregnancy", /pregnan/i], ["kidney", "Kidney disease", /kidney (disease|problem|patient|failure)/i]];
const DUR = ["Since today", "1–2 days", "3–5 days", "A week or more"];
const SEV = ["Mild", "Moderate", "Severe"];
const AGES = ["Child (under 12)", "Adult", "Senior (60+)"];
const EMPATHY = [
  n => `I'm so sorry you're dealing with <b>${n}</b> 💙 Don't worry – I'm here and I can help you with this.`,
  n => `Oh no, <b>${n}</b> is no fun 😔 No worry, let's work through it together.`,
  n => `I'm sorry you're suffering with <b>${n}</b> 💙 Take a breath – I'll help you step by step.`,
];
const DISCLAIMER = "<small>⚠️ General guidance only – not a diagnosis. Always consult a doctor for medical advice.</small>";

/* ============ 2. STATE & SAVED HISTORY ============ */
const STORE = "careCheckIn.sessions";
let sessions = [];
try { sessions = JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) {}
const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(sessions.slice(0, 30))); } catch (e) {} };

let st, cur, viewing = false;
const fresh = () => ({ step: "start", syms: [], dur: null, durText: "", sev: null, age: null, conds: new Set(), condsDone: false,
  qs: [], yes: [], flags: [], specs: [], unknown: [], done: false });

/* ============ 3. SCREEN HELPERS ============ */
const $ = id => document.getElementById(id);
const box = $("messages"), input = $("input"), list = $("history");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const btn = (label, fn, cls = "") => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.className = cls; b.onclick = fn; return b; };
const clearChips = () => document.querySelectorAll(".chips").forEach(c => c.remove());

function draw(who, html, cls = "", t = time()) {
  const d = document.createElement("div");
  d.className = `msg ${who} ${cls}`;
  if (who === "user") d.textContent = html; else d.innerHTML = html;      // user text is never run as HTML
  d.insertAdjacentHTML("beforeend", `<small>${t}</small>`);
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}
function addMsg(who, html, cls = "") {                                     // draw + save
  const t = time(); draw(who, html, cls, t);
  cur.msgs.push({ who, html, cls, t }); persist();
}
function chips(labels, fn) {                                               // tap = answer straight away
  const w = document.createElement("div"); w.className = "chips";
  labels.forEach(l => w.appendChild(btn(l, () => fn(l))));
  box.appendChild(w); box.scrollTop = box.scrollHeight;
}
const answerChips = labels => chips(labels, handle);
async function say(html, ui, cls) {                                        // bot "types", then replies
  const t = document.createElement("div");
  t.className = "msg bot typing"; t.innerHTML = "<span></span><span></span><span></span>";
  box.appendChild(t); box.scrollTop = box.scrollHeight;
  await sleep(500); t.remove();
  addMsg("bot", html, cls);
  if (Array.isArray(ui)) answerChips(ui); else if (ui) ui();
}
const picker = () => chips(KEYS.map(k => S[k].e + " " + S[k].n), l => pick(KEYS.find(k => S[k].e + " " + S[k].n === l)));

/* ============ 4. SIDEBAR HISTORY ============ */
function renderHistory() {
  list.innerHTML = "";
  if (!sessions.length) { list.innerHTML = '<li class="empty">No saved check-ins yet.</li>'; return; }
  sessions.forEach(s => {
    const li = document.createElement("li"); if (s === cur) li.className = "on";
    const b = btn(s.title, () => openSession(s), "item");
    b.insertAdjacentHTML("beforeend", `<small>${new Date(s.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>`);
    const x = btn("✕", () => { sessions = sessions.filter(z => z !== s); persist(); s === cur ? newChat() : renderHistory(); }, "del");
    x.title = "Delete this chat";
    li.append(b, x); list.appendChild(li);
  });
}
function openSession(s) {                                                  // old chat, read-only
  cur = s; viewing = true; st = fresh(); st.done = true;
  box.innerHTML = ""; s.msgs.forEach(m => draw(m.who, m.html, m.cls, m.t));
  draw("bot", "📂 This is a saved chat. Type a symptom or tap <b>New Check-In</b> to begin again.");
  renderHistory(); $("side").classList.remove("open");
}
function newChat(withWelcome = true) {
  if (cur && cur.msgs.length <= 1) sessions = sessions.filter(s => s !== cur);   // drop empty chats
  st = fresh(); viewing = false;
  cur = { id: Date.now(), title: "New check-in", ts: Date.now(), msgs: [] };
  sessions.unshift(cur); box.innerHTML = ""; renderHistory(); $("side").classList.remove("open");
  if (withWelcome) welcome();
}
function welcome() {
  say("Hello! Welcome to <b>Care Check-In</b> 💙 I'm here to help you make sense of how you're feeling.<br><br>👇 <b>Tap what you're feeling</b>, or just <b>type it</b> – for example <i>“fever for 2 days”</i> or <i>“my 5 year old has a cough”</i>. I'll understand and ask only what's missing.", picker);
}

/* ============ 5. UNDERSTANDING TEXT ============ */
function parseDur(t) {
  t = t.replace(/\d+\s*(?:years?|yrs?|months?)\s*old/g, "");              // "5 years old" is age, not duration
  if (/today|few hours|this morning|tonight/.test(t)) return [0, "since today"];
  const m = t.match(/(\d+)\s*(?:to|-|–)?\s*(\d+)?\s*(day|week|month)/);
  if (m) return [+(m[2] || m[1]) * (m[3] === "week" ? 7 : m[3] === "month" ? 30 : 1), m[0]];
  if (/yesterday/.test(t)) return [1, "since yesterday"];
  if (/week/.test(t)) return [7, "a week or more"];
  return null;
}
function parseSev(t, strict) {
  const m = t.match(/(\d{1,2})\s*(?:\/|out of)\s*10/);
  const n = m ? +m[1] : (!strict && (t.match(/^\s*(\d{1,2})\s*$/) || [])[1]);
  if (n >= 1 && n <= 10) return +n <= 3 ? 1 : +n <= 6 ? 2 : 3;
  if (/severe|unbearable|very bad|worst|terrible|intense/.test(t)) return 3;
  if (/moderate|medium/.test(t)) return 2;
  if (/\bmild|slight|little/.test(t)) return 1;
  return null;
}
function parseAge(t) {
  const m = t.match(/(\d{1,3})\s*(?:years?|yrs?)\s*old|(\d{1,3})\s*(?:yo|y\/o)\b|\bage[: ]*(\d{1,3})/);
  if (m) { const a = +(m[1] || m[2] || m[3]); return a < 12 ? "Child" : a >= 60 ? "Senior" : "Adult"; }
  if (/\d+\s*months?\s*old|child|kid|baby|infant|toddler|under 12/.test(t)) return "Child";
  if (/senior|elderly|60\+|grand(father|mother|pa|ma)|older/.test(t)) return "Senior";
  if (/\badult|teen|young/.test(t)) return "Adult";
  return null;
}
function absorb(t) {                                                       // pull every useful detail from a message
  if (st.dur == null) { const d = parseDur(t); if (d) [st.dur, st.durText] = d; }
  if (!st.sev) { const s = parseSev(t, st.step !== "sev"); if (s) st.sev = s; }
  if (!st.age) { const a = parseAge(t); if (a) st.age = a; }
  CONDS.forEach(([k, , rx]) => {
    if (rx.test(t) && !new RegExp("\\b(no|not|without|don'?t have)\\b.{0,15}(?:" + rx.source + ")", "i").test(t)) st.conds.add(k);
  });
}

/* ============ 6. THE BRAIN ============ */
function addSyms(keys) {
  keys.forEach(k => {
    if (st.syms.includes(k)) return;
    st.syms.push(k);
    S[k].q.forEach(q => { if (st.qs.length < 4) st.qs.push(q); });          // at most 4 follow-ups overall
  });
  cur.title = (st.syms.map(k => S[k].n).join(", ") || st.specs.map(s => s[1]).join(", ") || "New check-in").slice(0, 40);
  renderHistory();
}
function pick(k) {                                                         // tapping a symptom starts straight away
  if (viewing) newChat(false);
  if (st.done) newChat(false);
  addMsg("user", S[k].e + " " + S[k].n); clearChips();
  addSyms([k]); begin();
}

async function handle(raw) {
  const text = raw.trim(); if (!text) return;
  if (viewing) newChat(false);
  const t = text.toLowerCase();
  const found = KEYS.filter(k => S[k].rx.test(t));
  const sp = SPEC.filter(s => s[0].test(t));
  if (st.done && (found.length || sp.length) && !/^(start|end)/.test(t)) newChat(false);
  addMsg("user", text); clearChips(); input.value = "";

  if (/^(start ?over|restart|reset|new( check-?in)?)$/.test(t)) return newChat();
  if (/^(end|end chat|exit|quit|bye|goodbye|stop|thanks?|thank you)$/.test(t)) {
    st.done = true;
    return say("Thank you for checking in 💙 Your chat is saved in the left panel. Please rest, drink water, and see a doctor if you feel worse. Take care! 👋", ["Start over"]);
  }
  if (EMERGENCY.test(t)) return emergency();
  if (st.done) return say("This check-in is finished. Tap <b>Start over</b> for a new one. 💙", ["Start over"]);

  const newKeys = found.filter(k => !st.syms.includes(k));
  const newSpecs = sp.filter(s => !st.specs.includes(s));

  /* ---- first message: need at least one symptom ---- */
  if (st.step === "start") {
    if (!newKeys.length && !newSpecs.length) {
      if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t)) return say("Hello! 👋 What's troubling you today? Tap one below or type it.", picker);
      st.unknown.push(text.slice(0, 60));
      return say(`I don't recognise “${esc(text.slice(0, 60))}” 🤔 I've noted it – please see a doctor about it. You can tap a symptom below or type another.`, picker);
    }
    newSpecs.forEach(s => st.specs.push(s)); addSyms(newKeys); absorb(t);
    return begin();
  }

  /* ---- later messages: new symptoms can be added at any time ---- */
  let note = "";
  if (newKeys.length || newSpecs.length) {
    newSpecs.forEach(s => st.specs.push(s)); addSyms(newKeys);
    note = `Noted ✓ I've added ${[...newKeys.map(k => S[k].n), ...newSpecs.map(s => s[1])].join(", ")} too.<br>`;
  }
  absorb(t);

  const isNo = /^(n|no|none|nothing|nope|nah|not)\b/.test(t), isYes = /^(y|yes|yeah|yep|yup|sure|i do|have)\b/.test(t);
  let ok = false;
  switch (st.step) {
    case "dur": ok = st.dur != null; break;
    case "sev": ok = !!st.sev; break;
    case "age": ok = !!st.age; break;
    case "cond": if (isNo || st.conds.size) { st.condsDone = true; ok = true; } break;
    case "q":
      if (isYes || isNo) {
        const q = st.qs.shift();
        if (isYes) { st.yes.push(q[1]); if (q[2]) st.flags.push(q[1]); }
        if (isYes && q[1] === "self-harm") return emergency(true);
        ok = true;
      }
      break;
  }
  proceed(note || (ok || newKeys.length ? "" : "Sorry, I didn't catch that – tap an option or type your answer. "));
}

/* ============ 7. ASK THE NEXT MISSING THING ============ */
function begin() {
  const names = [...st.syms.map(k => S[k].e + " " + S[k].n), ...st.specs.map(s => s[1])].join(", ");
  proceed(EMPATHY[Math.floor(Math.random() * EMPATHY.length)](names) + "<br><br>");
}
function proceed(prefix = "") {
  if (st.dur == null) { st.step = "dur"; return say(prefix + "⏱️ How long have you had this?", DUR); }
  if (!st.sev) { st.step = "sev"; return say(prefix + "How strong does it feel overall?", SEV); }
  if (!st.age) { st.step = "age"; return say(prefix + "🧑 Who is this for? Age matters for safe advice.", AGES); }
  if (st.qs.length) { st.step = "q"; return say(prefix + st.qs[0][0], ["Yes", "No"]); }
  if (!st.condsDone && !st.conds.size) {
    st.step = "cond";
    return say(prefix + "Any <b>existing health condition</b>? Tap one (or type), or choose None.", ["None", ...CONDS.map(c => c[1])]);
  }
  report(prefix);
}

/* ============ 8. RESULT ============ */
function emergency(selfHarm) {
  st.done = true;
  const msg = selfHarm
    ? "I'm really glad you told me 💙 You don't have to face this alone. Please call your local emergency number or reach out to someone you trust <b>right now</b>."
    : "Please call your local emergency number or go to the nearest emergency room <b>right now</b>. Do not wait for an online chat.";
  say(`<h3>🚨 This could be serious</h3>${msg}`, ["Start over"], "card emergency");
}

function report(prefix = "") {
  st.done = true;
  const d = st.syms.map(k => S[k]);
  const pts = [0, 0, 2, 4][st.sev] + (st.dur >= 3) + (st.dur >= 7) + st.flags.length * 3 + (st.specs.length ? 3 : 0)
    + (st.unknown.length ? 1 : 0) + (st.age !== "Adult" ? 1 : 0) + (st.conds.size ? 1 : 0) + (st.syms.includes("fever") && st.age === "Child" ? 2 : 0);
  let lvl = pts >= 6 ? 2 : pts >= 3 ? 1 : 0;
  if (st.specs.length || st.unknown.length) lvl = Math.max(lvl, 1);
  const L = [
    ["🟢", "Looks mild", "Home care is usually enough. Re-check if you're not better in 2–3 days."],
    ["🟡", "Moderate – keep a close watch", "Monitor closely. See a doctor if you're not better in 48 hours or get worse."],
    ["🔴", "Please see a doctor", "Some answers are warning signs – please get checked soon, ideally today."],
  ][lvl];
  const ul = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";
  const notes = [
    ...st.flags.map(f => `⚠️ You mentioned <b>${f}</b> – this is a warning sign.`),
    ...(st.age === "Child" ? ["👶 Children can get sick quickly. Never give adult medicines – ask a paediatrician for the right dose."] : []),
    ...(st.age === "Senior" ? ["🧓 Older adults can get worse faster – a doctor visit is safer if symptoms last."] : []),
    ...(st.conds.has("preg") ? ["🤰 Check with your doctor before taking any medicine while pregnant."] : []),
    ...(st.conds.has("diabetes") ? ["🩸 Infections can raise blood sugar – monitor it closely."] : []),
    ...(st.conds.has("asthma") && (st.syms.includes("cough") || st.syms.includes("cold")) ? ["🌬️ With asthma, keep your inhaler handy and watch for wheezing."] : []),
    ...(st.conds.size ? ["Existing conditions change what is safe to take – confirm with your doctor."] : []),
    ...st.specs.map(s => `🩺 <b>${s[1]}</b>: I can't safely guide on this – please consult ${s[2]}.`),
    ...st.unknown.map(u => `❓ “${esc(u)}” isn't in my knowledge – please consult a doctor.`),
  ];
  const causes = [...new Set(d.flatMap(x => x.c.split(", ")))].slice(0, 6);
  const tips = [...new Set(d.flatMap(x => x.t))].slice(0, 8);
  const condText = st.conds.size ? [...st.conds].map(k => CONDS.find(c => c[0] === k)[1]).join(", ") : "none";

  cur.title = (st.syms.map(k => S[k].n).join(", ") || st.specs.map(s => s[1]).join(", ") || "Check-in").slice(0, 40);
  renderHistory();
  say(`${prefix}<h3>${L[0]} ${L[1]}</h3>
    <b>Symptoms:</b> ${d.map(x => x.e + " " + x.n).join(", ") || "—"}${st.yes.length ? " (also: " + st.yes.join(", ") + ")" : ""}<br>
    <b>Severity:</b> ${SEV[st.sev - 1]} · <b>Duration:</b> ${st.durText || DUR[st.dur === 0 ? 0 : st.dur <= 2 ? 1 : st.dur <= 5 ? 2 : 3].toLowerCase()} · <b>Age:</b> ${st.age} · <b>Conditions:</b> ${condText}
    <p><b>${L[2]}</b></p>
    ${notes.length ? "<h4>Important notes</h4>" + notes.map(n => `<div class="warn">${n}</div>`).join("") : ""}
    ${causes.length ? "<h4>Possible common causes (not a diagnosis)</h4>" + ul(causes) : ""}
    ${tips.length ? "<h4>Self-care that may help</h4>" + ul(tips) : ""}
    <h4>Go to a doctor or hospital if you have</h4>
    ${ul(["Trouble breathing or chest pain", "Fever above 103°F (39.4°C) or lasting over 3 days", "Confusion, fainting or a stiff neck", "Severe pain, or blood in vomit, stool or urine", "Signs of dehydration (very dry mouth, little urine, dizziness)", "Symptoms that keep getting worse"])}
    ${DISCLAIMER}`, ["Start over", "End chat"], "card lvl" + lvl);
}

/* ============ 9. SEARCH BAR ============ */
function search(q) {
  q = q.trim(); if (!q) return;
  if (viewing) newChat(false);
  addMsg("user", "🔎 " + q); clearChips();
  const t = q.toLowerCase();
  const hits = KEYS.filter(k => S[k].rx.test(t) || S[k].n.toLowerCase().includes(t) || S[k].c.toLowerCase().includes(t)).slice(0, 4);
  const sp = SPEC.filter(s => s[0].test(t));
  let h = hits.map(k => `<b>${S[k].e} ${S[k].n}</b><br><i>Common causes:</i> ${S[k].c}<br><i>Self-care:</i> ${S[k].t.join("; ")}<br><br>`).join("");
  h += sp.map(s => `<b>🩺 ${s[1]}</b><br>I can't safely give home advice for this – please consult ${s[2]}.<br><br>`).join("");
  if (!h) h = `I don't have information on “${esc(q)}”. 🤔 Please consult a doctor.<br>`;
  say(h + DISCLAIMER, !st.done && st.step === "start" ? picker : null);
  $("q").value = "";
}

/* ============ 10. START-UP ============ */
$("form").addEventListener("submit", e => { e.preventDefault(); handle(input.value); });
$("searchForm").addEventListener("submit", e => { e.preventDefault(); search($("q").value); });
$("newBtn").onclick = () => newChat();
$("clearBtn").onclick = () => { if (confirm("Delete all saved chats?")) { sessions = []; persist(); newChat(); } };
$("menu").onclick = () => $("side").classList.toggle("open");
newChat();
