
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, update, get } from "firebase/database";

// ══════════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIG
// ══════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyDQ4tc7qJVQ9KeDUZbySNewA7Z1NQeSHjU",
  authDomain: "khouazem-cabinet.firebaseapp.com",
  databaseURL: "https://khouazem-cabinet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "khouazem-cabinet",
  storageBucket: "khouazem-cabinet.firebasestorage.app",
  messagingSenderId: "3394881486",
  appId: "1:3394881486:web:333ce51e5460164f7acd9f"
};

// ══════════════════════════════════════════════════════════
//  🔑 PASSWORDS
// ══════════════════════════════════════════════════════════
const PASSWORDS = {
  doctor: "Khouazem2026",
  nurse:  "Nurse2026",
};

// ══════════════════════════════════════════════════════════
//  🌍 TRANSLATIONS — AR + EN only
// ══════════════════════════════════════════════════════════
const T = {
  en: {
    dir: "ltr",
    appName: "Dr. Khouazem Cabinet",
    appSub: "Dermatology · Boumerdès",
    login: "Secure Access",
    doctor: "Doctor",
    nurse: "Nurse",
    password: "Password",
    connect: "Login →",
    wrongPwd: "Incorrect password. Please try again.",
    accessDoctor: "Full access · Doctor",
    accessNurse: "Queue access · Nurse",
    logout: "⏻",
    waiting: "Waiting",
    inProgress: "In progress",
    done: "Done",
    newPatient: "New Patient",
    patientName: "Patient name",
    namePlaceholder: "e.g. Mr. Amrani",
    generateTicket: "+ Generate Ticket",
    ticketGenerated: "Ticket Generated",
    callNext: "📣 Call Next Patient",
    inQueue: "In queue",
    inConsultation: "🔔 In consultation",
    finished: "✓ Finished",
    cancelled: "— Cancelled",
    position: "Position",
    whatsapp: "📱 WhatsApp",
    copy: "📋 Copy",
    copied: "✓ Copied!",
    todayQueue: "Today's Queue",
    tickets: "tickets",
    noPatients: "No patients yet",
    addFirst: "Add a patient to start",
    // Patient view
    yourTurn: "Your Turn Number",
    enterCode: "Enter the code received via WhatsApp to track your position.",
    seeMyTurn: "See My Turn →",
    codeNotFound: "Code not found. Please check your number.",
    youAreWaiting: "You are waiting",
    stayNearby: "Please stay nearby. You will be called when it is your turn.",
    youAreInQueue: "You are",
    inQueueSuffix: "in the queue",
    itsYourTurn: "It's Your Turn!",
    pleaseGoToReception: "Please go to the reception desk now.",
    goToReception: "🔔 Go to Reception Now",
    consultationDone: "Consultation Finished",
    thankYou: "Thank you for your visit. Have a great day!",
    autoUpdate: "Auto-updating in real time",
    enterAnotherCode: "← Enter another code",
    liveNow: "Live",
  },
  ar: {
    dir: "rtl",
    appName: "عيادة د. خوازم",
    appSub: "طب الجلدية · بومرداس",
    login: "دخول آمن",
    doctor: "الطبيب",
    nurse: "الممرضة",
    password: "كلمة المرور",
    connect: "دخول ←",
    wrongPwd: "كلمة المرور غير صحيحة. حاول مرة أخرى.",
    accessDoctor: "وصول كامل · طبيب",
    accessNurse: "وصول قائمة الانتظار · ممرضة",
    logout: "⏻",
    waiting: "انتظار",
    inProgress: "قيد الفحص",
    done: "منتهي",
    newPatient: "مريض جديد",
    patientName: "اسم المريض",
    namePlaceholder: "مثال: السيد عمراني",
    generateTicket: "+ إنشاء تذكرة",
    ticketGenerated: "تم إنشاء التذكرة",
    callNext: "📣 استدعاء المريض التالي",
    inQueue: "في الانتظار",
    inConsultation: "🔔 في الفحص",
    finished: "✓ انتهى",
    cancelled: "— ملغى",
    position: "الترتيب",
    whatsapp: "📱 واتساب",
    copy: "📋 نسخ",
    copied: "✓ تم النسخ!",
    todayQueue: "قائمة اليوم",
    tickets: "تذاكر",
    noPatients: "لا يوجد مرضى بعد",
    addFirst: "أضف مريضاً للبدء",
    // Patient view
    yourTurn: "رقم دورك",
    enterCode: "أدخل الرمز الذي استلمته عبر واتساب لمتابعة مكانك في الطابور.",
    seeMyTurn: "عرض دوري ←",
    codeNotFound: "الرمز غير موجود. تحقق من رقمك.",
    youAreWaiting: "أنت في قائمة الانتظار",
    stayNearby: "ابقَ قريباً. سيتم استدعاؤك عندما يحين دورك.",
    youAreInQueue: "أنت",
    inQueueSuffix: "في قائمة الانتظار",
    itsYourTurn: "حان دورك!",
    pleaseGoToReception: "يرجى التوجه إلى الاستقبال الآن.",
    goToReception: "🔔 توجه إلى الاستقبال الآن",
    consultationDone: "انتهت الاستشارة",
    thankYou: "شكراً لزيارتك. نتمنى لك يوماً طيباً!",
    autoUpdate: "تحديث تلقائي في الوقت الفعلي",
    enterAnotherCode: "← إدخال رمز آخر",
    liveNow: "مباشر",
  }
};

