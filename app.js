(() => {
  document.documentElement.classList.add('js');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Re-apply deep links after deferred images settle so shared section URLs
  // arrive at the intended content without layout-shift drift.
  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    window.setTimeout(() => target?.scrollIntoView(), 120);
  });

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('is-open');
    header?.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const shouldOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    mobileNav?.classList.toggle('is-open', shouldOpen);
    header?.classList.toggle('menu-open', shouldOpen);
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const desktopLinks = [...document.querySelectorAll('.desktop-nav a')];
  const observedSections = desktopLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      desktopLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.01, 0.25] });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const stickyCtas = [...document.querySelectorAll('[data-sticky-cta]')];
  const stickyCtaBlockers = [document.querySelector('.hero'), document.querySelector('.site-footer')].filter(Boolean);
  const setStickyCtasHidden = (hidden) => {
    stickyCtas.forEach((cta) => {
      cta.classList.toggle('is-hidden', hidden);
      if (hidden) {
        cta.setAttribute('aria-hidden', 'true');
        cta.setAttribute('tabindex', '-1');
      } else {
        cta.removeAttribute('aria-hidden');
        cta.removeAttribute('tabindex');
      }
    });
  };

  if (stickyCtas.length && stickyCtaBlockers.length) {
    let stickyCtaFrame = 0;
    const updateStickyCtas = () => {
      stickyCtaFrame = 0;
      const blocked = stickyCtaBlockers.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      });
      setStickyCtasHidden(blocked);
    };
    const scheduleStickyCtaUpdate = () => {
      if (stickyCtaFrame) return;
      stickyCtaFrame = window.requestAnimationFrame(updateStickyCtas);
    };
    updateStickyCtas();
    window.addEventListener('scroll', scheduleStickyCtaUpdate, { passive: true });
    window.addEventListener('resize', scheduleStickyCtaUpdate);
  } else {
    setStickyCtasHidden(false);
  }

  const plans = {
    a: {
      title: 'Type A · 525 sq. ft.',
      description: 'An efficient 1+1-bedroom home with a dedicated study, bay-window design and a naturally lit living area.',
      features: ['Kitchen fitted by Signature', 'Smart-home system', 'Inverter air-conditioners'],
      image: 'assets/plan-a-white-1400.webp',
      srcset: 'assets/plan-a-white-720.webp 720w, assets/plan-a-white-1400.webp 1400w',
      alt: 'Type A 525 square foot floor plan at Ophira Resort Residences', width: 1058, height: 1487
    },
    b: {
      title: 'Type B · 722 sq. ft.',
      description: 'A practical 2+1-bedroom, 2-bathroom home with a dedicated study and well-separated private spaces.',
      features: ['2+1-bedroom layout', 'Two bathrooms', 'Single car park'],
      image: 'assets/plan-b-white-1400.webp',
      srcset: 'assets/plan-b-white-720.webp 720w, assets/plan-b-white-1400.webp 1400w',
      alt: 'Type B 722 square foot floor plan at Ophira Resort Residences', width: 1400, height: 796
    },
    c: {
      title: 'Type C · 840 sq. ft.',
      description: 'A balanced 3-bedroom, 2-bathroom residence with a balcony and connected living, dining and kitchen zones.',
      features: ['Three-bedroom layout', 'Two bathrooms', 'Two tandem car parks'],
      image: 'assets/plan-c-white-1400.webp',
      srcset: 'assets/plan-c-white-720.webp 720w, assets/plan-c-white-1400.webp 1400w',
      alt: 'Type C 840 square foot floor plan at Ophira Resort Residences', width: 1400, height: 796
    },
    c1: {
      title: 'Type C1 · 902 sq. ft.',
      description: 'A 3-bedroom, 3-bathroom dual-key-enabled home designed to give the junior suite added privacy.',
      features: ['Dual-key-enabled layout', 'Two tandem car parks', 'Three bathrooms'],
      image: 'assets/plan-c1-white-1400.webp',
      srcset: 'assets/plan-c1-white-720.webp 720w, assets/plan-c1-white-1400.webp 1400w',
      alt: 'Type C1 902 square foot dual-key-enabled floor plan at Ophira Resort Residences', width: 1400, height: 1034
    },
    d: {
      title: 'Type D · 1,006 sq. ft.',
      description: 'A spacious 4-bedroom, 2-bathroom family residence with a balcony and generous shared living areas.',
      features: ['Four-bedroom layout', 'Two bathrooms', 'Two to three side-by-side car parks'],
      image: 'assets/plan-d-white-1400.webp',
      srcset: 'assets/plan-d-white-720.webp 720w, assets/plan-d-white-1400.webp 1400w',
      alt: 'Type D 1006 square foot floor plan at Ophira Resort Residences', width: 1400, height: 796
    },
    d1: {
      title: 'Type D1 · 1,020 sq. ft.',
      description: 'A 4-bedroom, 3-bathroom dual-key-enabled family layout with generous separation between living zones.',
      features: ['Dual-key-enabled layout', 'Three side-by-side car parks', 'Flexible internal wall'],
      image: 'assets/plan-d1-white-1400.webp',
      srcset: 'assets/plan-d1-white-720.webp 720w, assets/plan-d1-white-1400.webp 1400w',
      alt: 'Type D1 1020 square foot dual-key-enabled floor plan at Ophira Resort Residences', width: 1400, height: 961
    }
  };

  const planTabs = [...document.querySelectorAll('[data-plan]')];
  const planTitle = document.querySelector('[data-plan-title]');
  const planDescription = document.querySelector('[data-plan-description]');
  const planFeatures = document.querySelector('[data-plan-features]');
  const planImage = document.querySelector('[data-plan-image]');
  const planPanel = document.querySelector('#plan-panel');
  const planCta = planPanel?.querySelector('[data-form-interest]');

  const selectPlan = (tab, moveFocus = false) => {
    const plan = plans[tab?.dataset.plan];
    if (!plan || !planTitle || !planDescription || !planFeatures || !planImage) return;
    planTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    planTitle.textContent = plan.title;
    planDescription.textContent = plan.description;
    planFeatures.replaceChildren(...plan.features.map((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    planImage.src = plan.image;
    planImage.srcset = plan.srcset;
    planImage.alt = plan.alt;
    planImage.width = plan.width;
    planImage.height = plan.height;
    planImage.dataset.planKey = tab.dataset.plan;
    planPanel.setAttribute('aria-labelledby', tab.id);
    if (planCta) planCta.dataset.formInterest = plan.title;
    if (moveFocus) tab.focus();
  };

  planTabs.forEach((tab, index) => {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    tab.addEventListener('click', () => selectPlan(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % planTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + planTabs.length) % planTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = planTabs.length - 1;
      selectPlan(planTabs[nextIndex], true);
    });
  });

  const form = document.querySelector('[data-enquiry-form]');
  const result = document.querySelector('[data-form-result]');
  const shareButton = document.querySelector('[data-share-enquiry]');
  const submitButton = form?.querySelector('[type="submit"]');
  const interestSelect = form?.querySelector('[name="interest"]');
  const formEndpoint = String(window.OPHIRA_FORM_ENDPOINT || '').trim();
  let preparedMessage = '';

  document.querySelectorAll('[data-form-interest]').forEach((cta) => {
    cta.addEventListener('click', () => {
      const requestedInterest = cta.dataset.formInterest;
      if (!interestSelect || !requestedInterest) return;
      const option = [...interestSelect.options].find((item) => item.value === requestedInterest);
      if (option) interestSelect.value = option.value;
    });
  });

  const showValidation = () => {
    const invalid = [...form.querySelectorAll('input, select, textarea')].filter((field) => !field.checkValidity());
    form.querySelectorAll('.form-row').forEach((row) => row.classList.remove('is-invalid'));
    invalid.forEach((field) => field.closest('.form-row')?.classList.add('is-invalid'));
    invalid[0]?.focus();
    return invalid.length === 0;
  };

  form?.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) field.closest('.form-row')?.classList.remove('is-invalid');
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!showValidation()) return;

    const data = new FormData(form);
    preparedMessage = [
      'Ophira Resort Residences enquiry',
      `Name: ${data.get('name')}`,
      `Contact phone: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `Interest: ${data.get('interest')}`,
      data.get('message') ? `Message: ${data.get('message')}` : ''
    ].filter(Boolean).join('\n');

    const originalLabel = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.textContent = 'Sending enquiry…';
    }

    try {
      if (!formEndpoint) throw new Error('No form endpoint configured');
      await fetch(formEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          interest: data.get('interest'),
          message: data.get('message'),
          source: window.location.href,
          website: data.get('website')
        })
      });
      form.reset();
      if (result) {
        result.hidden = false;
        result.querySelector('p').textContent = 'Thank you. Your enquiry has been sent to the Ophira sales team.';
      }
      if (shareButton) shareButton.hidden = true;
    } catch (error) {
      if (result) {
        result.hidden = false;
        result.querySelector('p').textContent = 'The direct connection is temporarily unavailable. You can still share the prepared enquiry.';
      }
      if (shareButton) {
        shareButton.hidden = false;
        shareButton.focus();
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.textContent = originalLabel || 'Request latest details';
      }
    }
  });

  shareButton?.addEventListener('click', async () => {
    if (!preparedMessage) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ophira Resort Residences enquiry', text: preparedMessage });
        shareButton.textContent = 'Enquiry shared';
      } else {
        await navigator.clipboard.writeText(preparedMessage);
        shareButton.textContent = 'Copied to clipboard';
      }
    } catch (error) {
      if (error?.name !== 'AbortError') shareButton.textContent = 'Copy the prepared enquiry manually';
    }
  });
})();
