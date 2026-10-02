/**
 * Generates the Yatra Setu hackathon pitch deck (7 slides, 16:9).
 *
 * Run:  bun scripts/generate-pitch.ts
 * Output: public/YatraSetu-Proof-Before-Resolved.pptx
 */
import pptxgen from "pptxgenjs";

type Slide = ReturnType<InstanceType<typeof pptxgen>["addSlide"]>;

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pptx.author = "Team Desi Voyagers";
pptx.company = "Yatra Setu";
pptx.title = "Yatra Setu — Proof Before Resolved";
pptx.subject = "Civic complaint platform · hackathon pitch";

const P = pptx.ShapeType;

/* ── palette ─────────────────────────────────────────────── */
const C = {
  bg: "FFFCFA",
  ink: "241E29",
  muted: "6E6474",
  coral: "E4674F",
  coralDk: "B4503B",
  peach: "FBE6DD",
  peachDk: "F4CBBB",
  teal: "17635B",
  tealSoft: "DEEEE9",
  amber: "B97A12",
  amberSoft: "F8EDD6",
  green: "2E7D4F",
  greenSoft: "E1F1E7",
  border: "EEE2DB",
  white: "FFFFFF",
  neutral: "F1ECE7",
  neutralTx: "4A4550",
};

const FONT = "Segoe UI";
const MONO = "Consolas";

const W = 10;
const H = 5.625;
const M = 0.5;
const CW = W - M * 2; // 9

/* ── helpers ─────────────────────────────────────────────── */
function T(slide: Slide, text: string, opts: Record<string, unknown>) {
  slide.addText(text, { fontFace: FONT, margin: 0, ...opts } as never);
}

function rect(
  slide: Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  opts: Record<string, unknown> = {},
) {
  slide.addShape(P.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.07,
    fill: { color: fill },
    line: { type: "none" },
    ...opts,
  } as never);
}

function card(
  slide: Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  fill = C.white,
) {
  slide.addShape(P.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.07,
    fill: { color: fill },
    line: { color: C.border, width: 1 },
  });
}

function dot(slide: Slide, x: number, y: number, size: number, color: string) {
  slide.addShape(P.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color },
    line: { type: "none" },
  });
}

function bulletList(
  slide: Slide,
  items: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  fontSize: number,
  color = C.ink,
) {
  slide.addText(
    items.map((t) => ({
      text: t,
      options: { bullet: { indent: 14 }, breakLine: true },
    })),
    {
      x,
      y,
      w,
      h,
      fontFace: FONT,
      fontSize,
      color,
      valign: "top",
      margin: 0,
      fit: "shrink",
      lineSpacingMultiple: 1.2,
    } as never,
  );
}

function header(slide: Slide, kicker: string, title: string, page: number) {
  slide.background = { color: C.bg };
  slide.addShape(P.rect, {
    x: 0,
    y: 0,
    w: 0.13,
    h: H,
    fill: { color: C.coral },
    line: { type: "none" },
  });
  T(slide, kicker.toUpperCase(), {
    x: M,
    y: 0.26,
    w: CW,
    h: 0.24,
    fontSize: 9,
    bold: true,
    color: C.coral,
    charSpacing: 2,
  });
  T(slide, title, {
    x: M,
    y: 0.5,
    w: CW,
    h: 0.55,
    fontSize: 24,
    bold: true,
    color: C.ink,
  });
  slide.addShape(P.line, {
    x: M,
    y: 1.12,
    w: CW,
    h: 0,
    line: { color: C.border, width: 1 },
  });
  footer(slide, page);
}

function footer(slide: Slide, page: number) {
  T(slide, "Yatra Setu — Proof Before Resolved · Team Desi Voyagers", {
    x: M,
    y: H - 0.33,
    w: 6,
    h: 0.2,
    fontSize: 7.5,
    color: C.muted,
  });
  T(slide, `${page} / 7`, {
    x: W - M - 1,
    y: H - 0.33,
    w: 1,
    h: 0.2,
    fontSize: 7.5,
    color: C.muted,
    align: "right",
  });
}

