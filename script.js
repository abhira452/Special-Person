
/* ==========================================
   1. ELEMENTS AND SETTINGS
========================================== */

const messageText = document.getElementById("message-text");
const hint = document.getElementById("hint");
const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const mainHeart = document.getElementById("main-heart");
const success = document.getElementById("success");
const flowerLayer = document.getElementById("flower-layer");

const celebrateBtn = document.getElementById("celebrate-btn");
const whatsappPopup = document.getElementById("whatsapp-popup");
const openWhatsAppBtn = document.getElementById("open-whatsapp");
const closeWhatsAppPopup = document.getElementById("close-whatsapp-popup");
const popupX = document.getElementById("popup-x");

// WhatsApp number with country code, without +, spaces or dashes.
const WHATSAPP_NUMBER = "917651828165";

const WHATSAPP_MESSAGE =
  "Hey Mr. 💖 Thank you for this beautiful moment! 🌸";

let noClicks = 0;
let accepted = false;
let noIsHidden = false;
let flowerTimer = null;
let previousFocus = null;

// NO stays for 7 clicks; hides on the 8th click.
const NO_HIDE_AFTER = 15;

const messages = [
  {
    text: "Okay, I'll ask a little more sweetly... 💕<br><strong>Pooja Rai, will you be my favourite person?</strong>",
    hint: "A little yes could make someone's whole day. 🌸"
  },
  {
    text: "What if I promised to make you smile, even on your toughest days? 🥹<br><strong>Would you give me a chance?</strong>",
    hint: "My heart is still waiting for your answer. 💗"
  },
  {
    text: "If you were a flower, you'd be the one I'd admire in every season. 🌹<br><strong>Can I be someone special to you?</strong>",
    hint: "One little click could make this story sweeter. ✨"
  },
  {
    text: "I don't need a perfect fairytale... just a chance to write a beautiful story with you. 📖💕<br><strong>What do you say, Pooja Rai?</strong>",
    hint: "The next chapter is waiting for you. 💌"
  },
  {
    text: "I'd choose your smile on ordinary Mondays and your company on extraordinary days. 🌷<br><strong>Can I choose you?</strong>",
    hint: "Sending you the softest virtual hug. 🫶"
  },
  {
    text: "Roses are red, violets are blue... my favourite notification would be a message from you! 🌹📱<br><strong>Shall we make more memories?</strong>",
    hint: "Pretty please, with a cherry on top? 🍒"
  },
  {
    text: "Imagine a sky full of stars, a garden full of roses, and one very happy heart because of you. 🌌💐<br><strong>Will you make this moment magical?</strong>",
    hint: "My imaginary flower bouquet is ready! 💐"
  },
  {
    text: "Breaking news! 🚨 You're officially the main character in someone's favourite daydream.<br><strong>Interested in the role? 💖</strong>",
    hint: "No pressure, just a little extra romance. 🎀"
  },
  {
    text: "If happiness had a face, I bet it would look a little like you. 😊💕<br><strong>May I be part of your happy moments?</strong>",
    hint: "A tiny yes would mean a lot. 🌸"
  },
  {
    text: "Dear Pooja Rai, this is your official invitation to unlimited compliments, silly jokes, and sweet memories. 💌<br><strong>Will you accept this invitation?</strong>",
    hint: "Your answer is the plot twist I'm hoping for. 🎀"
  },
  {
    text: "I'd send you a thousand flowers, but none could quite match how special you are. 🌺<br><strong>Can I make you smile today?</strong>",
    hint: "One more question from this hopeless romantic. 🥹"
  },
  {
    text: "Imagine late-night talks, silly jokes, and little moments that become favourite memories. 🌙💗<br><strong>Would you like to see where this story goes?</strong>",
    hint: "Every beautiful story starts with a choice. 💖"
  }
];

const noLabels = [
  "Nooooo? 🌸",
  "Oops Yrrr? 💌",
  "Ask Me Again? 💗",
  "Catch me! 🙈",
  "Too slow! 🌷",
  "Try again! 💕",
  "Not Now! 🎀",
  "One tiny yes? 🥹",
  "Oops, over here! 🌹",
  "Your admirer awaits 💖"
];


