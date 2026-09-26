import { useEffect, useMemo, useRef, useState } from 'react';

const jobs = [
  { id: 1, company: 'Linear', mark: 'L', markStyle: 'linear', title: 'Senior Product Designer', category: 'Design', location: 'San Francisco, CA', mode: 'Hybrid', salary: '$145k – $190k', posted: '2h ago', description: 'Shape the future of how the world’s most ambitious teams build products.', tags: ['Product design', 'Figma', 'Systems'] },
  { id: 2, company: 'Vercel', mark: '▲', markStyle: 'vercel', title: 'Frontend Engineer', category: 'Engineering', location: 'Remote, US', mode: 'Remote', salary: '$160k – $220k', posted: '5h ago', description: 'Help make the web feel instant for developers everywhere.', tags: ['React', 'TypeScript', 'Next.js'] },
  { id: 3, company: 'Notion', mark: 'N', markStyle: 'notion', title: 'Brand Marketing Lead', category: 'Marketing', location: 'New York, NY', mode: 'Hybrid', salary: '$130k – $175k', posted: '1d ago', description: 'Make a little more room for a lot more creativity.', tags: ['Brand', 'Storytelling', 'Growth'] },
  { id: 4, company: 'Ramp', mark: 'r', markStyle: 'ramp', title: 'Product Manager, Growth', category: 'Product', location: 'New York, NY', mode: 'On-site', salary: '$150k – $205k', posted: '1d ago', description: 'Build products that give businesses their time and money back.', tags: ['Product', 'Experimentation', 'B2B'] },
  { id: 5, company: 'Arc', mark: 'a', markStyle: 'arc', title: 'Data Scientist', category: 'Data', location: 'Remote, Worldwide', mode: 'Remote', salary: '$140k – $185k', posted: '2d ago', description: 'Turn a new way of working into a more human internet.', tags: ['Python', 'Analytics', 'SQL'] },
  { id: 6, company: 'Headspace', mark: '◒', markStyle: 'headspace', title: 'People Operations Partner', category: 'People', location: 'Los Angeles, CA', mode: 'Hybrid', salary: '$105k – $145k', posted: '3d ago', description: 'Help build a workplace where people can do their best work.', tags: ['People ops', 'Culture', 'HR'] },
];

const categories = ['All roles', 'Design', 'Engineering', 'Product', 'Marketing', 'Data'];
const WHATSAPP_NUMBER = '919997565019';
const WHATSAPP_MESSAGE = 'Hi Daybreak, I need help with my job search.';

function Icon({ name, size = 18, ...props }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}

function Brand({ mark, markStyle, size = 'small' }) {
  return <span className={`company-mark ${markStyle} ${size}`} aria-hidden="true">{mark}</span>;
}

