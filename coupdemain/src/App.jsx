import React, { useState, useMemo } from "react";
import {
  MapPin, Star, Send, ShieldCheck, CreditCard,
  Dog, Sprout, Laptop2, ShoppingBag, ChevronLeft, Check, ArrowRight, Baby,
  Brush, Package, BookOpen, Car, Hammer, Baby as BabySit, PawPrint, Paintbrush,
  Snowflake, Sparkles
} from "lucide-react";

const CATEGORIES = [
  { id: "jardin", label: "Jardinage", icon: Sprout, hue: "#4A8B6F" },
  { id: "animaux", label: "Garde d'animaux", icon: Dog, hue: "#C97B4A" },
  { id: "info", label: "Aide informatique", icon: Laptop2, hue: "#4A7FA6" },
  { id: "courses", label: "Courses", icon: ShoppingBag, hue: "#B5657D" },
  { id: "menage", label: "Ménage", icon: Brush, hue: "#6B5FA6" },
  { id: "demenagement", label: "Déménagement léger", icon: Package, hue: "#8A7FB0" },
  { id: "cours", label: "Cours particuliers", icon: BookOpen, hue: "#4A7FA6" },
  { id: "voiture", label: "Lavage de voiture", icon: Car, hue: "#3F8B96" },
  { id: "bricolage", label: "Petit bricolage", icon: Hammer, hue: "#C97B4A" },
  { id: "babysitting", label: "Baby-sitting", icon: BabySit, hue: "#D9A94A" },
  { id: "promenade", label: "Balade compagnie", icon: PawPrint, hue: "#4A8B6F" },
  { id: "peinture", label: "Peinture, déco", icon: Paintbrush, hue: "#B5657D" },
  { id: "hiver", label: "Déneigement", icon: Snowflake, hue: "#4A7FA6" },
  { id: "autre", label: "Autre", icon: Sparkles, hue: "#6B5FA6" },
];

