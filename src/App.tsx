import { useState, useEffect, useRef, useCallback } from "react";
import cutePhoto from "./assets/img1.jpg";
import lego from "./assets/img2.png";
import imgm from "./assets/imgm.jpg";
import imgm2 from "./assets/imgm2.jpg";
import imgm3 from "./assets/imgm3.jpg";

// ── Floating Hearts Background ──────────────────────────────────────────────
function FloatingHearts() {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 14 + Math.random() * 18,
    opacity: 0.15 + Math.random() * 0.25,
  }));
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(-10deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) rotate(10deg); opacity: 0; }
        }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        @keyframes wiggle { 0%,100%{transform:rotate(-2deg);} 50%{transform:rotate(2deg);} }
        @keyframes spinWheel { from{transform:rotate(0deg);} to{transform:rotate(var(--spin-deg));} }
        @keyframes popIn { 0%{transform:scale(0) rotate(-10deg);opacity:0;} 80%{transform:scale(1.1) rotate(2deg);} 100%{transform:scale(1) rotate(0);opacity:1;} }
        @keyframes flowerPop { 0%{transform:translateY(100vh) scale(0);opacity:0;} 60%{opacity:1;} 100%{transform:translateY(var(--fy)) scale(1);opacity:0;} }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        @keyframes borderGlow { 0%,100%{box-shadow:0 0 12px rgba(236,72,153,0.3);} 50%{box-shadow:0 0 28px rgba(236,72,153,0.6);} }
        @keyframes envelopeOpen { 0%{transform:scaleY(1);} 100%{transform:scaleY(-1);} }
        @keyframes letterRise { 0%{transform:translateY(60px);opacity:0;} 100%{transform:translateY(0);opacity:1;} }
        @keyframes twinkle { 0%,100%{opacity:0.4;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
      `}</style>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: 0,
            fontSize: h.size,
            opacity: h.opacity,
            animation: `floatUp ${h.duration}s ${h.delay}s infinite linear`,
          }}
        >
          💗
        </div>
      ))}
    </div>
  );
}

// ── Section Box ──────────────────────────────────────────────────────────────
function Box({ children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(12px)",
        borderRadius: 28,
        padding: "2rem 2rem",
        marginBottom: "2.5rem",
        border: "1.5px solid rgba(236,72,153,0.18)",
        animation: "borderGlow 3s ease-in-out infinite",
        position: "relative",
        zIndex: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BoxTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(1.3rem,3.5vw,1.8rem)",
        color: "#be185d",
        textAlign: "center",
        marginBottom: "1.2rem",
        fontWeight: 700,
      }}
    >
      {children}
    </h2>
  );
}

// ── Scratch Card ─────────────────────────────────────────────────────────────
function ScratchCard() {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const scratchedPct = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "✨ Scratch Here! ✨",
      canvas.width / 2,
      canvas.height / 2 - 10,
    );
    ctx.font = "13px sans-serif";
    ctx.fillText(
      "Use your finger or mouse to reveal",
      canvas.width / 2,
      canvas.height / 2 + 18,
    );
  }, []);

  const scratch = useCallback(
    (e) => {
      if (!isDrawing.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparent++;
      }
      scratchedPct.current =
        (transparent / (canvas.width * canvas.height)) * 100;
      if (scratchedPct.current > 50 && !revealed) setRevealed(true);
    },
    [revealed],
  );

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(236,72,153,0.25)",
          width: "min(320px,90vw)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#fce7f3,#fbcfe8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 0,
          }}
        >
          {revealed ? (
            <div style={{ animation: "popIn 0.5s ease both" }}>
              <img
                src={cutePhoto}
                alt="Us"
                style={{
                  width: "100%",
                  height: "252px",
                  objectFit: "cover",
                  borderRadius: 16,
                }}
              />
            </div>
          ) : (
            <div style={{ opacity: 0.3, fontSize: 40 }}>💕</div>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          style={{
            display: "block",
            width: "100%",
            cursor: "crosshair",
            touchAction: "none",
            position: "relative",
            zIndex: 1,
            borderRadius: 16,
          }}
          onMouseDown={() => (isDrawing.current = true)}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
          onMouseMove={scratch}
          onTouchStart={() => (isDrawing.current = true)}
          onTouchEnd={() => (isDrawing.current = false)}
          onTouchMove={scratch}
        />
      </div>
    </div>
  );
}

// ── Love Letter Envelope ─────────────────────────────────────────────────────
function LoveLetter() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      {!open ? (
        <div
          onClick={() => setOpen(true)}
          style={{
            display: "inline-block",
            cursor: "pointer",
            animation: "pulse 2s infinite",
          }}
        >
          <div
            style={{
              width: 180,
              height: 120,
              borderRadius: 8,
              background: "#9f1239",
              position: "relative",
              boxShadow: "0 8px 32px rgba(159,18,57,0.35)",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,rgba(255,255,255,0.2),transparent)",
                borderRadius: 8,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: 32,
              }}
            >
              💌
            </div>
          </div>
          <p
            style={{
              color: "#be185d",
              marginTop: 12,
              fontFamily: "Georgia, serif",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Click to open 💕
          </p>
        </div>
      ) : (
        <div
          style={{
            animation: "letterRise 0.5s ease both",
            textAlign: "left",
            maxHeight: 340,
            overflowY: "auto",
            padding: "0 0.5rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#fce7f3,#fff0f6)",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid rgba(236,72,153,0.2)",
              fontFamily: "'Georgia', serif",
              lineHeight: 1.9,
              color: "#831843",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              My Dearest Malkin 💕
            </p>
            <p>
              Heyaa malkinn so i made this lil surprise website for you and i
              hope you like it! I just wanted to take a moment to tell you how
              special you are to me. From the moment we met, in school corideor
              you came in my life i feels soo blessed and lucky to have you as a
              my partner
            </p>
            <br />
            <p>
              You came into my life like a warm ray of sunshine, and since then,
              every single day has felt brighter. ahh yk I really Loveeeee youuu
              soo sooo soo muchhhhhh!!!! yesterday you asked for these digitle
              gift and i really feels guilt that i didnt got you these things
              soo i made this website for you and i hope you like it and i hope
              it shows even a tiny bit of how much i love you. You are the most
              amazing person i have ever met and i am so grateful to have you in
              my life.
            </p>
            <br />
            <p>
              I love every single thing about you like your smile, your laugh,
              your hairs , your eyes , yours voice ,your personality , your
              everythingg!!! You make me a better person just by being in my
              life. I am so lucky to have you as my partner and i promise to
              always cherish and love you with all my heart.
            </p>
            <br />
            <p>
              I also want to talk about one thing—please, I request you,
              whenever you feel low, come to me. I’m here for you, always. I’ll
              listen to your overthinking, your worries, your random
              thoughts—everything. I’ll never get tired of understanding you or
              explaining things to make you feel better. But I can’t let you
              ever think that you should hate yourself, or that you don’t
              deserve me. Why? Because apart from you, no one else deserves me.
              😭🥹 And honestly, there’s no one else for me. You are the only
              one in my life. And again, I want to say this—you are my first
              love, and you’ll be my last. I want to be with you for life.
            </p>
            <br />
            <p>
              This little website is just a tiny tiny tiny portion of how much I
              love you. I could write a million pages For youuu 🎀 you are my
              everything, my baby, my world , my falani ji , my malkin , my kaju
              katli ,my rasmalyi ,andd meraaaaa pyaraaa bachaaa I loveeeeeeeee
              youuuuuuuu sooo sooo sooo muchh and feels soo proud to have you
              malkin🥹🥹🥹🎀😭🧿.🌸
            </p>

            <br />
            <p style={{ fontWeight: 700 }}>
              Forever yours,
              <br />
              aapka gulamm!!💗
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              marginTop: 12,
              background: "#fce7f3",
              border: "1px solid #f9a8d4",
              borderRadius: 20,
              padding: "6px 20px",
              color: "#be185d",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontSize: 13,
            }}
          >
            Close 💌
          </button>
        </div>
      )}
    </div>
  );
}

// ── Timer Together ────────────────────────────────────────────────────────────
function TimeTogether() {
  const start = new Date("2025-12-22T14:00:00");
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = now - start;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const units = [
    { label: "Days", val: days },
    { label: "Hours", val: hours },
    { label: "Minutes", val: mins },
    { label: "Seconds", val: secs },
  ];
  return (
    <div>
      <p
        style={{
          textAlign: "center",
          color: "#db2777",
          fontFamily: "Georgia, serif",
          marginBottom: "1rem",
          fontSize: 15,
        }}
      >
        We've been together for...
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          textAlign: "center",
        }}
      >
        {units.map((u) => (
          <div
            key={u.label}
            style={{
              background: "linear-gradient(135deg,#fce7f3,#fdf2f8)",
              borderRadius: 16,
              padding: "1rem 0.5rem",
              border: "1px solid rgba(236,72,153,0.2)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(1.4rem,5vw,2.2rem)",
                fontWeight: 800,
                color: "#be185d",
                fontFamily: "Georgia, serif",
              }}
            >
              {u.val}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#db2777",
                letterSpacing: 1,
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              {u.label}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 14,
          color: "#be185d",
          fontSize: 13,
          fontFamily: "Georgia, serif",
        }}
      >
        Since 22nd December 2025{" "}
      </p>
    </div>
  );
}

// ── Flower Burst ─────────────────────────────────────────────────────────────
function FlowerBurst() {
  const [flowers, setFlowers] = useState([]);
  const shoot = () => {
    const newFlowers = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: 20 + Math.random() * 60,
      fy: -(20 + Math.random() * 60) + "vh",
      emoji: ["🌸", "🌺", "🌹", "💮", "🌷", "🌻", "💐"][
        Math.floor(Math.random() * 7)
      ],
      size: 20 + Math.random() * 20,
      dur: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.6,
    }));
    setFlowers((f) => [...f, ...newFlowers]);
    setTimeout(
      () =>
        setFlowers((f) =>
          f.filter((fl) => !newFlowers.find((n) => n.id === fl.id)),
        ),
      4000,
    );
  };
  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <button
        onClick={shoot}
        style={{
          background: "linear-gradient(135deg,#f472b6,#ec4899)",
          color: "#fff",
          border: "none",
          borderRadius: 50,
          padding: "14px 36px",
          fontSize: 16,
          fontFamily: "Georgia, serif",
          cursor: "pointer",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
          animation: "pulse 2s infinite",
        }}
      >
        🌸 You Love Flowers My Love, Click Me! 🌸
      </button>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: 999,
        }}
      >
        {flowers.map((f) => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              left: `${f.left}%`,
              bottom: 0,
              fontSize: f.size,
              "--fy": f.fy,
              animation: `flowerPop ${f.dur}s ${f.delay}s ease-out forwards`,
            }}
          >
            {f.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Things I Love ─────────────────────────────────────────────────────────────
const loveThings = [
  {
    emoji: "😊",
    text: "You make me feel really good about myself, like I’m enough.",
  },
  {
    emoji: "🥹 ",
    text: "You made me more confident in myself.",
  },
  {
    emoji: "🛐",
    text: "Life feels happier and more interesting with you in it.",
  },
  {
    emoji: "💭",
    text: "You are my safe place — when I feel low, you’re the first person I want to go to. agree aap bhi dant dete ho per thori der baat kr ne ke baad bhot aacha lagtaa haiii fr!!!! lovedd thisss!!!",
  },
  {
    emoji: "🌟",
    text: "You always try to understand me, even when I’m difficult.",
  },
  {
    emoji: "🎀",
    text: "You don’t let me stay stuck in negative thoughts for too long.",
  },
  {
    emoji: "🥹",
    text: "I love that you never judge me — even at my worst, you make me feel accepted, understood, and safe to be myself.",
  },
  {
    emoji: "🧿",
    text: "The way you trust me means everything to me.",
  },
  {
    emoji: "🫂",
    text: "you are meraaaaaa pyaraaaaa bachaaaa and I love that babygurlll 🧿🛐🛐.",
  },
];
function LoveThings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {loveThings.map((t, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            background: "rgba(253,242,248,0.7)",
            borderRadius: 14,
            padding: "14px 16px",
            border: "1px solid rgba(236,72,153,0.15)",
            animation: `fadeInUp 0.4s ${i * 0.08}s both`,
          }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }}>{t.emoji}</span>
          <p
            style={{
              margin: 0,
              color: "#831843",
              fontFamily: "Georgia, serif",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            {t.text}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Spin Wheel ────────────────────────────────────────────────────────────────
const prizes = [
  "A big tight hug",
  "Love Letter",
  "Voice Note ",
  "1000 kisses",
  "A movie night ",
  "Cute Selfie",
  "Back massage",
  "Cute Selfie",
  "Whatever You Says",
];
const COLORS = [
  "#f9a8d4",
  "#fbb6ce",
  "#f472b6",
  "#ec4899",
  "#db2777",
  "#be185d",
  "#9d174d",
  "#831843",
];

function SpinWheel() {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const currentAngle = useRef(0);

  useEffect(() => {
    drawWheel(currentAngle.current);
  }, []);

  function drawWheel(startAngle) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2,
      cy = canvas.height / 2,
      r = cx - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const slice = (2 * Math.PI) / prizes.length;
    prizes.forEach((p, i) => {
      const angle = startAngle + i * slice;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(p, r - 8, 4);
      ctx.restore();
    });
    // center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#be185d";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("💗", cx, cy + 4);
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    const extraSpins = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const landingAngle = Math.random() * 2 * Math.PI;
    const total = extraSpins + landingAngle;
    const duration = 4000;
    const start = performance.now();
    const startA = currentAngle.current;

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const angle = startA + total * eased;
      currentAngle.current = angle;
      drawWheel(angle);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // figure out which slice is at top (pointer at top = 270deg = 3π/2)
        const normalized =
          ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointer =
          ((3 * Math.PI) / 2 - normalized + 2 * Math.PI) % (2 * Math.PI);
        const slice = (2 * Math.PI) / prizes.length;
        const idx = Math.floor(pointer / slice) % prizes.length;
        setPrize(prizes[idx]);
      }
    }
    requestAnimationFrame(animate);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* pointer */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "22px solid #be185d",
            zIndex: 2,
          }}
        />
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          style={{
            borderRadius: "50%",
            boxShadow: "0 4px 24px rgba(236,72,153,0.3)",
          }}
        />
      </div>
      <br />
      <button
        onClick={spin}
        disabled={spinning}
        style={{
          marginTop: 16,
          background: spinning
            ? "#f9a8d4"
            : "linear-gradient(135deg,#f472b6,#ec4899)",
          color: "#fff",
          border: "none",
          borderRadius: 50,
          padding: "12px 32px",
          fontSize: 15,
          fontFamily: "Georgia, serif",
          cursor: spinning ? "not-allowed" : "pointer",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(236,72,153,0.3)",
          transition: "all 0.3s",
        }}
      >
        {spinning ? "Spinning... 🌀" : "Push Here 🎰"}
      </button>
      {prize && (
        <div
          style={{
            marginTop: 20,
            animation: "popIn 0.5s ease both",
            background: "linear-gradient(135deg,#fce7f3,#fdf2f8)",
            borderRadius: 16,
            padding: "1rem 1.5rem",
            border: "1px solid rgba(236,72,153,0.25)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
          <p
            style={{
              color: "#be185d",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: 16,
              margin: 0,
            }}
          >
            You won: <span style={{ color: "#9d174d" }}>{prize}</span>
          </p>
          <p
            style={{
              color: "#db2777",
              fontFamily: "Georgia, serif",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            Go grab your prize, baby! 💕
          </p>
        </div>
      )}
    </div>
  );
}

// ── YouTube Player ────────────────────────────────────────────────────────────
function YouTubePlayer() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=S03cRZ-NO3k");
  const [videoId, setVideoId] = useState("S03cRZ-NO3k");
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(url);

  function extractId(u) {
    const m = u.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function save() {
    const id = extractId(input);
    if (id) {
      setVideoId(id);
      setUrl(input);
      setEditing(false);
    } else alert("Please enter a valid YouTube URL");
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(236,72,153,0.2)",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div style={{ marginTop: 14, textAlign: "center" }}>
        {editing ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste YouTube URL..."
              style={{
                flex: 1,
                minWidth: 200,
                padding: "8px 14px",
                borderRadius: 20,
                border: "1px solid #f9a8d4",
                fontFamily: "Georgia, serif",
                fontSize: 13,
                outline: "none",
                color: "#831843",
              }}
            />
            <button
              onClick={save}
              style={{
                background: "#ec4899",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#fce7f3",
                color: "#be185d",
                border: "1px solid #f9a8d4",
                borderRadius: 20,
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "transparent",
              color: "#db2777",
              border: "1px solid #f9a8d4",
              borderRadius: 20,
              padding: "7px 20px",
              cursor: "pointer",
              display: "none",
              fontFamily: "Georgia, serif",
              fontSize: 13,
            }}
          >
            🎵 Change Song
          </button>
        )}
      </div>
    </div>
  );
}

// ── Photo Swipe Gallery ────────────────────────────────────────────────────────
const placeholderPhotos = [
  { label: "Photo 1 💕", bg: "#fce7f3", img: imgm },
  { label: "Photo 2 🥰", bg: "#fdf2f8", img: imgm2 },
  { label: "Photo 3 💗", bg: "#fbcfe8", img: imgm3 },
];

function PhotoSwipe() {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  function onStart(e) {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onEnd(e) {
    if (startX.current === null) return;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;

    if (endX - startX.current < -40)
      setIdx((i) => (i + 1) % placeholderPhotos.length);
    else if (endX - startX.current > 40)
      setIdx(
        (i) => (i - 1 + placeholderPhotos.length) % placeholderPhotos.length,
      );

    startX.current = null;
  }

  return (
    <div>
      <div
        style={{
          background: placeholderPhotos[idx].bg,
          borderRadius: 20,
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          border: "1px solid rgba(236,72,153,0.18)",
          cursor: "grab",
          userSelect: "none",
          transition: "background 0.4s",
        }}
        onMouseDown={onStart}
        onMouseUp={onEnd}
        onTouchStart={onStart}
        onTouchEnd={onEnd}
      >
        <img
          src={placeholderPhotos[idx].img}
          alt={placeholderPhotos[idx].label}
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 16,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 14,
        }}
      >
        {placeholderPhotos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 24 : 10,
              height: 10,
              borderRadius: 5,
              border: "none",
              background: i === idx ? "#ec4899" : "#fbb6ce",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#db2777",
          fontSize: 12,
          marginTop: 8,
          fontFamily: "Georgia, serif",
        }}
      >
        ← Swipe or drag to navigate →
      </p>
    </div>
  );
}
// ── Moon Phase ────────────────────────────────────────────────────────────────
function MoonPhase() {
  const [date, setDate] = useState("2010-01-21");
  const getMoonPhase = (dateStr) => {
    const d = new Date(dateStr);
    const diff = (d - new Date("2000-01-06")) / 86400000;
    const cycle = 29.53;
    const phase = ((diff % cycle) + cycle) % cycle;
    if (phase < 1.85) return { name: "New Moon", emoji: "🌑" };
    if (phase < 7.38) return { name: "Waxing Crescent", emoji: "🌒" };
    if (phase < 9.22) return { name: "First Quarter", emoji: "🌓" };
    if (phase < 14.77) return { name: "Waxing Gibbous", emoji: "🌔" };
    if (phase < 16.61) return { name: "Full Moon", emoji: "🌕" };
    if (phase < 22.15) return { name: "Waning Gibbous", emoji: "🌖" };
    if (phase < 23.99) return { name: "Last Quarter", emoji: "🌗" };
    if (phase < 29.53) return { name: "Waning Crescent", emoji: "🌘" };
    return { name: "New Moon", emoji: "🌑" };
  };
  const moon = getMoonPhase(date);
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          color: "#be185d",
          fontFamily: "Georgia, serif",
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        When my love came into this world 🌙
      </p>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          border: "1px solid #f9a8d4",
          borderRadius: 12,
          padding: "8px 16px",
          fontFamily: "Georgia, serif",
          color: "#831843",
          fontSize: 14,
          outline: "none",
          background: "#fdf2f8",
          marginBottom: 20,
        }}
      />
      <div style={{ animation: "popIn 0.5s ease both" }}>
        <div style={{ fontSize: 80, marginBottom: 6, marginTop: 25 }}>
          {moon.emoji}
        </div>
        <p
          style={{
            color: "#be185d",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 20,
            marginTop: 45,
          }}
        >
          {moon.name}
        </p>
        <p
          style={{
            color: "#db2777",
            fontSize: 14,
            fontFamily: "Georgia, serif",
          }}
        >
          The moon was in its <strong>{moon.name}</strong> phase when you were
          born ✨
        </p>
        <img
          src={`https://api.farmsense.net/v1/moonphases/?d=${Math.floor(new Date(date).getTime() / 1000)}`}
          alt="Moon phase"
          onError={(e) => (e.target.style.display = "none")}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            marginTop: 12,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#fdf2f8 0%,#fce7f3 30%,#fbcfe8 60%,#fdf2f8 100%)",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <FloatingHearts />

      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem 4rem" }}
      >
        {/* ── Hero ── */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "3rem",
            paddingBottom: "2.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
              animation: "pulse 2s infinite",
            }}
          >
            💗
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem,8vw,4.5rem)",
              color: "#9d174d",
              margin: 0,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 24px rgba(236,72,153,0.2)",
            }}
          >
            Falani Ji
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              margin: "12px 0 16px",
              fontSize: 22,
            }}
          ></div>
          <p
            style={{
              color: "#be185d",
              fontSize: "clamp(1rem,3vw,1.2rem)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            I loveeeeee youuuuu sooo sooo muchhh bachaa 🥹
            <br />
            Here is a surprise gift for you 🎁💕
          </p>
        </div>

        {/* ── Scratch Card ── */}
        <Box>
          <BoxTitle>Aren't We Cute? 🥹</BoxTitle>
          <ScratchCard />
        </Box>

        {/* ── Love Letter ── */}
        <Box>
          <BoxTitle>A Letter From My Heart 💌</BoxTitle>
          <LoveLetter />
        </Box>

        {/* ── Lego ── */}
        <Box>
          <BoxTitle>Here Is Us As Lego! 🧱</BoxTitle>
          <div
            style={{
              background: "linear-gradient(135deg,#fce7f3,#fdf2f8)",
              borderRadius: 16,
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
              border: "1px solid rgba(236,72,153,0.15)",
            }}
          >
            <img
              src={lego}
              alt="Lego us"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
          </div>
        </Box>

        {/* ── Time Together ── */}
        <Box>
          <BoxTitle>Time Together ⏰</BoxTitle>
          <TimeTogether />
        </Box>

        {/* ── Flowers ── */}
        <Box>
          <FlowerBurst />
        </Box>

        {/* ── Things I Love ── */}
        <Box>
          <BoxTitle>Things I Love About You 💗</BoxTitle>
          <p
            style={{
              textAlign: "center",
              color: "#db2777",
              fontStyle: "italic",
              fontSize: 13,
              marginBottom: "1rem",
            }}
          >
            Here is a small portion of them...
          </p>
          <LoveThings />
        </Box>

        {/* ── Spin Wheel ── */}
        <Box>
          <BoxTitle>Spin For A Prize! 🎰</BoxTitle>
          <SpinWheel />
        </Box>

        {/* ── YouTube ── */}
        <Box>
          <BoxTitle>The Song That Reminds Me Of You 🎵</BoxTitle>
          <YouTubePlayer />
        </Box>

        {/* ── Photos ── */}
        <Box>
          <BoxTitle>You & Me 📸</BoxTitle>
          <PhotoSwipe />
        </Box>

        {/* ── Moon Phase ── */}
        <Box>
          <BoxTitle>Moon Phase 🌙</BoxTitle>
          <MoonPhase />
        </Box>

        {/* ── Final Message ── */}
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            borderRadius: 28,
            border: "1.5px solid rgba(236,72,153,0.2)",
            animation: "borderGlow 3s ease-in-out infinite",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              animation: "pulse 2s infinite",
            }}
          >
            💗
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.6rem,5vw,2.8rem)",
              color: "#9d174d",
              fontWeight: 900,
              margin: "0 0 16px",
            }}
          >
            Thank you for being with me!
          </h2>
          <p
            style={{
              color: "#be185d",
              fontFamily: "Georgia, serif",
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            You are my biggest blessing, my sweetest adventure, and my favorite
            person in the entire universe. I love you more than words could ever
            say. 🥺💕
          </p>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "#be185d",
                fontFamily: "Georgia, serif",
                fontSize: 16,
                lineHeight: 1.8,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              Thank you for being you! 🥹
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
