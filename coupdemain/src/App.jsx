import React, { useState, useMemo } from "react";
import {
  MapPin, Star, Send, ShieldCheck, CreditCard,
  Dog, Sprout, Laptop2, ShoppingBag, ChevronLeft, Check, ArrowRight, Baby,
  Brush, Package, BookOpen, Car, Hammer, Baby as BabySit, PawPrint, Paintbrush,
  Snowflake, Sparkles
} from "lucide-react";

const CATEGORIES = [
  { id: "jardin", label: "Jardinage", icon: Sprout, hue: "#3D5AFE" },
  { id: "animaux", label: "Garde d'animaux", icon: Dog, hue: "#00A876" },
  { id: "info", label: "Aide informatique", icon: Laptop2, hue: "#E8590C" },
  { id: "courses", label: "Courses", icon: ShoppingBag, hue: "#C2255C" },
  { id: "menage", label: "Ménage", icon: Brush, hue: "#7048E8" },
  { id: "demenagement", label: "Déménagement léger", icon: Package, hue: "#845EF7" },
  { id: "cours", label: "Cours particuliers", icon: BookOpen, hue: "#1971C2" },
  { id: "voiture", label: "Lavage de voiture", icon: Car, hue: "#0C8599" },
  { id: "bricolage", label: "Petit bricolage", icon: Hammer, hue: "#D9480F" },
  { id: "babysitting", label: "Baby-sitting", icon: BabySit, hue: "#F08C00" },
  { id: "promenade", label: "Balade compagnie", icon: PawPrint, hue: "#2F9E44" },
  { id: "peinture", label: "Peinture, déco", icon: Paintbrush, hue: "#AE3EC9" },
  { id: "hiver", label: "Déneigement", icon: Snowflake, hue: "#4263EB" },
  { id: "autre", label: "Autre", icon: Sparkles, hue: "#5C5C54" },
];

const PROFILES = [
  { id: 1, name: "Lucas M.", age: 17, city: "Nyon", distance: 1.2, rating: 4.9, reviews: 14, verified: true,
    skills: [
      { cat: "jardin", rate: 18, note: "Tonte, taille de haies, entretien de potager" },
      { cat: "animaux", rate: 15, note: "Promenade de chiens, 2 ans d'expérience" },
    ],
    bio: "Motivé, ponctuel, j'ai mon propre matériel de jardinage.",
    reviewList: [
      { author: "Mme Fontaine", rating: 5, comment: "Très sérieux, jardin impeccable." },
      { author: "M. Berger", rating: 5, comment: "A promené mon chien deux fois par semaine tout l'été." },
    ]},
  { id: 2, name: "Emma R.", age: 16, city: "Nyon", distance: 2.4, rating: 4.7, reviews: 9, verified: true,
    skills: [
      { cat: "info", rate: 12, note: "Aide smartphone, tablette, WiFi, mails" },
      { cat: "courses", rate: 10, note: "Courses au village, livraison à pied ou vélo" },
    ],
    bio: "Patiente, j'aide surtout les personnes âgées avec leurs appareils.",
    reviewList: [{ author: "Mme Delacroix", rating: 5, comment: "Elle m'a enfin appris à faire des appels vidéo !" }]},
  { id: 3, name: "Noah T.", age: 15, city: "Gland", distance: 6.1, rating: 4.5, reviews: 5, verified: false,
    skills: [{ cat: "jardin", rate: 15, note: "Tonte de pelouse, ramassage de feuilles" }],
    bio: "Débutant motivé, dispo les mercredis et week-ends.",
    reviewList: [{ author: "Famille Roux", rating: 4, comment: "Bon travail, un peu en retard une fois." }]},
  { id: 4, name: "Zoé K.", age: 17, city: "Nyon", distance: 0.8, rating: 5.0, reviews: 21, verified: true,
    skills: [
      { cat: "animaux", rate: 16, note: "Garde de chats et chiens, weekends compris" },
      { cat: "jardin", rate: 17, note: "Arrosage, désherbage" },
    ],
    bio: "3 ans d'expérience, référencée par plusieurs familles du quartier.",
    reviewList: [
      { author: "M. Vuille", rating: 5, comment: "La meilleure ! Toujours à l'heure." },
      { author: "Mme Suter", rating: 5, comment: "Mes chats l'adorent." },
    ]},
];

