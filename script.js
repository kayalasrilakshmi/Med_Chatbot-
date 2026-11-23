const RAW = {
  fever:["Fever","🤒","fever|temperature|chills|feverish","Viral infection, flu, bacterial infection, dengue or malaria (in some regions)","Drink plenty of fluids 💧|Rest and wear light clothes|Paracetamol can help – follow the label"],
  cold:["Cold / blocked nose","🤧","cold|runny nose|sneez|stuffy|blocked nose|congestion","Common cold, allergy, sinus infection","Sip warm fluids ☕|Steam inhalation|Rest well"],
  cough:["Cough","😷","cough","Viral infection, allergy, asthma, acid reflux, bronchitis","Warm water with honey 🍯 (adults only)|Avoid smoke and dust|Keep your head raised when sleeping"],
  throat:["Sore throat","😖","sore throat|throat","Viral infection, tonsillitis, strep throat","Gargle with warm salt water|Warm fluids|Avoid cold and spicy food"],
  headache:["Headache","🤕","headache|head ache|migraine|head hurts","Tension, dehydration, poor sleep, eye strain, migraine","Rest in a quiet dark room|Drink water|Limit screen time"],
  dizzy:["Dizziness","😵","dizz|vertigo|light-?headed","Low blood pressure, dehydration, anaemia, inner-ear problem","Sit or lie down at once|Drink fluids and eat something|Stand up slowly"],
  stomach:["Stomach pain","😣","stomach ache|stomach pain|abdominal|belly|tummy","Gas, indigestion, infection, ulcer, gallbladder or appendix problem","Sip warm water|Eat light food|Avoid oily and spicy meals"],
  nausea:["Nausea / vomiting","🤢","nausea|vomit|puke|throwing up","Stomach bug, food poisoning, migraine, pregnancy","Sip ORS or clear fluids in small amounts|Eat bland food (toast, banana)|Rest your stomach for an hour"],
  diarrhea:["Diarrhoea","🚽","diarrh|loose motion|loose stool","Stomach infection, food poisoning, food intolerance","Take ORS often|Eat rice, banana, curd|Wash hands well"],
  constipation:["Constipation","😬","constipat|hard stool","Low fibre or water, inactivity, medicines","Drink more water|Eat fruit, vegetables and fibre|Walk daily"],
  acidity:["Acidity / gas","🔥","acidity|heartburn|reflux|gas\\b|bloating|indigestion","Acid reflux, gastritis, spicy or late meals","Eat smaller meals|Avoid lying down after eating|Limit spicy food, tea and coffee"],
  body:["Body ache","💪","body ache|body pain|muscle|myalgia","Viral illness, overexertion, vitamin D deficiency","Rest and gentle stretching|Warm compress|Stay hydrated"],
  joint:["Joint pain","🦴","joint|knee pain|arthritis","Strain, arthritis, injury, uric acid","Rest the joint|Warm or cold pack|Light movement as comfortable"],
  back:["Back / neck pain","🧍","back pain|backache|neck pain|spine","Poor posture, muscle strain, disc problem","Fix your sitting posture|Gentle stretches|Warm compress"],
  fatigue:["Tiredness","😴","tired|fatigue|weak|exhausted|no energy","Poor sleep, anaemia, thyroid problem, infection, stress","Sleep 7–8 hours|Eat regular balanced meals|Take short breaks"],
  rash:["Skin rash","🔴","rash|hives|red spots|skin","Allergy, eczema, heat rash, fungal or viral infection","Keep the area clean and dry|Avoid scratching|Wear loose cotton clothes"],
  itch:["Itching","🖐️","itch","Dry skin, allergy, fungal infection, insect bite","Moisturise skin|Avoid harsh soaps|Keep nails short"],
  allergy:["Allergy","🌼","allerg|hay fever|watery eyes","Pollen, dust, pet dander, food","Avoid the trigger|Rinse nose with saline|Keep windows closed in pollen season"],
  eye:["Eye problem","👁️","eye|vision|pink eye","Conjunctivitis, dry eyes, allergy, eye strain","Don't rub your eyes|Wash hands often|Rest from screens"],
  ear:["Ear pain","👂","ear ?ache|ear pain|ear infection","Ear infection, wax, water in the ear","Keep the ear dry|Warm cloth outside the ear|Don't put anything inside"],
  tooth:["Tooth / gum pain","🦷","tooth|gum|dental","Cavity, gum infection, sensitivity","Rinse with warm salt water|Brush gently|Avoid very hot or cold food"],
  urine:["Burning urination","🚻","burning urin|urin|burning pee","Urinary tract infection, dehydration","Drink plenty of water|Don't hold urine|Maintain hygiene"],
  anxiety:["Stress / anxiety","😟","anxiety|anxious|stress|panic|worried|depress|low mood","Stress, poor sleep, anxiety disorder, low mood","Slow breathing: in 4s, out 6s|Talk to someone you trust|Short walk outdoors"],
  sleep:["Poor sleep","🌙","insomnia|can'?t sleep|cannot sleep|sleepless","Stress, caffeine, screens, irregular routine","Fixed bedtime|No screens an hour before bed|Avoid caffeine after noon"],
  period:["Period pain","🩸","period pain|menstrual|period cramps","Normal menstrual cramps, hormonal changes, fibroids or endometriosis","Heat pad on the lower belly|Gentle exercise|Stay hydrated"],
  injury:["Minor injury / bite","🩹","wound|sprain|injur|bite|sting|minor burn","Cuts, sprains, insect bites, small burns","Rinse with clean water|Cover with a clean dressing|Rest and elevate a sprain"],
};
const DB = {};
for (const k in RAW) {
  const [label, emoji, words, causes, tips] = RAW[k];
  DB[k] = { label, emoji, rx: new RegExp("\\b(?:" + words + ")", "i"), causes, tips: tips.split("|") };
}
const KEYS = Object.keys(DB);

