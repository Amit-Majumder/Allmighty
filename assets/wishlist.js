(function () {
  'use strict';

  var KEY = 'giva-wishlist-v1';

  function getList() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveList(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {}
    document.dispatchEvent(new CustomEvent('giva:wishlist-change', { detail: { count: list.length } }));
  }

  function hasItem(handle) {
    return getList().some(function (item) {
      return item.handle === handle;
    });
  }

  function snapshotFromCard(card, handle) {
    var img = card ? card.querySelector('.card__media img') : null;
    var titleEl = card ? card.querySelector('.card__heading') : null;
    return {
      handle: handle,
      title: titleEl ? titleEl.textContent.trim() : '',
      image: img ? (img.currentSrc || img.src || '').split(/[?#]/)[0] : ''
    };
  }

  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'giva-wishlist-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        toast.remove();
      }, 350);
    }, 2200);
  }

  function syncButtons(root) {
    (root || document).querySelectorAll('[data-wishlist-handle]').forEach(function (btn) {
      var active = hasItem(btn.getAttribute('data-wishlist-handle'));
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      var labelEl = btn.querySelector('.visually-hidden');
      var label = active ? 'Remove from wishlist' : 'Add to wishlist';
      btn.setAttribute('aria-label', label);
      if (labelEl) labelEl.textContent = label;
    });
  }

  function updateCounters() {
    var count = getList().length;
    document.querySelectorAll('.wishlist-count-bubble').forEach(function (el) {
      el.textContent = count > 99 ? '99+' : String(count);
      el.classList.toggle('is-empty', count === 0);
    });
  }

  function addItem(item) {
    var list = getList();
    if (!list.some(function (i) { return i.handle === item.handle; })) {
      list.push(item);
      saveList(list);
    }
  }

  function removeItem(handle) {
    saveList(
      getList().filter(function (i) {
        return i.handle !== handle;
      })
    );
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-wishlist-handle]');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    var handle = btn.getAttribute('data-wishlist-handle');
    var card = btn.closest('.card-wrapper') || btn.closest('.card');
    if (hasItem(handle)) {
      removeItem(handle);
      showToast('Removed from your wishlist');
    } else {
      addItem(snapshotFromCard(card, handle));
      showToast('Added to your wishlist');
    }
    syncButtons();
  });

  document.addEventListener('DOMContentLoaded', function () {
    syncButtons();
    updateCounters();
  });

  document.addEventListener('shopify:section:load', function (event) {
    syncButtons(event.target);
    updateCounters();
  });

  document.addEventListener('giva:wishlist-change', updateCounters);

  window.GivaWishlist = {
    getList: getList,
    hasItem: hasItem,
    addItem: addItem,
    removeItem: removeItem,
    showToast: showToast,
    syncButtons: syncButtons
  };
})();