const COMMISSION_RATE = 0.10;
const INK = "#12131A";
const LINE = "#E4E4E0";
const PAPER = "#FAFAF8";

function catOf(id) { return CATEGORIES.find((c) => c.id === id); }

function StarRow({ value }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <Star size={13} fill="#12131A" color="#12131A" />
      <span style={{ fontWeight: 700 }}>{value.toFixed(1)}</span>
    </span>
  );
}

export default function App() {
  const [role, setRole] = useState("client");
  const [activeCat, setActiveCat] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState("browse");
  const [chosenSkill, setChosenSkill] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [customSent, setCustomSent] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PROFILES];
    if (activeCat) list = list.filter((p) => p.skills.some((s) => s.cat === activeCat));
    if (sortBy === "distance") list.sort((a, b) => a.distance - b.distance);
    if (sortBy === "note") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "prix") list.sort((a, b) => Math.min(...a.skills.map(s=>s.rate)) - Math.min(...b.skills.map(s=>s.rate)));
    return list;
  }, [activeCat, sortBy]);

  function openProfile(p) { setSelected(p); setStage("detail"); setChosenSkill(p.skills[0]); setMessages([]); }
  function startBooking(skill) { setChosenSkill(skill); setStage("booking"); }
  function confirmBooking() { setStage("pay"); }
  function pay() {
    setStage("done");
    setMessages([{ from: "them", text: `Salut ! Merci pour la réservation, je peux venir ${["demain", "ce week-end", "mercredi"][selected.id % 3]}, ça te va ?` }]);
  }
  function sendMessage() {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "me", text: draft }]);
    setDraft("");
  }

  const price = chosenSkill ? chosenSkill.rate * 2 : 0;
  const commission = +(price * COMMISSION_RATE).toFixed(2);
  const payout = +(price - commission).toFixed(2);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: PAPER, minHeight: "100%", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .disp { font-family:'Archivo', system-ui, sans-serif; letter-spacing:-0.01em; }
        button { cursor:pointer; font-family:inherit; }
        input, textarea { font-family:inherit; }
        ::-webkit-scrollbar { display:none; }
        .row:active { background:#F0F0EC; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 18px 0", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div className="disp" style={{ fontSize: 22, fontWeight: 800 }}>CoupDeMain</div>
          <div style={{ fontSize: 11, color: "#8A8A82" }}>Nyon &amp; environs</div>
        </div>
        <div style={{ display: "flex", marginTop: 16 }}>
          {[["client", "Trouver un service"], ["jeune", "Proposer mes services"]].map(([val, label]) => (
            <button key={val} onClick={() => { setRole(val); setStage("browse"); }}
              style={{
                flex: 1, padding: "11px 4px", background: "none", border: "none",
                borderBottom: role === val ? `2px solid ${INK}` : `2px solid transparent`,
                fontSize: 13, fontWeight: role === val ? 700 : 500, color: role === val ? INK : "#8A8A82",
              }}>{label}</button>
          ))}
        </div>
      </div>

      {role === "client" && stage === "browse" && (
        <div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto", borderBottom: `1px solid ${LINE}` }}>
            <button onClick={() => setActiveCat(null)} style={tabStyle(activeCat === null, INK)}>Tout</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={tabStyle(activeCat === c.id, c.hue)}>
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, padding: "10px 18px", fontSize: 11.5, color: "#8A8A82" }}>
            <span>Trier —</span>
            {[["distance", "Distance"], ["note", "Note"], ["prix", "Prix"]].map(([v, l]) => (
              <button key={v} onClick={() => setSortBy(v)} style={{
                border: "none", background: "none", padding: 0, color: sortBy === v ? INK : "#8A8A82",
                fontWeight: sortBy === v ? 700 : 500, fontSize: 11.5,
              }}>{l}</button>
            ))}
          </div>

          <div style={{ padding: "0 18px 14px" }}>
            <div style={{ border: `1px dashed ${LINE}`, borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>Un besoin qui ne rentre dans aucune case ?</div>
              <div style={{ fontSize: 11.5, color: "#8A8A82", marginBottom: 8 }}>Décris ton besoin, on le transmet aux jeunes disponibles près de chez toi.</div>
              {!customSent ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="Ex : aide pour installer une étagère..."
                    style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 4, padding: "9px 11px", fontSize: 12.5 }} />
                  <button onClick={() => customRequest.trim() && setCustomSent(true)}
                    style={{ background: INK, color: "#fff", border: "none", borderRadius: 4, padding: "0 14px", fontSize: 12, fontWeight: 700 }}>
                    Envoyer
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#00A876", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <Check size={14} /> Demande envoyée aux jeunes disponibles
                </div>
              )}
            </div>
          </div>

          <div>
            {filtered.map((p, i) => {
              const primaryCat = catOf(p.skills[0].cat);
              return (
                <div key={p.id} className="row" onClick={() => openProfile(p)} style={{
                  display: "flex", gap: 12, padding: "16px 18px",
                  borderTop: i === 0 ? "none" : `1px solid ${LINE}`, alignItems: "flex-start",
                }}>
                  <div style={{ width: 3, alignSelf: "stretch", background: primaryCat.hue, borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div className="disp" style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</div>
                      <StarRow value={p.rating} />
                    </div>
                    <div style={{ fontSize: 11.5, color: "#8A8A82", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <MapPin size={11} /> {p.city} · {p.distance} km · {p.reviews} avis
                      {p.verified && <ShieldCheck size={12} color="#00A876" style={{ marginLeft: 2 }} />}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {p.skills.map((s) => (
                        <span key={s.cat} style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 3,
                          background: catOf(s.cat).hue + "14", color: catOf(s.cat).hue,
                        }}>{catOf(s.cat).label} · {s.rate} CHF/h</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {role === "client" && stage === "detail" && selected && (
        <DetailPanel p={selected} onBack={() => setStage("browse")} onBook={startBooking} />
      )}
      {role === "client" && stage === "booking" && selected && chosenSkill && (
        <BookingPanel p={selected} skill={chosenSkill} price={price} commission={commission} payout={payout}
          onBack={() => setStage("detail")} onConfirm={confirmBooking} />
      )}
      {role === "client" && stage === "pay" && (
        <PayPanel price={price} onBack={() => setStage("booking")} onPay={pay} />
      )}
      {role === "client" && stage === "done" && selected && (
        <ChatPanel p={selected} messages={messages} draft={draft} setDraft={setDraft} onSend={sendMessage}
          onBack={() => setStage("browse")} />
      )}
      {role === "jeune" && <JeuneProfile signupAge={signupAge} setSignupAge={setSignupAge} />}
    </div>
  );
}

function tabStyle(active, hue) {
  return {
    padding: "11px 14px", background: "none", border: "none", whiteSpace: "nowrap",
    fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? INK : "#8A8A82",
    borderBottom: active ? `2px solid ${hue}` : "2px solid transparent", marginBottom: -1,
  };
}

function PanelShell({ onBack, title, children }) {
  return (
    <div style={{ padding: "16px 18px 32px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", fontSize: 12, fontWeight: 600, color: "#8A8A82", padding: 0, marginBottom: 14 }}>
        <ChevronLeft size={15} /> Retour
      </button>
      <div className="disp" style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function DetailPanel({ p, onBack, onBook }) {
  return (
    <PanelShell onBack={onBack} title={p.name}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <StarRow value={p.rating} />
        <span style={{ fontSize: 12, color: "#8A8A82" }}>{p.reviews} avis · {p.city}, {p.distance} km</span>
      </div>
      {p.verified && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#00A876", fontWeight: 600, marginTop: 6 }}>
          <ShieldCheck size={14} /> Identité vérifiée
        </div>
      )}
      <p style={{ fontSize: 13.5, marginTop: 12, lineHeight: 1.55, borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>{p.bio}</p>

      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A8A82", marginTop: 18, marginBottom: 4 }}>Services proposés</div>
      {p.skills.map((s, i) => (
        <div key={s.cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i === 0 ? `1px solid ${LINE}` : `1px solid ${LINE}` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: catOf(s.cat).hue }}>{catOf(s.cat).label}</div>
            <div style={{ fontSize: 11.5, color: "#8A8A82", marginTop: 1 }}>{s.note}</div>
          </div>
          <button onClick={() => onBook(s)} style={{ border: `1.5px solid ${INK}`, background: "#fff", fontSize: 12, fontWeight: 700, padding: "8px 12px", borderRadius: 4, whiteSpace: "nowrap" }}>
            {s.rate} CHF/h
          </button>
        </div>
      ))}

      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A8A82", marginTop: 18, marginBottom: 4 }}>Avis</div>
      {p.reviewList.map((r, i) => (
        <div key={i} style={{ borderTop: `1px solid ${LINE}`, padding: "10px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600 }}>
            <span>{r.author}</span><StarRow value={r.rating} />
          </div>
          <div style={{ fontSize: 12.5, color: "#5C5C54", marginTop: 3 }}>{r.comment}</div>
        </div>
      ))}
    </PanelShell>
  );
}

function BookingPanel({ p, skill, price, commission, payout, onBack, onConfirm }) {
  return (
    <PanelShell onBack={onBack} title="Confirmer la demande">
      <div style={{ fontSize: 13.5, marginBottom: 14 }}>
        Service <b style={{ color: catOf(skill.cat).hue }}>{catOf(skill.cat).label}</b> avec <b>{p.name}</b>
      </div>
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 6, padding: "4px 14px" }}>
        <Row label="Forfait démo (2h)" value={`${price.toFixed(2)} CHF`} />
        <Row label="Commission plateforme (10%)" value={`- ${commission.toFixed(2)} CHF`} muted />
        <div style={{ borderTop: `1px solid ${LINE}` }} />
        <Row label={`Versé à ${p.name}`} value={`${payout.toFixed(2)} CHF`} bold />
      </div>
      <div style={{ fontSize: 11.5, color: "#8A8A82", marginTop: 12, display: "flex", gap: 6, lineHeight: 1.5 }}>
        <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        Le paiement passe par l'app : ça garantit une protection en cas de souci et un avis vérifié après le service.
      </div>
      <button onClick={onConfirm} style={{ width: "100%", marginTop: 18, background: INK, color: "#fff", border: "none", padding: "13px", borderRadius: 6, fontWeight: 700, fontSize: 13.5, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
        Continuer vers le paiement <ArrowRight size={15} />
      </button>
    </PanelShell>
  );
}

function Row({ label, value, muted, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, color: muted ? "#8A8A82" : INK, fontWeight: bold ? 800 : 500 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function PayPanel({ price, onBack, onPay }) {
  const [method, setMethod] = useState("twint");
  return (
    <PanelShell onBack={onBack} title="Paiement">
      <div style={{ fontSize: 13.5, marginBottom: 16, borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
        Total à payer — <b>{price.toFixed(2)} CHF</b>
      </div>
      {[["twint", "Twint"], ["card", "Carte bancaire"]].map(([v, l]) => (
        <button key={v} onClick={() => setMethod(v)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 9, textAlign: "left",
          border: `1.5px solid ${method === v ? INK : LINE}`, background: "#fff",
          borderRadius: 6, padding: "12px 13px", marginBottom: 8, fontSize: 13, fontWeight: 600,
        }}>
          <CreditCard size={16} /> {l} {method === v && <Check size={14} style={{ marginLeft: "auto" }} />}
        </button>
      ))}
      <button onClick={onPay} style={{ width: "100%", marginTop: 8, background: INK, color: "#fff", border: "none", padding: "13px", borderRadius: 6, fontWeight: 700, fontSize: 13.5 }}>
        Payer {price.toFixed(2)} CHF
      </button>
      <div style={{ fontSize: 10.5, color: "#8A8A82", marginTop: 10, textAlign: "center" }}>Paiement simulé — démo uniquement</div>
    </PanelShell>
  );
}

function ChatPanel({ p, messages, draft, setDraft, onSend, onBack }) {
  return (
    <PanelShell onBack={onBack} title={`Discussion — ${p.name}`}>
      <div style={{ fontSize: 12, color: "#00A876", fontWeight: 700, display: "flex", gap: 5, alignItems: "center", marginBottom: 14, borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
        <Check size={14} /> Réservation confirmée
      </div>
      <div style={{ minHeight: 100, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: "82%", marginLeft: m.from === "me" ? "auto" : 0, marginBottom: 8,
            background: m.from === "me" ? INK : "#F0F0EC", color: m.from === "me" ? "#fff" : INK,
            padding: "9px 12px", borderRadius: 4, fontSize: 12.5,
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Écrire un message..."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 4, padding: "10px 12px", fontSize: 12.5 }} />
        <button onClick={onSend} style={{ background: INK, border: "none", borderRadius: 4, width: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={14} color="#fff" />
        </button>
      </div>
    </PanelShell>
  );
}

function JeuneProfile({ signupAge, setSignupAge }) {
  const isMinor = signupAge !== "" && Number(signupAge) < 16;
  return (
    <PanelShell onBack={() => {}} title="Mon profil">
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A82" }}>Âge</label>
        <input type="number" value={signupAge} onChange={(e) => setSignupAge(e.target.value)}
          placeholder="Ex : 16" style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 4, padding: "10px 12px", fontSize: 13, marginTop: 5 }} />
      </div>

      {isMinor && (
        <div style={{ borderLeft: `3px solid #E8590C`, background: "#FFF4EC", borderRadius: 4, padding: "11px 13px", fontSize: 12.5, display: "flex", gap: 8, marginBottom: 14, lineHeight: 1.5 }}>
          <Baby size={16} style={{ flexShrink: 0, color: "#E8590C" }} />
          <div>Comme tu as moins de 16 ans, un parent doit valider ton inscription avant que ton profil soit visible. On lui envoie un lien de consentement par SMS.</div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A82" }}>Présentation</label>
        <textarea placeholder="Motivé, ponctuel, disponible les mercredis et week-ends..."
          style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 4, padding: "10px 12px", fontSize: 13, marginTop: 5, minHeight: 64, fontFamily: "inherit" }} />
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A8A82", marginBottom: 8 }}>Mes services</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} style={{ display: "flex", alignItems: "center", gap: 5, border: `1px solid ${LINE}`, background: "#fff", borderRadius: 4, padding: "8px 11px", fontSize: 12, fontWeight: 600 }}>
            <c.icon size={13} color={c.hue} /> {c.label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "13px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13.5 }}>
          <span>Abonnement mensuel</span><span>2 CHF/mois</span>
        </div>
        <div style={{ color: "#8A8A82", marginTop: 4, fontSize: 11.5, lineHeight: 1.5 }}>
          Nécessaire pour apparaître sur la plateforme. Résiliable à tout moment.
        </div>
      </div>

      <button disabled={isMinor} style={{
        width: "100%", marginTop: 16, background: isMinor ? "#DCDCD5" : INK, border: "none",
        padding: "13px", borderRadius: 6, fontWeight: 700, fontSize: 13.5, color: "#fff",
      }}>
        {isMinor ? "En attente d'accord parental" : "Publier mon profil"}
      </button>
    </PanelShell>
  );
}