const PROFILES = [
  { id: 1, name: "Lucas M.", age: 17, city: "Nyon", distance: 1.2, rating: 4.9, reviews: 14, verified: true, rotate: -1.5,
    skills: [
      { cat: "jardin", rate: 18, note: "Tonte, taille de haies, entretien de potager" },
      { cat: "animaux", rate: 15, note: "Promenade de chiens, 2 ans d'expérience" },
    ],
    bio: "Motivé, ponctuel, j'ai mon propre matériel de jardinage.",
    reviewList: [
      { author: "Mme Fontaine", rating: 5, comment: "Très sérieux, jardin impeccable." },
      { author: "M. Berger", rating: 5, comment: "A promené mon chien deux fois par semaine tout l'été." },
    ]},
  { id: 2, name: "Emma R.", age: 16, city: "Nyon", distance: 2.4, rating: 4.7, reviews: 9, verified: true, rotate: 1.2,
    skills: [
      { cat: "info", rate: 12, note: "Aide smartphone, tablette, WiFi, mails" },
      { cat: "courses", rate: 10, note: "Courses au village, livraison à pied ou vélo" },
    ],
    bio: "Patiente, j'aide surtout les personnes âgées avec leurs appareils.",
    reviewList: [{ author: "Mme Delacroix", rating: 5, comment: "Elle m'a enfin appris à faire des appels vidéo !" }]},
  { id: 3, name: "Noah T.", age: 15, city: "Gland", distance: 6.1, rating: 4.5, reviews: 5, verified: false, rotate: -0.8,
    skills: [{ cat: "jardin", rate: 15, note: "Tonte de pelouse, ramassage de feuilles" }],
    bio: "Débutant motivé, dispo les mercredis et week-ends.",
    reviewList: [{ author: "Famille Roux", rating: 4, comment: "Bon travail, un peu en retard une fois." }]},
  { id: 4, name: "Zoé K.", age: 17, city: "Nyon", distance: 0.8, rating: 5.0, reviews: 21, verified: true, rotate: 1.8,
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
const INK = "#22242A";
const BG = "#F4F5F7";
const CARD = "#FFFFFF";

function catOf(id) { return CATEGORIES.find((c) => c.id === id); }

function hardShadow(px = 4) { return `0 ${Math.max(1, px/2)}px ${px * 1.5}px rgba(34,36,42,0.12)`; }

function StarRow({ value }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#D9A94A", border: `1.5px solid ${INK}`, borderRadius: 20, padding: "2px 8px 2px 6px" }}>
      <Star size={12} fill={INK} color={INK} />
      <span style={{ fontWeight: 800, fontSize: 12 }}>{value.toFixed(1)}</span>
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
  function pay(method) {
    setStage("done");
    setMessages([{ from: "them", text: `Hey ! Merci pour la résa 🙌 (paiement ${method === "twint" ? "Twint" : "carte"} reçu) je peux venir ${["demain", "ce week-end", "mercredi"][selected.id % 3]}, ça te va ?` }]);
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
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: BG, minHeight: "100%", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .disp { font-family:'Sora', system-ui, sans-serif; }
        button { cursor:pointer; font-family:inherit; }
        input, textarea { font-family:inherit; }
        ::-webkit-scrollbar { display:none; }
        .press:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 ${INK} !important; }
        .chip:active { transform: translate(1px,1px); }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 18px 16px", background: "#3A3D46", borderBottom: `1px solid ${INK}` }}>
        <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: "#fff", textShadow: "none" }}>
          CoupDeMain
        </div>
        <div style={{ fontSize: 12.5, color: "#fff", opacity: 0.95, marginTop: 3, fontWeight: 600 }}>
          Des jeunes du coin, prêts à donner un coup de main
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[["client", "Je cherche"], ["jeune", "Je propose"]].map(([val, label]) => (
            <button key={val} className="press" onClick={() => { setRole(val); setStage("browse"); setCustomRequest(""); setCustomSent(false); if (val === "client") setSignupAge(""); }}
              style={{
                padding: "9px 14px", borderRadius: 14, border: `1px solid ${INK}`, fontSize: 12.5, fontWeight: 700,
                background: role === val ? "#D9A94A" : "#fff",
                color: INK, boxShadow: role === val ? hardShadow(3) : "none",
              }}>{label}</button>
          ))}
        </div>
      </div>

      {role === "client" && stage === "browse" && (
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
            <button className="chip" onClick={() => { setActiveCat(null); setCustomRequest(""); setCustomSent(false); }} style={chipStyle(activeCat === null, "#D9A94A")}>Tout</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className="chip" onClick={() => { setActiveCat(c.id); setCustomRequest(""); setCustomSent(false); }} style={chipStyle(activeCat === c.id, c.hue)}>
                <c.icon size={13} /> {c.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14, fontSize: 12, alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>Trier :</span>
            {[["distance", "Distance"], ["note", "Note"], ["prix", "Prix"]].map(([v, l]) => (
              <button key={v} onClick={() => setSortBy(v)} style={{
                border: `1.5px solid ${INK}`, background: sortBy === v ? INK : "#fff", color: sortBy === v ? "#fff" : INK,
                borderRadius: 10, padding: "4px 9px", fontWeight: 700, fontSize: 11.5,
              }}>{l}</button>
            ))}
          </div>

          <div style={{ background: CARD, border: `2px dashed ${INK}`, borderRadius: 14, padding: "13px 14px", marginBottom: 16 }}>
            <div className="disp" style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Une demande spécifique ?</div>
            <div style={{ fontSize: 11.5, color: "#5C5346", marginBottom: 9 }}>Décris ton besoin, on le transmet aux jeunes du coin.</div>
            {!customSent ? (
              <div style={{ display: "flex", gap: 7 }}>
                <input value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}
                  placeholder="Ex : m'aider à monter une étagère..."
                  style={{ flex: 1, border: `1px solid ${INK}`, borderRadius: 10, padding: "9px 11px", fontSize: 12.5 }} />
                <button className="press" onClick={() => customRequest.trim() && setCustomSent(true)}
                  style={{ background: "#B5657D", color: "#fff", border: `1px solid ${INK}`, boxShadow: hardShadow(3), borderRadius: 10, padding: "0 14px", fontSize: 12, fontWeight: 700 }}>
                  Go
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: INK, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                <Check size={15} /> Envoyé, on vous tient informé.
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((p) => {
              const primaryCat = catOf(p.skills[0].cat);
              return (
                <div key={p.id} className="press" onClick={() => openProfile(p)} style={{
                  background: CARD, border: `1.5px solid ${INK}`, borderRadius: 16, padding: "14px 15px",
                  boxShadow: hardShadow(4), transform: `rotate(0deg)`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div className="disp" style={{ fontSize: 17, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11.5, color: "#5C5346", display: "flex", alignItems: "center", gap: 4, marginTop: 2, fontWeight: 600 }}>
                        <MapPin size={12} /> {p.city} · {p.distance} km
                        {p.verified && <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: "#1F9D55" }}><ShieldCheck size={12} /> vérifié</span>}
                      </div>
                    </div>
                    <StarRow value={p.rating} />
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                    {p.skills.map((s) => (
                      <span key={s.cat} style={{
                        display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
                        background: catOf(s.cat).hue, color: "#fff", padding: "4px 9px", borderRadius: 20,
                        border: `1.5px solid ${INK}`,
                      }}><CategoryIcon id={s.cat} /> {s.rate} CHF/h</span>
                    ))}
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
        <PayPanel price={price} onBack={() => setStage("booking")} onPay={(m) => pay(m)} />
      )}
      {role === "client" && stage === "done" && selected && (
        <ChatPanel p={selected} messages={messages} draft={draft} setDraft={setDraft} onSend={sendMessage}
          onBack={() => setStage("browse")} />
      )}
      {role === "jeune" && (
        <JeuneProfile
          signupAge={signupAge}
          setSignupAge={setSignupAge}
          onBack={() => { setRole("client"); setStage("browse"); }}
        />
      )}
    </div>
  );
}

function CategoryIcon({ id, size = 12 }) {
  const cat = catOf(id);
  const Icon = cat.icon;
  return <Icon size={size} />;
}

function chipStyle(active, hue) {
  return {
    display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
    padding: "8px 12px", borderRadius: 20, border: `1px solid ${INK}`, fontSize: 12, fontWeight: 700,
    background: active ? hue : "#fff", color: active ? "#fff" : INK,
    boxShadow: active ? hardShadow(3) : "none",
  };
}

function PanelShell({ onBack, title, emoji, children }) {
  return (
    <div style={{ padding: "16px 18px 32px" }}>
      <button className="press" onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 4, border: `1px solid ${INK}`, background: "#fff",
        borderRadius: 12, fontSize: 12, fontWeight: 700, padding: "6px 12px", marginBottom: 14, boxShadow: hardShadow(3),
      }}>
        <ChevronLeft size={15} /> Retour
      </button>
      <div className="disp" style={{ fontWeight: 600, fontSize: 20, marginBottom: 14 }}>{title} {emoji}</div>
      {children}
    </div>
  );
}

function DetailPanel({ p, onBack, onBook }) {
  return (
    <PanelShell onBack={onBack} title={p.name} emoji="">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <StarRow value={p.rating} />
        <span style={{ fontSize: 12, color: "#5C5346", fontWeight: 600 }}>{p.reviews} avis · {p.city}, {p.distance} km</span>
      </div>
      {p.verified && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#1F9D55", fontWeight: 700, marginTop: 8 }}>
          <ShieldCheck size={14} /> Identité vérifiée
        </div>
      )}
      <div style={{ background: CARD, border: `1px solid ${INK}`, borderRadius: 14, padding: "12px 14px", marginTop: 12, fontSize: 13, lineHeight: 1.5, fontWeight: 600 }}>
        {p.bio}
      </div>

      <div className="disp" style={{ fontSize: 15, fontWeight: 600, marginTop: 18, marginBottom: 8 }}>Ce qui est proposé</div>
      {p.skills.map((s) => (
        <div key={s.cat} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: catOf(s.cat).hue + "22", border: `1px solid ${INK}`, borderRadius: 14, padding: "10px 12px", marginBottom: 9,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{catOf(s.cat).label}</div>
            <div style={{ fontSize: 11.5, color: "#5C5346", fontWeight: 600 }}>{s.note}</div>
          </div>
          <button className="press" onClick={() => onBook(s)} style={{ border: `1px solid ${INK}`, background: "#D9A94A", fontSize: 12, fontWeight: 800, padding: "8px 12px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: hardShadow(3) }}>
            {s.rate} CHF/h
          </button>
        </div>
      ))}

      <div className="disp" style={{ fontSize: 15, fontWeight: 600, marginTop: 18, marginBottom: 8 }}>Avis</div>
      {p.reviewList.map((r, i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${INK}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700 }}>
            <span>{r.author}</span><StarRow value={r.rating} />
          </div>
          <div style={{ fontSize: 12.5, color: "#5C5346", marginTop: 4, fontWeight: 600 }}>{r.comment}</div>
        </div>
      ))}
    </PanelShell>
  );
}

