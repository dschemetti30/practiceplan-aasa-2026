
// Feature cards interactive green highlight
(function() {
  const allCards = document.querySelectorAll('.bento-card');
  if (!allCards.length) return;

  function activateCard(card) {
    allCards.forEach(function(c) { c.classList.remove('highlight'); });
    card.classList.add('highlight');
  }

  allCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() { activateCard(card); });
    
    // Track touch - only activate on tap, not scroll
    var touchStartY = 0;
    card.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    card.addEventListener('touchend', function(e) {
      var touchEndY = e.changedTouches[0].clientY;
      if (Math.abs(touchEndY - touchStartY) < 10) {
        activateCard(card);
      }
    }, { passive: true });
  });

  // Start with first card highlighted
  allCards[0].classList.add('highlight');
})();

// Cost card strike-through animation
(function() {
  let costAnimated = false;
  const costGrid = document.querySelector('.cost-grid');
  if (!costGrid) return;
  
  const costObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !costAnimated) {
        costAnimated = true;
        const cards = document.querySelectorAll('.cost-card');
        cards.forEach(function(card, i) {
          // Step 1: Strike through the red text (staggered per card)
          setTimeout(function() {
            card.classList.add('struck');
          }, 800 + i * 350);
          // Step 2: Reveal green text and label
          setTimeout(function() {
            card.classList.add('revealed');
          }, 800 + i * 350 + 1000);
        });
        // Step 3: Reveal "Until now." after last card
        setTimeout(function() {
          var wrap = document.getElementById('costPunchlineWrap');
          var text = document.getElementById('costPunchline');
          if (wrap) { wrap.style.maxHeight = '2.5rem'; }
          setTimeout(function() {
            if (text) { text.style.opacity = '1'; }
          }, 300);
        }, 800 + 5 * 350 + 1000 + 600);
      }
    });
  }, { threshold: 0.3 });
  
  costObserver.observe(costGrid);
})();

