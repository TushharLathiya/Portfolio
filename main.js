
// Always start at top on page load/refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ANIMATED BACKGROUND
(function () {
    var c = document.getElementById('bg-canvas'), ctx = c.getContext('2d');
    var W, H, pts = [], isMob = window.innerWidth < 768, N = isMob ? 35 : 90;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', function () { resize(); isMob = W < 768; });
    for (var i = 0; i < N; i++) {
        pts.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.4 + 0.4, a: Math.random() * 0.45 + 0.08,
            col: Math.random() > 0.5 ? '0,245,212' : '123,47,255'
        });
    }
    function frame() {
        ctx.clearRect(0, 0, W, H);
        // soft mesh gradient
        var g1 = ctx.createRadialGradient(W * .25, H * .3, 0, W * .25, H * .3, W * .65);
        g1.addColorStop(0, 'rgba(0,245,212,0.025)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
        var g2 = ctx.createRadialGradient(W * .75, H * .65, 0, W * .75, H * .65, W * .55);
        g2.addColorStop(0, 'rgba(123,47,255,0.03)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
        // particles + lines
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
            ctx.fillStyle = 'rgba(' + p.col + ',' + p.a + ')'; ctx.fill();
            if (!isMob) {
                for (var j = i + 1; j < pts.length; j++) {
                    var dx = p.x - pts[j].x, dy = p.y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = 'rgba(0,245,212,' + (0.04 * (1 - d / 110)) + ')';
                        ctx.lineWidth = 0.4; ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(frame);
    }
    frame();
})();

// SPLASH
window.addEventListener('load', function () {
    setTimeout(function () { document.getElementById('splash').classList.add('hide'); }, 1600);
});

// SCROLL PROGRESS BAR
window.addEventListener('scroll', function () {
    var p = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scroll-bar').style.width = p + '%';
});

// REVEAL ON SCROLL
var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
        if (e.isIntersecting) setTimeout(function () { e.target.classList.add('visible'); }, i * 70);
    });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

// EXPERIENCE ACCORDION
function toggleExp(id) {
    var body = document.getElementById('body' + id.replace('exp', ''));
    var icon = document.getElementById('icon' + id.replace('exp', ''));
    body.classList.toggle('open');
    if (icon) {
        if (body.classList.contains('open')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
}
window.toggleExp = toggleExp;

// sync icon state with any body that starts open
document.querySelectorAll('.exp-body.open').forEach(function (body) {
    var num = body.id.replace('body', '');
    var icon = document.getElementById('icon' + num);
    if (icon) icon.style.transform = 'rotate(180deg)';
});

// COUNTER ANIMATION
function runCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
        var target = parseInt(el.dataset.count), sfx = el.dataset.suffix || '', cur = 0;
        var step = Math.max(1, Math.ceil(target / 30));
        var t = setInterval(function () { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur + sfx; }, 40);
    });
}
setTimeout(runCounters, 1800);

// MOBILE MENU
document.getElementById('burgerBtn').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.toggle('open');
});
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }
window.closeMobile = closeMobile;

// TYPING ANIMATION
(function () {
    var roles = ['Unity Game Developer', 'C# Game Programmer', 'Mobile Game Dev', '2D / 3D Game Creator'];
    var el = document.getElementById('hero-role');
    var cursor = el.querySelector('.cursor-blink');
    var idx = 0, charIdx = roles[0].length, deleting = false;
    function tick() {
        var current = roles[idx];
        if (!deleting) {
            charIdx++;
            if (charIdx > current.length) { deleting = true; setTimeout(tick, 1800); return; }
        } else {
            charIdx--;
            if (charIdx < 0) { deleting = false; idx = (idx + 1) % roles.length; charIdx = 0; }
        }
        el.firstChild.textContent = current.slice(0, charIdx);
        setTimeout(tick, deleting ? 38 : 75);
    }
    setTimeout(tick, 2200);
})();

// ACTIVE NAV HIGHLIGHT
(function () {
    var navLinks = document.querySelectorAll('.nav-links a');
    var sectionIds = ['hero', 'experience', 'projects', 'skills', 'education', 'contact'];
    window.addEventListener('scroll', function () {
        var current = 'hero';
        sectionIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 120) current = id;
        });
        navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });
})();

