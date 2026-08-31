"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- Stage definitions ---------------- */
const STAGES = {
  msc: [
    "Concept Presentation",
    "Proposal Seminar",
    "Submitted for Proposal Defence",
    "Proposal Defence",
    "Thesis Seminar",
    "Intent to Defend",
    "Thesis Defence",
  ],
  phd: [
    "Concept Presentation",
    "Proposal Seminar I",
    "Proposal Seminar II",
    "Submitted for Proposal Defence",
    "Proposal Defence",
    "Thesis Seminar I",
    "Thesis Seminar II",
    "Intent to Defend",
    "Thesis Defence",
  ],
};
const STAGE_SHORT = {
  msc: ["Concept", "Prop. Seminar", "Submitted", "Prop. Defence", "Thesis Sem.", "Intent", "Thesis Defence"],
  phd: [
    "Concept",
    "Prop. Sem. I",
    "Prop. Sem. II",
    "Submitted",
    "Prop. Defence",
    "Thesis Sem. I",
    "Thesis Sem. II",
    "Intent",
    "Thesis Defence",
  ],
};
const REQUIRED_PUBS = { msc: 1, phd: 2 };
const TARGET_YEAR = { msc: 2027, phd: 2028 };
const PROGRAM_QUOTE = {
  msc: "If your dreams don't scare you, they aren't big enough.",
  phd: "Do not stop until you are proud.",
};
const RESEARCH_LABEL = { msc: "Masters", phd: "PhD" };

/* ---------------- Roster data (from the department sheet) ---------------- */
/* progress: number of leading stages completed. 0 = not started (no consent yet). */
const DATA = {
  msc: [
    { name: "John William Muga", topic: "An edge-native multilingual neural machine translation model for Swahili, Luo and Kalenjin", supervisors: "Dr. Lilian Wanzare & Prof. Silvester McOyowo", area: "MT", progress: 1, pubs: 0 },
    { name: "Boniface Mwau", topic: "A linguistically-informed cross-lingual neural text-to-speech model for agricultural advisory in Kikuyu using Swahili transfer learning", supervisors: "Dr. Lilian Wanzare & Dr. Vivian Oloo", area: "TTS", progress: 1, pubs: 0 },
    { name: "Joel Otachi", topic: "A comparative evaluation approach for sentiment analysis in low-resource African languages: case studies of Swahili and Kalenjin", supervisors: "Dr. Lilian Wanzare & Dr. James Obuhuma", area: "Sentiment", progress: 1, pubs: 0 },
    { name: "Stanley Oduor", topic: "A cross-lingual transformer-based text-to-speech system with learned prosody conditioning for Dholuo text-to-Swahili speech synthesis", supervisors: "Dr. Vivian Oloo & Dr. Calvins Otieno", area: "TTS", progress: 1, pubs: 0 },
    { name: "Hope Kerubo", topic: "LinguaID: a text based Language Identification model for Kenyan languages", supervisors: "Dr. Lilian Wanzare & Dr. Samuel Oonge", area: "LID", progress: 0, pubs: 0 },
    { name: "Judith Odera", topic: "Token-level language identification for English–Swahili–Luo code-switching", supervisors: "Dr. Lilian Wanzare & Dr. James Obuhuma", area: "LID", progress: 1, pubs: 0 },
    { name: "Valary Joyce", topic: "A deep learning model for Swahili–Dholuo speech transcription with edge-cloud cascading for East African infrastructure constraints", supervisors: "Dr. Vivian Oloo & Dr. Calvins Otieno", area: "ASR", progress: 1, pubs: 0 },
    { name: "Biatus Kamau", topic: "Glossary-constrained byte-level neural machine translation for low-resource languages: a case study on Kikuyu", supervisors: "Dr. Lilian Wanzare & Dr. Calvins Otieno", area: "MT", progress: 1, pubs: 0 },
    { name: "Martin Okech", topic: "Analysing the impact of speech style and utterance duration on wav2vec2-based ASR and language identification for low-resource Kenyan languages", supervisors: "—", area: "ASR", progress: 1, pubs: 0 },
    { name: "Teresa Peter", topic: "A Continuous Sign Language Recognition Model for Kenyan Sign Language", supervisors: "Dr. Lilian Wanzare & Dr. Vivian Oloo", area: "Sign Language", progress: 0, pubs: 0 },
  ],
  phd: [
    { name: "Cynthia Amol", topic: "Typologically-informed automatic speech recognition for low-resource Nilotic languages: Dholuo, Kalenjin and Maasai", supervisors: "Dr. Lilian Wanzare & Dr. James Obuhuma", area: "ASR", progress: 0, pubs: 0 },
    { name: "Ezekiel Maina", topic: "A multimodal neural signing model for Kenyan Sign Language", supervisors: "Dr. Lilian Wanzare & Dr. James Obuhuma", area: "Sign Language", progress: 1, pubs: 0 },
    { name: "Edwin Onkoba", topic: "Retrieval-grounded LLM strategies for Nilotic synthetic text generation", supervisors: "Dr. Lilian Wanzare & Dr. Calvins Otieno", area: "Synthetic Data", progress: 1, pubs: 0 },
    { name: "Nelson Odhiambo", topic: "Machine translation for Kenyan languages (title to be confirmed)", supervisors: "Dr. Lilian Wanzare & Dr. James Obuhuma", area: "MT", progress: 0, pubs: 0 },
  ],
};

