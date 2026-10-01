// After a restart replaces the step under the user's focus, move focus to the new
// step's heading (marked data-step-heading) so keyboard and screen-reader users
// land on what changed instead of on <body>. Deferred one task so React has
// rendered the new step first.
export function focusStepHeadingSoon() {
  setTimeout(() => {
    document.querySelector("[data-step-heading]")?.focus({ preventScroll: true });
  }, 0);
}
