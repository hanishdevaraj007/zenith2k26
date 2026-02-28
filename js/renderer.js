/**
 * ZENITH 2K26 - Event & Team Renderer
 * Creates dynamic event cards and team member displays
 */

window.renderEventCards = (data, gridId, category) => {
  'use strict';

  const grid = document.getElementById(gridId);
  if (!grid || !data || !Array.isArray(data)) return;

  data.forEach((event) => {
    if (!event || !event.id) return;

    const card = document.createElement('div');
    card.className = 'event-card';
    if (category === 'fun') {
      card.classList.add('card-placeholder');
    }
    card.setAttribute('data-event-id', event.id);

    // Get coordinator name safely
    const coordinatorName = (event.coordinators && event.coordinators[0]) ?
      event.coordinators[0].name :
      'Coordinator';

    // Build card HTML
    card.innerHTML = `
      <div class="card-accent-bar"></div>
      <div class="card-body">
        <span class="card-num">${event.number || ''}</span>
        <h3 class="card-name">${event.name || ''}</h3>
        <p class="card-tagline">${event.tagline || ''}</p>
        <hr class="card-divider">
        <div class="card-footer">
          <span class="card-coordinator">${coordinatorName}</span>
          <button class="view-details btn-crack" type="button">View Details →</button>
        </div>
      </div>
    `;

    // Add game type badge for fun events
    if (category === 'fun' && event.gameType) {
      const gameTypeBadge = document.createElement('span');
      gameTypeBadge.className = 'card-game-type';
      gameTypeBadge.textContent = event.gameType;
      const footer = card.querySelector('.card-footer');
      const details = card.querySelector('.view-details');
      if (footer && details) {
        footer.insertBefore(gameTypeBadge, details);
      }
    }

    grid.appendChild(card);

    // Add 3D tilt effect on hover (desktop only)
    if (!document.body.classList.contains('is-mobile')) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 8;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -8;

        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      });
    }
  });
};