function JobCard({ job, saved, onSave, onApply, featured = false }) {
  return (
    <article className={`job-card ${featured ? 'featured-job' : ''}`}>
      <div className="job-card-top">
        <Brand mark={job.mark} markStyle={job.markStyle} size={featured ? 'large' : 'small'} />
        <button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(job.id)} aria-label={saved ? 'Remove saved job' : 'Save job'} aria-pressed={saved}>
          <Icon name="bookmark" size={18} />
        </button>
      </div>
      <div className="job-title-wrap">
        <div className="company-name">{job.company} <span className="verified">✓</span></div>
        <h3>{job.title}</h3>
      </div>
      <div className="job-meta"><span><Icon name="pin" size={15} />{job.location}</span><i /> <span>{job.mode}</span></div>
      {featured && <p className="job-description">{job.description}</p>}
      <div className="job-tags">{job.tags.slice(0, featured ? 3 : 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="job-card-bottom">
        <div className="salary">{job.salary}<span> / year</span></div>
        <button className="apply-link" onClick={() => onApply(job)}>View role <Icon name="arrow" size={16} /></button>
      </div>
    </article>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('All roles');
  const [saved, setSaved] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ from: 'bot', text: 'Hey there! I’m here to help with your job search. Ask me about roles, remote work, salary, or saving jobs.' }]);
  const chatEndRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState('');

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const search = `${job.title} ${job.company} ${job.category} ${job.tags.join(' ')}`.toLowerCase();
    return (!savedOnly || saved.includes(job.id))
      && (activeCategory === 'All roles' || job.category === activeCategory)
      && (!query || search.includes(query.toLowerCase()))
      && (!location || job.location.toLowerCase().includes(location.toLowerCase()) || job.mode.toLowerCase().includes(location.toLowerCase()));
  }), [activeCategory, query, location, savedOnly, saved]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => setToast(''), 2600);
  };

  const toggleSaved = (id) => {
    const alreadySaved = saved.includes(id);
    setSaved((current) => alreadySaved ? current.filter((item) => item !== id) : [...current, id]);
    notify(alreadySaved ? 'Removed from your saved roles' : 'Role saved to your shortlist');
  };

  const scrollToJobs = () => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' });
  const showSavedJobs = () => {
    setSavedOnly(true);
    setActiveCategory('All roles');
    scrollToJobs();
    if (saved.length === 0) notify('Save a role and it’ll appear here for later.');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages, chatTyping, chatOpen]);

  const getChatReply = (message) => {
    const text = message.toLowerCase();
    if (/remote|work from home|anywhere/.test(text)) {
      const remoteRoles = jobs.filter((job) => job.mode === 'Remote');
      return `Here are a couple of remote roles to explore: ${remoteRoles.map((job) => `${job.title} at ${job.company}`).join(' and ')}. Use the Remote search chip to filter the list.`;
    }
    if (/salary|pay|compensation|range/.test(text)) return 'Each role shows its salary range on the card and in the details. The current listings range from $105k to $220k per year.';
    if (/save|bookmark|shortlist|later/.test(text)) return 'Tap the bookmark on any role to save it. Your shortlist is available from Saved jobs in the header or the Saved filter above the listings.';
    if (/resume|résumé|cv|career|interview/.test(text)) return 'A good next step is to tailor your resume to the role’s skills and highlight the impact of your work. Career resources are in the newsletter section, and we’re adding more guides soon.';
    if (/design/.test(text)) return 'For design, take a look at Senior Product Designer at Linear. Choose the Design filter to see design roles.';
    if (/engineer|developer|code|technical/.test(text)) return 'Frontend Engineer at Vercel is open now. Choose Engineering to browse technical roles.';
    if (/hello|hi|hey|help/.test(text)) return 'Of course! I can help you find roles by location or category, check salary ranges, and save jobs for later. What are you looking for?';
    return 'Try searching by job title, skill, company, or location in the search bar. You can also filter by category, or tell me if you’re looking for remote work.';
  };

  const sendChatMessage = (message = chatInput) => {
    const cleanMessage = message.trim();
    if (!cleanMessage || chatTyping) return;
    setChatMessages((current) => [...current, { from: 'user', text: cleanMessage }]);
    setChatInput('');
    setChatTyping(true);
    window.setTimeout(() => {
      setChatMessages((current) => [...current, { from: 'bot', text: getChatReply(cleanMessage) }]);
      setChatTyping(false);
    }, 550);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Daybreak home"><span className="brand-symbol"><span /></span>daybreak<span className="wordmark-dot">.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-active" href="#open-roles">Find jobs</a>
          <a href="#companies">Explore companies</a>
          <a href="#about">Career resources</a>
        </nav>
        <div className="header-actions"><button className="login-button" onClick={() => notify('Candidate sign-in is coming soon')}>Sign in</button><button className="post-button" onClick={showSavedJobs}>Saved jobs <span className="saved-count">{saved.length}</span></button></div>
        <button className="mobile-menu" aria-label="Open menu" onClick={() => notify('Explore the page using the links below')}>☰</button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE WORK YOU WERE MADE FOR</div>
            <h1>Make work<br />feel like <em>you.</em></h1>
            <p className="hero-subtitle">Good work changes everything. Find a team that gets you, a role that grows you, and a Monday worth getting up for.</p>
            <div className="hero-actions"><button className="hero-cta" onClick={scrollToJobs}>Explore open roles <Icon name="arrow" size={18} /></button><div className="candidate-proof"><div className="avatar-stack"><span className="avatar av-one">A</span><span className="avatar av-two">J</span><span className="avatar av-three">M</span><span className="avatar av-four">S</span></div><span><b>2,400+</b> found their next thing</span></div></div>
          </div>
          <div className="hero-art" aria-label="A preview of curated job opportunities">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="floating-note note-top"><span className="note-spark"><Icon name="spark" size={17} /></span><span><b>Good things ahead</b><small>New roles, every day</small></span></div>
            <div className="preview-card">
              <div className="preview-header"><span>MADE FOR YOUR NEXT</span><span className="live-indicator">● LIVE</span></div>
              <div className="preview-company"><Brand mark="L" markStyle="linear" size="small" /><span>Linear <small>San Francisco · Hybrid</small></span><span className="preview-badge">92% match</span></div>
              <h3>Senior Product<br />Designer</h3>
              <div className="preview-pills"><span>Full-time</span><span>$145k–$190k</span></div>
              <div className="preview-footer"><div className="mini-avatars"><i>A</i><i>J</i><i>+</i></div><span>Meet your future teammates</span><button onClick={scrollToJobs} aria-label="Browse this job"><Icon name="arrow" size={16} /></button></div>
            </div>
            <div className="floating-note note-bottom"><span className="note-check">✓</span><span><b>People-first teams</b><small>Work that fits your life</small></span></div>
            <span className="hero-star star-one">✳</span><span className="hero-star star-two">✳</span>
          </div>
          <div className="hero-bottom"><span>NOT JUST ANOTHER JOB BOARD</span><span>WORK, WITH A LITTLE MORE HEART <b>↗</b></span></div>
        </section>

        <section className="search-section" aria-label="Search jobs">
          <div className="search-panel">
            <label className="search-field"><Icon name="search" size={21} /><span className="field-copy"><small>WHAT ARE YOU LOOKING FOR?</small><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, skill or company" /></span></label>
            <span className="search-divider" />
            <label className="search-field location-field"><Icon name="pin" size={21} /><span className="field-copy"><small>WHERE?</small><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, state or remote" /></span></label>
            <button className="search-submit" onClick={scrollToJobs}>Find your role <Icon name="arrow" size={17} /></button>
          </div>
          <div className="popular-searches"><span>Popular:</span>{['Product designer', 'Remote', 'Growth', 'Early-stage'].map((term) => <button key={term} onClick={() => term === 'Remote' ? setLocation(term) : setQuery(term === 'Early-stage' ? 'startup' : term)}>{term}</button>)}</div>
        </section>

        <section className="company-strip" id="companies"><div className="strip-label">GOOD PEOPLE, GOOD PLACES</div><div className="company-logos"><span className="logo-notion">Notion</span><span className="logo-linear">◒ <b>linear</b></span><span className="logo-vercel">▲ Vercel</span><span className="logo-ramp">ramp</span><span className="logo-headspace">headspace</span><span className="logo-webflow">◈ Webflow</span></div></section>

        <section className="jobs-section" id="open-roles">
          <div className="section-heading"><div><div className="eyebrow section-eyebrow"><span className="eyebrow-dot" /> A GOOD PLACE TO START</div><h2>Roles worth your<br className="mobile-break" /> <em>next move.</em></h2></div><a href="#open-roles" className="all-jobs-link" onClick={(event) => { event.preventDefault(); setSavedOnly(false); setActiveCategory('All roles'); setQuery(''); setLocation(''); }}>See all roles <Icon name="arrow" size={17} /></a></div>
          <div className="job-controls"><div className="category-tabs" role="tablist" aria-label="Filter roles by category">{categories.map((category) => <button role="tab" aria-selected={!savedOnly && activeCategory === category} className={!savedOnly && activeCategory === category ? 'category-active' : ''} key={category} onClick={() => { setSavedOnly(false); setActiveCategory(category); }}>{category}{category === 'All roles' && <span className="tab-count">{jobs.length}</span>}</button>)}<button role="tab" aria-selected={savedOnly} className={savedOnly ? 'category-active' : ''} onClick={() => { setSavedOnly(true); setActiveCategory('All roles'); }}>Saved <span className="tab-count">{saved.length}</span></button></div><span className="results-count">Showing <b>{filteredJobs.length}</b> roles</span></div>
          {filteredJobs.length > 0 ? <div className="jobs-grid">{filteredJobs.map((job, index) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={toggleSaved} onApply={setSelectedJob} featured={index === 0 && activeCategory === 'All roles' && !query && !location} />)}</div> : <div className="empty-state"><span>✳</span><h3>{savedOnly && saved.length === 0 ? 'Your shortlist starts here.' : 'No roles found just yet.'}</h3><p>{savedOnly && saved.length === 0 ? 'Save a role you like and we’ll keep it close for later.' : 'Try another title or location. Your next thing is out there.'}</p><button onClick={() => { setQuery(''); setLocation(''); setActiveCategory('All roles'); setSavedOnly(false); }}>Browse all roles</button></div>}
          <div className="load-more-wrap"><span>A SMALL, THOUGHTFUL SELECTION — UPDATED DAILY</span><button className="load-more" onClick={() => notify('You’re all caught up. Check back for new roles tomorrow.')}>That’s a good start <span>✳</span></button></div>
        </section>

        <section className="newsletter" id="about"><div className="newsletter-mark"><Icon name="spark" size={23} /></div><div className="newsletter-copy"><span>THE GOOD WORK LETTER</span><h2>A little inspiration<br />for your inbox.</h2><p>Thoughtful career advice, fresh roles, and reminders that you’re doing just fine.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); notify('You’re on the list. Look out for a little good news soon.'); event.currentTarget.reset(); }}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" placeholder="Your email address" required /><button type="submit">Count me in <Icon name="arrow" size={16} /></button><small>No noise, ever. Unsubscribe whenever.</small></form><span className="newsletter-decoration">✳</span></section>
      </main>

      <footer className="site-footer"><a className="wordmark" href="#top"><span className="brand-symbol"><span /></span>daybreak<span className="wordmark-dot">.</span></a><p>Good work starts with a good feeling.</p><div className="footer-links"><a href="#open-roles">Find jobs</a><a href="#companies">Explore companies</a><a href="#about">Career resources</a><span>© 2025 Daybreak</span></div></footer>

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
      <a className="whatsapp-launcher" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`} target="_blank" rel="noreferrer" aria-label="Open WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.89c0 2.096.548 4.142 1.588 5.945L.057 24l6.335-1.662a11.882 11.882 0 005.653 1.437h.005c6.554 0 11.89-5.335 11.893-11.89a11.821 11.821 0 00-3.48-8.397"/></svg></a>
      <button className={`chat-launcher ${chatOpen ? 'chat-launcher-open' : ''}`} onClick={() => setChatOpen((open) => !open)} aria-label={chatOpen ? 'Close career assistant' : 'Open career assistant'} aria-expanded={chatOpen}><Icon name={chatOpen ? 'close' : 'chat'} size={21} />{!chatOpen && <span className="chat-launcher-dot" />}</button>
      {chatOpen && <section className="chat-window" aria-label="Daybreak career assistant"><header className="chat-header"><span className="chat-avatar"><Icon name="spark" size={17} /></span><span className="chat-header-copy"><b>Your career sidekick</b><small><i /> Here to help you find your next thing</small></span><button onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close" size={17} /></button></header><div className="chat-messages" aria-live="polite">{chatMessages.map((message, index) => <div key={`${index}-${message.from}`} className={`chat-message ${message.from === 'user' ? 'chat-user' : 'chat-bot'}`}>{message.from === 'bot' && <span className="chat-mini-avatar"><Icon name="spark" size={12} /></span>}<p>{message.text}</p></div>)}{chatTyping && <div className="chat-message chat-bot"><span className="chat-mini-avatar"><Icon name="spark" size={12} /></span><p className="typing-dots"><i /><i /><i /></p></div>}<div ref={chatEndRef} /></div>{chatMessages.length === 1 && <div className="chat-suggestions"><span>QUICK QUESTIONS</span><button onClick={() => sendChatMessage('Show me remote jobs')}>Remote roles</button><button onClick={() => sendChatMessage('How do I save a job?')}>Save a role</button><button onClick={() => sendChatMessage('What are the salary ranges?')}>Salary ranges</button></div>}<form className="chat-compose" onSubmit={(event) => { event.preventDefault(); sendChatMessage(); }}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask me anything..." aria-label="Message the career assistant" /><button type="submit" disabled={!chatInput.trim() || chatTyping} aria-label="Send message"><Icon name="arrow" size={17} /></button></form><div className="chat-disclaimer">Career help, right when you need it.</div></section>}
      {selectedJob && <div className="modal-backdrop" onClick={() => setSelectedJob(null)}><section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Close"><Icon name="close" /></button><Brand mark={selectedJob.mark} markStyle={selectedJob.markStyle} size="large" /><div className="modal-company">{selectedJob.company} <span className="verified">✓</span></div><h2 id="modal-title">{selectedJob.title}</h2><div className="job-meta"><span><Icon name="pin" size={15} />{selectedJob.location}</span><i /> <span>{selectedJob.mode}</span><i /> <span>{selectedJob.salary}</span></div><p>{selectedJob.description} Join a team that values thoughtful work, kind collaboration, and a healthy pace. Bring your perspective and help shape what comes next.</p><div className="job-tags">{selectedJob.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="modal-apply" onClick={() => { setSelectedJob(null); notify(`Application link for ${selectedJob.company} is not connected yet`); }}>Application link coming soon <Icon name="arrow" size={17} /></button><small className="modal-footnote">Demo role • Company application link will appear here.</small></section></div>}
    </div>
  );
}

export default App;