/* ==========================================
   2. NO BUTTON MOVEMENT
   First 2 clicks: stays in place
   Clicks 3–7: moves but remains visible
   Click 8: hides
========================================== */

function moveNoButton() {
  if (accepted || noIsHidden) return;

  // Don't move before the third click.
  if (noClicks <= 2) return;

  // Hide only after the first 7 clicks.
  if (noClicks > NO_HIDE_AFTER) {
    noIsHidden = true;
    noBtn.style.display = "none";

    yesBtn.classList.add("yes-glowing");
    yesBtn.style.transform = "scale(1.3)";
    return;
  }

  const padding = 12;
  const rect = noBtn.getBoundingClientRect();

  // Switch to fixed positioning so the button can move
  // within the visible screen on mobile and desktop.
  noBtn.classList.add("running-away");
  noBtn.style.position = "fixed";
  noBtn.style.zIndex = "999";
  noBtn.style.display = "block";

  const buttonWidth = rect.width;
  const buttonHeight = rect.height;

  const maxX = Math.max(
    padding,
    window.innerWidth - buttonWidth - padding
  );

  const maxY = Math.max(
    padding,
    window.innerHeight - buttonHeight - padding
  );

  let x = padding + Math.random() * (maxX - padding);
  let y = padding + Math.random() * (maxY - padding);

  // Keep NO away from the YES button.
  const yesRect = yesBtn.getBoundingClientRect();

  const overlapsYes =
    x < yesRect.right + 15 &&
    x + buttonWidth > yesRect.left - 15 &&
    y < yesRect.bottom + 15 &&
    y + buttonHeight > yesRect.top - 15;

  if (overlapsYes) {
    x = x < window.innerWidth / 2
      ? Math.max(padding, window.innerWidth - buttonWidth - padding)
      : padding;

    y = Math.max(
      padding,
      Math.min(y + 100, maxY)
    );
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  // Make YES grow and glow.
  yesBtn.classList.add("yes-glowing");

  const scale = Math.min(1 + noClicks * 0.035, 1.3);
  yesBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("click", () => {
  if (accepted || noIsHidden) return;

  noClicks++;

  // Update the romantic message.
  const message = messages[(noClicks - 1) % messages.length];

  messageText.innerHTML = message.text;
  hint.textContent = message.hint;

  // Update NO button label.
  noBtn.textContent =
    noLabels[(noClicks - 1) % noLabels.length];

  // Change the heart emoji.
  mainHeart.textContent =
    ["💗", "💖", "💘", "💕", "💓"][noClicks % 5];

  if (noClicks <= 2) {
    // First two clicks: keep NO in its original position.
    noBtn.classList.remove("running-away");
    noBtn.style.position = "";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.zIndex = "";
    noBtn.style.display = "";
  } else if (noClicks <= NO_HIDE_AFTER) {
    // Clicks 3 through 7: move the button.
    moveNoButton();
  } else {
    // Eighth click: hide NO.
    moveNoButton();
  }

  // YES gradually grows.
  const scale = Math.min(1 + noClicks * 0.035, 1.3);
  yesBtn.style.transform = `scale(${scale})`;

  if (noClicks >= 3) {
    yesBtn.classList.add("yes-glowing");
  }
});

// Intentionally no pointerenter or pointerdown listeners.
// This prevents the button moving before a tap on mobile.

// Keep the moving button within the viewport after resizing.
window.addEventListener("resize", () => {
  if (accepted || noIsHidden || noClicks < 3) return;

  const rect = noBtn.getBoundingClientRect();
  const padding = 12;

  const maxX = Math.max(
    padding,
    window.innerWidth - rect.width - padding
  );

  const maxY = Math.max(
    padding,
    window.innerHeight - rect.height - padding
  );

  noBtn.style.left =
    `${Math.max(padding, Math.min(rect.left, maxX))}px`;

  noBtn.style.top =
    `${Math.max(padding, Math.min(rect.top, maxY))}px`;
});


/* ==========================================
   3. FLOWER RAIN
========================================== */

const flowers = [
  "🌸", "🌹", "🌺", "🌷", "💐",
  "🌼", "💮", "❤️", "💖", "✨", "💕"
];

function rainFlowers(amount = 100) {
  for (let i = 0; i < amount; i++) {
    const flower = document.createElement("span");

    flower.className = "flower";
    flower.textContent =
      flowers[Math.floor(Math.random() * flowers.length)];

    flower.style.left = Math.random() * 100 + "vw";
    flower.style.fontSize = (18 + Math.random() * 27) + "px";
    flower.style.animationDuration = (3 + Math.random() * 5) + "s";
    flower.style.animationDelay = (Math.random() * 1.5) + "s";

    flower.style.setProperty(
      "--drift",
      (Math.random() * 240 - 120) + "px"
    );

    flower.style.setProperty(
      "--spin",
      (Math.random() * 1000 - 500) + "deg"
    );

    flower.addEventListener("animationend", () => flower.remove());

    flowerLayer.appendChild(flower);
  }
}


/* ==========================================
   4. YES CELEBRATION
========================================== */

yesBtn.addEventListener("click", () => {
  if (accepted) return;

  accepted = true;

  noBtn.disabled = true;
  yesBtn.textContent = "YES! 💖";

  success.classList.add("show");

  rainFlowers(180);

  flowerTimer = setInterval(() => {
    if (!document.hidden) {
      rainFlowers(24);
    }
  }, 1600);
});

celebrateBtn.addEventListener("click", () => {
  previousFocus = celebrateBtn;

  whatsappPopup.classList.add("show");
  whatsappPopup.setAttribute("aria-hidden", "false");

  openWhatsAppBtn.focus();
});


/* ==========================================
   5. WHATSAPP POPUP CONTROLS
========================================== */

function closeWhatsAppDialog() {
  whatsappPopup.classList.remove("show");
  whatsappPopup.setAttribute("aria-hidden", "true");

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

closeWhatsAppPopup.addEventListener("click", closeWhatsAppDialog);
popupX.addEventListener("click", closeWhatsAppDialog);

// Clicking outside the popup card closes it.
whatsappPopup.addEventListener("click", (event) => {
  if (event.target === whatsappPopup) {
    closeWhatsAppDialog();
  }
});

// Escape key closes the popup.
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    whatsappPopup.classList.contains("show")
  ) {
    closeWhatsAppDialog();
  }
});


