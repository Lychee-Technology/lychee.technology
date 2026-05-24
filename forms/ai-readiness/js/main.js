// ---------- DATA ----------
const QUESTIONS = [
  {
    q: "Do you find yourself answering the same kinds of customer questions over and over, daily or weekly?",
    help: "",
    opts: [
      { label: "Almost never", score: 0 },
      { label: "Sometimes", score: 5 },
      { label: "Yes, often", score: 10 }
    ]
  },
  {
    q: "Are your customer records scattered across many places?",
    help: "e.g. WeChat, SMS, email, spreadsheets, PDFs, paper, different employees' phones.",
    opts: [
      { label: "Mostly in one place", score: 0 },
      { label: "A bit scattered", score: 5 },
      { label: "Very scattered", score: 10 }
    ]
  },
  {
    q: "Do your staff or partners keep asking the same internal process questions?",
    help: "e.g. how to quote, how to collect documents, how to reply, how to record status.",
    opts: [
      { label: "Rarely", score: 0 },
      { label: "Sometimes", score: 5 },
      { label: "Often", score: 10 }
    ]
  },
  {
    q: "Are customer follow-ups easy to drop or forget?",
    help: "e.g. forgetting to reply, to chase missing documents, to confirm a booking, to circle back.",
    opts: [
      { label: "Almost never", score: 0 },
      { label: "Sometimes", score: 5 },
      { label: "Yes, often", score: 10 }
    ]
  },
  {
    q: "Do you have standard reply templates in regular use?",
    help: "e.g. FAQ replies, quote explainers, document checklists, booking confirmations, post-sale reminders.",
    opts: [
      { label: "Mostly not", score: 0 },
      { label: "Some, but not complete", score: 5 },
      { label: "Yes, and we use them often", score: 10 }
    ]
  },
  {
    q: "Which kinds of replies could AI draft first, for you to review?",
    help: "",
    opts: [
      { label: "Can't think of any right now", score: 0 },
      { label: "A few — basic inquiries, document lists, reminders", score: 5 },
      { label: "Many — replies, summaries, first-draft quotes, follow-ups", score: 10 }
    ]
  },
  {
    q: "Which actions absolutely require a human to confirm?",
    help: "e.g. quotes, commitments, contracts, sensitive customer info, professional advice, payment, formal send.",
    opts: [
      { label: "Hardly any need human review", score: 0 },
      { label: "Some do", score: 5 },
      { label: "Many, and they really matter", score: 10 }
    ]
  },
  {
    q: "Is customer status clearly recorded somewhere right now?",
    help: "e.g. new inquiry, replied, awaiting documents, quoted, follow-up due, won, closed.",
    opts: [
      { label: "Pretty messy", score: 0 },
      { label: "Partially recorded", score: 5 },
      { label: "Quite clear", score: 10 }
    ]
  },
  {
    q: "Are there actions you believe should NOT be automated?",
    help: "",
    opts: [
      { label: "Haven't really thought about it", score: 0 },
      { label: "A rough idea", score: 5 },
      { label: "Yes, clearly — quotes, promises, sending, payments, judgment calls stay human", score: 10 }
    ]
  },
  {
    q: "If you could only improve one workflow first, can you name a specific one?",
    help: "",
    opts: [
      { label: "Not really", score: 0 },
      { label: "I have a rough direction", score: 5 },
      { label: "Yes — I can name one clearly", score: 10 }
    ]
  }
];

const RESULTS = [
  {
    min: 0, max: 30,
    band: "Tidy first",
    bandClass: "band-low",
    title: "Tidy your workflow first, then look at AI.",
    starter: "Customer Q&A index → Standard reply templates → Customer status log",
    body: [
      "Your answers suggest you're probably not ready to jump straight into AI automation or a heavier system — and that isn't a bad thing.",
      "For a lot of small teams, the real bottleneck isn't that AI isn't powerful enough. It's that the workflow hasn't been described clearly yet.",
      "A solid starting move: write down your common customer questions, where records live, your standard replies, how you track customer status, and which actions must stay human."
    ]
  },
  {
    min: 31, max: 60,
    band: "Pilot ready",
    bandClass: "band-mid",
    title: "You're ready for an AI assist pilot.",
    starter: "Customer Q&A → AI draft reply → Human confirms → Follow-up log",
    body: [
      "There are real signals in your business that an AI assist could help.",
      "The smart move is to start with one small workflow — not a big system out of the gate. Pick the workflow you mentioned, and build the smallest possible AI-assisted version of it."
    ]
  },
  {
    min: 61, max: 100,
    band: "AI Workflow ready",
    bandClass: "band-high",
    title: "You're ready to validate a real AI workflow.",
    starter: "Inquiry classify → AI draft reply → Human confirm → Send / act → Status log",
    body: [
      "Your team is showing clear signals that a small AI pilot is worth running.",
      "The advice: don't chase full automation right away. Use the safer pattern — AI drafts the reply or suggestion, a person reviews and confirms before anything goes out, and every action is logged for the next time."
    ]
  }
];