/* ---------------- Publications ----------------
   Add rows here as they come in: { author, title, link, research: "msc" | "phd" } */
const PUBLICATIONS = [];

/* ---------------- Helpers ---------------- */
function stagesArray(program, progress) {
  return Array.from({ length: STAGES[program].length }, (_, i) => i < progress);
}
function statusInfo(doneCount, total) {
  if (doneCount === 0) return { text: "Not started", cls: "status-not" };
  if (doneCount === total) return { text: "Complete", cls: "status-complete" };
  return { text: "In progress", cls: "status-progress" };
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5.2L3.8 7.5L8.5 2.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export default function Page() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("grid"); // grid | dump | publications
  const [program, setProgram] = useState("msc"); // msc | phd
  const [areaFilter, setAreaFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [pubSearch, setPubSearch] = useState("");
  const [pubFilter, setPubFilter] = useState("all"); // all | msc | phd

  useEffect(() => {
    const saved = localStorage.getItem("mcaai-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mcaai-theme", theme);
  }, [theme]);

  const stages = STAGES[program];
  const shortStages = STAGE_SHORT[program];
  const areas = useMemo(() => [...new Set(DATA[program].map((d) => d.area))], [program]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DATA[program]
      .map((d, idx) => ({ d, idx }))
      .filter(({ d }) => {
        if (areaFilter && d.area !== areaFilter) return false;
        if (!q) return true;
        return d.name.toLowerCase().includes(q) || d.topic.toLowerCase().includes(q);
      });
  }, [program, areaFilter, search]);

  const meta = useMemo(() => {
    let started = 0, doneTicks = 0, totalTicks = 0;
    DATA[program].forEach((d) => {
      const doneCount = Math.min(d.progress, stages.length);
      if (doneCount > 0) started++;
      doneTicks += doneCount;
      totalTicks += stages.length;
    });
    const pct = totalTicks ? Math.round((doneTicks / totalTicks) * 100) : 0;
    return { count: DATA[program].length, started, pct };
  }, [program, stages.length]);

  const pubRows = useMemo(() => {
    const q = pubSearch.trim().toLowerCase();
    return PUBLICATIONS.filter((p) => {
      if (pubFilter !== "all" && p.research !== pubFilter) return false;
      if (!q) return true;
      return p.author.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
    });
  }, [pubSearch, pubFilter]);

  function switchProgram(next) {
    setProgram(next);
    setAreaFilter(null);
    setSearch("");
  }

  return (
    <>
      <header className="masthead">
        <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>

        <div className="masthead-eyebrow">
          <span className="dot"></span>Maseno Centre for Applied Artificial Intelligence
        </div>
        <h1 className="title">
          Postgraduate
          <br />
          Student Progress
        </h1>
        <p className="masthead-sub">
          A running record of milestone seminars, defences and required publications for MCAAI&apos;s Masters and PhD
          cohorts.
        </p>

        <div className="switcher-row">
          <div className="view-switcher">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
              Grid
            </button>
            <button className={view === "dump" ? "active" : ""} onClick={() => setView("dump")}>
              Dump
            </button>
            <button className={view === "publications" ? "active" : ""} onClick={() => setView("publications")}>
              Publications
            </button>
          </div>

          {view !== "publications" && (
            <div className="cohort-meta">
              <div className="meta-item">
                <span className="meta-num">{meta.count}</span>
                <span className="meta-label">students</span>
              </div>
              <div className="meta-item">
                <span className="meta-num">{meta.started}</span>
                <span className="meta-label">seminars underway</span>
              </div>
              <div className="meta-item">
                <span className="meta-num">{meta.pct}%</span>
                <span className="meta-label">cohort progress</span>
              </div>
              <div className="meta-item">
                <span className="meta-num">{TARGET_YEAR[program]}</span>
                <span className="meta-label">expected graduation</span>
              </div>
            </div>
          )}
        </div>

        {view !== "publications" && <p className="program-quote">{PROGRAM_QUOTE[program]}</p>}
      </header>

      {view !== "publications" && (
        <div className="controls">
          <div className="program-switcher">
            <button className={program === "msc" ? "active" : ""} onClick={() => switchProgram("msc")}>
              Masters
            </button>
            <button className={program === "phd" ? "active" : ""} onClick={() => switchProgram("phd")}>
              PhD
            </button>
          </div>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search by name or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="area-filters">
            {areas.map((a) => (
              <button
                key={a}
                className={`chip ${areaFilter === a ? "active" : ""}`}
                onClick={() => setAreaFilter(areaFilter === a ? null : a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "publications" && (
        <div className="controls">
          <div className="program-switcher">
            <button className={pubFilter === "all" ? "active" : ""} onClick={() => setPubFilter("all")}>
              All
            </button>
            <button className={pubFilter === "msc" ? "active" : ""} onClick={() => setPubFilter("msc")}>
              Masters
            </button>
            <button className={pubFilter === "phd" ? "active" : ""} onClick={() => setPubFilter("phd")}>
              PhD
            </button>
          </div>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search by author or paper title…"
              value={pubSearch}
              onChange={(e) => setPubSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <main>
        {view === "grid" && (
          <section className="view">
            <p className="target-note">
              {program === "msc" ? "Masters" : "PhD"} candidates are expected to graduate in{" "}
              <b>{TARGET_YEAR[program]}</b> and must publish <b>{REQUIRED_PUBS[program]}</b> peer-reviewed paper
              {REQUIRED_PUBS[program] > 1 ? "s" : ""}. A blank row means the student has not yet started seminars —
              not even consent.
            </p>

            {rows.length === 0 ? (
              <div className="empty-state">No students match this filter.</div>
            ) : (
              <div className="grid-scroll">
                <table className="grid">
                  <thead>
                    <tr>
                      <th className="col-student">Student</th>
                      <th className="col-topic">Topic</th>
                      <th>Supervisors</th>
                      <th>Area</th>
                      <th className="col-status">Status</th>
                      {shortStages.map((label, si) => (
                        <th key={si} className="stage-col" title={stages[si]}>
                          {label}
                        </th>
                      ))}
                      <th className="col-pubs">Publications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ d }) => {
                      const stageState = stagesArray(program, d.progress);
                      const doneCount = stageState.filter(Boolean).length;
                      const status = statusInfo(doneCount, stages.length);
                      return (
                        <tr key={d.name}>
                          <td className="col-student">{d.name}</td>
                          <td className="col-topic" title={d.topic}>
                            {d.topic}
                          </td>
                          <td className="col-supervisors" title={d.supervisors}>
                            {d.supervisors}
                          </td>
                          <td className="col-area">
                            <span className="area-badge">{d.area}</span>
                          </td>
                          <td className={`col-status ${status.cls}`}>{status.text}</td>
                          {stageState.map((done, si) => (
                            <td key={si}>
                              <div className={`cell-check ${done ? "done" : ""}`}>
                                <CheckIcon />
                              </div>
                            </td>
                          ))}
                          <td className="col-pubs">
                            <div className="pubs-cell">
                              {Array.from({ length: REQUIRED_PUBS[program] }, (_, pi) => (
                                <div
                                  key={pi}
                                  className={`pub-dot ${pi < d.pubs ? "done" : ""}`}
                                  title={`Peer-reviewed publication ${pi + 1}`}
                                ></div>
                              ))}
                              <span className="pubs-count">
                                {Math.min(d.pubs, REQUIRED_PUBS[program])}/{REQUIRED_PUBS[program]}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {view === "dump" &&
          (rows.length === 0 ? (
            <div className="empty-state">No students match this filter.</div>
          ) : (
            <section className="view">
              {rows.map(({ d }) => {
                const stageState = stagesArray(program, d.progress);
                const doneCount = stageState.filter(Boolean).length;
                const notStarted = doneCount === 0;
                return (
                  <article className="card" key={d.name}>
                    <div className="card-id">
                      <div className="card-name">{d.name}</div>
                      <div className="card-topic">{d.topic}</div>
                      <div className="card-tags">
                        <span className="tag area">{d.area}</span>
                      </div>
                      <div className="supervisors">Supervised by {d.supervisors}</div>
                      <div className="target-year">
                        Expected to graduate <b>{TARGET_YEAR[program]}</b>
                      </div>
                    </div>
                    <div className="ladder-wrap">
                      <div className="ladder-top">
                        <div className="ladder-status">
                          {!notStarted && (
                            <>
                              <b>{doneCount}</b> of {stages.length} stages complete
                            </>
                          )}
                        </div>
                        {notStarted && <span className="not-started">Not yet started — no consent given</span>}
                      </div>
                      <div className="ladder">
                        {stages.map((label, si) => {
                          const done = stageState[si];
                          const lineFilled = si > 0 && stageState[si - 1] && done;
                          return (
                            <div className={`stage ${done ? "done" : ""}`} key={si}>
                              <div className={`stage-line ${lineFilled ? "filled" : ""}`}></div>
                              <div className="stage-dot">
                                <CheckIcon />
                              </div>
                              <div className="stage-label">{label}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pubs-row">
                        <span className="pubs-label">Peer-reviewed publications</span>
                        {Array.from({ length: REQUIRED_PUBS[program] }, (_, pi) => (
                          <div
                            key={pi}
                            className={`pub-dot ${pi < d.pubs ? "done" : ""}`}
                            title={`Peer-reviewed publication ${pi + 1}`}
                          ></div>
                        ))}
                        <span className="pubs-count">
                          {Math.min(d.pubs, REQUIRED_PUBS[program])}/{REQUIRED_PUBS[program]} required
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ))}

        {view === "publications" && (
          <section className="view">
            <table className="pubs-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Paper Title</th>
                  <th>Link</th>
                  <th className="col-research">Research</th>
                </tr>
              </thead>
              <tbody>
                {pubRows.length === 0 ? (
                  <tr className="pub-empty-row">
                    <td colSpan={4}>No publications yet</td>
                  </tr>
                ) : (
                  pubRows.map((p, i) => (
                    <tr key={i}>
                      <td className="pub-author">{p.author}</td>
                      <td className="pub-title">{p.title}</td>
                      <td className="pub-link">
                        {p.link ? (
                          <a href={p.link} target="_blank" rel="noopener noreferrer">
                            View paper
                          </a>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="pub-research">{RESEARCH_LABEL[p.research]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}
      </main>

      <footer>
        <span>Progress is updated by MCAAI directly in the source file — this page is view-only.</span>
        <span>MCAAI · updated by hand from the School tracking sheet</span>
      </footer>
    </>
  );
}
