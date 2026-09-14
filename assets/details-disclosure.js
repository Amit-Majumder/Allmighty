class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.nestedDetails = [];

    if (window.matchMedia('(hover: hover) and (min-width: 990px)').matches) {
      this.enableHoverOpen();
    }
  }

  enableHoverOpen() {
    const closeTimer = 150;

    let scheduleClose = null;

    const open = () => {
      if (scheduleClose) {
        clearTimeout(scheduleClose);
        scheduleClose = null;
      }
      this.mainDetailsToggle.setAttribute('open', '');
    };

    const close = () => {
      scheduleClose = setTimeout(() => {
        this.mainDetailsToggle.removeAttribute('open');
        this.nestedDetails.forEach((details) => details.removeAttribute('open'));
      }, closeTimer);
    };

    const suppressPointerToggle = (summary) => {
      summary.addEventListener('click', (event) => {
        if (event.detail > 0) event.preventDefault();
      });
    };

    this.addEventListener('mouseenter', open);
    this.addEventListener('mouseleave', close);

    this.nestedDetails = Array.from(
      this.querySelectorAll('.header__submenu details')
    );

    this.nestedDetails.forEach((details) => {
      let nestedTimer = null;

      details.addEventListener('mouseenter', () => {
        if (nestedTimer) {
          clearTimeout(nestedTimer);
          nestedTimer = null;
        }
        details.setAttribute('open', '');
      });

      details.addEventListener('mouseleave', () => {
        nestedTimer = setTimeout(() => {
          details.removeAttribute('open');
        }, closeTimer);
      });

      suppressPointerToggle(details.querySelector('summary'));
    });

    suppressPointerToggle(this.mainDetailsToggle.querySelector('summary'));
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);

/* Mobile drawer: auto-expand nested submenus (accordion-style) when a parent opens */
(function () {
  function expandAllNested(detailsEl) {
    const parentSubmenu = detailsEl.querySelector('.menu-drawer__submenu');
    if (parentSubmenu) parentSubmenu.classList.add('menu-drawer__submenu--auto-expanded');
  }

  function collapseAllNested(detailsEl) {
    detailsEl.querySelectorAll('.menu-drawer__submenu details').forEach((nested) => {
      nested.removeAttribute('open');
      nested.classList.remove('menu-opening');
      nested.querySelector('summary').setAttribute('aria-expanded', 'false');
    });
    const parentSubmenu = detailsEl.querySelector('.menu-drawer__submenu');
    if (parentSubmenu) parentSubmenu.classList.remove('menu-drawer__submenu--auto-expanded');
  }

  function init() {
    const drawer = document.getElementById('Details-menu-drawer-container');
    if (!drawer) return;

    const firstLevelItems = drawer.querySelectorAll('.menu-drawer__navigation > .menu-drawer__menu > li > details');
    firstLevelItems.forEach((details) => {
      details.addEventListener('toggle', () => {
        if (details.hasAttribute('open')) {
          expandAllNested(details);
        } else {
          collapseAllNested(details);
        }
      });
    });

    drawer.addEventListener(
      'click',
      (event) => {
        const topSummary = event.target.closest('.menu-drawer__navigation > .menu-drawer__menu > li > details > summary');
        if (topSummary) {
          event.preventDefault();
          event.stopImmediatePropagation();
          const detailsEl = topSummary.parentElement;
          if (detailsEl.hasAttribute('open')) {
            detailsEl.removeAttribute('open');
            topSummary.setAttribute('aria-expanded', 'false');
          } else {
            detailsEl.setAttribute('open', '');
            topSummary.setAttribute('aria-expanded', 'true');
          }
          return;
        }

        const groupSummary = event.target.closest('.menu-drawer__submenu--auto-expanded details > summary');
        if (groupSummary) {
          event.preventDefault();
          event.stopImmediatePropagation();
          const detailsEl = groupSummary.parentElement;
          if (detailsEl.hasAttribute('open')) {
            detailsEl.removeAttribute('open');
            detailsEl.classList.remove('menu-opening');
            groupSummary.setAttribute('aria-expanded', 'false');
          } else {
            detailsEl.setAttribute('open', '');
            detailsEl.classList.add('menu-opening');
            groupSummary.setAttribute('aria-expanded', 'true');
          }
          return;
        }
      },
      { capture: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
