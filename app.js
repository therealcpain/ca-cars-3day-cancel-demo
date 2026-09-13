/**
 * CA CARS 3-Day Cancel Clock — paste (1) CA dealer used-vehicle? yes/no,
 * (2) contract price ≤ $50,000? yes/no, (3) contract date OR “not yet / pre–Oct 1”,
 * (4) view date (+ optional miles >400) → one shareable card:
 * not yet in force / days until Oct 1 / inside 3-day cancel window / past window /
 * not eligible (new / >$50k / private party / >400 miles).
 * Brand: CA CARS 3-Day Cancel Clock only. User paste only — no VIN/DMS scrape.
 * Not legal advice. Not lemon-law. Never invent this buyer’s restocking $.
 */
(function () {
  "use strict";

  const LEGINFO =
    "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1784.43.";
  const CARPRO =
    "https://www.carpro.com/blog/california-cars-act-coming-soon-will-other-states-follow";
  const NCLC =
    "https://library.nclc.org/article/new-consumer-law-changes-taking-effect-2026";

  const OPERATIVE_ISO = "2026-10-01";
  const OPERATIVE_LABEL = "Oct 1 2026";
  const CANCEL_DAYS = 3;
  const MILE_CAP = 400;
  const PRICE_CAP = 50000;

  const CITE_ONE_LINER =
    "Civ. Code §1784.43 (operative Oct 1 2026 via SB 766 / Stats. 2025 Ch. 354): California dealer shall not sell/lease a used vehicle at retail ≤ $50,000 without a three-day right to cancel; right does not apply if driven >400 miles; dealer may charge a restocking fee; first-page notice that CA has no new-vehicle cooling-off but used ≤$50k has 3 days. CarPro Aug 11 2026: 3 calendar days beginning the day after execution; if day 3 falls on a closed dealership day, deadline moves to the next open day (confirm dealer hours — we do not invent them); restocking 1.5% of sale price ($200 min / $600 max) + up to $150 mileage over 250. NCLC 2026 consumer law changes: SB 766 CARS Act Oct 1 2026 three-day cancel for specified used vehicles. Literacy only — not legal advice · not lemon-law.";

  const DISCLAIMER_SHORT =
    "Not legal advice · not lemon-law · return during business hours · CA used ≤$50k only · new vehicles have no cooling-off per statute notice · never invent this buyer’s restocking $ · confirm dealer open day";

  const RESTOCKING_LITERACY =
    "Restocking fee literacy (CarPro): typically 1.5% of sale price ($200 min / $600 max) + up to $150 for mileage over 250. We never invent THIS buyer’s restocking $ — read the dealer’s required 3-Day Right to Cancel disclosure.";

  const WINDOW_CHIP =
    "3 calendar days starting the day after contract; if day 3 is a closed dealership day → next open day (literacy only — confirm the dealer’s open day; we do not invent hours).";

  /**
   * 3-day chip day literacy — restates MY window / Oct 1 countdown from
   * already-computed dates (not a static slogan). Never invents dealer hours.
   */
  function buildWindowChip(phase, window, daysLeftInWindow, operativeLeft) {
    if (phase === "not_yet_in_force") {
      const n = operativeLeft;
      const daysBit =
        n === null
          ? "days until Oct 1"
          : n === 0
            ? "Oct 1 is today"
            : n < 0
              ? "past Oct 1 operative date"
              : n === 1
                ? "1 day until Oct 1"
                : n + " days until Oct 1";
      return (
        "Not yet in force · " +
        OPERATIVE_LABEL +
        " operative · " +
        daysBit +
        " · once in force: 3 calendar days start the day after contract (closed-day roll → next open day — confirm hours)"
      );
    }
    if (window) {
      const range = fmtDate(window.start) + " → " + fmtDate(window.end);
      let leftBit = "";
      if (phase === "past") {
        leftBit = " · past this window";
      } else if (phase === "before_window") {
        leftBit = " · opens " + fmtDate(window.start) + " (day after contract)";
      } else if (daysLeftInWindow !== null) {
        leftBit =
          daysLeftInWindow === 0
            ? " · last calendar day (confirm open day)"
            : " · " +
              daysLeftInWindow +
              " calendar day" +
              (daysLeftInWindow === 1 ? "" : "s") +
              " left";
      }
      return (
        "3-day window " +
        range +
        leftBit +
        " · if day 3 is a closed dealership day → next open day (confirm hours — we do not invent them)"
      );
    }
    // Not-eligible outs: keep statute literacy; do not invent a cancel window
    return WINDOW_CHIP;
  }

  /** Teaching seeds — labeled. Not live dealer scrapes. */
  const SEEDS = [
    {
      id: "pre-oct1-28k",
      label: "Used $28k · Sep 28 pre–Oct 1",
      sub: "Teaching · not yet in force · days until Oct 1",
      caDealerUsed: "yes",
      priceOk: "yes",
      purchaseMode: "pre",
      contractDate: "2026-09-28",
      viewDate: "2026-09-13",
      milesOver400: "no",
      noteLabel: "Used $28k Sep 28 pre–Oct1 teaching seed",
    },
    {
      id: "inside-oct2",
      label: "Oct 2 contract · view Oct 3 inside",
      sub: "Teaching · inside 3-day cancel window",
      caDealerUsed: "yes",
      priceOk: "yes",
      purchaseMode: "date",
      contractDate: "2026-10-02",
      viewDate: "2026-10-03",
      milesOver400: "no",
      noteLabel: "Inside-window teaching seed",
    },
    {
      id: "past-window",
      label: "Past window",
      sub: "Teaching · Oct 2 contract · view Oct 10",
      caDealerUsed: "yes",
      priceOk: "yes",
      purchaseMode: "date",
      contractDate: "2026-10-02",
      viewDate: "2026-10-10",
      milesOver400: "no",
      noteLabel: "Past-window teaching seed",
    },
    {
      id: "new-out",
      label: "New vehicle · out",
      sub: "Teaching · not CA dealer used → not eligible",
      caDealerUsed: "no",
      priceOk: "yes",
      purchaseMode: "date",
      contractDate: "2026-10-02",
      viewDate: "2026-10-03",
      milesOver400: "no",
      noteLabel: "New-vehicle / not-used teaching seed",
    },
    {
      id: "over-50k",
      label: ">$50k · out",
      sub: "Teaching · price chip no → not eligible",
      caDealerUsed: "yes",
      priceOk: "no",
      purchaseMode: "date",
      contractDate: "2026-10-02",
      viewDate: "2026-10-03",
      milesOver400: "no",
      noteLabel: "Over-$50k teaching seed",
    },
    {
      id: "empty-miss",
      label: "Empty / missing dates",
      sub: "Teaching · date mode · blank contract → honest miss",
      caDealerUsed: "yes",
      priceOk: "yes",
      purchaseMode: "date",
      contractDate: "",
      viewDate: "2026-10-03",
      milesOver400: "unsure",
      noteLabel: "Honest-miss teaching seed",
    },
  ];

  const $ = (id) => document.getElementById(id);

  function parseISODate(s) {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const parts = s.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (
      d.getFullYear() !== parts[0] ||
      d.getMonth() !== parts[1] - 1 ||
      d.getDate() !== parts[2]
    ) {
      return null;
    }
    return d;
  }

  function fmtDate(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isoFromDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function todayISO() {
    return isoFromDate(new Date());
  }

  function addDays(date, n) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + n);
    return d;
  }

  /** Whole calendar days from a → b (local). Positive if b is after a. */
  function daysBetween(a, b) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ub - ua) / 86400000);
  }

  function operativeDaysLeft(viewDate) {
    const cliff = parseISODate(OPERATIVE_ISO);
    if (!viewDate || !cliff) return null;
    return daysBetween(viewDate, cliff);
  }

  /**
   * Cancel window: day after contract through contract+3 inclusive.
   * Contract Oct 2 → Oct 3..Oct 5.
   */
  function cancelWindow(contractDate) {
    const start = addDays(contractDate, 1);
    const end = addDays(contractDate, CANCEL_DAYS);
    return { start: start, end: end };
  }

  function clockMeta(phase, daysLeft, window, operativeLeft) {
    if (phase === "not_eligible_dealer") {
      return {
        phase: phase,
        pill: "Not eligible",
        cls: "danger",
        sub: "Not a CA dealer used-vehicle retail deal (new / private party / out of scope)",
        ringLabel: "OUT",
        daysLabel: "Not eligible",
        headline: "Not eligible — new / private party / not CA dealer used",
        flag: "NOT ELIGIBLE · statute targets CA dealer used-vehicle retail ≤$50k · new vehicles have no cooling-off per statute notice · private-party sales are out of scope",
      };
    }
    if (phase === "not_eligible_price") {
      return {
        phase: phase,
        pill: "Not eligible (>$50k)",
        cls: "danger",
        sub: "Contract price chip marked over $50,000",
        ringLabel: "OUT",
        daysLabel: "Not eligible",
        headline: "Not eligible — contract price > $50,000",
        flag: "NOT ELIGIBLE · Civ. Code §1784.43 three-day right applies to used retail ≤ $50,000 · we do not invent your price band",
      };
    }
    if (phase === "not_eligible_miles") {
      return {
        phase: phase,
        pill: "Not eligible (>400 miles)",
        cls: "danger",
        sub: "Mileage cap · right does not apply if driven >400 miles",
        ringLabel: "OUT",
        daysLabel: "Not eligible",
        headline: "Not eligible — driven >400 miles",
        flag: "NOT ELIGIBLE · §1784.43 right does not apply if the vehicle has been driven more than 400 miles · confirm your odometer against the dealer disclosure",
      };
    }
    if (phase === "not_yet_in_force") {
      const n = operativeLeft;
      const daysTxt =
        n === null
          ? "days until Oct 1"
          : n === 0
            ? "Oct 1 is today"
            : n < 0
              ? "past Oct 1 operative date (purchase framing still pre-force / pre-purchase)"
              : n === 1
                ? "1 day until Oct 1"
                : n + " days until Oct 1";
      return {
        phase: phase,
        pill: "Not yet in force",
        cls: "warn",
        sub: daysTxt + " · SB 766 / §1784.43 operative " + OPERATIVE_LABEL,
        ringLabel:
          n !== null && n > 0 ? String(n) : n === 0 ? "0" : "PRE",
        daysLabel: daysTxt,
        headline: "Not yet in force — days until Oct 1 2026",
        flag:
          "NOT YET IN FORCE · Civil Code §1784.43 operative " +
          OPERATIVE_LABEL +
          (n !== null && n > 0
            ? " · " + n + " calendar day" + (n === 1 ? "" : "s") + " until then"
            : "") +
          " · pre–Oct 1 / not-yet-purchased framing · the automatic 3-day right applies to qualifying used deals on/after Oct 1",
      };
    }
    if (phase === "inside") {
      const left = daysLeft;
      return {
        phase: phase,
        pill: "Inside 3-day cancel window",
        cls: left !== null && left <= 1 ? "danger" : "ok",
        sub:
          "Window " +
          fmtDate(window.start) +
          " → " +
          fmtDate(window.end) +
          (left !== null
            ? left === 0
              ? " · last calendar day (confirm open day)"
              : " · " + left + " calendar day" + (left === 1 ? "" : "s") + " left in window"
            : ""),
        ringLabel: left !== null ? String(left) : "IN",
        daysLabel: "Inside 3-day cancel window",
        headline: "Inside the 3-day cancel window",
        flag:
          "INSIDE WINDOW · 3 calendar days starting the day after contract (" +
          fmtDate(window.start) +
          " through " +
          fmtDate(window.end) +
          ") · if day 3 is a closed dealership day → next open day (confirm hours — we do not invent them) · return during business hours",
      };
    }
    if (phase === "past") {
      return {
        phase: phase,
        pill: "Past window",
        cls: "danger",
        sub:
          "Past cancel window ending " +
          fmtDate(window.end) +
          " (plus any closed-day roll you confirm with the dealer)",
        ringLabel: "PAST",
        daysLabel: "Past window",
        headline: "Past the 3-day cancel window",
        flag:
          "PAST WINDOW · cancel window ended " +
          fmtDate(window.end) +
          " (calendar) · closed-day roll is literacy only — confirm with the dealer · this card is not lemon-law and does not invent a late path",
      };
    }
    // before_window (view on contract day before day-after start)
    return {
      phase: "before_window",
      pill: "Inside 3-day cancel window",
      cls: "ok",
      sub:
        "Cancel days run " +
        fmtDate(window.start) +
        " → " +
        fmtDate(window.end) +
        " · window opens the day after contract",
      ringLabel: String(CANCEL_DAYS),
      daysLabel: "Inside 3-day cancel window",
      headline: "Inside the 3-day cancel window (opens day after contract)",
      flag:
        "ELIGIBLE · window opens " +
        fmtDate(window.start) +
        " (day after contract) through " +
        fmtDate(window.end) +
        " · return during business hours · confirm closed-day roll with the dealer",
    };
  }

  function validate(input) {
    if (!parseISODate(input.viewDate)) {
      return "Pick a view date (the day you’re looking) — the clock needs it. We will not invent days left.";
    }
    if (input.caDealerUsed !== "yes" && input.caDealerUsed !== "no") {
      return "Say whether this is a California dealer used-vehicle purchase/lease (yes/no). Empty = honest miss.";
    }
    if (input.priceOk !== "yes" && input.priceOk !== "no") {
      return "Say whether contract price is ≤ $50,000 (yes/no). Empty = honest miss.";
    }
    const mode = input.purchaseMode || "pre";
    if (mode === "date") {
      if (!parseISODate(input.contractDate)) {
        return "You chose a contract execution date — paste it. Empty dates = honest miss (we will not invent a cancel window).";
      }
    }
    return null;
  }

  function compute(input) {
    const viewDate = parseISODate(input.viewDate);
    const contractDate = parseISODate(input.contractDate);
    const operative = parseISODate(OPERATIVE_ISO);
    const mode = input.purchaseMode || "pre";
    const miles = input.milesOver400 || "unsure";
    const operativeLeft = operativeDaysLeft(viewDate);

    let phase = "not_yet_in_force";
    let window = null;
    let daysLeftInWindow = null;
    let eligibilityReason = null;

    // Hard outs first
    if (input.caDealerUsed === "no") {
      phase = "not_eligible_dealer";
      eligibilityReason = "new / private party / not CA dealer used";
    } else if (input.priceOk === "no") {
      phase = "not_eligible_price";
      eligibilityReason = ">$50k";
    } else if (miles === "yes") {
      phase = "not_eligible_miles";
      eligibilityReason = ">400 miles";
    } else if (
      mode === "pre" ||
      (contractDate && contractDate < operative) ||
      (viewDate && viewDate < operative && mode !== "date")
    ) {
      // Pre–Oct 1 / not-yet-purchased framing, or contract dated before operative
      phase = "not_yet_in_force";
    } else if (contractDate && viewDate && contractDate >= operative) {
      window = cancelWindow(contractDate);
      if (viewDate < window.start) {
        phase = "before_window";
        daysLeftInWindow = daysBetween(viewDate, window.end);
      } else if (viewDate <= window.end) {
        phase = "inside";
        daysLeftInWindow = daysBetween(viewDate, window.end);
      } else {
        phase = "past";
        daysLeftInWindow = daysBetween(viewDate, window.end); // negative
      }
    } else if (mode === "date" && !contractDate) {
      // validate should catch; keep safe
      phase = "not_yet_in_force";
    } else {
      // Eligible flags but still before operative (e.g. date mode with future Oct+ contract viewed early)
      if (contractDate && contractDate >= operative && viewDate && viewDate < operative) {
        phase = "not_yet_in_force";
      } else {
        phase = "not_yet_in_force";
      }
    }

    // Edge: contract on/after Oct 1 but view before Oct 1 → not yet in force (statute not operative yet)
    if (
      phase !== "not_eligible_dealer" &&
      phase !== "not_eligible_price" &&
      phase !== "not_eligible_miles" &&
      viewDate &&
      viewDate < operative &&
      (mode === "pre" || (contractDate && contractDate >= operative) || (contractDate && contractDate < operative))
    ) {
      // If they already have a post-Oct1 contract but are viewing before Oct1 — unusual; still show not yet in force
      if (mode === "pre" || (contractDate && contractDate < operative)) {
        phase = "not_yet_in_force";
        window = null;
      } else if (contractDate && contractDate >= operative && viewDate < operative) {
        phase = "not_yet_in_force";
        window = null;
      }
    }

    const clock = clockMeta(phase, daysLeftInWindow, window, operativeLeft);

    let pct = 0;
    if (phase === "inside" || phase === "before_window") {
      const left = daysLeftInWindow != null ? daysLeftInWindow : CANCEL_DAYS;
      pct = Math.max(2, Math.min(100, Math.round((left / CANCEL_DAYS) * 100)));
    } else if (phase === "not_yet_in_force" && operativeLeft != null && operativeLeft > 0) {
      // Rough span from Sep 1 framing (~30d) — visual only
      pct = Math.max(2, Math.min(100, Math.round((operativeLeft / 30) * 100)));
    } else if (phase === "past") {
      pct = 0;
    }

    const milesLiteracy =
      miles === "yes"
        ? "You marked miles driven >400 — right does not apply (mileage cap)."
        : miles === "no"
          ? "You marked ≤400 miles driven — mileage cap literacy satisfied for this paste."
          : "Miles driven >400? Unsure — confirm odometer vs dealer disclosure; right does not apply if driven >400 miles.";

    const decoder =
      phase === "not_eligible_dealer"
        ? "You marked this is not a California dealer used-vehicle purchase/lease. §1784.43 targets CA dealer used retail ≤$50k. New vehicles have no cooling-off under the statute notice. Private-party sales are out of scope. This card is not lemon-law."
        : phase === "not_eligible_price"
          ? "You marked contract price over $50,000. The automatic three-day right applies to used retail ≤ $50,000. We do not invent your price."
          : phase === "not_eligible_miles"
            ? "You marked the vehicle has been driven more than 400 miles. The statute says the right does not apply in that case."
            : phase === "not_yet_in_force"
              ? "SB 766 / Civ. Code §1784.43 is operative " +
                OPERATIVE_LABEL +
                ". Pre–Oct 1 / not-yet-purchased framing → not yet in force. Qualifying used deals on/after Oct 1 get the automatic 3-day cancel right."
              : phase === "past"
                ? "Your pasted view date is after the calendar cancel window (day after contract through day+3). Closed-day roll may extend the deadline to the next open dealership day — confirm hours; we do not invent them. Not lemon-law."
                : "Cancel window = day after contract through contract+3 calendar days. Return during business hours. Read the dealer’s required 3-Day Right to Cancel disclosure. Restocking literacy only — we never invent THIS buyer’s restocking $.";

    const action =
      "Calm next step: read Civ. Code §1784.43 on leginfo + the dealer’s required 3-Day Right to Cancel disclosure. Return during business hours if inside the window. This card is not legal advice and not a lemon-law claim tool.";

    return {
      caDealerUsed: input.caDealerUsed,
      priceOk: input.priceOk,
      purchaseMode: mode,
      contractDate: contractDate,
      viewDate: viewDate,
      milesOver400: miles,
      window: window,
      daysLeftInWindow: daysLeftInWindow,
      operativeLeft: operativeLeft,
      phase: phase,
      clock: clock,
      pct: pct,
      eligibilityReason: eligibilityReason,
      windowChip: buildWindowChip(phase, window, daysLeftInWindow, operativeLeft),
      restocking: RESTOCKING_LITERACY,
      milesLiteracy: milesLiteracy,
      decoder: decoder,
      action: action,
      noteLabel: input.noteLabel || "",
    };
  }

  function encodeHash(input) {
    const parts = [
      input.caDealerUsed || "",
      input.priceOk || "",
      input.purchaseMode || "pre",
      input.contractDate || "",
      input.viewDate || "",
      input.milesOver400 || "unsure",
      input.noteLabel || "",
    ];
    const raw = parts.join("|");
    try {
      return "#p=" + btoa(unescape(encodeURIComponent(raw)));
    } catch (e) {
      return "#p=" + encodeURIComponent(raw);
    }
  }

  function decodeHash() {
    const raw = location.hash || "";
    if (!raw.startsWith("#p=")) return null;
    try {
      let decoded;
      try {
        decoded = decodeURIComponent(escape(atob(raw.slice(3))));
      } catch (e) {
        decoded = decodeURIComponent(raw.slice(3));
      }
      const parts = decoded.split("|");
      if (parts.length < 1) return null;
      return {
        caDealerUsed: parts[0] || "",
        priceOk: parts[1] || "",
        purchaseMode: parts[2] || "pre",
        contractDate: parts[3] || "",
        viewDate: parts[4] || "",
        milesOver400: parts[5] || "unsure",
        noteLabel: parts[6] || "",
      };
    } catch (e) {
      return null;
    }
  }

  function readInputs() {
    return {
      caDealerUsed: $("caDealerUsed").value || "",
      priceOk: $("priceOk").value || "",
      purchaseMode: $("purchaseMode").value || "pre",
      contractDate: ($("contractDate").value || "").trim(),
      viewDate: ($("viewDate").value || "").trim(),
      milesOver400: $("milesOver400").value || "unsure",
      noteLabel: ($("noteLabel").value || "").trim(),
    };
  }

  function applyInputs(p) {
    $("caDealerUsed").value = p.caDealerUsed || "";
    $("priceOk").value = p.priceOk || "";
    $("purchaseMode").value = p.purchaseMode || "pre";
    $("contractDate").value = p.contractDate || "";
    $("viewDate").value = p.viewDate || "";
    $("milesOver400").value = p.milesOver400 || "unsure";
    $("noteLabel").value = p.noteLabel || "";
    syncContractField();
  }

  function syncContractField() {
    const dateMode = $("purchaseMode").value === "date";
    $("contractDate").disabled = !dateMode;
    const wrap = $("contractDateWrap");
    if (wrap) wrap.classList.toggle("dimmed", !dateMode);
  }

  function renderChips() {
    const box = $("seedChips");
    box.innerHTML = "";
    SEEDS.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seed-chip";
      btn.setAttribute("role", "listitem");
      btn.innerHTML =
        s.label + '<span class="chip-sub">' + s.sub + "</span>";
      btn.addEventListener("click", () => {
        applyInputs(s);
        $("status").textContent = "Loaded seed: " + s.label;
        renderCard();
      });
      box.appendChild(btn);
    });
  }

  function renderSources() {
    $("sourceLinks").innerHTML =
      'Cites: <a href="' +
      LEGINFO +
      '" target="_blank" rel="noopener noreferrer">Civ. Code §1784.43 (leginfo)</a>' +
      '<a href="' +
      CARPRO +
      '" target="_blank" rel="noopener noreferrer">CarPro Aug 11 2026</a>' +
      '<a href="' +
      NCLC +
      '" target="_blank" rel="noopener noreferrer">NCLC 2026 consumer law changes (SB 766)</a>';
  }

  function renderCard() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("cardSection").hidden = true;
      $("status").textContent = err;
      return;
    }

    const c = compute(input);
    $("cardSection").hidden = false;
    $("shareBox").hidden = false;
    $("status").textContent = "Card ready — copy, share, or export PNG.";

    const metaBits = [];
    if (c.caDealerUsed === "yes") metaBits.push("CA dealer used");
    else metaBits.push("Not CA dealer used");
    if (c.priceOk === "yes") metaBits.push("≤$50k");
    else metaBits.push(">$50k");
    if (c.purchaseMode === "pre") metaBits.push("Pre–Oct 1 / not yet purchased");
    else if (c.contractDate) metaBits.push("Contract " + fmtDate(c.contractDate));
    if (input.noteLabel) metaBits.push(input.noteLabel);
    $("cardMeta").textContent = metaBits.join(" · ");

    $("dlHeadline").textContent = c.clock.headline;
    $("statusPill").textContent = c.clock.pill;
    $("statusPill").className = "verdict-k " + c.clock.cls;
    $("statusSub").textContent = c.clock.sub;

    $("viewDateDisp").textContent = fmtDate(c.viewDate);
    $("daysDisp").textContent = c.clock.daysLabel;
    $("deadlineLine").textContent = c.window
      ? "Cancel window: " +
        fmtDate(c.window.start) +
        " → " +
        fmtDate(c.window.end)
      : c.phase === "not_yet_in_force"
        ? "Operative " + OPERATIVE_LABEL
        : "No cancel window for this paste";

    $("daysRingDisp").textContent = c.clock.ringLabel;
    $("daysRing").style.setProperty("--pct", String(c.pct));
    $("windowLine").textContent =
      c.phase === "not_yet_in_force" && c.operativeLeft != null && c.operativeLeft > 0
        ? c.operativeLeft + "d until Oct 1"
        : c.phase === "inside" || c.phase === "before_window"
          ? "3-day window"
          : c.clock.daysLabel;

    $("actionFlag").textContent = c.clock.flag;
    $("actionFlag").className =
      "look-enroll-flag" +
      (c.phase.indexOf("not_eligible") === 0 || c.phase === "past"
        ? " warn"
        : "");

    $("windowChipStrip").textContent = c.windowChip;
    $("restockStrip").textContent = c.restocking;
    $("milesStrip").textContent = c.milesLiteracy;

    $("rDealer").textContent =
      c.caDealerUsed === "yes" ? "CA dealer used" : "No / out of scope";
    $("rPrice").textContent = c.priceOk === "yes" ? "≤ $50,000" : "> $50,000";
    $("rWindow").textContent = c.window
      ? fmtDate(c.window.start) + " → " + fmtDate(c.window.end)
      : c.phase === "not_yet_in_force"
        ? "Not yet in force"
        : "—";
    $("rView").textContent = fmtDate(c.viewDate);

    $("decoderLine").textContent = c.decoder;
    $("actionLine").textContent = c.action;
    $("citeLine").textContent = CITE_ONE_LINER;

    const hash = encodeHash(input);
    if (location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
    $("shareUrl").value = location.href.split("#")[0] + hash;
  }

  function clearAll() {
    $("caDealerUsed").value = "";
    $("priceOk").value = "";
    $("purchaseMode").value = "pre";
    $("contractDate").value = "";
    $("viewDate").value = todayISO();
    $("milesOver400").value = "unsure";
    $("noteLabel").value = "";
    syncContractField();
    $("cardSection").hidden = true;
    $("shareBox").hidden = true;
    $("status").textContent = "Cleared.";
    history.replaceState(null, "", location.pathname + location.search);
  }

  function summaryText() {
    const input = readInputs();
    const err = validate(input);
    if (err) return err;
    const c = compute(input);
    return [
      "CA CARS 3-Day Cancel Clock",
      "Status: " + c.clock.pill,
      c.clock.sub,
      c.window
        ? "Window: " + fmtDate(c.window.start) + " → " + fmtDate(c.window.end)
        : "Operative: " + OPERATIVE_LABEL,
      "View: " + fmtDate(c.viewDate),
      c.windowChip,
      "≤400 miles / restocking literacy — never invent this buyer’s restocking $",
      "Pointer: Civ. Code §1784.43 + dealer 3-Day Right to Cancel disclosure",
      DISCLAIMER_SHORT,
    ].join("\n");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText());
      $("status").textContent = "Summary copied.";
    } catch (e) {
      $("status").textContent = "Copy failed — select share URL instead.";
    }
  }

  async function shareLink() {
    const url = $("shareUrl").value || location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "CA CARS 3-Day Cancel Clock",
          text: "Paste your contract date — still inside the 3-day window?",
          url: url,
        });
        $("status").textContent = "Share sheet opened.";
      } else {
        await navigator.clipboard.writeText(url);
        $("status").textContent = "Share link copied.";
      }
    } catch (e) {
      $("status").textContent = "Share cancelled or unavailable.";
    }
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText($("shareUrl").value);
      $("status").textContent = "Share URL copied.";
    } catch (e) {
      $("status").textContent = "Copy failed.";
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    let yy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, yy);
        line = words[i];
        yy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, yy);
      yy += lineHeight;
    }
    return yy;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function exportPng() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("status").textContent = err;
      return;
    }
    const c = compute(input);
    const canvas = $("pngCanvas");
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, W, H);

    // Accent bar
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#f0b429");
    grad.addColorStop(0.5, "#7eb8e8");
    grad.addColorStop(1, "#3ecf8e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 8);

    ctx.fillStyle = "#e8eef4";
    ctx.font = "600 22px IBM Plex Sans, system-ui, sans-serif";
    ctx.fillText("CA CARS 3-Day Cancel Clock", 48, 56);

    ctx.fillStyle = "#8b9aab";
    ctx.font = "400 16px IBM Plex Sans, system-ui, sans-serif";
    ctx.fillText(
      (c.caDealerUsed === "yes" ? "CA dealer used" : "Not CA dealer used") +
        " · " +
        (c.priceOk === "yes" ? "≤$50k" : ">$50k") +
        " · view " +
        fmtDate(c.viewDate),
      48,
      84
    );

    // Giant status (text-primary)
    roundRect(ctx, 48, 110, W - 96, 120, 16);
    ctx.fillStyle = "#121820";
    ctx.fill();
    ctx.strokeStyle = "#2e3a48";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e8eef4";
    ctx.font = "700 36px IBM Plex Sans, system-ui, sans-serif";
    wrapText(ctx, c.clock.pill, 72, 160, W - 144, 42);

    ctx.fillStyle = "#8b9aab";
    ctx.font = "400 18px IBM Plex Sans, system-ui, sans-serif";
    wrapText(ctx, c.clock.sub, 72, 210, W - 144, 24);

    let y = 270;
    ctx.fillStyle = "#7eb8e8";
    ctx.font = "600 15px IBM Plex Sans, system-ui, sans-serif";
    ctx.fillText("3-day window chip", 48, y);
    y += 8;
    ctx.fillStyle = "#e8eef4";
    ctx.font = "400 16px IBM Plex Sans, system-ui, sans-serif";
    y = wrapText(ctx, c.windowChip, 48, y + 20, W - 96, 22);

    y += 16;
    ctx.fillStyle = "#f0b429";
    ctx.font = "600 15px IBM Plex Sans, system-ui, sans-serif";
    ctx.fillText("≤400 miles / restocking literacy", 48, y);
    y += 8;
    ctx.fillStyle = "#e8eef4";
    ctx.font = "400 16px IBM Plex Sans, system-ui, sans-serif";
    y = wrapText(ctx, RESTOCKING_LITERACY, 48, y + 20, W - 96, 22);

    if (c.phase === "not_yet_in_force" && c.operativeLeft != null) {
      y += 16;
      ctx.fillStyle = "#3ecf8e";
      ctx.font = "600 18px IBM Plex Sans, system-ui, sans-serif";
      ctx.fillText(
        "Oct 1 2026 operative · " +
          (c.operativeLeft > 0
            ? c.operativeLeft + " days until"
            : c.operativeLeft === 0
              ? "today"
              : "passed"),
        48,
        y
      );
    }

    if (c.window) {
      y += 28;
      ctx.fillStyle = "#e8eef4";
      ctx.font = "600 18px IBM Plex Mono, ui-monospace, monospace";
      ctx.fillText(
        "Window " + fmtDate(c.window.start) + " → " + fmtDate(c.window.end),
        48,
        y
      );
    }

    y += 36;
    ctx.fillStyle = "#8b9aab";
    ctx.font = "400 14px IBM Plex Sans, system-ui, sans-serif";
    y = wrapText(
      ctx,
      "Pointer: Civil Code §1784.43 + dealer 3-Day Right to Cancel disclosure · CarPro Aug 11 2026 · NCLC SB 766",
      48,
      y,
      W - 96,
      20
    );

    y += 24;
    ctx.fillStyle = "#f07178";
    ctx.font = "600 14px IBM Plex Sans, system-ui, sans-serif";
    y = wrapText(ctx, DISCLAIMER_SHORT, 48, y, W - 96, 20);

    ctx.fillStyle = "#8b9aab";
    ctx.font = "400 12px IBM Plex Sans, system-ui, sans-serif";
    ctx.fillText("User-pasted dates only · no VIN/DMS scrape", 48, H - 36);

    canvas.toBlob(function (blob) {
      if (!blob) {
        $("status").textContent = "PNG export failed.";
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download =
        "ca-cars-3day-cancel-" +
        (c.phase || "status") +
        "-" +
        (input.viewDate || "view") +
        ".png";
      a.click();
      URL.revokeObjectURL(a.href);
      $("status").textContent = "PNG downloaded.";
    });
  }

  function bind() {
    if (!$("viewDate").value) $("viewDate").value = todayISO();
    syncContractField();
    renderChips();
    renderSources();

    $("purchaseMode").addEventListener("change", syncContractField);
    $("cardBtn").addEventListener("click", renderCard);
    $("clearBtn").addEventListener("click", clearAll);
    $("copySummary").addEventListener("click", copySummary);
    $("shareBtn").addEventListener("click", shareLink);
    $("copyShare").addEventListener("click", copyShare);
    $("pngBtn").addEventListener("click", exportPng);

    window.addEventListener("hashchange", () => {
      const p = decodeHash();
      if (p) {
        applyInputs(p);
        renderCard();
      }
    });

    const fromHash = decodeHash();
    if (fromHash) {
      applyInputs(fromHash);
      renderCard();
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bind);
    } else {
      bind();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      SEEDS: SEEDS,
      OPERATIVE_ISO: OPERATIVE_ISO,
      OPERATIVE_LABEL: OPERATIVE_LABEL,
      CANCEL_DAYS: CANCEL_DAYS,
      MILE_CAP: MILE_CAP,
      PRICE_CAP: PRICE_CAP,
      parseISODate: parseISODate,
      addDays: addDays,
      daysBetween: daysBetween,
      operativeDaysLeft: operativeDaysLeft,
      cancelWindow: cancelWindow,
      clockMeta: clockMeta,
      validate: validate,
      compute: compute,
      fmtDate: fmtDate,
      DISCLAIMER_SHORT: DISCLAIMER_SHORT,
      CITE_ONE_LINER: CITE_ONE_LINER,
      WINDOW_CHIP: WINDOW_CHIP,
      buildWindowChip: buildWindowChip,
      RESTOCKING_LITERACY: RESTOCKING_LITERACY,
    };
  }
})();