// ══════════════════════════════════════════════════════════
//  FIREBASE INIT
// ══════════════════════════════════════════════════════════
let db = null;
let firebaseOK = false;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  firebaseOK = true;
} catch (e) {
  firebaseOK = false;
}

const todayKey = () => new Date().toISOString().slice(0, 10).replace(/-/g, "");
const timeStr  = () => new Date().toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });

// ══════════════════════════════════════════════════════════
//  LOCAL STORE (fallback)
// ══════════════════════════════════════════════════════════
const LOCAL = {
  queue: [], counter: 0, listeners: [],
  notify() { this.listeners.forEach(fn => fn([...this.queue])); },
  subscribe(fn) {
    this.listeners.push(fn);
    fn([...this.queue]);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }
};

async function apiAdd(name) {
  if (!firebaseOK) {
    LOCAL.counter++;
    const code = String(LOCAL.counter).padStart(3, "0");
    const t = { id: Date.now().toString(), code, name, status: "waiting", time: timeStr() };
    LOCAL.queue.push(t);
    LOCAL.notify();
    return t;
  }
  const cRef = ref(db, `days/${todayKey()}/counter`);
  const snap = await get(cRef);
  const n = (snap.val() || 0) + 1;
  await set(cRef, n);
  const code = String(n).padStart(3, "0");
  const tRef = push(ref(db, `days/${todayKey()}/queue`));
  const t = { id: tRef.key, code, name, status: "waiting", time: timeStr() };
  await set(tRef, t);
  return t;
}

async function apiUpdate(id, data) {
  if (!firebaseOK) {
    const t = LOCAL.queue.find(t => t.id === id.toString());
    if (t) { Object.assign(t, data); LOCAL.notify(); }
    return;
  }
  await update(ref(db, `days/${todayKey()}/queue/${id}`), data);
}

async function apiCallNext(queue) {
  const cur = queue.find(t => t.status === "called");
  if (cur) await apiUpdate(cur.id, { status: "done" });
  const next = queue.find(t => t.status === "waiting");
  if (next) await apiUpdate(next.id, { status: "called" });
}

function subscribeQueue(cb) {
  if (!firebaseOK) return LOCAL.subscribe(cb);
  const qRef = ref(db, `days/${todayKey()}/queue`);
  onValue(qRef, snap => {
    const data = snap.val();
    const q = data
      ? Object.entries(data).map(([id, v]) => ({ ...v, id })).sort((a, b) => a.code.localeCompare(b.code))
      : [];
    cb(q);
  });
  return () => {};
}

