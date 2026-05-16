history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// Countdown timer
function updateCountdown() {
  // Обновленная дата: 19 июля 2026, 16:00
  const target = new Date('2026-07-19T16:00:00+06:00').getTime();
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

  // Добавляем правильные склонения слов
  updateLabels(days, hours, mins, secs);
}

// Функция для склонения существительных
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

// Scroll animation
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

// Music
// --- ИСПРАВЛЕННЫЙ БЛОК ИНТЕРАКТИВА ОВЕРЛЕЯ И МУЗЫКИ ---
document.addEventListener("DOMContentLoaded", function() {
  const introOverlay = document.getElementById("intro-overlay");
  const envelopeLink = document.getElementById("envelope-link"); // Наш конверт-ссылка
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");

  // Блокируем скролл сайта изначально, чтобы гость не крутил пустую страницу
  document.body.classList.add("no-scroll");

  // Функция плавного нарастания громкости (Fade-in) для красоты
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
    }).catch(err => console.log("Браузер заблокировал автоплей:", err));
  }

  // Функция переключения музыки Плей / Пауза на самом сайте
  function handleToggleMusic() {
    if (!bgMusic || !musicBtn) return;

    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          musicBtn.textContent = '🔊';
          musicBtn.classList.add('playing');
          bgMusic.volume = 1;
        })
        .catch(err => console.log("Ошибка воспроизведения: ", err));
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

  // КЛИК ПО КОНВЕРТУ (Исчезновение + старт музыки и сайта)
  if (envelopeLink && introOverlay && bgMusic) {
    envelopeLink.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Защита от повторных кликов
      envelopeLink.style.pointerEvents = "none";

      // 1. Запускаем анимацию исчезновения самого конверта
      envelopeLink.classList.add("fade-out");

      // 2. Включаем трек с красивым нарастанием звука
      fadeInMusic(bgMusic, 2500);
      if (musicBtn) {
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
      }

      // 3. Через 1 секунду плавно гасим и убираем весь темный фон
      setTimeout(() => {
        introOverlay.classList.add("hidden");
        document.body.classList.remove("no-scroll"); // Разрешаем скроллить сайт!
      }, 1000);

      // 4. Через 2.2 секунды полностью удаляем оверлей из разметки, чтобы не мешал
      setTimeout(() => {
        introOverlay.style.display = "none";
      }, 2200);
    });
  }
});
// RSVP
function submitRSVP() {
  const name = document.getElementById('rsvp-name').value.trim();
  const success = document.getElementById('success-msg');
  const button = document.querySelector('.rsvp-submit');

  if (!name) {
    const input = document.getElementById('rsvp-name');
    input.focus();
    input.style.borderColor = '#E53935';
    setTimeout(() => {
      input.style.borderColor = 'var(--crimson)';
    }, 1500);
    return;
  }

  success.style.display = 'block';
  button.style.display = 'none';
  success.style.opacity = '0';

  setTimeout(() => {
    success.style.transition = '0.5s';
    success.style.opacity = '1';
  }, 100);
}


    // 2. Scroll Animation for Program Items
    const programObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.program-item').forEach(el => programObserver.observe(el));

    // 3. Heart Path Animation
    const heart = document.getElementById('heart-follower');
    const path = document.getElementById('scroll-path');
    const pathLength = path.getTotalLength();
    const scrollSection = document.getElementById('scroll-section');

    function animateHeart() {
        if (!scrollSection) return;
        const rect = scrollSection.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        
        let progress = (viewHeight / 2 - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));

        const point = path.getPointAtLength(progress * pathLength);
        
        heart.style.left = point.x + 'px';
        heart.style.top = point.y + 'px';
        
        const rotateVal = Math.sin(progress * Math.PI * 6) * 15;
        heart.style.transform = `translate(-50%, -50%) rotate(${rotateVal}deg)`;
    }

    window.addEventListener('scroll', animateHeart);
    window.addEventListener('resize', animateHeart);
    requestAnimationFrame(animateHeart);

    document.addEventListener('DOMContentLoaded', function () {

    const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
    const guestsGroup = document.getElementById('guests-count-group');

    const countInput = document.getElementById('guests-count');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9+() \s-]/g, '');
    });

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

    btnMinus.addEventListener('click', function () {
        let val = parseInt(countInput.value) || 1;
        if (val > 1) countInput.value = val - 1;
    });

    btnPlus.addEventListener('click', function () {
        let val = parseInt(countInput.value) || 1;
        if (val < 10) countInput.value = val + 1;
    });

});

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('guest-form');
    const sendMsg = document.getElementById('send-msg');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        sendMsg.classList.add('show');
        sendMsg.classList.remove('hide');

        form.reset();

        setTimeout(() => {
            sendMsg.classList.add('hide');

            setTimeout(() => {
                sendMsg.classList.remove('show');
                sendMsg.classList.remove('hide');
            }, 600);

        }, 2500);
    });

});


// бб
document.getElementById('guest-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Чтобы страница не перезагружалась

    // 1. Подставьте сюда свои данные из Шагов 1 и 2:
    const tgToken = "8147402440:AAHFZpIrViUZ-GHMSDPky1x3-FqBR-h6Y4A";
    const tgChatId = "8242291287";

    // 2. Собираем данные из полей:
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value === 'yes' ? '✅ Придет' : '❌ Не смогу';
    
    // Смотрим количество гостей (если блок показан):
    const guestsGroup = document.getElementById('guests-count-group');
    const guestsCount = !guestsGroup.classList.contains('hidden-group') ? document.getElementById('guests-count').value : 0;

    // 3. Формируем текст сообщения:
    let text = `🔔 *Новый ответ!*\n\n`;
    text += `👤 *Имя:* ${name}\n`;
    text += `📞 *Тел:* ${phone}\n`;
    text += `❓ *Статус:* ${attendance}\n`;
    if (guestsCount > 0) {
        text += `👨‍👩‍👧‍👦 *Количество мест:* ${guestsCount}\n`;
    }

    // 4. Отправляем в Telegram:
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: tgChatId,
            text: text,
            parse_mode: "Markdown"
        })
    })

});