function BookingPanel({ p, skill, price, commission, payout, onBack, onConfirm }) {
  return (
    <PanelShell onBack={onBack} title="Confirmer la réservation" emoji="">
      <div style={{ fontSize: 13.5, marginBottom: 14, fontWeight: 600 }}>
        Service <b style={{ color: catOf(skill.cat).hue }}>{catOf(skill.cat).label}</b> avec <b>{p.name}</b>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${INK}`, borderRadius: 14, padding: "6px 14px" }}>
        <Row label="Forfait démo (2h)" value={`${price.toFixed(2)} CHF`} />
        <Row label="Commission plateforme (10%)" value={`- ${commission.toFixed(2)} CHF`} muted />
        <div style={{ borderTop: `2px dashed ${INK}`, opacity: 0.4 }} />
        <Row label={`Versé à ${p.name}`} value={`${payout.toFixed(2)} CHF`} bold />
      </div>
      <div style={{ fontSize: 11.5, color: "#5C5346", marginTop: 12, display: "flex", gap: 6, lineHeight: 1.5, fontWeight: 600 }}>
        <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        Le paiement passe par l'app : t'as une protection en cas de souci et un avis vérifié à la fin.
      </div>
      <button className="press" onClick={onConfirm} style={{ width: "100%", marginTop: 18, background: "#6B5FA6", color: "#fff", border: `1.5px solid ${INK}`, boxShadow: hardShadow(4), padding: "13px", borderRadius: 14, fontWeight: 800, fontSize: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
        Continuer vers le paiement <ArrowRight size={15} />
      </button>
    </PanelShell>
  );
}

function Row({ label, value, muted, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontSize: 13, color: muted ? "#8A8071" : INK, fontWeight: bold ? 800 : 600 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function PayPanel({ price, onBack, onPay }) {
  const [method, setMethod] = useState("twint");
  return (
    <PanelShell onBack={onBack} title="Paiement" emoji="">
      <div style={{ fontSize: 13.5, marginBottom: 14, fontWeight: 700 }}>Total à payer : {price.toFixed(2)} CHF</div>
      {[["twint", "Twint"], ["card", "Carte bancaire"]].map(([v, l]) => (
        <button key={v} className="press" onClick={() => setMethod(v)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 9, textAlign: "left",
          border: `1px solid ${INK}`, background: method === v ? "#D9A94A" : "#fff",
          boxShadow: method === v ? hardShadow(3) : "none",
          borderRadius: 12, padding: "12px 13px", marginBottom: 9, fontSize: 13, fontWeight: 700,
        }}>
          <CreditCard size={16} /> {l} {method === v && <Check size={14} style={{ marginLeft: "auto" }} />}
        </button>
      ))}
      <button className="press" onClick={() => onPay(method)} style={{ width: "100%", marginTop: 8, background: "#4A8B6F", color: "#fff", border: `1.5px solid ${INK}`, boxShadow: hardShadow(4), padding: "13px", borderRadius: 14, fontWeight: 800, fontSize: 14 }}>
        Payer {price.toFixed(2)} CHF
      </button>
      <div style={{ fontSize: 10.5, color: "#8A8071", marginTop: 10, textAlign: "center", fontWeight: 600 }}>Paiement simulé — démo uniquement</div>
    </PanelShell>
  );
}

function ChatPanel({ p, messages, draft, setDraft, onSend, onBack }) {
  return (
    <PanelShell onBack={onBack} title={p.name} emoji="">
      <div style={{ fontSize: 12, color: "#1F9D55", fontWeight: 800, display: "flex", gap: 5, alignItems: "center", marginBottom: 14 }}>
        <Check size={14} /> Réservation confirmée
      </div>
      <div style={{ minHeight: 100, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: "82%", marginLeft: m.from === "me" ? "auto" : 0, marginBottom: 9,
            background: m.from === "me" ? "#6B5FA6" : "#fff", color: m.from === "me" ? "#fff" : INK,
            border: `1px solid ${INK}`, padding: "9px 12px", borderRadius: 14, fontSize: 12.5, fontWeight: 600,
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Écrire un message..."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          style={{ flex: 1, border: `1px solid ${INK}`, borderRadius: 12, padding: "10px 12px", fontSize: 12.5 }} />
        <button className="press" onClick={onSend} style={{ background: "#D9A94A", border: `1px solid ${INK}`, boxShadow: hardShadow(3), borderRadius: 12, width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={14} />
        </button>
      </div>
    </PanelShell>
  );
}

function JeuneProfile({ signupAge, setSignupAge, onBack }) {
  const isMinor = signupAge !== "" && Number(signupAge) < 16;
  return (
    <PanelShell onBack={onBack} title="Mon profil" emoji="">
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11.5, fontWeight: 800 }}>Âge</label>
        <input type="number" value={signupAge} onChange={(e) => setSignupAge(e.target.value)}
          placeholder="Ex : 16" style={{ width: "100%", border: `1px solid ${INK}`, borderRadius: 12, padding: "10px 12px", fontSize: 13, marginTop: 5 }} />
      </div>

      {isMinor && (
        <div style={{ background: "#FFE8A3", border: `1px solid ${INK}`, borderRadius: 12, padding: "11px 13px", fontSize: 12.5, display: "flex", gap: 8, marginBottom: 14, fontWeight: 600, lineHeight: 1.5 }}>
          <Baby size={16} style={{ flexShrink: 0 }} />
          <div>T'as moins de 16 ans, donc un de tes parents doit valider ton inscription avant que ton profil soit visible. On lui envoie un lien par SMS.</div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11.5, fontWeight: 800 }}>Ta présentation</label>
        <textarea placeholder="Motivé, ponctuel, disponible les mercredis et week-ends..."
          style={{ width: "100%", border: `1px solid ${INK}`, borderRadius: 12, padding: "10px 12px", fontSize: 13, marginTop: 5, minHeight: 64, fontFamily: "inherit" }} />
      </div>

      <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>Tes services</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} className="chip" style={{ display: "flex", alignItems: "center", gap: 5, border: `1px solid ${INK}`, background: "#fff", borderRadius: 20, padding: "7px 11px", fontSize: 11.5, fontWeight: 700 }}>
            <c.icon size={13} /> {c.label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", border: `1px solid ${INK}`, borderRadius: 14, padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 13.5 }}>
          <span>Abonnement mensuel</span><span>2 CHF/mois</span>
        </div>
        <div style={{ color: "#5C5346", marginTop: 4, fontSize: 11.5, fontWeight: 600 }}>
          Pour apparaître sur l'appli. Tu arrêtes quand tu veux.
        </div>
      </div>

      <button className="press" disabled={isMinor} style={{
        width: "100%", marginTop: 16, background: isMinor ? "#E4DCC8" : "#B5657D", border: `1.5px solid ${INK}`,
        boxShadow: isMinor ? "none" : hardShadow(4),
        padding: "13px", borderRadius: 14, fontWeight: 800, fontSize: 14, color: isMinor ? "#8A8071" : "#fff",
      }}>
        {isMinor ? "En attente d'accord parental" : "Publier mon profil"}
      </button>
    </PanelShell>
  );
}