/* Conditions where I will NOT give home advice – only "please consult a doctor".
   [regex, name, which doctor] */
const SPEC = [
  ["fissure|piles|h(a)?emorrhoid|blood in (stool|motion)", "Fissure / piles / rectal bleeding", "a general surgeon or colorectal specialist"],
  ["hernia|lump|kidney stone|gallstone|appendic", "Hernia / lump / stone / appendix problem", "a general physician or surgeon"],
  ["epilep|\\bfits\\b|faint|numb|paraly", "Nerve or neurological symptom", "a neurologist (go to hospital if sudden)"],
  ["diabet|thyroid|jaundice|yellow (skin|eyes)", "Hormone or liver related problem", "a physician (tests are usually needed)"],
  ["blood in urine|palpitation|chest tight", "Heart or urinary warning sign", "a doctor promptly"],
  ["pregnan|breastfeed", "Pregnancy-related concern", "your gynaecologist before taking any medicine"],
].map(([r, n, d]) => [new RegExp(r, "i"), n, d]);

const EMERGENCY = /chest pain|can'?t breathe|cannot breathe|difficulty breathing|short(ness)? of breath|not breathing|unconscious|seizure|severe bleeding|vomiting blood|coughing blood|stroke|face droop|slurred speech|suicid|overdose|poison/i;
const CONDS = [["diabetes","Diabetes"],["bp","High BP"],["asthma","Asthma"],["heart","Heart disease"],["preg","Pregnancy"],["kidney","Kidney disease"]];
const COND_RX = [["diabetes",/diabet|sugar/i],["bp",/blood pressure|\bbp\b|hypertens/i],["asthma",/asthma/i],["heart",/heart/i],["preg",/pregnan/i],["kidney",/kidney/i]];
const SEV = ["1","2","3","4","5","6","7","8","9","10"];
const DUR = ["Since today","1 to 2 days","3 to 5 days","A week or more"];
const AGES = ["Child (under 12)","Teen / Adult","Senior (60+)"];
const DISCLAIMER = "<small>⚠️ General guidance only – not a diagnosis. Always consult a doctor for medical advice.</small>";