// ---------- STATE ----------
const state = {
  page: 1,
  industry: "",
  teamSize: "",
  businessArea: "",
  answers: Array(QUESTIONS.length).fill(null),
  openAnswer: "",
  name: "",
  email: "",
  role: "",
  company: "",
  contactPreference: ""
};

const STORAGE_KEY = "ai-self-check-v1";

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { }
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    Object.assign(state, data);
    return true;
  } catch (e) { return false; }
}

// ---------- RENDER ----------
function renderQuestions() {
  const root = document.getElementById('questionList');
  root.innerHTML = QUESTIONS.map((q, i) => `
    <div class="card" data-q="${i}">
      <div class="q-num">${String(i + 1).padStart(2, '0')}</div>
      <h3 class="q-title">${q.q}</h3>
      ${q.help ? `<p class="q-help">${q.help}</p>` : ''}
      <div class="options">
        ${q.opts.map((o, oi) => `
          <label class="opt" data-score="${o.score}" data-opt="${oi}" for="q${i}-${oi}">
            <input type="radio" id="q${i}-${oi}" name="q${i}" value="${oi}" />
            <span class="radio"></span>
            <span class="label">${o.label}<span class="score">${o.score} pts</span></span>
          </label>
        `).join('')}
      </div>
      <div class="err-msg" style="margin-top:10px;">Please pick one option for this question.</div>
    </div>
  `).join('');

  root.querySelectorAll('[data-q]').forEach(card => {
    const qi = +card.dataset.q;
    card.querySelectorAll('.opt').forEach(opt => {
      opt.addEventListener('click', () => {
        card.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.answers[qi] = +opt.dataset.score;
        card.classList.remove('has-error');
        updateAnsweredCount();
        save();
      });
    });
    if (state.answers[qi] !== null) {
      const target = [...card.querySelectorAll('.opt')]
        .find(o => +o.dataset.score === state.answers[qi]);
      if (target) target.classList.add('selected');
    }
  });
}

function updateAnsweredCount() {
  const n = state.answers.filter(v => v !== null).length;
  const el = document.getElementById('answeredCount');
  if (el) el.textContent = n;
}

function initChips() {
  document.querySelectorAll('[data-input="chips"]').forEach(group => {
    const key = group.id;
    group.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        state[key] = c.dataset.value;
        group.closest('.field')?.classList.remove('has-error');
        save();
      });
      if (state[key] === c.dataset.value) c.classList.add('selected');
    });
  });
}

function bindBasicFields() {
  const industry = document.getElementById('industry');
  industry.value = state.industry || "";
  industry.addEventListener('change', () => {
    state.industry = industry.value;
    industry.closest('.field')?.classList.remove('has-error');
    save();
  });

  const fields = ['openAnswer', 'name', 'email', 'role', 'company'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id] || "";
    el.addEventListener('input', () => {
      state[id] = el.value;
      el.closest('.field')?.classList.remove('has-error');
      save();
    });
  });
}

// ---------- NAVIGATION ----------
function goTo(n) {
  if (n < 1 || n > 5) return;
  state.page = n;
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', +p.dataset.page === n));
  const labels = { 1: 'Intro', 2: 'About you', 3: 'Questions', 4: 'Open & contact', 5: 'Result' };
  const stepNow = document.getElementById('stepNow')
  if (stepNow) {
    stepNow.textContent = n;
  }

  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    progressFill.style.width = ((n - 1) / 4 * 100) + '%';
    progressPill.innerHTML = `<b>${labels[n]}</b> · ${n}/5`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  save();
}

function validate(page) {
  let ok = true;
  const mark = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.classList.add('has-error');
    ok = false;
  };

  if (page === 2) {
    if (!state.industry) mark('[data-field="industry"]');
    if (!state.teamSize) mark('[data-field="teamSize"]');
    if (!state.businessArea) mark('[data-field="businessArea"]');
  }
  if (page === 3) {
    state.answers.forEach((v, i) => {
      if (v === null) {
        const c = document.querySelector(`[data-q="${i}"]`);
        if (c) c.classList.add('has-error');
        ok = false;
      }
    });
    if (!ok) {
      const first = document.querySelector('[data-q].has-error');
      if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  if (page === 4) {
    const email = state.email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) mark('[data-field="email"]');
  }
  return ok;
}

function score() {
  return state.answers.reduce((sum, v) => sum + (v || 0), 0);
}
function resultFor(s) {
  return RESULTS.find(r => s >= r.min && s <= r.max) || RESULTS[0];
}

