/* selection.js — shared treatment save state for psoriasis Flow A browse screens
 * Reads/writes localStorage key 'psoriasis_selectedTreatments': [{id, name}, ...]
 * No maximum during browse — the limit (3 for the plan) is enforced on flow-a-shortlist.html.
 * Buttons use data-treatment-id + data-treatment-name attributes.
 */

(function () {
  var KEY = 'psoriasis_selectedTreatments';

  var SVG_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.4 12 20 12 20z"/></svg>';
  var SVG_CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12l4.5 4.5L19 7"/></svg>';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function save(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function add(id, name) {
    var cur = get();
    if (cur.some(function (t) { return t.id === id; })) return;
    cur.push({ id: id, name: name });
    save(cur);
  }

  function remove(id) {
    save(get().filter(function (t) { return t.id !== id; }));
  }

  function isSelected(id) {
    return get().some(function (t) { return t.id === id; });
  }

  function render() {
    var selections = get();
    var count = selections.length;

    var pill = document.querySelector('[data-selection-counter]');
    if (pill) {
      pill.textContent = count === 0 ? 'Save anything that looks interesting' : count + ' saved';
    }

    var badge = document.querySelector('[data-header-counter]');
    if (badge) {
      badge.textContent = count === 0 ? '0 saved' : count + ' saved';
      badge.style.background  = count > 0 ? 'rgba(196,123,43,0.14)' : 'rgba(0,0,0,0.05)';
      badge.style.color       = count > 0 ? 'var(--primary-dk)' : 'var(--ink-400)';
    }

    var trayLeft = document.querySelector('[data-tray-left]');
    if (trayLeft) {
      if (count === 0) {
        trayLeft.innerHTML = '<span class="tray-empty-label">Save anything that catches your eye</span>';
      } else {
        trayLeft.innerHTML = '<span class="tray-count-label">' + count + ' saved</span>';
      }
    }

    var cta = document.querySelector('[data-tray-cta]');
    if (cta) {
      if (count === 0) {
        cta.classList.add('tray-cta-disabled');
      } else {
        cta.classList.remove('tray-cta-disabled');
      }
    }

    document.querySelectorAll('[data-treatment-id]').forEach(function (btn) {
      var id       = btn.dataset.treatmentId;
      var selected = isSelected(id);

      btn.disabled      = false;
      btn.style.opacity = '1';

      if (selected) {
        btn.classList.add('added');
        btn.innerHTML = SVG_CHECK + ' Saved';
      } else {
        btn.classList.remove('added');
        btn.innerHTML = SVG_HEART + ' Want to try';
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-treatment-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = this.dataset.treatmentId;
        var name = this.dataset.treatmentName;
        if (isSelected(id)) {
          remove(id);
        } else {
          add(id, name);
        }
        render();
      });
    });
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