/* ══ Slide 1 — Title ═════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  // decor circle
  s.addShape(P.ellipse, {
    x: 7.05,
    y: 0.75,
    w: 3.1,
    h: 3.1,
    fill: { color: C.peach },
    line: { type: "none" },
  });

  // logo lockup
  rect(s, M, 0.45, 0.55, 0.55, C.coral, { rectRadius: 0.12 });
  T(s, "YS", {
    x: M,
    y: 0.45,
    w: 0.55,
    h: 0.55,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "middle",
  });
  T(s, "Yatra Setu", {
    x: 1.2,
    y: 0.47,
    w: 4,
    h: 0.32,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });
  T(s, "Web3 for Transparent & Accountable Cities", {
    x: 1.2,
    y: 0.78,
    w: 5,
    h: 0.24,
    fontSize: 9.5,
    color: C.muted,
  });

  // headline
  s.addText(
    [
      { text: "Proof ", options: { color: C.coral } },
      { text: "Before Resolved", options: { color: C.ink } },
    ],
    {
      x: M,
      y: 1.55,
      w: 6.6,
      h: 1.15,
      fontFace: FONT,
      fontSize: 42,
      bold: true,
      margin: 0,
      fit: "shrink",
    } as never,
  );

  T(
    s,
    "A transparent civic complaint platform that records the complete journey of a complaint — and requires evidence before it can ever be marked resolved.",
    {
      x: M,
      y: 2.8,
      w: 6.3,
      h: 0.95,
      fontSize: 13,
      color: C.muted,
      lineSpacingMultiple: 1.25,
      fit: "shrink",
    },
  );

  // tagline pills
  const pills = ["Report it.", "Track it.", "Verify it."];
  pills.forEach((label, i) => {
    const x = M + i * 1.72;
    rect(s, x, 3.95, 1.55, 0.44, C.peach, { rectRadius: 0.22 });
    T(s, label, {
      x,
      y: 3.95,
      w: 1.55,
      h: 0.44,
      fontSize: 11.5,
      bold: true,
      color: C.coralDk,
      align: "center",
      valign: "middle",
    });
  });

  T(
    s,
    "Team Desi Voyagers   ·   Member 1 Product & Frontend   ·   Member 2 Backend & Database   ·   Member 3 Trust & Integration",
    {
      x: M,
      y: 4.75,
      w: CW,
      h: 0.3,
      fontSize: 9.5,
      color: C.muted,
    },
  );

  // mini timeline cards inside the decor circle
  const mini = [
    ["Reported", "photo + location + ID", C.coral],
    ["Proof uploaded", "department attaches evidence", C.amber],
    ["Citizen verifies", "accept — or challenge", C.teal],
  ];
  mini.forEach(([t, sub, color], i) => {
    const y = 1.25 + i * 0.95;
    card(s, 7.35, y, 2.15, 0.8);
    dot(s, 7.52, y + 0.2, 0.14, color as string);
    T(s, t as string, {
      x: 7.76,
      y: y + 0.13,
      w: 1.65,
      h: 0.24,
      fontSize: 9.5,
      bold: true,
      color: C.ink,
    });
    T(s, sub as string, {
      x: 7.76,
      y: y + 0.4,
      w: 1.62,
      h: 0.3,
      fontSize: 7.5,
      color: C.muted,
      fit: "shrink",
    });
  });

  T(s, "Hackathon pitch · 7 slides", {
    x: M,
    y: H - 0.42,
    w: 4,
    h: 0.22,
    fontSize: 8,
    color: C.muted,
  });
}

/* ══ Slide 2 — Problem ═══════════════════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "The challenge", "Closure without proof breaks trust", 2);

  card(s, M, 1.3, 5.2, 3.05);
  T(s, "What happens today", {
    x: 0.68,
    y: 1.45,
    w: 4.8,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.ink,
  });
  bulletList(
    s,
    [
      "Complaints are logged, then disappear into a black box.",
      "Status changes carry no actor, no timestamp, no evidence.",
      "“Resolved” is a button click — the citizen cannot verify it.",
      "No tamper-evident history means nobody is accountable.",
    ],
    0.68,
    1.85,
    4.85,
    2.35,
    11,
  );

  rect(s, 5.9, 1.3, 3.6, 1.55, C.peach);
  T(s, "WHAT THE CITIZEN ASKS", {
    x: 6.08,
    y: 1.46,
    w: 3.2,
    h: 0.22,
    fontSize: 8,
    bold: true,
    color: C.coralDk,
    charSpacing: 1.5,
  });
  T(s, "“Was it actually fixed — and who says so?”", {
    x: 6.08,
    y: 1.74,
    w: 3.24,
    h: 1.0,
    fontSize: 14.5,
    bold: true,
    color: C.coralDk,
    lineSpacingMultiple: 1.15,
    fit: "shrink",
  });

  card(s, 5.9, 3.0, 3.6, 1.35);
  T(s, "What's missing", {
    x: 6.08,
    y: 3.14,
    w: 3.2,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: C.ink,
  });
  ["Evidence", "Audit trail", "Right to challenge"].forEach((label, i) => {
    const x = 6.08 + i * 1.1;
    rect(s, x, 3.5, 1.04, 0.34, C.peach, { rectRadius: 0.17 });
    T(s, label, {
      x,
      y: 3.5,
      w: 1.04,
      h: 0.34,
      fontSize: 7.5,
      bold: true,
      color: C.coralDk,
      align: "center",
      valign: "middle",
      fit: "shrink",
    });
  });
  T(s, "All three exist in Yatra Setu from day one.", {
    x: 6.08,
    y: 3.92,
    w: 3.24,
    h: 0.24,
    fontSize: 8.5,
    color: C.muted,
  });

  rect(s, M, 4.55, CW, 0.52, C.tealSoft);
  T(
    s,
    "Yatra Setu closes the loop — no proof, no closure, and every action stays on the record.",
    {
      x: 0.7,
      y: 4.55,
      w: 8.6,
      h: 0.52,
      fontSize: 11,
      bold: true,
      color: C.teal,
      align: "center",
      valign: "middle",
    },
  );
}

/* ══ Slide 3 — Solution journey ══════════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "The solution", "One complete journey: report → verify", 3);

  const steps = [
    ["Report", "category, photo,\nlocation"],
    ["Unique ID", "complaint ID\n+ timestamp"],
    ["Assigned", "responsible\ndepartment"],
    ["Proof", "repair evidence\nuploaded"],
    ["Verify", "citizen reviews\nthe proof"],
    ["Accept / Challenge", "close it — or\nreopen it"],
  ];
  const stepW = 1.34;
  const gap = 0.16;
  const stepX = (i: number) => M + i * (stepW + gap);

  // connecting track
  s.addShape(P.line, {
    x: M,
    y: 1.93,
    w: 6 * stepW + 5 * gap,
    h: 0,
    line: { color: C.peachDk, width: 2 },
  } as never);

  steps.forEach(([label, sub], i) => {
    const x = stepX(i);
    card(s, x, 1.4, stepW, 1.08);
    dot(s, x + stepW / 2 - 0.15, 1.52, 0.3, C.coral);
    T(s, String(i + 1), {
      x: x + stepW / 2 - 0.15,
      y: 1.52,
      w: 0.3,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
    });
    T(s, label, {
      x: x + 0.05,
      y: 1.87,
      w: stepW - 0.1,
      h: 0.3,
      fontSize: 9.5,
      bold: true,
      color: C.ink,
      align: "center",
      valign: "middle",
      fit: "shrink",
    });
    T(s, sub, {
      x: x + 0.05,
      y: 2.14,
      w: stepW - 0.1,
      h: 0.3,
      fontSize: 7,
      color: C.muted,
      align: "center",
      valign: "top",
      fit: "shrink",
    });
  });

  rect(s, M, 2.72, CW, 0.72, C.peach);
  T(
    s,
    "Example · A citizen reports a pothole → photo + location → unique complaint ID → department assigned → repair proof uploaded → the citizen checks the proof → accepts or challenges the closure.",
    {
      x: 0.68,
      y: 2.72,
      w: 8.64,
      h: 0.72,
      fontSize: 10.5,
      color: C.ink,
      valign: "middle",
      fit: "shrink",
      lineSpacingMultiple: 1.2,
    },
  );

  T(s, "Status flow", {
    x: M,
    y: 3.58,
    w: 3,
    h: 0.26,
    fontSize: 10.5,
    bold: true,
    color: C.ink,
  });

  const statuses: [string, string, string][] = [
    ["SUBMITTED", C.neutral, C.neutralTx],
    ["ASSIGNED", C.amberSoft, C.amber],
    ["IN_PROGRESS", C.amberSoft, C.amber],
    ["PROOF_UPLOADED", C.tealSoft, C.teal],
    ["AWAITING_VERIFICATION", C.tealSoft, C.teal],
    ["RESOLVED", C.greenSoft, C.green],
  ];
  statuses.forEach(([label, bg, tx], i) => {
    const x = stepX(i);
    rect(s, x, 3.88, stepW, 0.4, bg, { rectRadius: 0.2 });
    T(s, label, {
      x: x + 0.03,
      y: 3.88,
      w: stepW - 0.06,
      h: 0.4,
      fontSize: 7.5,
      bold: true,
      color: tx,
      align: "center",
      valign: "middle",
      fit: "shrink",
    });
  });

  rect(s, M, 4.48, CW, 0.5, "FCE4DE");
  T(
    s,
    "If the citizen challenges:   RESOLVED  →  CHALLENGED  →  REOPENED  →  IN_PROGRESS   —  with every step hashed and timestamped.",
    {
      x: 0.68,
      y: 4.48,
      w: 8.64,
      h: 0.5,
      fontSize: 9.5,
      bold: true,
      color: C.coralDk,
      align: "center",
      valign: "middle",
      fit: "shrink",
    },
  );
}

/* ══ Slide 4 — Features ══════════════════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "Feature set", "Built for both sides — and for trust", 4);

  const cols: [string, string, string[]][] = [
    [
      "Citizen",
      C.coral,
      [
        "Report: category, description, location, photo, privacy setting",
        "Track by complaint ID with a full status timeline",
        "See every authority update and all uploaded evidence",
        "Accept the resolution — or challenge it and reopen",
        "My Complaints dashboard, history & resolution feedback",
        "Login / demo login, privacy controls, copyable ID",
      ],
    ],
    [
      "Authority",
      C.amber,
      [
        "Login and view assigned complaints",
        "Filter by category and status",
        "Change complaint status with an actor + timestamp",
        "Upload resolution proof before requesting closure",
        "Deadlines and at-risk complaints at a glance",
        "Complaints challenged by citizens, ready for rework",
        "Dashboard: total · pending · resolved counts",
      ],
    ],
    [
      "Trust layer",
      C.teal,
      [
        "Unique complaint ID for every report",
        "Time-stamped activity history per complaint",
        "Hash-chain audit log — tamper-evident events",
        "Proof required before a case can be closed",
        "Citizen challenge / reopen keeps authority honest",
        "Privacy-safe public records — no personal details",
      ],
    ],
  ];

  const colW = 2.85;
  const colX = [0.5, 3.525, 6.55];

  cols.forEach(([title, color, items], ci) => {
    const x = colX[ci];
    card(s, x, 1.3, colW, 3.5);
    dot(s, x + 0.18, 1.53, 0.16, color);
    T(s, title, {
      x: x + 0.44,
      y: 1.44,
      w: colW - 0.6,
      h: 0.32,
      fontSize: 13,
      bold: true,
      color,
    });
    s.addShape(P.line, {
      x: x + 0.18,
      y: 1.9,
      w: colW - 0.36,
      h: 0,
      line: { color: C.border, width: 1 },
    });
    bulletList(s, items, x + 0.2, 2.02, colW - 0.4, 2.65, 9.5);
  });

  rect(s, M, 4.92, CW, 0.3, C.peach);
  T(
    s,
    "Design rules — mobile-first · large readable buttons · simple language · clear status colours · no personal details in public views · easy-to-copy IDs",
    {
      x: 0.68,
      y: 4.92,
      w: 8.64,
      h: 0.3,
      fontSize: 8.5,
      color: C.coralDk,
      align: "center",
      valign: "middle",
      fit: "shrink",
    },
  );
}

/* ══ Slide 5 — USP + trust layer ═════════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "Why Yatra Setu", "USP: Proof Before Resolved", 5);

  rect(s, M, 1.3, 4.55, 0.95, C.peach);
  T(
    s,
    "A complaint is not resolved because someone clicked a button — it is resolved when the citizen has checked the proof.",
    {
      x: 0.68,
      y: 1.3,
      w: 4.2,
      h: 0.95,
      fontSize: 11.5,
      bold: true,
      color: C.coralDk,
      valign: "middle",
      fit: "shrink",
      lineSpacingMultiple: 1.2,
    },
  );

  const usps: [string, string][] = [
    [
      "Proof-based closure",
      "Evidence is attached before resolution is requested.",
    ],
    ["Challengeable", "Citizens can flag a weak fix; the complaint reopens."],
    ["Tamper-evident", "Key actions are linked through hashes — edits show."],
    ["Privacy-first", "Public transparency without revealing identity."],
    ["Accountability", "Every status update has an actor and a timestamp."],
  ];
  usps.forEach(([label, desc], i) => {
    const y = 2.42 + i * 0.56;
    card(s, M, y, 4.55, 0.5);
    T(s, label, {
      x: 0.64,
      y,
      w: 1.55,
      h: 0.5,
      fontSize: 9.5,
      bold: true,
      color: C.coral,
      valign: "middle",
      fit: "shrink",
    });
    T(s, desc, {
      x: 2.2,
      y,
      w: 2.75,
      h: 0.5,
      fontSize: 8.5,
      color: C.muted,
      valign: "middle",
      fit: "shrink",
    });
  });

  T(s, "How the trust layer works", {
    x: 5.3,
    y: 1.28,
    w: 4.2,
    h: 0.28,
    fontSize: 11.5,
    bold: true,
    color: C.ink,
  });
  T(
    s,
    "MVP: hash-chain audit log.  Production: permissioned blockchain (Hyperledger Fabric).",
    {
      x: 5.3,
      y: 1.58,
      w: 4.2,
      h: 0.3,
      fontSize: 8.5,
      color: C.muted,
      fit: "shrink",
    },
  );

  const events: [string, string][] = [
    ["Event 1 · Complaint created", "previous_hash = null"],
    ["Event 2 · Assigned to department", "previous_hash = hash(Event 1)"],
    ["Event 3 · Repair proof uploaded", "previous_hash = hash(Event 2)"],
    ["Event 4 · Citizen challenged", "previous_hash = hash(Event 3)"],
  ];
  events.forEach(([title, code], i) => {
    const y = 1.98 + i * 0.78;
    card(s, 5.3, y, 4.2, 0.6);
    dot(s, 5.46, y + 0.14, 0.14, i === 3 ? C.coral : C.teal);
    T(s, title, {
      x: 5.7,
      y: y + 0.07,
      w: 3.65,
      h: 0.24,
      fontSize: 9.5,
      bold: true,
      color: C.ink,
      fit: "shrink",
    });
    T(s, code, {
      x: 5.7,
      y: y + 0.32,
      w: 3.65,
      h: 0.22,
      fontSize: 8.5,
      fontFace: MONO,
      color: C.coralDk,
    });
    if (i < events.length - 1) {
      T(s, "↓", {
        x: 5.3,
        y: y + 0.6,
        w: 4.2,
        h: 0.18,
        fontSize: 9,
        color: C.coral,
        align: "center",
        valign: "middle",
      });
    }
  });
}

/* ══ Slide 6 — Stack + MVP ═══════════════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "Build plan", "Technology stack and MVP scope", 6);

  card(s, M, 1.3, 4.1, 3.55);
  T(s, "Technology stack", {
    x: 0.68,
    y: 1.44,
    w: 3.7,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.ink,
  });
  s.addShape(P.line, {
    x: 0.68,
    y: 1.8,
    w: 3.74,
    h: 0,
    line: { color: C.border, width: 1 },
  });
  const stack: [string, string][] = [
    ["Frontend", "React + Vite — UI, forms, dashboard"],
    ["Backend", "Python FastAPI — auth + complaint APIs"],
    ["Database", "PostgreSQL / Supabase"],
    ["Trust", "Python hash-chain audit log"],
    ["Maps", "Leaflet + OpenStreetMap"],
    ["Tools", "Figma · GitHub · Vercel + Render"],
  ];
  stack.forEach(([label, value], i) => {
    const y = 1.94 + i * 0.47;
    T(s, label, {
      x: 0.68,
      y,
      w: 1.1,
      h: 0.42,
      fontSize: 9.5,
      bold: true,
      color: C.coral,
      valign: "middle",
    });
    T(s, value, {
      x: 1.82,
      y,
      w: 2.65,
      h: 0.42,
      fontSize: 9,
      color: C.ink,
      valign: "middle",
      fit: "shrink",
    });
    if (i < stack.length - 1) {
      s.addShape(P.line, {
        x: 0.68,
        y: y + 0.44,
        w: 3.74,
        h: 0,
        line: { color: C.border, width: 0.5 },
      });
    }
  });

  card(s, 4.85, 1.3, 4.65, 3.55);
  T(s, "MVP — one complete journey (10 must-haves)", {
    x: 5.03,
    y: 1.44,
    w: 4.3,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.ink,
    fit: "shrink",
  });
  s.addShape(P.line, {
    x: 5.03,
    y: 1.8,
    w: 4.29,
    h: 0,
    line: { color: C.border, width: 1 },
  });
  bulletList(
    s,
    [
      "Citizen login or demo login",
      "Complaint submission form",
      "Unique complaint ID generation",
      "Location and photo upload",
      "Complaint tracking timeline",
      "Authority dashboard",
      "Status updates",
      "Resolution proof upload",
      "Accept / Challenge resolution",
      "Hash-based audit history",
    ],
    5.03,
    1.94,
    4.3,
    2.8,
    9.5,
  );

  rect(s, M, 4.94, CW, 0.28, C.peach);
  T(
    s,
    "Deferred to v2 — full blockchain deployment · AI · native app · government APIs · crypto rewards · multi-city scaling",
    {
      x: 0.68,
      y: 4.94,
      w: 8.64,
      h: 0.28,
      fontSize: 8.5,
      color: C.coralDk,
      align: "center",
      valign: "middle",
      fit: "shrink",
    },
  );
}

/* ══ Slide 7 — Team, roadmap, close ══════════════════════ */
{
  const s = pptx.addSlide();
  header(s, "Execution", "Three owners, ten days, one demo", 7);

  T(s, "Team split — three owners", {
    x: M,
    y: 1.26,
    w: 4.3,
    h: 0.28,
    fontSize: 11.5,
    bold: true,
    color: C.ink,
  });
  const team: [string, string][] = [
    [
      "Member 1 — Product, Research & Frontend",
      "Personas, user stories, Figma wireframes, React frontend, mobile-responsive demo and the product pitch.",
    ],
    [
      "Member 2 — Backend & Database",
      "FastAPI project, schema, auth, complaint / status / evidence APIs, validation, errors and tests.",
    ],
    [
      "Member 3 — Trust & Integration",
      "Complaint IDs, hash-chain events, timeline, challenge & reopen, deadlines, integration, deploy.",
    ],
  ];
  team.forEach(([role, body], i) => {
    const y = 1.6 + i * 0.98;
    card(s, M, y, 4.3, 0.88);
    T(s, role, {
      x: 0.66,
      y: y + 0.1,
      w: 4,
      h: 0.24,
      fontSize: 9.5,
      bold: true,
      color: C.coral,
      fit: "shrink",
    });
    T(s, body, {
      x: 0.66,
      y: y + 0.36,
      w: 4,
      h: 0.46,
      fontSize: 8.5,
      color: C.muted,
      fit: "shrink",
      lineSpacingMultiple: 1.15,
    });
  });

  T(s, "10-day roadmap", {
    x: 5.1,
    y: 1.26,
    w: 4.4,
    h: 0.28,
    fontSize: 11.5,
    bold: true,
    color: C.ink,
  });
  const road: [string, string][] = [
    ["Day 1", "Research, scope & API contract"],
    ["Day 2", "Figma screens · DB schema · trust workflow"],
    ["Days 3–5", "Core build: submit, auth, tracking, dashboard"],
    ["Days 6–7", "Proof layer + challenge / reopen flow"],
    ["Days 8–10", "Integration, testing, deploy & 3-min pitch"],
  ];
  road.forEach(([day, body], i) => {
    const y = 1.6 + i * 0.58;
    card(s, 5.1, y, 4.4, 0.5);
    rect(s, 5.24, y + 0.09, 0.95, 0.32, C.peach, { rectRadius: 0.16 });
    T(s, day, {
      x: 5.24,
      y: y + 0.09,
      w: 0.95,
      h: 0.32,
      fontSize: 8,
      bold: true,
      color: C.coralDk,
      align: "center",
      valign: "middle",
      fit: "shrink",
    });
    T(s, body, {
      x: 6.32,
      y,
      w: 3.05,
      h: 0.5,
      fontSize: 8.5,
      color: C.ink,
      valign: "middle",
      fit: "shrink",
    });
  });

  rect(s, M, 4.58, CW, 0.62, C.coral);
  T(
    s,
    "Yatra Setu does not just record complaints. It records the journey, preserves the evidence and gives citizens the right to question a weak resolution.",
    {
      x: 0.75,
      y: 4.58,
      w: 8.5,
      h: 0.62,
      fontSize: 10.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "middle",
      fit: "shrink",
    },
  );
}

/* ── write ───────────────────────────────────────────────── */
const OUT = "public/YatraSetu-Proof-Before-Resolved.pptx";
pptx
  .writeFile({ fileName: OUT })
  .then((path) => console.log(`✔ Deck written: ${path}`))
  .catch((err) => {
    console.error("✖ Failed to write deck:", err);
    process.exit(1);
  });