window.EventPanel = (function() {
  'use strict';

  let panel = null;
  let panelInner = null;
  let panelBack = null;
  let isOpen = false;

  function init() {
    panel = document.getElementById('event-panel');
    panelInner = document.getElementById('event-panel-inner');
    panelBack = panel ? panel.querySelector('.panel-back') : null;

    if (panelBack) {
      panelBack.addEventListener('click', close);
    }

    document.addEventListener('keydown', handleEscape);

    // Delegate click handler for view-details buttons
    document.addEventListener('click', handleCardClick);
  }

  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  }

  function handleCardClick(e) {
    const button = e.target.closest('.view-details');
    if (button) {
      const card = button.closest('.event-card');
      if (card) {
        const eventId = card.getAttribute('data-event-id');
        open(eventId);
      }
    }
  }

  function open(eventId) {
    if (!panel || !panelInner || isOpen) return;
    isOpen = true;

    // Find event in data
    let event = null;

    if (window.techEvents) {
      event = window.techEvents.find(e => e.id === eventId);
    }
    if (!event && window.nonTechEvents) {
      event = window.nonTechEvents.find(e => e.id === eventId);
    }
    if (!event && window.funEvents) {
      event = window.funEvents.find(e => e.id === eventId);
    }

    if (!event) {
      isOpen = false;
      return;
    }

    // Build content
    const prizeHtml = buildPrizeHtml(event);
    const coordinatorsHtml = buildCoordinatorsHtml(event);
    const roundsHtml = buildRoundsHtml(event);
    const rulesHtml = buildRulesHtml(event);

    const content = `
      <div class="event-panel-left">
        <h1>${event.name || ''}</h1>
        <p class="panel-description">${event.description || ''}</p>
        <div class="panel-format">
          <h3>Format</h3>
          <p>${event.format || ''}</p>
        </div>
        ${roundsHtml}
        ${rulesHtml}
      </div>
      <div class="event-panel-right">
        ${prizeHtml}
        ${coordinatorsHtml}
        <a href="${event.registrationLink || '#'}" target="_blank" class="panel-register-btn btn-crack">Register for Event →</a>
      </div>
    `;

    panelInner.innerHTML = content;
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Animate panel back button
    if (panelBack && typeof gsap !== 'undefined') {
      gsap.to(panelBack, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        delay: 0.3
      });
    }

    if (window.SoundSystem && window.SoundSystem.playPanelOpen) {
      window.SoundSystem.playPanelOpen();
    }

    // Re-init button crack for dynamically created buttons
    if (window.ButtonCrack && window.ButtonCrack.init) {
      window.ButtonCrack.init();
    }
  }

  function close() {
    if (!panel || !isOpen) return;
    isOpen = false;

    if (typeof gsap !== 'undefined') {
      // Fade content
      gsap.to(panelInner, {
        opacity: 0,
        duration: 0.2
      });

      // Animate out
      gsap.to(panel, {
        y: '100vh',
        duration: 0.5,
        ease: 'power4.out',
        onComplete: () => {
          panel.classList.remove('open');
          if (panelInner) panelInner.innerHTML = '';
          document.body.style.overflow = '';
          gsap.set(panelInner, { opacity: 1 });
          if (panelBack) gsap.set(panelBack, { opacity: 0, pointerEvents: 'none' });
        }
      });
    } else {
      // Fallback without GSAP
      panel.classList.remove('open');
      if (panelInner) panelInner.innerHTML = '';
      document.body.style.overflow = '';
    }

    if (window.SoundSystem && window.SoundSystem.playPanelClose) {
      window.SoundSystem.playPanelClose();
    }
  }

  function buildPrizeHtml(event) {
    if (!event.prizes) return '';
    return `
      <div class="prize-card">
        <h3>Prize Pool</h3>
        <div class="prize-tier">
          <span class="prize-label">🥇 First Place</span>
          <span class="prize-amount">${event.prizes.first || ''}</span>
        </div>
        <div class="prize-tier">
          <span class="prize-label">🥈 Second Place</span>
          <span class="prize-amount">${event.prizes.second || ''}</span>
        </div>
        <div class="prize-tier">
          <span class="prize-label">🏅 Consolation</span>
          <span class="prize-amount">${event.prizes.consolation || ''}</span>
        </div>
      </div>
    `;
  }

  function buildCoordinatorsHtml(event) {
    if (!event.coordinators || event.coordinators.length === 0) return '';
    return event.coordinators.map(c => `
      <div class="coordinator-card">
        <div class="coordinator-name">${c.name || ''}</div>
        <div class="coordinator-role">${c.role || ''}</div>
        <div class="coordinator-phone">${c.phone || ''}</div>
      </div>
    `).join('');
  }

  function buildRoundsHtml(event) {
    if (!event.rounds || event.rounds.length === 0) return '';
    return `
      <div class="panel-rounds">
        <h3>Rounds</h3>
        <ol>
          ${event.rounds.map(r => `<li>${r}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  function buildRulesHtml(event) {
    if (!event.rules || event.rules.length === 0) return '';
    return `
      <div class="panel-rules">
        <h3>Rules & Guidelines</h3>
        <ul>
          ${event.rules.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    open,
    close
  };
})();

window.renderTeam = (function() {
  'use strict';

  return function() {
    const container = document.getElementById('team-container');
    if (!container || !window.teamData || !window.teamData.tiers) return;

    window.teamData.tiers.forEach((tier) => {
      if (!tier) return;

      const tierDiv = document.createElement('div');
      tierDiv.className = 'team-tier';

      // Tier header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'tier-header';

      const labelDiv = document.createElement('p');
      labelDiv.className = 'tier-label';
      labelDiv.textContent = tier.label || '';

      const dividerDiv = document.createElement('div');
      dividerDiv.className = 'tier-divider';

      headerDiv.appendChild(labelDiv);
      headerDiv.appendChild(dividerDiv);
      tierDiv.appendChild(headerDiv);

      // Members grid
      const gridDiv = document.createElement('div');
      gridDiv.className = 'tier-grid';

      if (tier.members && Array.isArray(tier.members)) {
        tier.members.forEach((member) => {
          if (!member) return;

          const card = document.createElement('div');
          card.className = 'member-card';

          const initials = (member.name || '')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

          card.innerHTML = `
            <div class="member-photo-wrap">
              <div class="member-photo-inner">
                ${member.photo ? 
                  `<img src="${member.photo}" alt="${member.name}" loading="lazy">` :
                  `<div class="member-photo-placeholder">${initials}</div>`
                }
              </div>
            </div>
            <p class="member-name">${member.name || ''}</p>
            <p class="member-role">${member.role || ''}</p>
            ${member.linkedin ? 
              `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="member-linkedin" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 0H4C1.791 0 0 1.791 0 4v16c0 2.209 1.791 4 4 4h16c2.209 0 4-1.791 4-4V4c0-2.209-1.791-4-4-4zM8 20H5v-9h3v9zm-1.5-10.267c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75c.967 0 1.75.784 1.75 1.75s-.783 1.75-1.75 1.75zM19 20h-3v-4.374c0-1.042-.019-2.382-1.452-2.382-1.452 0-1.674 1.135-1.674 2.306V20h-3v-9h2.88v1.231h.041c.401-.76 1.379-1.561 2.836-1.561 3.04 0 3.6 2 3.6 4.609V20z"/>
                </svg>
              </a>` :
              ''
            }
          `;

          gridDiv.appendChild(card);
        });
      }

      tierDiv.appendChild(gridDiv);
      container.appendChild(tierDiv);
    });
  };
})();
