history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// ==========================================================================
// 1. COUNTDOWN TIMER
// ==========================================================================
function updateCountdown() {
  const target = new Date('2026-07-19T17:00:00+06:00').getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent = '0';
    document.getElementById('cd-secs').textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = hours;
  document.getElementById('cd-mins').textContent = mins;
  document.getElementById('cd-secs').textContent = secs;

  updateLabels(days, hours, mins, secs);
}

function getWordForm(number, one, two, five) {
  let n = Math.abs(number) % 100;
  if (n >= 5 && n <= 20) return five;
  n %= 10;
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return two;
  return five;
}

function updateLabels(d, h, m, s) {
  const labels = document.querySelectorAll('.count-label');
  if (labels.length >= 4) {
    labels[0].textContent = getWordForm(d, 'күн', 'күн', 'күн');
    labels[1].textContent = getWordForm(h, 'саат', 'саат', 'саат');
    labels[2].textContent = getWordForm(m, 'мүнөт', 'мүнөт', 'мүнөт');
    labels[3].textContent = getWordForm(s, 'секунда', 'секунда', 'секунда');
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================================================
// 2. SCROLL ANIMATION (Intersection Observer)
// ==========================================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll('[data-animate]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'all 0.8s ease';
  observer.observe(el);
});

// ==========================================================================
// 3. INTRO OVERLAY, MUSIC & FORM INTERACTIVE
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
  const introOverlay = document.getElementById("intro-overlay");
  const envelopeLink = document.getElementById("envelope-link");
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");

  const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
  const guestsGroup = document.getElementById('guests-count-group');
  const countInput = document.getElementById('guests-count');
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const phoneInput = document.getElementById('phone');

  const form = document.getElementById('guest-form');
  const sendMsg = document.getElementById('send-msg');
  const submitBtn = document.querySelector('.btn-submit');

  // Сайт ачылганда скроллду блоктоо
  document.body.classList.add("no-scroll");

  // Музыканы жай баштоо (Fade-in)
  function fadeInMusic(audioElement, duration = 2000) {
    audioElement.volume = 0;
    audioElement.play().then(() => {
      let startTime = performance.now();
      function animateVolume(now) {
        let elapsed = now - startTime;
        let progress = Math.min(elapsed / duration, 1);
        audioElement.volume = progress;
        if (progress < 1) {
          requestAnimationFrame(animateVolume);
        }
      }
      requestAnimationFrame(animateVolume);
    }).catch(err => console.log("Браузер автоплейди блоктоду:", err));
  }

  // Музыканы жандыруу / өчүрүү баскычы
  function handleToggleMusic() {
    if (!bgMusic || !musicBtn) return;

    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          musicBtn.textContent = '🔊';
          musicBtn.classList.add('playing');
          bgMusic.volume = 1;
        })
        .catch(err => console.log("Ката кетти: ", err));
    } else {
      bgMusic.pause();
      musicBtn.textContent = '🎵';
      musicBtn.classList.remove('playing');
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation(); 
      handleToggleMusic();
    });
  }

  // Конвертти басканда оверлейдин жоголушу
  if (envelopeLink && introOverlay && bgMusic) {
    envelopeLink.addEventListener("click", function(e) {
      e.preventDefault();
      envelopeLink.style.pointerEvents = "none";
      envelopeLink.classList.add("fade-out");

      fadeInMusic(bgMusic, 2500);
      if (musicBtn) {
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
      }

      setTimeout(() => {
        introOverlay.classList.add("hidden");
        document.body.classList.remove("no-scroll");
      }, 1000);

      setTimeout(() => {
        introOverlay.style.display = "none";
      }, 2200);
    });
  }

  // Телефон номерин текшерүү (сандар гана)
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9+() \s-]/g, '');
    });
  }

  // Коноктордун саны блогун көрсөтүү/жашыруу
  attendanceInputs.forEach(input => {
    input.addEventListener('change', function () {
      if (this.value === 'yes') {
        guestsGroup.classList.add('show-block');
      } else {
        guestsGroup.classList.remove('show-block');
        countInput.value = 1;
      }
    });
  });

  // Плюс / Минус баскычтары
  if (btnMinus && btnPlus && countInput) {
    btnMinus.addEventListener('click', function () {
      let val = parseInt(countInput.value) || 1;
      if (val > 1) countInput.value = val - 1;
    });

    btnPlus.addEventListener('click', function () {
      let val = parseInt(countInput.value) || 1;
      if (val < 10) countInput.value = val + 1;
    });
  }

  // Telegram-га билдирүү жөнөтүү
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); 

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const selected = document.querySelector('input[name="attendance"]:checked');

      if (!name || !phone || !selected) return;

      let attendanceText = '';
      if (selected.value === 'yes') {
        const guestsCount = document.getElementById('guests-count').value;
        attendanceText = `Ооба, кубануу менен барамын ✅\n👥 *Коноктордун саны:* ${guestsCount} киши`;
      } else {
        attendanceText = `Тилекке каршы, бара албайм ❌`;
      }

      const text =
        `*Новая заявка *\n\n` +
        `👤 *ФИО:* ${name}\n` +
        `📞 *Телефон:* ${phone}\n` +
        `📊 *Статус:* ${attendanceText}`;

      if (submitBtn) submitBtn.disabled = true;

      try {
        await fetch(`https://api.telegram.org/bot8147402440:AAHFZpIrViUZ-GHMSDPky1x3-FqBR-h6Y4A/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "8242291287",
            text: text,
            parse_mode: "Markdown"
          })
        });

        if (sendMsg) {
          sendMsg.classList.add('show');
          sendMsg.classList.remove('hide');
        }
        if (submitBtn) submitBtn.style.display = 'none';
        
        form.reset();
        if (guestsGroup) guestsGroup.classList.remove('show-block');
        
        setTimeout(() => {
          if (sendMsg) {
            sendMsg.classList.add('hide');
            setTimeout(() => {
              sendMsg.classList.remove('show');
              sendMsg.classList.remove('hide');
              if (submitBtn) {
                submitBtn.style.display = 'block';
                submitBtn.disabled = false;
              }
            }, 600);
          }
        }, 2500);

      } catch (err) {
        console.error("Telegram error:", err);
        if (submitBtn) submitBtn.disabled = false;
        alert("Ката кетти. Кайра аракет кылык көрүңүз.");
      }
    });
  }
});