// ══════════════════════════════════════════════════════════
//  STYLES
// ══════════════════════════════════════════════════════════
const S = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Cormorant+Garamond:wght@500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --teal:#2d7d7d;--teal-l:#e0f0f0;--teal-d:#1a5c5c;
  --cream:#f8f6f1;--sand:#e6e0d6;--txt:#1e1e1e;--soft:#777;--w:#fff;
  --amber:#d4832a;--amb-bg:#fef3e2;--green:#2e8b57;--gr-bg:#e8f5ee;
  --red:#c0392b;--red-bg:#fdecea;--ease:cubic-bezier(.16,1,.3,1);
}
html,body{height:100%;background:var(--cream);color:var(--txt);-webkit-font-smoothing:antialiased}
body.ar{font-family:'Tajawal',sans-serif}
body.en{font-family:'Tajawal',sans-serif}

/* LANG BAR */
.lang-bar{position:fixed;top:0;left:0;right:0;z-index:999;background:var(--teal-d);padding:6px 16px;display:flex;justify-content:flex-end;gap:6px}
.lang-btn{padding:4px 14px;border-radius:100px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:rgba(255,255,255,.7);font-size:.75rem;font-weight:700;cursor:pointer;transition:all .2s}
.lang-btn.active{background:white;color:var(--teal-d);border-color:white}
.lang-btn:hover:not(.active){background:rgba(255,255,255,.1);color:white}

/* LOGIN */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--teal-d),var(--teal));padding:24px;padding-top:52px}
.login-box{background:white;border-radius:20px;padding:40px 32px;width:100%;max-width:360px;box-shadow:0 40px 80px rgba(0,0,0,.25);animation:fadeUp .4s var(--ease) both}
.login-logo{text-align:center;margin-bottom:28px}
.login-icon{font-size:40px;margin-bottom:8px}
.login-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--teal-d)}
.login-sub{font-size:11px;color:var(--soft);letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
.role-tabs{display:flex;gap:6px;background:var(--cream);padding:4px;border-radius:10px;margin-bottom:20px;border:1px solid var(--sand)}
.role-tab{flex:1;padding:8px;border:none;background:transparent;border-radius:7px;font-family:'Tajawal',sans-serif;font-size:13px;font-weight:600;cursor:pointer;color:var(--soft);transition:all .2s}
.role-tab.active{background:white;color:var(--teal-d);box-shadow:0 1px 4px rgba(0,0,0,.1)}
.lfield{margin-bottom:14px}
.lfield label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);margin-bottom:6px}
.lfield input{width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid var(--sand);background:var(--cream);font-family:'Tajawal',sans-serif;font-size:15px;color:var(--txt);outline:none;transition:border-color .2s}
.lfield input:focus{border-color:var(--teal);background:white}
.login-btn{width:100%;padding:13px;border-radius:100px;border:none;background:var(--teal);color:white;font-family:'Tajawal',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-top:4px}
.login-btn:hover{background:var(--teal-d);transform:translateY(-1px)}
.login-error{color:var(--red);font-size:12px;text-align:center;margin-top:10px;background:var(--red-bg);padding:8px;border-radius:8px}
.login-hint{font-size:11px;color:var(--soft);text-align:center;margin-top:14px}

/* SHELL */
.shell{min-height:100vh;display:flex;flex-direction:column;max-width:480px;margin:0 auto;background:var(--cream)}
.shell.rtl{direction:rtl}

/* TOPBAR */
.topbar{background:linear-gradient(135deg,var(--teal-d),var(--teal));color:white;padding:18px 20px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:38px;z-index:20;box-shadow:0 2px 20px rgba(0,0,0,.2)}
.topbar-left{display:flex;align-items:center;gap:12px}
.topbar-icon{width:38px;height:38px;background:rgba(255,255,255,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px}
.topbar-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;line-height:1}
.topbar-sub{font-size:10px;opacity:.65;margin-top:1px}
.topbar-right{display:flex;align-items:center;gap:8px}
.topbar-pill{background:rgba(255,255,255,.15);border-radius:100px;padding:5px 12px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:6px}
.live-dot{width:7px;height:7px;border-radius:50%;background:#4dff91;animation:blink 1.5s infinite}
.logout-btn{background:rgba(255,255,255,.15);border:none;color:white;border-radius:8px;padding:6px 10px;font-size:14px;cursor:pointer}

/* CALLED BANNER */
.called-banner{background:var(--amb-bg);border-bottom:2.5px solid var(--amber);padding:13px 16px;display:flex;align-items:center;gap:12px}
.cb-icon{font-size:20px}
.cb-info{flex:1}
.cb-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);font-weight:700}
.cb-patient{font-size:15px;font-weight:700}
.cb-btn{background:var(--amber);color:white;border:none;padding:9px 16px;border-radius:10px;font-family:'Tajawal',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}

