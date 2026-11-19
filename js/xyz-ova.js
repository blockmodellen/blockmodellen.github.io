// Blockmodellen med XYZ: interaktiv övning. Data i window.XYZ (js/xyz-data.js).
(function () {
  'use strict';
  var data = window.XYZ || [];
  var gid = new URLSearchParams(location.search).get('g');
  var G = null;
  for (var i = 0; i < data.length; i++) if (data[i].id === gid) G = data[i];
  var rot = document.getElementById('bmova');
  if (!G) { G = data[0]; }
  if (!G) { rot.textContent = 'Hittade inga uppgifter.'; return; }

  var NIVA = { 1: 'Nivå 1', 2: 'Nivå 2', 3: 'Nivå 3' };
  document.getElementById('xyz-rubrik').textContent = 'Öva: ' + G.avs;
  document.getElementById('xyz-under').textContent = NIVA[G.niva] + ' · ' + G.bok + ' · ' + G.uppg.length + ' uppgifter. Lös uppgiften med blockmodellen i ditt räknehäfte. Skriv svaret och kontrollera. Behöver du hjälp kan du visa stegen.';
  document.title = 'Öva: ' + G.avs + ' · ' + NIVA[G.niva] + ' · Blockmodellen med XYZ';
  var tb = document.getElementById('xyz-tillbaka');
  if (tb) tb.href = 'xyz.html#ak' + G.ak;

  var nu = 0, klara = {};

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  // ---- blockmodell som SVG (samma regler som modell.py) ----
  function delInfo(p) {
    if (p.charAt(0) === '*') return ['m', p.slice(1)];
    if (p.charAt(0) === '+' && p.length > 1) return ['x', p];
    if ((p.charAt(0) === '-' || p.charAt(0) === '−') && p.length > 1) return ['b', '−' + p.slice(1)];
    return ['e', p];
  }
  function delBredd(p) {
    var t = delInfo(p);
    if (t[0] === 'x' || t[0] === 'b') return Math.max(0.6, t[1].length / 7);
    return Math.max(1.0, t[1].length / 6);
  }
  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, at, txt) {
    var e = document.createElementNS(NS, tag);
    for (var k in at) e.setAttribute(k, at[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }
  function textBredd(t, fs) { return t.length * fs * 0.56; }

  function ritaModell(u) {
    var rader = [], maxb = 0;
    u.m.forEach(function (r) {
      var x = 0, ds = [];
      r[1].forEach(function (p) { var b = delBredd(p), t = delInfo(p); ds.push([x, b, t[0], t[1]]); x += b; });
      rader.push({ namn: r[0], delar: ds, bredd: x, varde: r[2] });
      if (x > maxb) maxb = x;
    });
    var W = 640, fs = 15;
    var labw = 0;
    rader.forEach(function (r) { labw = Math.max(labw, textBredd(r.namn, fs) + 12); });
    labw = Math.min(Math.max(labw, 60), 190);
    var hoger = 0;
    rader.forEach(function (r) { if (r.varde) hoger = Math.max(hoger, textBredd(r.varde, fs) + 14); });
    if (u.tot) hoger = Math.max(hoger, textBredd(u.tot, fs) + 34);
    hoger = Math.max(hoger, 10);
    var ux = Math.min(64, (W - labw - hoger - 8) / maxb);
    var rh = 40, gap = 12, y0 = 6;
    var H = y0 + rader.length * (rh + gap) - gap + 8;
    var RAD = ['#DEDFCE', '#EED5C3', '#F1E3D3'];
    var Wn = Math.ceil(labw + maxb * ux + hoger + 8);
    var svg = s('svg', { viewBox: '0 0 ' + Wn + ' ' + H, width: '100%', role: 'img', 'aria-label': 'Blockmodell' });
    svg.style.maxWidth = Wn + 'px';
    var defs = s('defs', {});
    var pat = s('pattern', { id: 'xyzstreck', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    pat.appendChild(s('rect', { width: 8, height: 8, fill: '#fff' }));
    pat.appendChild(s('line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: '#B5603F', 'stroke-width': 2 }));
    defs.appendChild(pat); svg.appendChild(defs);
    rader.forEach(function (r, i) {
      var y = y0 + i * (rh + gap);
      svg.appendChild(s('text', { x: labw - 10, y: y + rh / 2 + 5, 'text-anchor': 'end', 'font-size': fs, 'font-weight': 700, fill: '#2A2B22' }, r.namn));
      r.delar.forEach(function (d) {
        var bx = labw + d[0] * ux, bw = d[1] * ux, t = d[2], lab = d[3];
        var at = { x: bx, y: y, width: bw, height: rh };
        if (t === 'm') { at.fill = '#E2B49A'; at.stroke = '#4F5342'; at['stroke-width'] = 1.5; }
        else if (t === 'x') { at.fill = '#FBE3DC'; at.stroke = '#B5603F'; at['stroke-width'] = 2; }
        else if (t === 'b') { at.fill = 'url(#xyzstreck)'; at.stroke = '#B5603F'; at['stroke-width'] = 2; at['stroke-dasharray'] = '5 3'; }
        else { at.fill = RAD[i % 3]; at.stroke = '#4F5342'; at['stroke-width'] = 1.5; }
        svg.appendChild(s('rect', at));
        if (lab === '...') lab = '…';
        if (lab) {
          var f = 14;
          while (f > 9 && textBredd(lab, f) > bw - 4) f--;
          if (textBredd(lab, f) <= bw + 2) {
            var tx = s('text', { x: bx + bw / 2, y: y + rh / 2 + f * 0.36, 'text-anchor': 'middle', 'font-size': f, 'font-weight': 700, fill: (t === 'x' || t === 'b') ? '#B5603F' : '#2A2B22' }, lab);
            if (t === 'b') { tx.setAttribute('paint-order', 'stroke'); tx.setAttribute('stroke', '#fff'); tx.setAttribute('stroke-width', 4); }
            svg.appendChild(tx);
          }
        }
      });
      if (r.varde) svg.appendChild(s('text', { x: labw + r.bredd * ux + 8, y: y + rh / 2 + 5, 'font-size': fs, 'font-weight': 800, fill: '#4F5E31' }, r.varde));
    });
    if (u.tot) {
      var bx = labw + maxb * ux + 6, ya = y0, yb = y0 + rader.length * (rh + gap) - gap, ym = (ya + yb) / 2;
      svg.appendChild(s('path', { d: 'M' + bx + ' ' + ya + ' q8 0 8 8 V' + (ym - 6) + ' q0 6 6 6 q-6 0 -6 6 V' + (yb - 8) + ' q0 8 -8 8', fill: 'none', stroke: '#4F5342', 'stroke-width': 2 }));
      svg.appendChild(s('text', { x: bx + 20, y: ym + 5, 'font-size': fs, 'font-weight': 800, fill: '#4F5E31' }, u.tot));
    }
    return svg;
  }

  // ---- tolka svar ----
  function tal(str) {
    str = String(str).replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '.').replace(/%$/, '').replace(/[a-zåäö]+$/i, '');
    if (str === '') return NaN;
    var m = str.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (/^-?\d+(\.\d+)?$/.test(str)) return parseFloat(str);
    return NaN;
  }
  function tolkaInmatning(raw) {
    raw = String(raw).trim();
    var bl = raw.replace(/,/g, '.').match(/^(-?\d+)\s+(\d+)\/(\d+)/); // blandad form "1 3/4"
    if (bl) return parseInt(bl[1], 10) + (bl[1].charAt(0) === '-' ? -1 : 1) * parseInt(bl[2], 10) / parseInt(bl[3], 10);
    return tal(raw);
  }
  function lika(a, b) { return Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 1e-4) + 0.005; }

  // ---- visa en uppgift ----
  function visa() {
    var u = G.uppg[nu];
    rot.innerHTML = '';
    var lek = el('div', 'bmo-lek');
    lek.appendChild(el('h2', null, 'Uppgift ' + u.nr));
    var prog = el('div', 'bmo-prog');
    G.uppg.forEach(function (x, i) {
      var sp = el('span', i === nu ? 'nu' : '', klara[i] ? '✓' : String(i + 1));
      sp.title = 'Uppgift ' + x.nr;
      sp.tabIndex = 0;
      sp.onclick = function () { nu = i; visa(); };
      sp.onkeydown = function (ev) { if (ev.key === 'Enter') { nu = i; visa(); } };
      prog.appendChild(sp);
    });
    prog.style.flexWrap = 'wrap';
    lek.appendChild(prog);
    rot.appendChild(lek);

    var kort = el('div', 'bmo-uppg');
    kort.appendChild(el('span', 'bmo-bok', window.XYZ_ORIGINAL ? G.bok + ' · s. ' + u.sid + ' · uppgift ' + u.nr : 'Som uppgift ' + u.nr + ' i ' + G.bok + ' (s. ' + u.sid + ')'));
    kort.appendChild(el('p', 'bmo-text', u.text));
    if (u.prat) {
      var pr = el('div', 'xyz-prat');
      u.prat.split(' | ').forEach(function (p) { pr.appendChild(el('div', null, p)); });
      kort.appendChild(pr);
    }
    rot.appendChild(kort);

    var modell = el('div', 'bmo-modell');
    modell.style.display = 'none';
    var ms = el('div', 'bmo-svg');
    modell.appendChild(ms);
    rot.appendChild(modell);
    var modellVisad = false;
    function visaModell() { if (modellVisad) return; modellVisad = true; ms.appendChild(ritaModell(u)); modell.style.display = ''; }

    var ruta = el('div', 'bmo-steg');
    var fb = el('div', 'bmo-fb');
    var inputs = [];
    if (u.facit.length) {
      var sv = el('div', 'xyz-svar');
      u.facit.forEach(function (f, i) {
        var lab = el('label');
        lab.appendChild(el('span', null, (u.fl[i] || 'Svar') + ':'));
        var inp = el('input');
        inp.type = 'text'; inp.inputMode = 'decimal'; inp.autocomplete = 'off';
        inp.onkeydown = function (ev) { if (ev.key === 'Enter') kontrollera(); };
        lab.appendChild(inp); inputs.push(inp);
        sv.appendChild(lab);
      });
      ruta.appendChild(sv);
    } else {
      ruta.appendChild(el('p', 'bmo-hj', 'Den här uppgiften har inget enkelt sifferssvar. Lös den i häftet och jämför sedan med stegen och svaret.'));
    }
    var kn = el('div', 'xyz-knapp');
    var bK = el('button', null, 'Kontrollera');
    var bS = el('button', 'ljus', 'Visa steg för steg');
    var bV = el('button', 'ljus', 'Visa svar');
    if (u.facit.length) kn.appendChild(bK);
    kn.appendChild(bS); kn.appendChild(bV);
    ruta.appendChild(kn);
    ruta.appendChild(fb);
    var steg = el('ol', 'xyz-steg');
    ruta.appendChild(steg);
    var svarRuta = el('div', 'bmo-svar', 'Svar: ' + u.svar);
    svarRuta.style.display = 'none'; svarRuta.style.marginTop = '12px';
    ruta.appendChild(svarRuta);
    var slut = el('div', 'xyz-knapp');
    slut.style.marginTop = '12px';
    var bN = el('button', 'terra', nu < G.uppg.length - 1 ? 'Nästa uppgift →' : 'Börja om från första');
    bN.onclick = function () { nu = (nu + 1) % G.uppg.length; visa(); window.scrollTo({ top: rot.offsetTop - 10, behavior: 'smooth' }); };
    slut.appendChild(bN);
    ruta.appendChild(slut);
    rot.appendChild(ruta);

    function kontrollera() {
      var alla = true, tomma = 0;
      inputs.forEach(function (inp, i) {
        var v = tolkaInmatning(inp.value), f = tolkaInmatning(u.facit[i]);
        inp.classList.remove('ratt', 'fel');
        if (inp.value.trim() === '') { tomma++; alla = false; return; }
        if (!isNaN(v) && lika(v, f)) inp.classList.add('ratt');
        else { inp.classList.add('fel'); alla = false; }
      });
      fb.className = 'bmo-fb';
      if (alla) {
        klara[nu] = true;
        fb.innerHTML = '';
        fb.appendChild(el('b', null, 'Rätt! '));
        fb.appendChild(document.createTextNode(u.svar));
        fb.style.color = '#33391F';
        var p = prog.children[nu]; if (p) p.textContent = '✓';
      } else if (tomma === inputs.length) {
        fb.className = 'bmo-fb fel';
        fb.textContent = 'Skriv ditt svar först. Bara talet räcker, till exempel 12 eller 3/4.';
      } else {
        fb.className = 'bmo-fb fel';
        fb.textContent = 'Inte riktigt. Rita blocken igen och kontrollera. Du kan visa ett steg i taget om du vill ha hjälp.';
      }
    }
    bK.onclick = kontrollera;

    var ritaIdx = 0;
    for (var k = 0; k < u.steg.length; k++) if (/^Rita/i.test(u.steg[k][0])) { ritaIdx = k; break; }
    var nastaSteg = 0;
    function visaNastaSteg() {
      if (nastaSteg >= u.steg.length) return;
      var st = u.steg[nastaSteg];
      var li = el('li');
      li.appendChild(el('b', null, st[0]));
      var knapp = el('button', null, 'Visa');
      var idx = nastaSteg;
      knapp.onclick = function () {
        knapp.remove();
        li.appendChild(el('em', null, st[1]));
        if (idx === ritaIdx) visaModell();
        if (idx === u.steg.length - 1) { svarRuta.style.display = ''; }
        else visaNastaSteg();
      };
      li.appendChild(knapp);
      steg.appendChild(li);
      nastaSteg++;
    }
    bS.onclick = function () { bS.disabled = true; bS.style.opacity = .5; visaNastaSteg(); };
    bV.onclick = function () {
      bS.disabled = true; bS.style.opacity = .5;
      steg.innerHTML = '';
      u.steg.forEach(function (st) { var li = el('li'); li.appendChild(el('b', null, st[0])); li.appendChild(el('em', null, st[1])); steg.appendChild(li); });
      nastaSteg = u.steg.length;
      visaModell();
      svarRuta.style.display = '';
    };
    if (inputs[0] && nu > 0) inputs[0].focus({ preventScroll: true });
  }
  visa();
})();