// Hero form
function submitHero() {
  const name = document.getElementById('hName').value.trim();
  const org = document.getElementById('hOrg').value.trim();
  const email = document.getElementById('hEmail').value.trim();
  const phone = document.getElementById('hPhone').value.trim();
  if (!name || !email) {
    if (!name) flashBorder('hName');
    if (!email) flashBorder('hEmail');
    return;
  }
  // Submit to Google Form
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdfD5zbR6zjBNDgGNI4CPEJ3ieeAFC43PgKKKhYuB_gPKDDjQ/formResponse';
  const params = new URLSearchParams();
  params.append('entry.62845131', name);
  params.append('entry.668821882', org);
  params.append('entry.1564644554', email);
  params.append('entry.2045164055', phone);
  fetch(formUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  document.getElementById('heroFormTitle').style.display = 'none';
  document.getElementById('heroFormSub').style.display = 'none';
  document.getElementById('heroForm').style.display = 'none';
  document.getElementById('heroSuccess').classList.add('show');
}

// CTA form
function submitCta() {
  const email = document.getElementById('ctaEmail').value.trim();
  if (!email) { flashBorder('ctaEmail'); return; }
  // Submit to Google Form (email only, name/district blank)
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdfD5zbR6zjBNDgGNI4CPEJ3ieeAFC43PgKKKhYuB_gPKDDjQ/formResponse';
  const params = new URLSearchParams();
  params.append('entry.62845131', '');
  params.append('entry.668821882', '');
  params.append('entry.1564644554', email);
  fetch(formUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  document.getElementById('ctaForm2').style.display = 'none';
  document.getElementById('ctaSuccess').classList.add('show');
}

function flashBorder(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ff6b6b';
  setTimeout(() => { el.style.borderColor = ''; }, 2000);
}

// Testimonial Carousel
var currentSlide = 0;
var totalSlides = document.querySelectorAll('.testimonial-slide').length;
var carouselTimer;

function goToSlide(n) {
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.carousel-dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = n % totalSlides;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  resetTimer();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function resetTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextSlide, 6000);
}

resetTimer();

// ROI Calculator
function calcROI() {
  const fac = parseInt(document.getElementById('facSlider').value);
  const rent = parseInt(document.getElementById('rentSlider').value);
  const fee = parseInt(document.getElementById('feeSlider').value);

  document.getElementById('facVal').textContent = fac;
  document.getElementById('rentVal').textContent = rent;
  document.getElementById('feeVal').textContent = '$' + fee;

  const baseAnnual = fac * rent * fee * 12;
  const boosted = Math.round(baseAnnual * 1.4); // 40% increase
  document.getElementById('roiTotal').textContent = '$' + boosted.toLocaleString();
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// Init
calcROI();

// ===== DASHBOARD ANIMATION =====
(function() {
  let hasPlayed = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        hasPlayed = true;
        runDashboardAnimation();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(document.getElementById('demoContent'));

  function runDashboardAnimation() {
    var revenue = 600, bookings = 2;
    var ratings = [5]; // Start with 1 five-star review
    var revenueEl = document.getElementById('animRevenue');
    var bookingsEl = document.getElementById('animBookings');
    var starsEl = document.getElementById('animStars');
    var ratingEl = document.getElementById('animRating');
    var reviewCountEl = document.getElementById('animReviewCount');

    function updateRating(newScore) {
      ratings.push(newScore);
      var sum = 0;
      for (var i = 0; i < ratings.length; i++) sum += ratings[i];
      var avg = sum / ratings.length;
      var rounded = Math.round(avg * 10) / 10;
      ratingEl.textContent = rounded.toFixed(1);
      reviewCountEl.textContent = '(' + ratings.length + ')';
      var fullStars = Math.floor(rounded);
      var halfStar = (rounded - fullStars) >= 0.5;
      var starStr = '';
      for (var s = 0; s < fullStars; s++) starStr += '★';
      if (halfStar) { starStr += '★'; fullStars++; }
      for (var e = fullStars + (halfStar ? 0 : 0); e < 5; e++) starStr += '☆';
      starsEl.textContent = starStr;
      glowCard(ratingEl);
    }

    var fees = [450, 875, 1250, 550, 975, 650, 1100, 500, 825, 750, 1200, 475, 950, 600, 1050, 700, 525, 1150, 850, 575];
    var feeIdx = 0;

    // === Revenue roller ===
    function setRevenue(val) {
      revenue = val;
      var s = revenue.toLocaleString();
      var h = '<span class="revenue-static" style="margin-right:0.35em;">$</span>';
      for (var i = 0; i < s.length; i++) {
        if (s[i] === ',') {
          h += '<span class="revenue-static">,</span>';
        } else {
          var d = parseInt(s[i]);
          var inner = '';
          for (var n = 0; n <= 9; n++) inner += '<span>' + n + '</span>';
          h += '<span class="revenue-digit"><span class="revenue-digit-inner" style="transform:translateY(-' + (d * 1.4) + 'em);transition-delay:' + (i * 45) + 'ms">' + inner + '</span></span>';
        }
      }
      revenueEl.innerHTML = h;
      var inners = revenueEl.querySelectorAll('.revenue-digit-inner');
      for (var j = 0; j < inners.length; j++) {
        var el = inners[j];
        var tgt = el.style.transform;
        el.style.transition = 'none';
        el.style.transform = 'translateY(0)';
        void el.offsetHeight;
        el.style.transition = '';
        el.style.transform = tgt;
      }
    }

    function glowCard(el) {
      var card = el.closest ? el.closest('.mock-stat-card') : null;
      if (!card && el.parentElement) card = el.parentElement.closest('.mock-stat-card');
      if (card) { card.classList.add('glow'); setTimeout(function() { card.classList.remove('glow'); }, 1200); }
    }

    // Fade in stat cards
    var cards = document.querySelectorAll('.mock-stat-card');
    for (var ci = 0; ci < cards.length; ci++) {
      (function(c, i) { setTimeout(function() { c.classList.add('visible'); }, 300 + i * 300); })(cards[ci], ci);
    }

    // Set initial display values
    setRevenue(600);
    bookingsEl.textContent = '2';

    // === Calendar days + event data ===
    var allDays = Array.prototype.slice.call(document.querySelectorAll('#animCalendar .mock-day'));

    // Place 2 initial static bookings on the calendar
    (function() {
      var day3 = allDays[2]; // day 3
      var day8 = allDays[8]; // day 9
      if (day3) {
        var b1 = document.createElement('div');
        b1.className = 'ev-block ev-blue visible';
        b1.textContent = 'PP - Youth Basketball';
        b1.setAttribute('data-time', '6-8 PM');
        day3.appendChild(b1);
      }
      if (day8) {
        var b2 = document.createElement('div');
        b2.className = 'ev-block ev-green visible';
        b2.textContent = 'PP - Field Rental';
        b2.setAttribute('data-time', '9-11 AM');
        day8.appendChild(b2);
      }
    })();

    // Booking event templates - name, color, time
    var eventPool = [
      { name: 'PP - Youth Basketball', color: 'blue', time: '6-8 PM' },
      { name: 'PP - Soccer League', color: 'blue', time: '5-7 PM' },
      { name: 'PP - Cheer Practice', color: 'blue', time: '6-8 PM' },
      { name: 'PP - Dance Recital', color: 'blue', time: '7-9 PM' },
      { name: 'PP - Baseball League', color: 'blue', time: '4-6 PM' },
      { name: 'PP - Volleyball', color: 'teal', time: '6-8 PM' },
      { name: 'PP - Track Meet', color: 'teal', time: '9 AM-12 PM' },
      { name: 'PP - Swim Practice', color: 'teal', time: '3:30-5 PM' },
      { name: 'Faculty Meeting', color: 'gray', time: '3:30 PM' },
      { name: 'Board Meeting', color: 'gray', time: '6 PM' },
      { name: 'PTA Meeting', color: 'green', time: '6 PM' },
      { name: 'PP - Community Event', color: 'green', time: '9 AM-4 PM' },
      { name: 'PP - Tigers AAU', color: 'orange', time: '6-8 PM' },
      { name: 'PP - Tournament', color: 'orange', time: '8 AM-4 PM' },
      { name: 'Varsity Game', color: 'gray', time: '7 PM' },
      { name: 'PP - Gym Rental', color: 'blue', time: '5-8 PM' },
      { name: 'PP - Field Rental', color: 'green', time: '9-11 AM' },
    ];
    var evIdx = 0;

    function pickEvent() {
      var ev = eventPool[evIdx % eventPool.length];
      evIdx++;
      return ev;
    }

    // Toast
    var toastQueue = [];
    var toastBusy = false;

    function showToast(msg, onApprove) {
      toastQueue.push({ msg: msg, onApprove: onApprove });
      if (!toastBusy) processToastQueue();
    }

    function processToastQueue() {
      if (toastQueue.length === 0) { toastBusy = false; return; }
      toastBusy = true;
      var item = toastQueue.shift();
      var toast = document.getElementById('mockToast');
      var dot = document.getElementById('toastDot');
      var text = document.getElementById('toastText');
      var approveBtn = document.getElementById('toastApprove');
      var declineBtn = document.getElementById('toastDecline');

      // Reset state
      approveBtn.textContent = 'APPROVE';
      approveBtn.style.background = 'var(--green)';
      approveBtn.style.padding = '4px 8px';
      declineBtn.style.opacity = '1';
      text.textContent = item.msg;
      dot.style.animation = 'toastPulse 1.5s ease-in-out infinite';
      toast.style.opacity = '1';

      // After 1.2s, animate the approve button
      setTimeout(function() {
        approveBtn.style.background = '#00c95e';
        approveBtn.textContent = '✓ APPROVED';
        approveBtn.style.padding = '4px 10px';
        declineBtn.style.opacity = '0.3';

        // Trigger the calendar add + revenue after approve
        if (item.onApprove) {
          setTimeout(function() { item.onApprove(); }, 300);
        }
      }, 1400);

      // Fade out toast
      setTimeout(function() {
        toast.style.opacity = '0';
        dot.style.animation = '';
        setTimeout(function() { processToastQueue(); }, 600);
      }, 3800);
    }

    // Is this a PP (PracticePlan revenue) booking?
    function isPPEvent(ev) { return ev.name.indexOf('PP') === 0; }

    // === Add an event block to a day ===
    function addEventToDay(dayEl, ev) {
      // Show toast first, calendar add happens on approve
      var toastMsg = isPPEvent(ev) ? 'New request: ' + ev.name.replace('PP - ', '') + ' - ' + ev.time : ev.name + ' - ' + ev.time;

      var fee = fees[feeIdx % fees.length];

      showToast(toastMsg, function() {
        // Add block to calendar
        var block = document.createElement('div');
        block.className = 'ev-block ev-' + ev.color;
        block.textContent = ev.name;
        block.setAttribute('data-time', ev.time);
        dayEl.appendChild(block);

        requestAnimationFrame(function() {
          requestAnimationFrame(function() { block.classList.add('visible'); });
        });

        // Checkmark
        setTimeout(function() { dayEl.classList.add('booked'); }, 200);
        setTimeout(function() { dayEl.classList.add('check-fade'); }, 2500);
        setTimeout(function() { dayEl.classList.remove('booked', 'check-fade'); }, 3100);

        // Stats - only PP bookings generate revenue
        if (isPPEvent(ev)) {
          bookings++;
          bookingsEl.textContent = bookings;
          glowCard(bookingsEl);
          setTimeout(function() {
            setRevenue(revenue + fee);
            glowCard(revenueEl);
            feeIdx++;
            // Only ~40% of bookings leave a review
            if (Math.random() < 0.4) {
              var score = (Math.random() < 0.7) ? 5 : 4;
              updateRating(score);
            }
          }, 600);
        }
      });
    }

    // How many event blocks does a day currently have?
    function dayEventCount(dayEl) {
      return dayEl.querySelectorAll('.ev-block').length;
    }

    // Shuffle helper
    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    // === Build initial event schedule ===
    // Create a random fill plan: some days get 1 event, some get 2, some stay empty
    var fillPlan = [];
    var shuffledDays = shuffle(allDays);
    // ~60% of days get at least 1 event, ~25% get 2
    for (var di = 0; di < shuffledDays.length; di++) {
      var r = Math.random();
      if (r < 0.35) continue; // empty
      fillPlan.push({ day: shuffledDays[di], ev: pickEvent() });
      if (r > 0.75) {
        fillPlan.push({ day: shuffledDays[di], ev: pickEvent() });
      }
    }
    // Shuffle the fill plan so multi-event days aren't always back to back
    fillPlan = shuffle(fillPlan);

    // Animate initial fill
    for (var fi = 0; fi < fillPlan.length; fi++) {
      (function(item, idx) {
        setTimeout(function() { addEventToDay(item.day, item.ev); }, 2000 + idx * 800);
      })(fillPlan[fi], fi);
    }

    // === Continuous cycling ===
    var cycleStart = 2000 + fillPlan.length * 800 + 2500;
    setTimeout(function() {
      setInterval(function() {
        // Sometimes remove an old event block
        var allBlocks = document.querySelectorAll('#animCalendar .ev-block.visible');
        if (allBlocks.length > 12 && Math.random() > 0.3) {
          var rmBlock = allBlocks[Math.floor(Math.random() * allBlocks.length)];
          rmBlock.classList.remove('visible');
          setTimeout(function() { if (rmBlock.parentNode) rmBlock.parentNode.removeChild(rmBlock); }, 600);
        }

        // Add a new event to a random day (prefer days with fewer events)
        var candidates = allDays.filter(function(d) { return dayEventCount(d) < 3; });
        if (candidates.length > 0) {
          var addDay = candidates[Math.floor(Math.random() * candidates.length)];
          addEventToDay(addDay, pickEvent());
        }
      }, 3800);
    }, cycleStart);
  }
})();
