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