function renderResult() {
  const s = score();
  const r = resultFor(s);
  const scoreNum = document.getElementById('scoreNum');
  if (scoreNum) scoreNum.textContent = s;

  const resultTitle = document.getElementById('resultTitle');
  if (resultTitle) resultTitle.textContent = r.title;
  const resultBody = document.getElementById('resultBody');
  if (resultBody) resultBody.innerHTML = r.body.map(p => `<p>${p}</p>`).join('');
  const starterFlow = document.getElementById('starterFlow');
  if (starterFlow) starterFlow.textContent = r.starter;
  const band = document.getElementById('scoreBand');
  if (band) {
    band.classList.remove('band-low', 'band-mid', 'band-high');
    band.classList.add(r.bandClass);
  }
  const scoreBandText = document.getElementById('scoreBandText');
  if (scoreBandText) scoreBandText.textContent = r.band;

  const rows = [
    ['Industry', state.industry],
    ['Team size', state.teamSize],
    ['Focus area', state.businessArea],
    ['Total score', `${s} / 100`],
    ['Result', r.title]
  ];
  const open = state.openAnswer.trim();
  const grid = document.getElementById('summaryGrid');
  grid.innerHTML = rows.map(([k, v]) => `
    <div class="summary-row"><div class="k">${k}</div><div class="v">${escapeHtml(v)}</div></div>
  `).join('') + `
    <div class="summary-row open"><div class="k">In your words</div><div class="v">${escapeHtml(open)}</div></div>
    <div class="summary-row"><div class="k">Follow-up</div><div class="v">${escapeHtml(state.contactPreference)}</div></div>
  `;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function buildCopyText() {
  const s = score();
  const r = resultFor(s);
  const lines = [
    "My AI Readiness Self-Check result:",
    "",
    "Industry / line of business:",
    state.industry,
    "",
    "Team size:",
    state.teamSize,
    "",
    "Area I most want to improve:",
    state.businessArea,
    "",
    "Total score:",
    `${s}/100`,
    "",
    "Result:",
    r.title,
    "",
    "The workflow I most want to improve:",
    state.openAnswer.trim()
  ];
  if (state.name.trim() || state.role.trim() || state.company.trim()) {
    lines.push("");
    if (state.name.trim()) lines.push("Name:", state.name.trim());
    if (state.role.trim()) lines.push("Role:", state.role.trim());
    if (state.company.trim()) lines.push("Company:", state.company.trim());
  }
  if (state.contactPreference) {
    lines.push("", "Follow-up preference:", state.contactPreference);
  }
  return lines.join("\n");
}

// ---------- TOAST ----------
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------- PAYLOAD ----------
function buildPayload() {
  const answerLabel = (qi) => {
    const score = state.answers[qi];
    if (score === null) return undefined;
    return QUESTIONS[qi].opts.find(o => o.score === score)?.label;
  };

  const obj = {};
  if (state.industry) obj.field_1 = [state.industry];
  const q = answerLabel;
  if (q(0) != null) obj.field_2 = q(0);
  if (q(1) != null) obj.field_3 = q(1);
  if (q(2) != null) obj.field_4 = q(2);
  if (q(3) != null) obj.field_5 = q(3);
  if (q(4) != null) obj.field_6 = q(4);
  if (q(5) != null) obj.field_7 = q(5);
  if (q(6) != null) obj.field_8 = q(6);
  // field_9 omitted — schema entry appears to be a duplicate with incorrect enum
  if (q(7) != null) obj.field_10 = q(7);
  if (q(8) != null) obj.field_11 = q(8);
  if (q(9) != null) obj.field_12 = q(9);
  if (state.openAnswer) obj.field_13 = state.openAnswer;
  if (state.name) obj.field_14 = state.name;
  if (state.email) obj.field_15 = state.email;
  if (state.role) obj.field_16 = state.role;
  if (state.company) obj.field_17 = state.company;
  if (state.contactPreference) obj.field_18 = state.contactPreference;
  return obj;
}

const API_ENDPOINT = 'https://gforms.lychee.technology/api/v1/forms/1FAIpQLSdT6je0hJmpQLbEKUa4Bm4-skYEg64DNmGhJtLpDE2wjAxGKQ/responses';

async function submitPayload(payload) {
  await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ---------- WIRE UP ----------
document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (go) {
    const target = +go.dataset.go;
    const fromValidate = go.dataset.validate ? +go.dataset.validate : null;
    if (fromValidate) {
      if (!validate(fromValidate)) return;
    }
    if (target === 5) renderResult();
    goTo(target);
  }
});

document.getElementById('submitBtn').addEventListener('click', async () => {
  if (!validate(4)) return;
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  state.payload = buildPayload();
  try {
    await submitPayload(state.payload);
  } catch (_) {
    // proceed to result even if submission fails
  } finally {
    btn.disabled = false;
  }
  renderResult();
  goTo(5);
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const text = buildCopyText();
  try {
    await navigator.clipboard.writeText(text);
    toast("Result copied to clipboard");
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast("Result copied"); }
    catch (_) { toast("Couldn't copy — please select & copy manually"); }
    document.body.removeChild(ta);
  }
});

document.getElementById('restartBtn').addEventListener('click', () => {
  if (!confirm("Start the self-check over? Your current answers will be cleared.")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

// ---------- INIT ----------
(function init() {
  const hadState = load();
  renderQuestions();
  initChips();
  bindBasicFields();
  updateAnsweredCount();

  if (hadState && state.page > 1) {
    const btn = document.getElementById('resumeBtn');
    btn.style.display = '';
    btn.textContent = `Resume — Section ${Math.min(state.page - 1, 4)}`;
    btn.addEventListener('click', () => goTo(state.page));
  }
  goTo(1);
})();
