// Single-select ("1 of N") button groups as an ARIA radio group: the container is
// role="radiogroup", each option is role="radio" with aria-checked, only the
// selected option (or the first, when none is) sits in the tab order, and the
// arrow keys move the selection — the standard WAI-ARIA radio pattern. A screen
// reader then announces "radio button, 2 of 3, checked" rather than a row of
// independent toggle buttons.

// tabIndex for option `index` given the selected index (-1 when none is selected).
export function radioTabIndex(index, selectedIndex) {
  return index === (selectedIndex >= 0 ? selectedIndex : 0) ? 0 : -1;
}

// onKeyDown for the radiogroup container: arrows select and focus the neighbour,
// wrapping at the ends. `select(i)` applies option i.
export function onRadioKeyDown(event, selectedIndex, select) {
  const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
  if (!delta) return;
  const radios = [...event.currentTarget.querySelectorAll('[role="radio"]')];
  if (radios.length === 0) return;
  event.preventDefault();
  const focused = radios.indexOf(document.activeElement);
  const from = focused >= 0 ? focused : Math.max(selectedIndex, 0);
  const next = (from + delta + radios.length) % radios.length;
  select(next);
  radios[next].focus();
}