/* ---------- 2. STATE & SAVED HISTORY ---------- */
const STORE = "careCheckIn.sessions";
let sessions = [];
try { sessions = JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) {}
const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(sessions.slice(0, 30))); } catch (e) {} };

let st, cur, viewing = false;       // st = current conversation memory, cur = saved session
const fresh = () => ({ step: "pick", sel: new Set(), sev: null, days: null, durText: "", age: null,
  conds: new Set(), condsDone: false, moreDone: false, specs: [], unknown: [], done: false });

/* ---------- 3. SCREEN HELPERS ---------- */
const $ = id => document.getElementById(id);
const box = $("messages"), input = $("input"), list = $("history");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const scroll = () => (box.scrollTop = box.scrollHeight);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const btn = (label, fn, cls = "") => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.className = cls; b.onclick = fn; return b; };

function draw(who, html, cls = "", t = time()) {            // put one bubble on screen
  const d = document.createElement("div");
  d.className = `msg ${who} ${cls}`;
  if (who === "user") d.textContent = html; else d.innerHTML = html;   // user text is never run as HTML
  d.insertAdjacentHTML("beforeend", `<small>${t}</small>`);
  box.appendChild(d); scroll();
}
function addMsg(who, html, cls = "") {                      // draw + save to history
  const t = time(); draw(who, html, cls, t);
  cur.msgs.push({ who, html, cls, t }); persist();
}
const clearChips = () => document.querySelectorAll(".chips").forEach(c => c.remove());

function chips(labels) {                                    // single-choice buttons
  const w = document.createElement("div"); w.className = "chips";
  labels.forEach(l => w.appendChild(btn(l, () => handle(l))));
  box.appendChild(w); scroll();
}
function multi(options, sel, extra) {                       // multi-choice toggles + Continue
  clearChips();
  const w = document.createElement("div"); w.className = "chips";
  options.forEach(([k, l]) => {
    const b = btn(l, () => { sel.has(k) ? sel.delete(k) : sel.add(k); b.classList.toggle("on"); });
    if (sel.has(k)) b.classList.add("on");
    w.appendChild(b);
  });
  w.appendChild(btn("Continue ✓", () => handle("Continue ✓"), "go"));
  if (extra) w.appendChild(btn(extra, () => handle(extra), "alt"));
  box.appendChild(w); scroll();
}
async function say(html, ui, cls) {                         // bot "types", then replies
  const t = document.createElement("div");
  t.className = "msg bot typing"; t.innerHTML = "<span></span><span></span><span></span>";
  box.appendChild(t); scroll();
  await sleep(600); t.remove();
  addMsg("bot", html, cls);
  if (Array.isArray(ui)) chips(ui); else if (ui) ui();
}
const picker = () => multi(KEYS.map(k => [k, DB[k].emoji + " " + DB[k].label]), st.sel);