// PROJECT MODAL
function openModal(card) {
    var badgesEl   = card.querySelector('.project-header-row');
    var title      = card.querySelector('.project-title').innerHTML;
    var desc       = card.querySelector('.project-desc').innerHTML;
    var tags       = card.querySelector('.project-tags').innerHTML;
    var videoId    = (card.dataset.video || '').trim();
    var playstore  = (card.dataset.playstore || '').trim();
    var github     = (card.dataset.github || '').trim();
    var link       = (card.dataset.link || '').trim();
    var landscape  = card.dataset.landscape === 'true';

    document.getElementById('modal-badges').innerHTML = badgesEl ? badgesEl.innerHTML : '';
    document.getElementById('modal-title').innerHTML  = title;
    document.getElementById('modal-desc').innerHTML   = desc;
    document.getElementById('modal-tags').innerHTML   = tags;

    // video
    var videoWrap   = document.getElementById('modal-video-wrap');
    var videoEl     = document.getElementById('modal-video');
    var noVideo     = document.getElementById('modal-no-video');
    if (videoId && !videoId.startsWith('YOUR_')) {
        videoEl.src = videoId;
        videoEl.load();
        videoWrap.classList.add('has-video');
        noVideo.style.display = 'none';
    } else {
        videoEl.src = '';
        videoWrap.classList.remove('has-video');
        noVideo.style.display = 'flex';
    }

    // links
    var links = '';
    if (playstore && !playstore.startsWith('YOUR_')) {
        links += '<a href="' + playstore + '" target="_blank" class="btn-primary" style="font-size:0.75rem;padding:0.45rem 1rem;display:inline-flex;align-items:center;gap:0.5rem;"><i class="fa-brands fa-google-play"></i> Play Store</a>';
    }
    if (github && !github.startsWith('YOUR_')) {
        links += '<a href="' + github + '" target="_blank" class="btn-secondary" style="font-size:0.75rem;padding:0.45rem 1rem;display:inline-flex;align-items:center;gap:0.5rem;"><i class="fa-brands fa-github"></i> GitHub Repo</a>';
    }
    if (link && !link.startsWith('YOUR_')) {
        links += '<a href="' + link + '" target="_blank" class="btn-secondary" style="font-size:0.75rem;padding:0.45rem 1rem;display:inline-flex;align-items:center;gap:0.5rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Link</a>';
    }
    var linksEl = document.getElementById('modal-links');
    linksEl.innerHTML = links;
    linksEl.style.display = links ? 'flex' : 'none';

    var modalBox = document.querySelector('#project-modal .modal-box');
    if (landscape) {
        modalBox.classList.add('landscape');
    } else {
        modalBox.classList.remove('landscape');
    }

    document.getElementById('project-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('project-modal').classList.remove('open');
    var v = document.getElementById('modal-video');
    v.pause();
    v.src = '';
    document.body.style.overflow = '';
}

// close on backdrop click
document.getElementById('project-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

window.openModal = openModal;
window.closeModal = closeModal;

// SHOW MORE PROJECTS
function toggleMoreProjects() {
    var wrap = document.getElementById('extra-projects-wrap');
    var icon = document.getElementById('show-more-icon');
    var showLess = document.getElementById('show-less-wrap');
    var isExpanded = wrap.classList.contains('expanded');
    wrap.classList.toggle('expanded', !isExpanded);
    icon.classList.toggle('rotated', !isExpanded);
    showLess.style.display = isExpanded ? 'none' : 'block';
}
window.toggleMoreProjects = toggleMoreProjects;

// RESUME GENERATOR
function generateResume() {
    var w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><title>Tushar Lathiya - Resume</title>'
        + '<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;max-width:780px;margin:30px auto;padding:0 24px;color:#111;line-height:1.55;font-size:14px;}'
        + 'h1{font-size:26px;letter-spacing:1px;}sub{color:#555;font-size:14px;display:block;margin:4px 0 10px;}'
        + '.contacts{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:#444;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #ccc;}'
        + 'h2{font-size:11px;text-transform:uppercase;letter-spacing:2px;border-bottom:1.5px solid #111;padding-bottom:3px;margin:18px 0 8px;}'
        + '.job{margin-bottom:12px;}.jh{display:flex;justify-content:space-between;font-weight:bold;font-size:13px;}'
        + '.jr{font-size:12px;color:#333;margin:2px 0 6px;}ul{margin-left:16px;}li{margin-bottom:4px;font-size:13px;}'
        + '.row{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}.pill{background:#f2f2f2;padding:2px 8px;border-radius:2px;font-size:11px;}'
        + '@media print{body{margin:10px;}}</style></head><body>'
        + '<h1>Tushar Lathiya</h1><sub>Unity Game Developer</sub>'
        + '<div class="contacts"><span>&#128231; tusharlathiya0008@gmail.com</span><span>&#128241; +91 8140990008</span><span>&#128279; GitHub</span><span>&#128279; LinkedIn</span></div>'
        + '<h2>Summary</h2><p>Motivated Game Developer with hands-on experience creating 2D/3D games in Unity using C#. Strong in OOP, gameplay scripting, UI, and basic game physics. Familiar with Git and design patterns. A fast learner with a creative mindset, eager to contribute to a game development team.</p>'
        + '<h2>Work Experience</h2>'
        + '<div class="job"><div class="jh"><span>Nested Solution</span><span>Feb 2026 – Present</span></div><div class="jr">Unity Game Developer</div><ul><li>Developed and published Unity games with smooth performance and deployment.</li><li>Integrated monetization using Google AdMobs and in-app purchases.</li><li>Created engaging gameplay with animations while applying new Unity features and techniques.</li></ul></div>'
        + '<div class="job"><div class="jh"><span>Argon IT Services LLP</span><span>Nov 2025 – Jan 2026</span></div><div class="jr">Unity Game Developer — Intern</div><ul><li>Developed UI systems and smooth animations using DOTween.</li><li>Designed and implemented responsive layouts in Unity UI.</li><li>Created and customized Particle Systems for visual effects.</li><li>Applied new Unity features to enhance performance and user experience.</li></ul></div>'
        + '<h2>Projects</h2>'
        + '<p style="margin-bottom:6px;">Created 15+ Unity games including 2D, 3D, puzzle, and physics-based projects. Worked on complete game development with animations and particle systems; more projects available on GitHub.</p>'
        + '<ul><li><b>Colorwood Block – Sort Puzzle:</b> Color-based puzzle game with 500+ levels, DOTween animations, particle effects, sound effects and background music.</li>'
        + '<li><b>Crowd Pickup Jam Game:</b> 3D mobile Unity game with color-matching bus gameplay, 500+ optimized levels for Android.</li>'
        + '<li><b>Third-Person Character Controller Game:</b> 3D mobile game with joystick controls, camera follow system, animations, interactive gameplay.</li>'
        + '<li><b>Multiplayer Tic-Tac-Toe:</b> Real-time multiplayer using Photon PUN 2 with matchmaking, synchronized gameplay, turn-based logic.</li>'
        + '<li><b>StupidZombies Game:</b> 2D shooting puzzle with physics-based projectile mechanics, enemy elimination logic, level design and scoring.</li></ul>'
        + '<h2>Skills</h2>'
        + '<p><b>Languages:</b> C, C++, Java, C#, JavaScript</p>'
        + '<p><b>Backend &amp; Database:</b> Node.js, Express.js, MongoDB, REST APIs</p>'
        + '<p><b>Tools:</b> Git, GitHub, Visual Studio, Unity, VS Code</p>'
        + '<p><b>Soft Skills:</b> Problem-Solving, Debugging, Teamwork</p>'
        + '<h2>Education</h2>'
        + '<p><b>Bachelor of Computer Engineering</b> — Gandhinagar Institute of Technology (2021–2025)</p>'
        + '<p><b>HSC</b> — PP Savani (2020–2021)</p>'
        + '<h2>Certifications</h2>'
        + '<ul><li>Problem Solving through Programming in C – NPTEL</li><li>Programming in Java – NPTEL</li><li>DSA with Java – APNA College</li><li>Unity Game Development – CDMI</li></ul>'
        + '<script>window.print();<\/script></body></html>');
    w.document.close();
}
window.generateResume = generateResume;