// All five screens use the same October tape and Warehouse A certificate.
(() => {
  const facility = 'Harbor Street Capital · Warehouse A';
  const style = `<style>
    .funder * {box-sizing:border-box}
    .funder .app-body {height:calc(100% - 154px)}
    .funder .fr {display:grid;align-items:center;position:relative;min-height:79px;border-bottom:1px solid #e1e2e7;gap:20px;font-size:29px;line-height:1.25}
    .funder .fr:last-child {border-bottom:0}
    .funder .fr.head {min-height:72px;color:#5b627e;font-size:23px}
    .funder .fr.bold, .funder .strong {font-weight:700}
    .funder .fr.selected {background:rgba(228,232,248,var(--on));box-shadow:-14px 0 rgba(228,232,248,var(--on)),14px 0 rgba(228,232,248,var(--on))}
    .funder .money {font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
    .funder .sub {display:block;font-size:22px;font-weight:400;color:#5b627e;margin-top:6px}
    .funder .summary {display:flex;gap:18px;align-items:center;border-top:1px solid #e1e2e7;padding-top:23px;font-size:23px;color:#5b627e}
    .funder .split {display:grid;grid-template-columns:51% 1fr;gap:42px;height:100%;align-items:start;padding-top:32px}
    .funder .listcol {min-width:0}
    .funder .listcol .fr {grid-template-columns:1fr auto;font-size:27px}
    .funder .detail {position:relative;min-height:448px;border-left:1px solid #e1e2e7;padding:8px 0 0 34px;overflow:hidden}
    .funder .detail>div {width:100%}
    .funder .detail .next {position:absolute;top:8px;left:34px;width:calc(100% - 34px)}
    .funder .eyeline {font-size:22px;color:#5b627e;margin:0 0 14px}
    .funder h3 {font-size:36px;line-height:1.12;letter-spacing:-.8px;margin:0 0 12px}
    .funder p {font-size:25px;line-height:1.35;margin:14px 0}
    .funder .detail .fr {grid-template-columns:1fr auto;min-height:60px;font-size:23px;gap:10px}
    .funder .detail .fr.head {font-size:20px;min-height:46px}
    .funder .value {font-size:49px;font-weight:700;letter-spacing:-1.5px;margin:12px 0}
    .funder .good {color:#207951}
    .funder .alert {color:#8c5b08}
    .funder .note {border-left:3px solid #d6dbea;padding:2px 0 2px 17px;font-size:23px}
    .funder .target-text {text-decoration:underline;text-decoration-color:#a7b0cc;text-underline-offset:6px}
    .funder .cta {display:inline-block;background:#172650;color:white;border-radius:4px;padding:12px 19px;font-size:24px;font-weight:600}
    .funder .routing .fr {grid-template-columns:43% 20% 1fr;gap:12px;min-height:111px}
    .funder .routing .fr.head {min-height:70px}
    .funder .routing .match {position:relative;font-size:27px}
    .funder .routing .pending {position:absolute;top:50%;transform:translateY(-50%);font-size:23px;color:#5b627e}
    .funder .route-name {display:block;font-weight:650}
    .funder .file {display:flex;align-items:center;gap:17px}
    .funder .file svg {flex:0 0 38px}
    .funder .routing .summary {border-top:0}
    .funder .ledger .listcol .fr {min-height:76px}
    .funder .ledger .detail {min-height:475px}
    .funder .ledger .listcol .fr:last-child {min-height:93px}
    .funder .ledger .label {color:#5b627e;font-size:23px;margin:8px 0}
    .funder .exclusions .listcol .fr {min-height:115px}
    .funder .exclusions .listcol .fr.head {min-height:48px;font-size:22px}
    .funder .sheet .split {grid-template-columns:54% 1fr;gap:28px}
    .funder .fx {font-size:25px;border:1px solid #d8dce4;display:flex;align-items:center;height:55px;margin-bottom:16px}
    .funder .fx span:first-child {padding:12px 16px;border-right:1px solid #d8dce4;color:#52647b}
    .funder .fx i {color:#267354;font-family:Georgia,serif;margin:0 14px}
    .funder table {width:100%;border-collapse:collapse;font-size:24px;font-variant-numeric:tabular-nums}
    .funder th, .funder td {border:1px solid #dce0e4;padding:12px 14px;text-align:left;font-weight:400}
    .funder th {color:#5a6674;background:#f4f6f6;font-size:20px;text-align:center}
    .funder td:last-child {text-align:right}
    .funder .cell {position:relative;background:rgba(226,241,234,var(--on));outline:2px solid rgba(36,116,79,var(--on));outline-offset:-2px}
    .funder .sheet-tab {display:inline-block;padding:10px 12px;border-bottom:3px solid #287851;color:#245d46;font-weight:600;font-size:21px}
    .funder .package .listcol .fr {min-height:114px;font-size:25px}
    .funder .package .listcol .fr.head {min-height:48px;font-size:22px}
    .funder .package .detail .fr {font-size:22px}
  </style>`;

  const layout = (title, subtitle, body, kind) => `${style}
    <div class="app funder">
      <div class="app-header"><div class="app-title">${title}</div><div class="app-subtitle">${subtitle}</div></div>
      <div class="app-body ${kind}">${body}</div>
    </div>`;

  const row = (left, right, classes = '') => `<div class="fr ${classes}"><span>${left}</span><span class="money">${right}</span></div>`;
  const detail = (initial, selected) => `<div class="detail"><div class="initial">${initial}</div><div class="next">${selected}</div></div>`;
  const section = (left, right) => `<div class="split"><div class="listcol">${left}</div>${right}</div>`;
  const small = text => `<span class="sub">${text}</span>`;
  const fileIcon = `<svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
    <path d="M5 2h18l10 11v30H5z" stroke="#8b98ad" stroke-width="2"/><path d="M22 3v11h10M11 22h15m-15 6h15m-15 6h10" stroke="#8b98ad" stroke-width="2"/></svg>`;
  const file = (name, type, source) => `<div class="fr"><div class="file">${fileIcon}<div><b>${name}</b>${small(type)}</div></div>
    <span>${source}</span><div class="match"><span class="pending">Matching…</span><div class="matched"><span class="route-name">Harbor Street Capital</span>${small('Warehouse A')}</div></div></div>`;

  // The input tape has six loans. Four remain after the two exclusions.
  const opening = `<div class="eyeline">Certificate summary</div><h3>Borrowing base</h3><div class="value">$7,000,000</div>
    <p>80% of eligible collateral</p><p class="note">October 31, 2025<br>Meadow Lane Lending</p>`;
  const eligible = `<div class="eyeline">Eligible balance · Line 4</div><h3>$8,750,000</h3>
    ${row('Loan', 'After limits', 'head')}${row('Alder Mill Paper', '$3,250,000')}
    ${row('Birch Bay Works', '$2,650,000')}${row('Willow Cape Glass', '$2,100,000')}${row('Maple Dune Supply', '$750,000')}
    ${row('Total', '$8,750,000', 'bold')}`;

  const ease = (start, end, t) => window.motion.ease(start, end, t);
  // Enter, hold the selected state, and return to the initial screen for the loop.
  const phase = (t, start = 1.38) => ease(start, start + .47, t) * (1 - ease(4.40, 4.92, t));
  function showDetail(root, progress) {
    root.style.setProperty('--on', progress);
    const initial = root.querySelector('.initial');
    const next = root.querySelector('.next');
    initial.style.opacity = Math.max(0, 1 - 2 * progress);
    next.style.opacity = progress;
    next.style.transform = `translateX(${(1 - progress) * 44}px)`;
  }

  function pointAt(root, query, xFraction, yFraction) {
    const bounds = root.getBoundingClientRect();
    const box = root.querySelector(query).getBoundingClientRect();
    return [box.left - bounds.left + box.width * xFraction, box.top - bounds.top + box.height * yFraction];
  }

  function moveCursor(root, t, target, destination, click = 1.38) {
    const start = [1000, 695];
    const approach = ease(.18, click - .10, t);
    const follow = ease(click + .47, click + 1.32, t);
    const back = ease(4.35, 4.94, t);
    const coords = start.map((n, i) => {
      const atTarget = n + (target[i] - n) * approach;
      const atDetail = atTarget + (destination[i] - target[i]) * follow;
      return atDetail + (n - atDetail) * back;
    });
    const press = ease(click - .08, click, t) * (1 - ease(click, click + .30, t));
    window.motion.cursor(root, ...coords, press);
  }

  function select(root, t, selector = '.selected') {
    const progress = phase(t);
    showDetail(root, progress);
    const target = pointAt(root, selector, .81, .64);
    moveCursor(root, t, target, [1140, 600]);
  }

  const scenes = {
    files: {
      html: layout('Incoming files', 'Meadow Lane Lending · October reporting', `
        <div class="fr head"><span>Document</span><span>Received via</span><span>Matched facility</span></div>
        ${file('October loan tape', 'Loan tape · CSV', 'Outlook')}
        ${file('Servicer statement', 'Statement · PDF', 'SharePoint')}
        ${file('Amendment 02', 'Amendment · PDF', 'Box')}
        <div class="summary"><b class="count"></b><span>matched to their facility</span></div>`, 'routing'),
      render(t, root) {
        let matchedCount = 0;
        root.querySelectorAll('.match').forEach((group, i) => {
          const progress = phase(t, .60 + i * .67);
          matchedCount += Number(progress >= .5);
          group.querySelector('.pending').style.opacity = Math.max(0, 1 - 2 * progress);
          const matched = group.querySelector('.matched');
          matched.style.opacity = progress;
          matched.style.transform = `translateX(${(1-progress)*22}px)`;
          const pulse = 4 * progress * (1-progress);
          group.closest('.fr').style.backgroundColor = `rgba(226,237,232,${pulse})`;
        });
        root.querySelector('.count').textContent = `${matchedCount} of 3 files`;
        root.querySelector('.count').classList.toggle('good', matchedCount === 3);
        const target = pointAt(root, '.match', .56, .69);
        moveCursor(root, t, target, [1090, 579], 2.57);
      }
    },
    'borrowing-base': {
      html: layout('Borrowing base certificate', facility, section(`
        <div class="label">October 31, 2025</div>
        ${row('Pledged principal', '$10,000,000')}${row('Less ineligible', '$1,000,000')}
        ${row('Less excess', '$250,000')}${row('Eligible balance', '<span class="target-text">$8,750,000</span>', 'selected bold')}
        ${row('Advance rate', '80%')}${row('Borrowing base', '$7,000,000', 'bold')}`, detail(opening, eligible)), 'ledger'),
      render(t, root) { select(root, t); }
    },
    ineligible: {
      html: layout('Ineligible loans', facility, section(`
        ${row('Excluded loan', 'Principal', 'head')}
        ${row('<b>Cedar Vale Textiles</b>'+small('Loan ML-105'), '$600,000', 'selected')}
        ${row('<b>Alder Run Tools</b>'+small('Loan ML-106'), '$400,000')}
        ${row('Total excluded', '$1,000,000', 'bold')}`, detail(
        `<div class="eyeline">October loan tape</div><h3>Eligibility review</h3><div class="value">$1,000,000</div>
        <p>Excluded from pledged collateral</p>${row('Past due', '$600,000')}${row('Missing insurance', '$400,000')}`,
        `<div class="eyeline">Loan ML-105 · Exclusion reason</div><h3>Cedar Vale Textiles</h3><p class="alert"><b>Past due</b></p>
        ${row('Days past due', '64 days')}${row('Allowed by facility', '60 days')}
        <p class="note">Section 3.2(b), page 14<br>A loan more than 60 days past due is ineligible.</p>`)), 'exclusions'),
      render(t, root) { select(root, t); }
    },
    template: {
      html: layout('Harbor Street certificate.xlsx', 'Meadow Lane Lending · October 2025', section(`
        <div class="fx"><span class="address">C12</span><i>ƒx</i><span class="formula">80%</span></div>
        <table><thead><tr><th></th><th>B</th><th>C</th></tr></thead><tbody>
        <tr><th>8</th><td>Pledged principal</td><td>$10,000,000</td></tr>
        <tr><th>9</th><td>Ineligible loans</td><td>$1,000,000</td></tr>
        <tr><th>10</th><td>Excess concentration</td><td>$250,000</td></tr>
        <tr><th>11</th><td>Eligible balance</td><td>$8,750,000</td></tr>
        <tr><th>12</th><td>Advance rate</td><td>80%</td></tr>
        <tr><th>13</th><td><b>Borrowing base</b></td><td class="cell"><b>$7,000,000</b></td></tr>
        </tbody></table><span class="sheet-tab">Certificate</span>`, detail(
        `<div class="eyeline">Certificate · C12</div><h3>Advance rate</h3><div class="value">80%</div><p class="note">Warehouse A agreement<br>Section 2.1, page 6</p>`,
        `<div class="eyeline">Certificate · C13</div><h3>Borrowing base</h3><div class="value">$7,000,000</div>
        ${row('C11 · Eligible balance','$8,750,000')}${row('C12 · Advance rate','× 80%')}
        <p class="note">C11 = C8 − C9 − C10<br>Source: October loan tape</p>`)), 'sheet'),
      render(t, root) {
        const selected = phase(t) > .45;
        root.querySelector('.address').textContent = selected ? 'C13' : 'C12';
        root.querySelector('.formula').textContent = selected ? '=C11*C12' : '80%';
        select(root, t, '.cell');
      }
    },
    'sign-off': {
      html: layout('October report package', facility, section(`
        ${row('Report', 'Review status', 'head')}
        ${row('<b>Borrowing base certificate</b>'+small('Harbor Street template · XLSX'), 'Ready', 'selected')}
        ${row('<b>Servicing report</b>'+small('Monthly loan activity · XLSX'), 'Ready')}
        ${row('<b>Compliance certificate</b>'+small('Facility covenants · PDF'), 'Ready')}`, detail(
        `<div class="eyeline">October 31, 2025</div><h3>Ready for review</h3><p>Three reports prepared in Harbor Street’s format.</p>
        ${row('Reporting entity','Meadow Lane')}${row('Facility','Warehouse A')}`,
        `<div class="eyeline">Certificate review</div><h3>Borrowing base</h3><div class="value">$7,000,000</div>
        ${row('Reconciled to tape','<b class="good">Passed</b>')}${row('Reviewer','R. Ellis')}
        <p><span class="cta">Approve certificate</span></p><span class="sub">Awaiting reviewer sign-off</span>`)), 'package'),
      render(t, root) { select(root, t); }
    }
  };
  window.scenes = Object.assign(window.scenes || {}, scenes);
})();