/* ---------- 4. SIDEBAR HISTORY ---------- */
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
function openSession(s) {                                   // show an old chat (read-only)
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

/* ---------- 5. UNDERSTANDING TEXT ---------- */
const detect = t => KEYS.filter(k => DB[k].rx.test(t));
const specOf = t => SPEC.filter(s => s[0].test(t));

function parseDuration(t) {
  if (/today|few hours|this morning|tonight/.test(t)) return { days: 0, text: "since today" };
  const m = t.match(/(\d+)\s*(?:to|-|–)?\s*(\d+)?\s*(day|week|month)/);
  if (m) return { days: +(m[2] || m[1]) * (m[3] === "week" ? 7 : m[3] === "month" ? 30 : 1), text: m[0] };
  if (/week/.test(t)) return { days: 7, text: "a week or more" };
  if (/yesterday/.test(t)) return { days: 1, text: "since yesterday" };
  return null;
}
function parseSeverity(t) {
  const m = t.match(/(\d+)\s*(?:\/|out of)\s*10/) || (st.step === "severity" ? t.match(/\b(\d+)\b/) : null);
  return m && +m[1] >= 1 && +m[1] <= 10 ? +m[1] : null;
}
function parseAge(t) {
  if (/child|kid|baby|infant|toddler|under 12/.test(t)) return "Child";
  if (/senior|elderly|60\+|older/.test(t)) return "Senior";
  if (/adult|teen|young/.test(t)) return "Adult";
  return null;
}

/* ---------- 6. THE BRAIN: runs for every message ---------- */
async function handle(raw) {
  const text = raw.trim(); if (!text) return;
  if (viewing) newChat(false);                              // typing after viewing an old chat starts a new one
  const t = text.toLowerCase();
  if (st.done && (detect(t).length || specOf(t).length) && !/^(start|end)/.test(t)) newChat(false);
  addMsg("user", text); clearChips(); input.value = "";

  if (/^(start ?over|restart|reset|new( check-?in)?)$/.test(t)) return newChat();
  if (/^(end|end chat|exit|quit|bye|goodbye|stop)$/.test(t)) {
    st.done = true;
    return say("Thank you for checking in 💙 Your chat is saved in the left panel. Please rest, drink water, and see a doctor if you feel worse. Take care! 👋", ["Start over"]);
  }
  if (EMERGENCY.test(t)) {
    st.done = true;
    return say("<h3>🚨 This could be serious</h3>Please call your local emergency number or go to the nearest emergency room <b>right now</b>. Do not wait for an online chat.", ["Start over"], "card emergency");
  }
  if (st.done) return say("This check-in is finished. Tap <b>Start over</b> for a new one. 💙", ["Start over"]);
  if (st.step === "pick" && !st.sel.size && /^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t)) return say("Hello! 👋 Select your symptoms below (as many as you like) or type them.", picker);

  // Pick up anything useful from the text, whatever the step
  const found = detect(t);
  specOf(t).forEach(s => { if (!st.specs.includes(s)) st.specs.push(s); });
  const dur = parseDuration(t); if (dur) { st.days = dur.days; st.durText = dur.text; }
  const sv = dur && /day|week|month/.test(t) ? null : parseSeverity(t); if (sv) st.sev = sv;
  const age = parseAge(t); if (age) st.age = age;
  const isContinue = /^(continue|done|next|that'?s all)/.test(t);
  const isNo = /^(no\b|none|nothing|nope)|no other/.test(t);

  switch (st.step) {
    case "pick": {
      found.forEach(k => st.sel.add(k));
      if (isContinue) {
        if (!st.sel.size && !st.specs.length && !st.unknown.length) return say("Please select at least one symptom first 🙂", picker);
        return ask();
      }
      if (found.length || specOf(t).length) {
        if (sv || dur) return ask();                        // "fever 7/10 for 3 days" answers everything
        return say("Added ✓ Select more, or tap <b>Continue ✓</b> when ready.", picker);
      }
      st.unknown.push(text.slice(0, 60));
      return say(`I don't recognise “${esc(text.slice(0, 60))}” 🤔 I've noted it – please consult a doctor about it. Pick from the list or type another symptom, then tap <b>Continue ✓</b>.`, picker);
    }
    case "conds":
      COND_RX.forEach(([k, rx]) => rx.test(t) && st.conds.add(k));
      if (isContinue || isNo) { st.condsDone = true; if (isNo) st.conds.clear(); return ask(); }
      return say("Noted ✓ Select more, or tap <b>Continue ✓</b>.", () => multi(CONDS, st.conds, "None"));
    case "more":
      found.forEach(k => st.sel.add(k));
      if (isContinue || isNo || found.length) { if (!found.length || isContinue) st.moreDone = true; if (found.length && !isContinue) return say("Added ✓ Anything else? Then tap <b>Continue ✓</b>.", moreUI); return ask(); }
      st.unknown.push(text.slice(0, 60));
      return say(`I don't recognise “${esc(text.slice(0, 60))}” – I've noted it; please consult a doctor about it. Anything else?`, moreUI);
    default:
      return ask(true);                                     // severity / duration / age steps
  }
}
const moreUI = () => multi(KEYS.filter(k => !st.sel.has(k)).map(k => [k, DB[k].emoji + " " + DB[k].label]), st.sel, "No other symptoms");

/* ---------- 7. ASK THE NEXT MISSING QUESTION ---------- */
function ask(retry) {
  const sorry = step => (retry && st.step === step ? "Sorry, I didn't catch that. " : "");
  const names = [...st.sel].map(k => DB[k].emoji + " " + DB[k].label).join(", ") || "your symptoms";
  if (st.sev == null) {
    const p = sorry("severity"); st.step = "severity";
    return say(`${p}I'm sorry you're dealing with <b>${names}</b>. 💙<br>On a scale of <b>1 to 10</b>, how bad does it feel overall? (1 = very mild, 10 = unbearable)`, SEV);
  }
  if (st.days == null) {
    const p = sorry("duration"); st.step = "duration";
    return say(`${p}Thanks. ⏱️ How long have you had this?`, DUR);
  }
  if (!st.age) {
    const p = sorry("age"); st.step = "age";
    return say(`${p}Who is this for? 🧑 Age matters for safe advice.`, AGES);
  }
  if (!st.condsDone) {
    st.step = "conds";
    return say("Do you have any <b>existing health conditions</b>? Select all that apply, then tap Continue.", () => multi(CONDS, st.conds, "None"));
  }
  if (!st.moreDone) {
    st.step = "more";
    return say("Any <b>other symptoms</b> too? Select more, type them, or choose “No other symptoms”.", moreUI);
  }
  report();
}

/* ---------- 8. FINAL REPORT ---------- */
function report() {
  st.done = true;
  const keys = [...st.sel], d = keys.map(k => DB[k]);
  // Risk score: worse rating, longer duration, many symptoms, age and conditions all add points
  let score = st.sev + (st.days >= 3) + (st.days >= 7) * 2 + (keys.length >= 3) + (st.conds.size ? 1 : 0)
            + (st.age !== "Adult" ? 1 : 0) + (st.specs.length ? 3 : 0) + (st.unknown.length ? 1 : 0)
            + (st.sel.has("fever") && st.age === "Child" ? 2 : 0);
  let lvl = score >= 11 ? 2 : score >= 7 ? 1 : 0;
  if (st.specs.length || st.unknown.length) lvl = Math.max(lvl, 1);
  const L = [
    ["🟢", "Looks mild", "Home care is usually enough. Re-check if you are not better in 2–3 days."],
    ["🟡", "Moderate – keep a close watch", "Monitor closely. See a doctor if you are not better in 48 hours or get worse."],
    ["🔴", "Needs medical attention", "Please see a doctor soon, ideally today."],
  ][lvl];
  const ul = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";
  const notes = [];
  if (st.age === "Child") notes.push("👶 Children can get sick quickly. Never give adult medicines – ask a paediatrician for the right dose.");
  if (st.age === "Senior") notes.push("🧓 Older adults can get worse faster – a doctor visit is safer if symptoms last.");
  if (st.conds.has("preg")) notes.push("🤰 Check with your doctor before taking any medicine while pregnant.");
  if (st.conds.has("diabetes")) notes.push("🩸 Infections can raise blood sugar – monitor it closely.");
  if (st.conds.has("asthma") && (st.sel.has("cough") || st.sel.has("cold"))) notes.push("🌬️ With asthma, keep your inhaler handy and watch for wheezing.");
  if (st.conds.size) notes.push("Existing conditions change what is safe to take – confirm with your doctor.");
  st.specs.forEach(s => notes.push(`🩺 <b>${s[1]}</b>: I can't safely guide on this – please consult ${s[2]}.`));
  st.unknown.forEach(u => notes.push(`❓ “${esc(u)}” isn't in my knowledge – please consult a doctor about it.`));
  const causes = [...new Set(d.flatMap(x => x.causes.split(", ")))];
  const tips = [...new Set(d.flatMap(x => x.tips))].slice(0, 8);
  const condText = st.conds.size ? [...st.conds].map(k => CONDS.find(c => c[0] === k)[1]).join(", ") : "none";

  cur.title = (keys.map(k => DB[k].label).join(", ") || st.specs.map(s => s[1]).join(", ") || "Check-in").slice(0, 40);
  renderHistory();
  say(`<h3>${L[0]} ${L[1]}</h3>
    <b>Symptoms:</b> ${d.map(x => x.emoji + " " + x.label).join(", ") || "—"}<br>
    <b>Severity:</b> ${st.sev}/10 · <b>Duration:</b> ${st.durText} · <b>Age:</b> ${st.age} · <b>Conditions:</b> ${condText}
    <p><b>${L[2]}</b></p>
    ${causes.length ? "<h4>Possible common causes (not a diagnosis)</h4>" + ul(causes) : ""}
    ${tips.length ? "<h4>Self-care that may help</h4>" + ul(tips) : ""}
    ${notes.length ? "<h4>Important notes</h4>" + notes.map(n => `<div class="warn">${n}</div>`).join("") : ""}
    <h4>Go to a doctor or hospital if you have</h4>
    ${ul(["Trouble breathing or chest pain", "Fever above 103°F (39.4°C) or lasting over 3 days", "Confusion, fainting or a stiff neck", "Severe pain, or blood in vomit, stool or urine", "Signs of dehydration (very dry mouth, little urine, dizziness)", "Symptoms that keep getting worse"])}
    ${DISCLAIMER}`, ["Start over", "End chat"], "card lvl" + lvl);
}

/* ---------- 9. SEARCH BAR (uses the built-in knowledge base) ---------- */
function search(q) {
  q = q.trim(); if (!q) return;
  if (viewing) newChat(false);
  addMsg("user", "🔎 " + q); clearChips();
  const t = q.toLowerCase();
  const hits = KEYS.filter(k => DB[k].rx.test(t) || DB[k].label.toLowerCase().includes(t) || DB[k].causes.toLowerCase().includes(t)).slice(0, 4);
  const sp = SPEC.filter(s => s[0].test(t));
  let h = hits.map(k => `<b>${DB[k].emoji} ${DB[k].label}</b><br><i>Common causes:</i> ${DB[k].causes}<br><i>Self-care:</i> ${DB[k].tips.join("; ")}<br><br>`).join("");
  h += sp.map(s => `<b>🩺 ${s[1]}</b><br>I can't safely give home advice for this – please consult ${s[2]}.<br><br>`).join("");
  if (!h) h = `I don't have information on “${esc(q)}”. 🤔 Please consult a doctor.<br>`;
  say(h + DISCLAIMER, !st.done && st.step === "pick" ? picker : null);
  $("q").value = "";
}

/* ---------- 10. START-UP ---------- */
function welcome() {
  say("Hello! Welcome to <b>Care Check-In</b> 💙 I'm here to help you make sense of how you're feeling.<br><br>👇 <b>Select all the symptoms you have</b> (more than one is fine), or just type them, then tap <b>Continue ✓</b>.<br>Type <b>end</b> to finish or <b>start over</b> at any time.", picker);
}
$("form").addEventListener("submit", e => { e.preventDefault(); handle(input.value); });
$("searchForm").addEventListener("submit", e => { e.preventDefault(); search($("q").value); });
$("newBtn").onclick = () => newChat();
$("clearBtn").onclick = () => { if (confirm("Delete all saved chats?")) { sessions = []; persist(); newChat(); } };
$("menu").onclick = () => $("side").classList.toggle("open");
newChat();