/* ==========================================
   6. OPEN WHATSAPP AFTER CONFIRMATION
========================================== */

openWhatsAppBtn.addEventListener("click", () => {
  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    alert(
      "Please add a valid WhatsApp number in script.js. " +
      "Include the country code without +, spaces or dashes."
    );
    return;
  }

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(WHATSAPP_MESSAGE);

  window.open(url, "_blank", "noopener,noreferrer");

  closeWhatsAppDialog();
});


/* ==========================================
   7. FLOWER RAIN VISIBILITY
========================================== */

document.addEventListener("visibilitychange", () => {
  if (document.hidden && flowerTimer) {
    clearInterval(flowerTimer);
    flowerTimer = null;
  } else if (!document.hidden && accepted && !flowerTimer) {
    flowerTimer = setInterval(() => rainFlowers(24), 1600);
  }
});


/* ==========================================
   8. THREE.JS FLOATING PARTICLES
========================================== */

(function initThree() {
  const canvas = document.getElementById("three-bg");

  if (!canvas || typeof THREE === "undefined") {
    if (canvas) canvas.style.display = "none";
    return;
  }

  try {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 65;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.7)
    );

    renderer.setSize(window.innerWidth, window.innerHeight);

    const count = window.innerWidth < 600 ? 350 : 750;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 115;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 95;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;

      speeds[i] = 0.008 + Math.random() * 0.025;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xff77ae,
      size: 0.38,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let animationFrame;
    let running = true;

    window.addEventListener("pointermove", (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animate() {
      if (!running) return;

      animationFrame = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const yIndex = i * 3 + 1;

        pos[yIndex] += speeds[i];

        if (pos[yIndex] > 48) {
          pos[yIndex] = -48;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      particles.rotation.y += 0.0007;
      particles.rotation.x = mouseY * 0.025;
      particles.rotation.y += mouseX * 0.0001;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.7)
      );

      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrame);
      } else if (!running) {
        running = true;
        animate();
      }
    });

  } catch (error) {
    canvas.style.display = "none";
    console.error("Three.js initialization failed:", error);
  }
})();
