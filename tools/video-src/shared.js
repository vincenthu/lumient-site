/* Deterministic five-second scenes. All coordinates refer to the 1280 by 800 canvas. */
(() => {
  const styles = `
    <style>
      .team-screen { font-variant-numeric: tabular-nums; }
      .team-screen * { box-sizing: border-box; }
      .team-screen .app-body { padding-top: 34px; }
      .team-screen h3, .team-screen p, .team-screen blockquote { margin: 0; }
      .team-screen .rule-layout { display: grid; grid-template-columns: 360px 1fr; gap: 30px; }
      .team-screen .rule-list { border-right: 1px solid #dddfe7; padding-right: 28px; }
      .team-screen .rule-item { position: relative; padding: 20px 16px; border-bottom: 1px solid #e3e5eb; font-size: 26px; }
      .team-screen .rule-item:first-child { margin-top: 16px; }
      .team-screen .rule-item small { display: block; color: #5c6680; margin-top: 8px; font-size: 22px; }
      .team-screen .field-label { font-size: 22px; line-height: 1.25; color: #5c6680; }
      .team-screen .rule-item.active { background: rgba(228,233,249,var(--on)); border-radius: 3px; }
      .team-screen .rule-item.active:before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: #233672; opacity: var(--on); }
      .team-screen .documents { position: relative; min-width: 0; height: 438px; }
      .team-screen .document { position: absolute; inset: 0; border: 1px solid #dfe2ea; border-radius: 3px; padding: 26px 29px; background: white; }
      .team-screen .source { font-size: 22px; color: #5c6680; line-height: 1.4; }
      .team-screen .source-title { font-size: 33px; font-weight: 700; margin: 26px 0 13px; }
      .team-screen .clause { margin-top: 23px; border-left: 3px solid #dfe2e8; padding-left: 19px; font-size: 28px; line-height: 1.46; }
      .team-screen mark { color: inherit; font-weight: 700; background: rgba(208,216,243,var(--on)); }
      .team-screen .source-foot { margin-top: 22px; color: #596381; font-size: 21px; }
      .team-screen .reveal { opacity: var(--on); transform: translateX(calc(34px * (1 - var(--on)))); }
      .team-screen .prompt { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 21px; border: 1px solid #d9dce4; border-radius: 3px; font-size: 28px; line-height: 1.32; background: #fff; }
      .team-screen .ask { border-radius: 3px; background: #172452; color: white; padding: 11px 19px; font-weight: bold; font-size: 23px; white-space: nowrap; }
      .team-screen .response { opacity: var(--on); transform: translateY(calc(14px * (1 - var(--on)))); }
      .team-screen .answer-heading { font-size: 33px; margin: 30px 0 15px; }
      .team-screen .comparison { border-collapse: collapse; width: 100%; text-align: left; font-size: 25px; }
      .team-screen .comparison th { color: #5c6680; font-size: 21px; font-weight: 500; padding: 10px 12px 12px 0; border-bottom: 1px solid #dfe2e8; }
      .team-screen .comparison td { padding: 16px 12px 16px 0; border-bottom: 1px solid #e3e5ea; vertical-align: top; }
      .team-screen .comparison td:first-child { font-weight: 700; }
      .team-screen .comparison td small { font-weight: 400; display: block; font-size: 20px; color: #5c6680; margin-top: 5px; }
      .team-screen .citation { white-space: nowrap; }
      .team-screen .schedule { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e3e5ea; padding-bottom: 22px; }
      .team-screen .schedule strong { display: block; font-size: 31px; margin-bottom: 6px; }
      .team-screen .schedule .due { text-align: right; }
      .team-screen .alert-columns { display: grid; grid-template-columns: 345px 1fr; gap: 42px; margin-top: 31px; }
      .team-screen .alert-columns dl { margin: 0; }
      .team-screen .alert-columns dt { font-size: 21px; color: #5c6680; margin-bottom: 5px; }
      .team-screen .alert-columns dd { margin: 0 0 19px; font-size: 26px; font-weight: 600; }
      .team-screen .alert-link { display: inline-block; padding: 10px 15px; border: 1px solid #cbd1df; border-radius: 3px; font-size: 23px; }
      .team-screen .alert { align-self: start; border: 1px solid #dce1ea; border-radius: 4px; padding: 22px 25px; background: white; }
      .team-screen .alert-meta { display: flex; align-items: center; justify-content: space-between; color: #5c6680; font-size: 20px; }
      .team-screen .alert-meta strong { font-size: 23px; color: #23356c; }
      .team-screen .alert h3 { font-size: 30px; margin: 20px 0 9px; }
      .team-screen .alert p { font-size: 25px; line-height: 1.37; }
      .team-screen .alert .source-foot { border-top: 1px solid #e3e5ea; padding-top: 14px; margin-top: 17px; }
      .team-screen .approved { display: flex; align-items: baseline; gap: 21px; margin: 27px 0 7px; }
      .team-screen .approved strong { font-size: 48px; }
      .team-screen .approved span { font-weight: 700; color: #19704a; font-size: 25px; }
      .team-screen .ledger { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 27px; padding: 21px 0; border-block: 1px solid #e3e5ea; }
      .team-screen .ledger strong { display: block; font-size: 29px; margin-top: 5px; }
      .team-screen .mcp-source { margin-top: 20px; font-size: 23px; line-height: 1.5; color: #5c6680; }
    </style>`;

  function screen(title, subtitle, body) {
    return `${styles}<section class="app team-screen">
      <div class="app-header"><div class="app-title">${title}</div><div class="app-subtitle">${subtitle}</div></div>
      <div class="app-body">${body}</div></section>`;
  }

  // The same interaction timing makes each poster a readable, settled end state.
  function interaction(start, selector, rest) {
    return (t, root) => {
      const { ease, cursor } = window.motion;
      const element = root.querySelector(selector).getBoundingClientRect();
      const bounds = root.getBoundingClientRect();
      const target = [element.left - bounds.left + element.width / 2, element.top - bounds.top + element.height / 2];
      const move = ease(0.12, 1.1, t);
      const settle = ease(1.6, 2.35, t);
      const reveal = ease(1.12, 1.6, t) * (1 - ease(4.46, 4.95, t));
      root.style.setProperty('--on', reveal.toFixed(4));
      const x = start[0] + (target[0] - start[0]) * move + (rest[0] - target[0]) * settle;
      const y = start[1] + (target[1] - start[1]) * move + (rest[1] - target[1]) * settle;
      const press = ease(1.02, 1.12, t) * (1 - ease(1.12, 1.4, t));
      cursor(root, x, y, press, ease(0, 0.25, t) * (1 - ease(3.86, 4.4, t)));
    };
  }

  const covenants = screen('Covenant monitoring', 'Meadow Lane Lending · October 2025', `
    <table class="comparison">
      <thead><tr><th>Borrower</th><th>Debt service coverage</th><th>Minimum</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Birch Bay Works</td><td>1.22×</td><td>1.20×</td><td class="warning"><b>Near limit</b></td></tr>
        <tr><td>Alder Mill Paper</td><td>1.56×</td><td>1.25×</td><td class="positive">Within limit</td></tr>
        <tr><td>Maple Dune Supply</td><td>1.74×</td><td>1.30×</td><td class="positive">Within limit</td></tr>
      </tbody>
    </table>`);

  const amendedClause = screen('Agreement rules', 'Harbor Street Capital · Warehouse A', `
    <div class="rule-layout">
      <div class="rule-list">
        <div class="field-label">Eligibility rules</div>
        <div class="rule-item active"><b>Past due limit</b><small>Section 3.2(b)</small></div>
        <div class="rule-item"><b>Concentration cap</b><small>Section 3.2(c)</small></div>
        <div class="rule-item"><b>Advance rate</b><small>Section 2.1</small></div>
      </div>
      <div class="documents">
        <article class="document">
          <div class="source">Warehouse credit agreement</div>
          <div class="source-title">Eligibility schedule</div>
          <p class="source">Select a rule to view its governing clause.</p>
        </article>
        <article class="document reveal">
          <div class="source">Amendment 2 · Effective October 1, 2025</div>
          <div class="source-title">Past due limit</div>
          <div class="source">Section 3.2(b) · Page 3</div>
          <blockquote class="clause">A loan is ineligible if any scheduled payment is <mark>more than 60 days past due.</mark></blockquote>
          <div class="source-foot">Replaces the 90-day limit in the original agreement.</div>
        </article>
      </div>
    </div>`);

  const agreements = screen('Ask across agreements', 'Meadow Lane Lending · Funder agreements', `
    <div class="prompt"><span>Which funders must we notify on a change in key management?</span><span class="ask">Ask</span></div>
    <div class="response">
      <h3 class="answer-heading">Two funders require written notice.</h3>
      <table class="comparison">
        <thead><tr><th>Funder and agreement</th><th>Notice period</th><th>Source</th></tr></thead>
        <tbody><tr><td>Harbor Street Capital<small>Warehouse credit agreement</small></td><td>Within 5 business days</td><td class="citation">§ 7.4(b), p. 38</td></tr>
          <tr><td>Alder Brook Funding<small>Revolving credit agreement</small></td><td>Within 10 days</td><td class="citation">§ 6.8(a), p. 27</td></tr></tbody>
      </table>
    </div>`);

  const deadlines = screen('Reporting calendar', 'Harbor Street Capital · Warehouse A', `
    <div class="schedule">
      <div><strong>October servicing report</strong><span class="source">Servicing agreement · Section 4.1</span></div>
      <div class="due"><strong>November 25, 2025</strong><span class="source">Due date</span></div>
    </div>
    <div class="alert-columns">
      <div>
        <dl><dt>Reminder date</dt><dd>October 31, 2025</dd><dt>Lead time</dt><dd>25 days before due date</dd><dt>Delivery</dt><dd>Microsoft Outlook</dd></dl>
        <span class="alert-link">View reminder</span>
      </div>
      <article class="alert reveal">
        <div class="alert-meta"><strong>Outlook</strong><span>Oct 31 · 9:00 AM</span></div>
        <h3>Report due in 25 days</h3>
        <p>The October servicing report for Harbor Street Capital is due November 25.</p>
        <div class="source-foot">To: Reporting team · From: Lumient</div>
      </article>
    </div>`);

  const copilot = screen('Your AI assistant', 'Meadow Lane Lending · Connected to Lumient through MCP', `
    <div class="prompt"><span>What is the approved October borrowing base for Warehouse A?</span><span class="ask">Ask</span></div>
    <div class="response">
      <div class="approved"><strong>$7,000,000</strong><span>Approved</span></div>
      <div class="source">Harbor Street Capital · October borrowing base certificate</div>
      <div class="ledger">
        <div><div class="field-label">Eligible receivables</div><strong>$8,750,000</strong></div>
        <div><div class="field-label">Advance rate</div><strong>80%</strong></div>
      </div>
      <div class="mcp-source">Source: Approved certificate, cell C13<br>Retrieved from Lumient through MCP</div>
    </div>`);

  window.scenes = Object.assign(window.scenes || {}, {
    covenants: {
      html: covenants,
      render(t, root) {
        const { ease } = window.motion;
        root.querySelectorAll('tbody tr').forEach((row, i) => {
          const start = .3 + i * .50;
          const progress = ease(start, start + .4, t) * (1 - ease(4.46, 4.95, t));
          row.style.opacity = progress;
          row.style.transform = `translateY(${(1 - progress) * 10}px)`;
        });
        root.querySelector('tbody tr').style.backgroundColor =
          `rgba(250, 237, 211, ${ease(1.7, 2.3, t) * .85})`;
      }
    },
    'amended-clause': { html: amendedClause, render: interaction([413, 494], '.rule-item.active', [856, 510]) },
    agreements: { html: agreements, render: interaction([795, 395], '.ask', [1030, 487]) },
    deadlines: { html: deadlines, render: interaction([388, 521], '.alert-link', [814, 491]) },
    copilot: { html: copilot, render: interaction([850, 382], '.ask', [751, 429]) },
  });
})();