/* STATS */
.stats{display:flex;background:white;border-bottom:1px solid var(--sand)}
.stat{flex:1;padding:14px 8px;text-align:center;border-right:1px solid var(--sand)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;line-height:1}
.stat-l{font-size:10px;color:var(--soft);margin-top:2px;text-transform:uppercase;letter-spacing:.06em}
.s-w .stat-n{color:var(--teal)}.s-c .stat-n{color:var(--amber)}.s-d .stat-n{color:var(--green)}

/* BODY */
.nurse-body{flex:1;overflow-y:auto;padding-bottom:140px}
.sec-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--soft);padding:14px 16px 6px}

/* ADD */
.add-panel{background:white;border-bottom:1px solid var(--sand);padding:14px 16px}
.add-row{display:flex;gap:8px}
.add-input{flex:1;padding:13px 14px;border-radius:12px;border:1.5px solid var(--sand);background:var(--cream);font-family:'Tajawal',sans-serif;font-size:15px;color:var(--txt);outline:none;transition:border-color .2s}
.add-input:focus{border-color:var(--teal);background:white}
.add-btn{background:var(--teal);color:white;border:none;padding:13px 18px;border-radius:12px;font-family:'Tajawal',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap}

/* TICKET */
.ticket-result{margin-top:16px;background:var(--teal-l);border:1.5px dashed var(--teal);border-radius:12px;padding:18px;text-align:center;animation:fadeUp .3s var(--ease)}
.t-hint{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--teal-d);font-weight:700}
.t-num{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:700;color:var(--teal-d);line-height:1}
.t-name{font-weight:600;font-size:13px;margin-top:4px}
.t-share{display:flex;gap:8px;margin-top:14px}
.t-share button{flex:1;padding:10px;border-radius:10px;border:none;font-family:'Tajawal',sans-serif;font-size:12px;font-weight:700;cursor:pointer}
.t-wa{background:#25D366;color:white}
.t-copy{background:var(--cream);color:var(--teal-d);border:1.5px solid var(--sand)!important}

/* QUEUE */
.q-item{background:white;margin:0 12px 8px;border-radius:14px;border:1.5px solid var(--sand);display:flex;align-items:center;gap:12px;padding:13px 14px;transition:all .2s}
.q-item.s-called{background:var(--amb-bg);border-color:var(--amber);animation:glow 2s ease-in-out infinite}
.q-item.s-done,.q-item.s-skipped{opacity:.35}
.q-num{width:44px;height:44px;border-radius:12px;background:var(--teal-l);color:var(--teal-d);font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.q-item.s-called .q-num{background:var(--amber);color:white}
.q-info{flex:1;min-width:0}
.q-name{font-size:14px;font-weight:600}
.q-meta{font-size:12px;color:var(--soft);margin-top:1px}
.q-meta.mc{color:var(--amber);font-weight:600}
.q-actions{display:flex;gap:6px;flex-shrink:0}
.q-btn{width:36px;height:36px;border-radius:10px;border:none;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.q-btn-done{background:var(--amber);color:white}
.q-btn-skip{background:var(--red-bg);color:var(--red)}
.q-empty{text-align:center;padding:48px 24px;color:var(--soft)}
.q-empty-icon{font-size:40px;margin-bottom:10px}

/* BOTTOM */
.bottom-action{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:white;border-top:1px solid var(--sand);padding:14px 16px 28px;z-index:30}
.call-btn{width:100%;padding:17px;border-radius:16px;border:none;background:var(--amber);color:white;font-family:'Tajawal',sans-serif;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 4px 20px rgba(212,131,42,.35)}
.call-btn:disabled{background:var(--sand);color:var(--soft);box-shadow:none;cursor:not-allowed}

/* PATIENT VIEW */
.pt-shell{min-height:100vh;display:flex;flex-direction:column;max-width:480px;margin:0 auto;background:var(--cream)}
.pt-shell.rtl{direction:rtl}
.pt-header{background:linear-gradient(135deg,var(--teal-d),var(--teal));padding:48px 24px 28px;color:white;text-align:center}
.pt-header-logo{font-size:32px;margin-bottom:8px}
.pt-header-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600}
.pt-header-sub{font-size:13px;opacity:.7;margin-top:3px}
.pt-entry{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px}
.pt-card{background:white;border-radius:20px;padding:32px 24px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.1);text-align:center}
.pt-card-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--teal-d);margin-bottom:6px}
.pt-card-sub{font-size:14px;color:var(--soft);margin-bottom:24px;line-height:1.6}
.pt-code-input{width:100%;padding:16px;font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;text-align:center;letter-spacing:.15em;border:2px solid var(--sand);border-radius:14px;background:var(--cream);color:var(--teal-d);outline:none;transition:border-color .2s;margin-bottom:14px}
.pt-code-input:focus{border-color:var(--teal);background:white}
.pt-error{color:var(--red);font-size:13px;margin-bottom:12px;background:var(--red-bg);padding:8px 14px;border-radius:8px}
.pt-confirm-btn{width:100%;padding:15px;border-radius:14px;border:none;background:var(--teal);color:white;font-family:'Tajawal',sans-serif;font-size:15px;font-weight:600;cursor:pointer}
.pt-status{flex:1;display:flex;flex-direction:column;align-items:center;padding:36px 24px 48px}
.pt-ring{width:200px;height:200px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:28px}
.pt-ring.r-waiting{background:var(--teal-l);border:4px solid var(--teal)}
.pt-ring.r-called{background:var(--amb-bg);border:4px solid var(--amber);animation:ringPulse 1.4s ease-in-out infinite}
.pt-ring.r-done{background:var(--gr-bg);border:4px solid var(--green)}
.pt-ring-num{font-family:'Cormorant Garamond',serif;font-size:68px;font-weight:700;line-height:1}
.r-waiting .pt-ring-num{color:var(--teal-d)}.r-called .pt-ring-num{color:var(--amber)}.r-done .pt-ring-num{font-size:48px}
.pt-ring-sub{font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-top:4px;font-weight:600}
.r-waiting .pt-ring-sub{color:var(--teal-d)}.r-called .pt-ring-sub{color:var(--amber)}.r-done .pt-ring-sub{color:var(--green)}
.pt-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;margin-bottom:8px;text-align:center}
.pt-desc{font-size:15px;color:var(--soft);text-align:center;max-width:280px;line-height:1.6;margin-bottom:20px}
.pt-pos{background:white;border:1px solid var(--sand);border-radius:100px;padding:10px 24px;display:flex;align-items:center;gap:10px;font-size:14px;color:var(--soft);margin-bottom:14px}
.pt-pos-n{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--teal-d)}
.pt-alert{background:var(--amb-bg);border:2px solid var(--amber);border-radius:14px;padding:16px 20px;font-size:16px;text-align:center;margin-bottom:14px;font-weight:600;color:var(--amber)}
.pt-live{font-size:12px;color:var(--soft);display:flex;align-items:center;gap:6px;margin-top:8px}
.pt-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink 1.5s infinite}
.pt-back{margin-top:24px;font-size:13px;color:var(--soft);background:none;border:none;cursor:pointer;text-decoration:underline;font-family:'Tajawal',sans-serif}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(212,131,42,.2)}50%{box-shadow:0 0 0 8px rgba(212,131,42,0)}}
@keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,131,42,.4)}50%{box-shadow:0 0 0 20px rgba(212,131,42,0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
`;

// ══════════════════════════════════════════════════════════
//  HOOK
// ══════════════════════════════════════════════════════════
function useQueue() {
  const [queue, setQueue] = useState([]);
  useEffect(() => {
    const unsub = subscribeQueue(setQueue);
    return unsub;
  }, []);
  return queue;
}

// ══════════════════════════════════════════════════════════
//  LANG BAR
// ══════════════════════════════════════════════════════════
function LangBar({ lang, setLang }) {
  return (
    <div className="lang-bar">
      <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
      <button className={`lang-btn ${lang === "ar" ? "active" : ""}`} onClick={() => setLang("ar")}>عربي</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════════════
function LoginScreen({ onLogin, lang, setLang }) {
  const t = T[lang];
  const [role, setRole]     = useState("nurse");
  const [pwd, setPwd]       = useState("");
  const [error, setError]   = useState("");

  const handle = () => {
    if (pwd === PASSWORDS[role]) {
      onLogin(role);
    } else {
      setError(t.wrongPwd);
      setPwd("");
    }
  };

  return (
    <>
      <style>{S}</style>
      <LangBar lang={lang} setLang={setLang} />
      <div className="login-wrap" dir={t.dir}>
        <div className="login-box">
          <div className="login-logo">
            <div className="login-icon">🏥</div>
            <div className="login-name">{t.appName}</div>
            <div className="login-sub">{t.appSub}</div>
          </div>
          <div className="role-tabs">
            <button className={`role-tab ${role === "doctor" ? "active" : ""}`} onClick={() => { setRole("doctor"); setError(""); setPwd(""); }}>
              👨‍⚕️ {t.doctor}
            </button>
            <button className={`role-tab ${role === "nurse" ? "active" : ""}`} onClick={() => { setRole("nurse"); setError(""); setPwd(""); }}>
              👩‍⚕️ {t.nurse}
            </button>
          </div>
          <div className="lfield">
            <label>{t.password}</label>
            <input type="password" placeholder="••••••••••••" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} autoFocus />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" onClick={handle}>{t.connect}</button>
          <div className="login-hint">{role === "doctor" ? t.accessDoctor : t.accessNurse}</div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
//  NURSE / DOCTOR DASHBOARD
// ══════════════════════════════════════════════════════════
function NurseView({ role, onLogout, lang, setLang }) {
  const t = T[lang];
  const queue   = useQueue();
  const [name, setName]       = useState("");
  const [last, setLast]       = useState(null);
  const [copied, setCopied]   = useState(false);

  const waiting = queue.filter(q => q.status === "waiting");
  const called  = queue.find(q => q.status === "called");
  const done    = queue.filter(q => q.status === "done" || q.status === "skipped");
  const display = [called, ...waiting, ...done].filter(Boolean);

  const handleAdd = async () => {
    if (!name.trim()) return;
    const ticket = await apiAdd(name.trim());
    setLast(ticket);
    setName("");
  };

  // ⚠️ Patient link — ONLY patient view, no access to dashboard
  const patientLink = (code) => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?ticket=${code}&lang=${lang}`;
  };

  const shareWA = (tk) => {
    const msg = lang === "ar"
      ? `السلام عليكم ${tk.name} 👋\n\nرقم دورك في عيادة *د. خوازم*:\n\n🎫 رقمك: *${tk.code}*\n\n📱 تابع دورك من هنا:\n${patientLink(tk.code)}\n\nشكراً 🙏`
      : `Hello ${tk.name} 👋\n\nYour queue number at *Dr. Khouazem Cabinet*:\n\n🎫 Your number: *${tk.code}*\n\n📱 Track your turn here:\n${patientLink(tk.code)}\n\nThank you 🙏`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const copyLink = (tk) => {
    navigator.clipboard.writeText(patientLink(tk.code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pos = {};
  waiting.forEach((q, i) => pos[q.id] = i + 1);

  return (
    <>
      <style>{S}</style>
      <LangBar lang={lang} setLang={setLang} />
      <div className={`shell ${t.dir === "rtl" ? "rtl" : ""}`} dir={t.dir}>
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-icon">🏥</div>
            <div>
              <div className="topbar-title">{t.appName}</div>
              <div className="topbar-sub">{role === "doctor" ? t.doctor : t.nurse}</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-pill">
              <span className="live-dot"/>
              {waiting.length} {t.waiting}
            </div>
            <button className="logout-btn" onClick={onLogout}>{t.logout}</button>
          </div>
        </div>

        {called && (
          <div className="called-banner">
            <span className="cb-icon">🔔</span>
            <div className="cb-info">
              <div className="cb-label">{t.inProgress}</div>
              <div className="cb-patient">N° {called.code} — {called.name}</div>
            </div>
            <button className="cb-btn" onClick={() => apiUpdate(called.id, { status: "done" })}>✓ {t.done}</button>
          </div>
        )}

        <div className="stats">
          <div className="stat s-w"><div className="stat-n">{waiting.length}</div><div className="stat-l">{t.waiting}</div></div>
          <div className="stat s-c"><div className="stat-n">{called ? 1 : 0}</div><div className="stat-l">{t.inProgress}</div></div>
          <div className="stat s-d"><div className="stat-n">{done.length}</div><div className="stat-l">{t.done}</div></div>
        </div>

        <div className="nurse-body">
          <div className="sec-label">{t.newPatient}</div>
          <div className="add-panel">
            <div className="add-row">
              <input className="add-input" type="text" placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
              <button className="add-btn" onClick={handleAdd}>{t.generateTicket}</button>
            </div>
            {last && (
              <div className="ticket-result">
                <div className="t-hint">{t.ticketGenerated}</div>
                <div className="t-num">{last.code}</div>
                <div className="t-name">{last.name}</div>
                <div className="t-share">
                  <button className="t-wa" onClick={() => shareWA(last)}>{t.whatsapp}</button>
                  <button className="t-copy" onClick={() => copyLink(last)}>{copied ? t.copied : t.copy}</button>
                </div>
              </div>
            )}
          </div>

          <div className="sec-label">{t.todayQueue} · {display.length} {t.tickets}</div>
          {display.length === 0 ? (
            <div className="q-empty">
              <div className="q-empty-icon">⏳</div>
              <div>{t.noPatients}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{t.addFirst}</div>
            </div>
          ) : display.map(q => (
            <div key={q.id} className={`q-item s-${q.status}`}>
              <div className="q-num">{q.code}</div>
              <div className="q-info">
                <div className="q-name">{q.name}</div>
                <div className={`q-meta ${q.status === "called" ? "mc" : ""}`}>
                  {q.status === "waiting"  && `⏳ ${t.position} ${pos[q.id]}`}
                  {q.status === "called"   && t.inConsultation}
                  {q.status === "done"     && t.finished}
                  {q.status === "skipped"  && t.cancelled}
                </div>
              </div>
              <div className="q-actions">
                {q.status === "called" && <button className="q-btn q-btn-done" onClick={() => apiUpdate(q.id, { status: "done" })}>✓</button>}
                {q.status === "waiting" && <button className="q-btn q-btn-skip" onClick={() => apiUpdate(q.id, { status: "skipped" })}>✕</button>}
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-action">
          <button className="call-btn" onClick={() => apiCallNext(queue)} disabled={waiting.length === 0}>
            {t.callNext} {waiting.length > 0 && `(${waiting.length})`}
          </button>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
//  PATIENT VIEW — NO ACCESS TO DASHBOARD
// ══════════════════════════════════════════════════════════
function PatientView({ initialCode, lang, setLang }) {
  const t = T[lang];
  const queue = useQueue();
  const [input, setInput] = useState(initialCode || "");
  const [code, setCode]   = useState(initialCode || "");
  const [info, setInfo]   = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    const padded = code.padStart(3, "0");
    const tk = queue.find(q => q.code === padded);
    if (tk) {
      const pos = queue.filter(x => x.status === "waiting").findIndex(x => x.code === padded);
      setInfo({ ...tk, position: pos + 1 });
      setError("");
    } else if (queue.length > 0) {
      setError(t.codeNotFound);
    }
  }, [queue, code, t]);

  const confirm = () => {
    const padded = input.trim().padStart(3, "0");
    const tk = queue.find(q => q.code === padded);
    if (!tk) { setError(t.codeNotFound); return; }
    setCode(padded);
  };

  const isTermine = info && (info.status === "done" || info.status === "skipped");
  const ringClass = info ? (isTermine ? "r-done" : `r-${info.status}`) : "";

  return (
    <>
      <style>{S}</style>
      <LangBar lang={lang} setLang={setLang} />
      <div className={`pt-shell ${t.dir === "rtl" ? "rtl" : ""}`} dir={t.dir}>
        <div className="pt-header">
          <div className="pt-header-logo">🏥</div>
          <div className="pt-header-name">{t.appName}</div>
          <div className="pt-header-sub">{t.appSub}</div>
        </div>

        {!info ? (
          <div className="pt-entry">
            <div className="pt-card">
              <div className="pt-card-title">{t.yourTurn}</div>
              <div className="pt-card-sub">{t.enterCode}</div>
              <input className="pt-code-input" type="tel" maxLength={3} placeholder="001" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && confirm()} />
              {error && <div className="pt-error">{error}</div>}
              <button className="pt-confirm-btn" onClick={confirm}>{t.seeMyTurn}</button>
            </div>
          </div>
        ) : (
          <div className="pt-status">
            <div className={`pt-ring ${ringClass}`}>
              {isTermine ? (
                <>
                  <div className="pt-ring-num" style={{ color: "var(--green)" }}>✓</div>
                  <div className="pt-ring-sub" style={{ color: "var(--green)" }}>{t.done}</div>
                </>
              ) : (
                <>
                  <div className="pt-ring-num">{info.code}</div>
                  <div className="pt-ring-sub">{info.status === "waiting" ? t.waiting : t.liveNow}</div>
                </>
              )}
            </div>

            {info.status === "waiting" && (
              <>
                <div className="pt-title">{t.youAreWaiting}</div>
                <div className="pt-desc">{t.stayNearby}</div>
                {info.position > 0 && (
                  <div className="pt-pos">
                    <span>{t.youAreInQueue}</span>
                    <span className="pt-pos-n">{info.position}</span>
                    <span>{t.inQueueSuffix}</span>
                  </div>
                )}
              </>
            )}

            {info.status === "called" && (
              <>
                <div className="pt-title" style={{ color: "var(--amber)" }}>{t.itsYourTurn}</div>
                <div className="pt-desc">{t.pleaseGoToReception}</div>
                <div className="pt-alert">{t.goToReception}</div>
              </>
            )}

            {isTermine && (
              <>
                <div className="pt-title" style={{ color: "var(--green)" }}>{t.consultationDone}</div>
                <div className="pt-desc">{t.thankYou}</div>
              </>
            )}

            <div className="pt-live">
              <div className="pt-dot"/>
              {t.autoUpdate}
            </div>
            <button className="pt-back" onClick={() => { setInfo(null); setCode(""); setInput(""); }}>{t.enterAnotherCode}</button>
          </div>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
//  APP — ROUTING
// ══════════════════════════════════════════════════════════
export default function App() {
  const params      = new URLSearchParams(window.location.search);
  const ticketParam = params.get("ticket");
  const langParam   = params.get("lang") || "ar";

  const [lang, setLang] = useState(langParam);
  const [role, setRole] = useState(null);

  // Update body class for font
  useEffect(() => {
    document.body.className = lang;
  }, [lang]);

  // ✅ If patient link → ONLY show patient view, NO login, NO dashboard access
  if (ticketParam) {
    return <PatientView initialCode={ticketParam} lang={lang} setLang={setLang} />;
  }

  // Not logged in → login screen
  if (!role) {
    return <LoginScreen onLogin={setRole} lang={lang} setLang={setLang} />;
  }

  // Logged in → dashboard
  return <NurseView role={role} onLogout={() => setRole(null)} lang={lang} setLang={setLang} />;
}
