/**
 * D Keertana — Personal Developer Portfolio Script
 * Interactive logic: Cursor spotlight, navigation scroll spy,
 * project filters, architecture modal, copy email toast, and form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Cursor Spotlight Tracking ---
  const spotlight = document.getElementById('spotlightOverlay');
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (spotlight) {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          document.documentElement.style.setProperty('--mouse-x', `${x}%`);
          document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // --- 2. Site Header Scroll State ---
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 3. Scroll Spy for Navigation Links ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const updateActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- 4. Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  const toggleMobileMenu = () => {
    const isOpen = mobileToggle.classList.toggle('open');
    mobileNavDrawer.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  mobileToggle?.addEventListener('click', toggleMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileToggle.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // --- 5. Project Filtering Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 6. Toast Notification Utility ---
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // --- 7. Copy Email Actions ---
  const targetEmail = 'keertana.dev@outlook.com';

  function copyEmailToClipboard(buttonElement, labelTextElement = null) {
    navigator.clipboard.writeText(targetEmail).then(() => {
      showToast(`[CLIPBOARD] Copied: ${targetEmail}`, 'success');

      if (labelTextElement) {
        const origText = labelTextElement.textContent;
        labelTextElement.textContent = 'Copied!';
        buttonElement.style.borderColor = 'var(--accent-emerald)';
        setTimeout(() => {
          labelTextElement.textContent = origText;
          buttonElement.style.borderColor = '';
        }, 2200);
      }
    }).catch(() => {
      // Fallback
      prompt('Copy Keertana’s email address:', targetEmail);
    });
  }

  const btnCopyHeader = document.getElementById('copyEmailHeaderBtn');
  const btnCopyHero = document.getElementById('heroCopyEmail');
  const btnCopyAction = document.getElementById('btnCopyEmailAction');
  const copyBtnText = document.getElementById('copyBtnText');

  btnCopyHeader?.addEventListener('click', () => copyEmailToClipboard(btnCopyHeader));
  btnCopyHero?.addEventListener('click', () => copyEmailToClipboard(btnCopyHero));
  btnCopyAction?.addEventListener('click', () => copyEmailToClipboard(btnCopyAction, copyBtnText));

  // --- 8. Project Architecture Modal Data & Controls ---
  const projectDetails = {
    rfq: {
      title: 'RFQ Compliance Checker // Architecture Inspection',
      body: `
        <p><strong>Overview:</strong> Built to automate the validation of complex vendor bids against procurement Request for Quotation (RFQ) documents containing mechanical, electrical, and commercial specifications.</p>
        
        <h4>Core Engineering Architecture</h4>
        <ul>
          <li><strong>Document Parsing:</strong> Ingests unstructured technical specifications and converts constraints into typed constraint matrices (e.g. dimensions, tolerance bounds, certifications, delivery dates).</li>
          <li><strong>Rule Execution Engine:</strong> Compares vendor assertions against upper and lower bounds. Multi-variable penalties are applied to identify critical compliance risks.</li>
          <li><strong>Audit &amp; Reporting:</strong> Generates tamper-evident evaluation summaries formatted for enterprise procurement compliance audits.</li>
        </ul>

        <h4>Technical Stack &amp; Constraints</h4>
        <ul>
          <li><strong>Language &amp; Runtime:</strong> Java 17, Spring Boot, PostgreSQL</li>
          <li><strong>Validation Strategy:</strong> Strict typing with unit tests covering numeric boundary cases and conflicting clauses.</li>
          <li><strong>Complexity:</strong> $O(N \\times M)$ constraint resolution with memoized rule graph indexing.</li>
        </ul>
      `,
      github: 'https://github.com'
    },
    dsa: {
      title: 'Algorithmic Patterns Lab // Architecture Inspection',
      body: `
        <p><strong>Overview:</strong> A structured repository of 150+ problems from LeetCode, Codeforces, and standard CS curricula, organized by algorithmic patterns rather than random problem lists.</p>
        
        <h4>Categorized Pattern Taxonomies</h4>
        <ul>
          <li><strong>Graph Traversals:</strong> Cycle detection via Kahn's algorithm (Topological sort), Dijkstra's shortest path, Disjoint Set Union (DSU) with path compression.</li>
          <li><strong>Dynamic Programming:</strong> 1D recurrence, 0/1 Knapsack variants, Longest Common Subsequence (LCS), Interval DP.</li>
          <li><strong>Sliding Window &amp; Two Pointers:</strong> Monotonic deque for moving window maximums, two-pointer containment optimization.</li>
        </ul>

        <h4>Benchmarking &amp; Code Quality</h4>
        <ul>
          <li>All solutions contain explicit asymptotic Time and Space complexity bounds.</li>
          <li>Unit test suites with tricky edge cases (empty inputs, integer overflow conditions, cyclical loops).</li>
        </ul>
      `,
      github: 'https://github.com'
    },
    db: {
      title: 'Company & Operations Database // Architecture Inspection',
      body: `
        <p><strong>Overview:</strong> Relational schema design model for enterprise resource planning, personnel records, project milestones, and billing ledgers.</p>
        
        <h4>Database Architecture &amp; Optimizations</h4>
        <ul>
          <li><strong>Relational Normalization:</strong> Engineered to Third Normal Form (3NF) to eliminate update anomalies and data redundancy.</li>
          <li><strong>Index Engineering:</strong> Composite B-Tree indexing on frequently filtered columns (e.g., department_id, salary_grade, timestamp ranges), reducing sequential table scans.</li>
          <li><strong>Transaction Safety:</strong> ACID compliant transactions with repeatable read isolation levels for high-concurrency payroll calculations.</li>
        </ul>

        <h4>Security &amp; RBAC</h4>
        <ul>
          <li>Role-Based Access Control (RBAC) schemas separating HR, Engineering leads, and Financial Auditor capabilities.</li>
        </ul>
      `,
      github: 'https://github.com'
    },
    lab: {
      title: 'Systems Sandbox & Experiments // Architecture Inspection',
      body: `
        <p><strong>Overview:</strong> A testing ground for core system utilities, concurrent threading benchmarks, and low-level CLI development.</p>
        
        <h4>Active Experiments</h4>
        <ul>
          <li><strong>Concurrent Thread Pool Benchmark:</strong> Comparative analysis of thread synchronization latency using Java ReentrantLock vs Synchronized blocks.</li>
          <li><strong>CLI Task Automator:</strong> Command-line application with subcommands, progress indicators, and local SQLite caching for developer workflows.</li>
          <li><strong>Socket Communication:</strong> Custom multi-client echo server in Java using non-blocking I/O (NIO) selectors.</li>
        </ul>
      `,
      github: 'https://github.com'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalBody = document.getElementById('modalProjectBody');
  const modalGithubLink = document.getElementById('modalGithubLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');

  function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data || !projectModal) return;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    modalGithubLink.setAttribute('href', data.github);

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = trigger.getAttribute('data-project');
      openProjectModal(projKey);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalCloseAction?.addEventListener('click', closeProjectModal);

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // --- 9. Contact Form Submission Handling ---
  const contactForm = document.getElementById('contactForm');
  const senderName = document.getElementById('senderName');
  const senderEmail = document.getElementById('senderEmail');
  const senderMessage = document.getElementById('senderMessage');
  const submitBtn = document.getElementById('submitBtn');
  const btnSubmitText = document.getElementById('btnSubmitText');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('has-error'));

    if (!senderName.value.trim()) {
      senderName.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!emailRegex.test(senderEmail.value.trim())) {
      senderEmail.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!senderMessage.value.trim()) {
      senderMessage.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      showToast('[ERROR] Please fill out all required fields properly.', 'error');
      return;
    }

    // Simulate sending transmission
    btnSubmitText.textContent = 'Transmitting Packet...';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnSubmitText.textContent = 'Message Transmitted!';
      showToast('[TRANSMISSION SENT] Thank you! Keertana will reply shortly.', 'success');
      contactForm.reset();

      setTimeout(() => {
        btnSubmitText.textContent = 'Transmit Message';
        submitBtn.disabled = false;
      }, 3000);
    }, 1200);
  });

  // --- 10. Back To Top Button ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 11. Subtle Telemetry Time Ticker ---
  const tickerText = document.getElementById('liveTickerText');
  const tickerPhrases = [
    'Iterating Daily',
    'Compiling DSA Logic',
    'Deepening Java Concurrency',
    'Open to Internships',
    'Writing Clean Code'
  ];
  let tickerIdx = 0;

  setInterval(() => {
    if (tickerText) {
      tickerIdx = (tickerIdx + 1) % tickerPhrases.length;
      tickerText.style.opacity = '0';
      setTimeout(() => {
        tickerText.textContent = tickerPhrases[tickerIdx];
        tickerText.style.opacity = '1';
      }, 300);
    }
  }, 4500);
});
