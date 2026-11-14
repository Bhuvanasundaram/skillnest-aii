import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, Award, BookOpen, Bot, BrainCircuit, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Code2, Compass, Flame, GraduationCap, LayoutDashboard, Lightbulb, Menu, MessageCircle, Play, Plus, Rocket, Search, Send, Settings2, ShieldCheck, Sparkles, Target, TrendingUp, Trophy, UserRound, Users, X, Zap } from 'lucide-react';
import './styles.css';

type Skill = { name: string; level: number; required: number; category: string };
type Course = { title: string; provider: string; duration: string; level: string; skill: string; type: string };
const roles = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'AI / ML Engineer', 'Cloud Engineer'];
const initialSkills: Skill[] = [
  { name: 'Python', level: 78, required: 65, category: 'Programming' },
  { name: 'SQL', level: 72, required: 60, category: 'Data' },
  { name: 'HTML & CSS', level: 68, required: 75, category: 'Frontend' },
  { name: 'JavaScript', level: 22, required: 80, category: 'Frontend' },
  { name: 'React', level: 8, required: 75, category: 'Frontend' },
  { name: 'Node.js', level: 0, required: 70, category: 'Backend' },
  { name: 'Git & GitHub', level: 35, required: 60, category: 'Tools' },
];
const courseCatalog: Course[] = [
  { title: 'JavaScript: The Complete Guide', provider: 'freeCodeCamp', duration: '8h 20m', level: 'Beginner', skill: 'JavaScript', type: 'Course' },
  { title: 'React – The Complete Guide', provider: 'Scrimba', duration: '10h', level: 'Beginner', skill: 'React', type: 'Interactive' },
  { title: 'Node.js & Express Fundamentals', provider: 'The Odin Project', duration: '6h', level: 'Intermediate', skill: 'Node.js', type: 'Project' },
  { title: 'Git & GitHub for Developers', provider: 'Microsoft Learn', duration: '2h 30m', level: 'Beginner', skill: 'Git & GitHub', type: 'Tutorial' },
  { title: 'Build Responsive Web Pages', provider: 'MDN', duration: '3h', level: 'Beginner', skill: 'HTML & CSS', type: 'Practice' },
  { title: 'SQL Practice: Query Challenges', provider: 'SQLBolt', duration: '90m', level: 'Intermediate', skill: 'SQL', type: 'Practice' },
];
const agentDetails = [
  { name: 'Skill Analyst', role: 'Maps your current abilities', icon: BrainCircuit, color: 'violet', status: 'Analysis complete' },
  { name: 'Career Navigator', role: 'Compares skills to role requirements', icon: Compass, color: 'blue', status: 'Role matched' },
  { name: 'Learning Architect', role: 'Builds your next best learning steps', icon: BookOpen, color: 'green', status: 'Path generated' },
  { name: 'Progress Coach', role: 'Adapts the plan as you improve', icon: TrendingUp, color: 'orange', status: 'Monitoring progress' },
];

export default function App() {
  const [active, setActive] = useState('Overview');
  const [role, setRole] = useState('Full Stack Developer');
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [completed, setCompleted] = useState<string[]>(['Git & GitHub']);
  const [assessment, setAssessment] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [showGoal, setShowGoal] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>(['Hi Alex! I’m your AI learning mentor. Your strongest foundation is Python and SQL. Let’s close your JavaScript gap next.']);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');

  // KAGE-inspired scroll choreography: chapter reveals, a live progress rail and subtle pointer parallax.
  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--page-progress', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
      const hero = document.querySelector<HTMLElement>('.cinematic-hero');
      if (hero) hero.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.12, 90)}px`);
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => { window.removeEventListener('scroll', updateScroll); observer.disconnect(); };
  }, [active]);

  const gaps = useMemo(() => skills.filter(s => s.required > s.level).sort((a,b) => (b.required-b.level)-(a.required-a.level)), [skills]);
  const readiness = useMemo(() => Math.round(skills.reduce((sum,s) => sum + Math.min(100, s.level / Math.max(s.required,1) * 100),0) / skills.length), [skills]);
  const recommended = useMemo(() => courseCatalog.filter(c => gaps.some(g => g.name === c.skill)).slice(0,4), [gaps]);
  const doneCount = completed.length;
  const overallProgress = Math.min(100, Math.round((doneCount / 6) * 100));

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2600); }
  function changeRole(next: string) {
    setRole(next); setShowGoal(false); setAssessmentScore(null);
    const roleNeeds: Record<string,string[]> = {
      'Full Stack Developer': ['HTML & CSS','JavaScript','React','Node.js','Git & GitHub'],
      'Frontend Developer': ['HTML & CSS','JavaScript','React','Git & GitHub'],
      'Backend Developer': ['Python','SQL','Node.js','Git & GitHub'],
      'Data Analyst': ['Python','SQL','Data Visualization','Statistics'],
      'AI / ML Engineer': ['Python','SQL','Machine Learning','Statistics'],
      'Cloud Engineer': ['Linux','Networking','Cloud Fundamentals','Python'],
    };
    const needs = roleNeeds[next] || roleNeeds['Full Stack Developer'];
    setSkills(prev => {
      const known = new Map(prev.map(s => [s.name,s]));
      return needs.map((name,i) => known.get(name) || { name, level: 0, required: [75,80,70,65,60][i%5], category: 'Career skill' });
    });
    notify(`Learning path updated for ${next}`);
  }
  function completeCourse(title: string, skill: string) {
    if (completed.includes(title)) return;
    setCompleted(prev => [...prev,title]);
    setSkills(prev => prev.map(s => s.name === skill ? {...s, level: Math.min(100, s.level + 18)} : s));
    notify('Progress saved · Skill level updated');
  }
  function addSkill() {
    const name = newSkill.trim(); if (!name) return;
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) { notify('That skill is already in your profile'); return; }
    setSkills(prev => [...prev,{name,level:35,required:65,category:'Added skill'}]); setNewSkill(''); setShowSkill(false); notify('Skill added to your profile');
  }
  function sendChat() {
    if (!chatInput.trim()) return;
    const q = chatInput.trim(); setChatMessages(prev => [...prev, q]); setChatInput('');
    const answer = q.toLowerCase().includes('react') ? 'React is one of your biggest current gaps. Start with components, props and state, then build a small task tracker. I’ve placed a React course in your recommended path.' : q.toLowerCase().includes('goal') || q.toLowerCase().includes('career') ? `Your current target is ${role}. I compare your profile against the skills for this role and reprioritize the roadmap when your goal changes.` : q.toLowerCase().includes('weak') || q.toLowerCase().includes('gap') ? `Your largest gaps are ${gaps.slice(0,3).map(g=>g.name).join(', ')}. Focus on ${gaps[0]?.name || 'your next learning module'} first; it has the highest priority for your target role.` : 'A good next step is to focus on one high-priority skill, complete a short lesson, then apply it in a small project. I’ll update your roadmap as you record progress.';
    window.setTimeout(() => setChatMessages(prev => [...prev,answer]), 250);
  }

  const nav = [{label:'Overview',icon:LayoutDashboard},{label:'My skills',icon:Zap},{label:'Career path',icon:Target},{label:'Learning hub',icon:BookOpen},{label:'Progress',icon:Activity}];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><div><b>skill<span>nest</span></b><small>YOUR GROWTH, MAPPED.</small></div><button className="close-nav" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(item=><button key={item.label} className={`nav-item ${active===item.label?'active':''}`} onClick={()=>{setActive(item.label);setMobileNav(false)}}><item.icon size={18}/><span>{item.label}</span>{item.label==='Learning hub'&&<span className="nav-count">4</span>}</button>)}</nav>
      <div className="sidebar-divider"/>
      <div className="workspace-label">YOUR SPACE</div>
      <button className="nav-item" onClick={()=>notify('Portfolio workspace is ready for your projects')}><BriefcaseBusiness size={18}/><span>My projects</span></button>
      <button className="nav-item" onClick={()=>notify('Certificates will appear here as you complete courses')}><Award size={18}/><span>Certificates</span></button>
      <div className="sidebar-spacer"/>
      <div className="sidebar-help"><div className="help-icon"><Lightbulb size={18}/></div><b>Small steps add up.</b><p>Your next skill is closer than you think.</p><button onClick={()=>setChatOpen(true)}>Talk to your mentor <ArrowRight size={14}/></button></div>
      <button className="profile-mini" onClick={()=>notify('Profile settings opened')}><div className="avatar">AC</div><div><b>Alex Carter</b><small>Computer Science · Student</small></div><Settings2 size={17}/></button>
    </aside>
    {mobileNav&&<div className="nav-backdrop" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><div className="streak"><Flame size={16}/><b>5</b><span>day streak</span></div><button className="icon-btn" aria-label="Search" onClick={()=>notify('Search your skills and learning resources')}><Search size={18}/></button><button className="icon-btn notification" aria-label="Notifications" onClick={()=>notify('You’re all caught up!')}><span/> <CircleHelp size={18}/></button><div className="avatar top-avatar">AC</div></div></header>
      <div className="scroll-progress"><span/></div>
      <div className="page-content">
        <section className="cinematic-hero scroll-reveal">
          <div className="cinematic-copy"><div className="cinematic-kicker"><i/> THE FUTURE OF PERSONAL LEARNING</div>
            <h1>Build the skills.<br/><em>Become the possibility.</em></h1>
            <p>An adaptive learning journey that understands where you are, sees where you want to go, and maps the steps between.</p>
            <div className="cinematic-actions"><button onClick={()=>document.getElementById('learning-dashboard')?.scrollIntoView({behavior:'smooth'})}>Explore your journey <ArrowDownRight size={16}/></button><span><Sparkles size={14}/> Powered by your AI learning team</span></div>
            <div className="cinematic-meta"><span><b>01</b> DISCOVER YOUR SKILLS</span><span><b>02</b> MAP YOUR CAREER</span><span><b>03</b> GROW WITH AI</span></div>
          </div>
          <div className="learning-orbit" aria-hidden="true"><div className="orbit-ring ring-a"/><div className="orbit-ring ring-b"/><div className="orbit-ring ring-c"/><div className="orbit-glow"/><div className="orbit-center"><Sparkles size={27}/><small>YOUR<br/>POTENTIAL</small></div><div className="orbit-node node-one"><BrainCircuit size={17}/></div><div className="orbit-node node-two"><Target size={17}/></div><div className="orbit-node node-three"><BookOpen size={17}/></div><div className="orbit-node node-four"><TrendingUp size={17}/></div><span className="orbit-label label-one">SKILL DNA</span><span className="orbit-label label-two">CAREER PATH</span><span className="orbit-label label-three">LEARNING LOOP</span></div>
          <div className="hero-scroll-cue"><span/> SCROLL TO EXPLORE</div>
        </section>
        <div id="learning-dashboard" className="dashboard-anchor"/>
        <section className="welcome-row scroll-reveal"><div><div className="eyebrow"><span className="live-dot"/> YOUR PERSONAL LEARNING INTELLIGENCE</div><h1>{active==='Overview'?'Good morning, Alex':active}<span className="wave">{active==='Overview'?' ✦':''}</span></h1><p className="welcome-sub">{active==='Overview'?'You’re building momentum. Here’s your progress toward your next career move.':`A clear view of your ${active.toLowerCase()} and what to focus on next.`}</p></div><button className="goal-button" onClick={()=>setShowGoal(true)}><Target size={16}/> <span>Goal: {role}</span><ChevronDown size={15}/></button></section>
        <section className="hero-card scroll-reveal"><div className="hero-copy"><div className="hero-tag"><Sparkles size={13}/> YOUR CAREER SNAPSHOT</div><h2>Your next chapter<br/><em>starts with a skill.</em></h2><p>You're on your way to becoming a <b>{role}</b>. We’ve mapped what you know, what’s next, and how to get there.</p><div className="hero-actions"><button className="primary-btn" onClick={()=>setActive('Career path')}>Explore my learning path <ArrowRight size={16}/></button><span className="hero-note"><ShieldCheck size={14}/> Personalized to you</span></div></div><div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><div className="orbit-icon"><Rocket size={27}/></div><span>YOUR<br/>POTENTIAL</span></div><div className="float-card float-top"><span className="float-dot green"/> Skills mapped <b>{skills.length}</b></div><div className="float-card float-bottom"><TrendingUp size={15}/><span>Career readiness</span><b>{readiness}%</b></div><div className="spark spark-a">✳</div><div className="spark spark-b">✦</div></div><div className="hero-bottom"><span>✦ &nbsp; Every expert was once a beginner.</span><span>YOUR JOURNEY, YOUR PACE</span></div></section>
        <section className="stats-grid scroll-reveal"><div className="stat-card"><div className="stat-head"><span className="stat-icon purple"><BrainCircuit size={18}/></span><span className="stat-caption">SKILL PROFILE</span></div><div className="stat-value">{skills.length}<small> skills</small></div><div className="stat-foot"><span className="positive"><ArrowDownRight size={14}/> +2 this month</span><span>across 4 areas</span></div></div><div className="stat-card"><div className="stat-head"><span className="stat-icon mint"><Target size={18}/></span><span className="stat-caption">CAREER READINESS</span></div><div className="stat-value">{readiness}<small>%</small></div><div className="stat-foot"><span className="positive"><TrendingUp size={14}/> Growing</span><span>toward your goal</span></div></div><div className="stat-card"><div className="stat-head"><span className="stat-icon peach"><BookOpen size={18}/></span><span className="stat-caption">LEARNING PROGRESS</span></div><div className="stat-value">{doneCount}<small>/ 6</small></div><div className="mini-progress"><span style={{width:`${overallProgress}%`}}/></div><div className="stat-foot"><span>{overallProgress}% completed</span><span>learning plan</span></div></div><div className="stat-card"><div className="stat-head"><span className="stat-icon yellow"><Trophy size={18}/></span><span className="stat-caption">ACHIEVEMENTS</span></div><div className="stat-value">{doneCount+2}<small> earned</small></div><div className="stat-foot"><span className="positive"><Award size={14}/> Keep it up</span><span>next one is close</span></div></div></section>
        <section className="content-grid scroll-reveal"><div className="panel skills-panel"><div className="panel-heading"><div><div className="section-kicker">THE BIG PICTURE</div><h3>Your skill landscape</h3><p>How your skills compare to your career goal.</p></div><button className="text-button" onClick={()=>setActive('My skills')}>View all <ArrowRight size={15}/></button></div><div className="legend"><span><i className="legend-have"/> Your level</span><span><i className="legend-need"/> Role requirement</span></div><div className="skill-bars">{skills.slice(0,6).map(s=><div className="skill-row" key={s.name}><div className="skill-name">{s.name}<span className={s.level>=s.required?'skill-good':'skill-gap'}>{s.level>=s.required?'On track':`${s.required-s.level}% to go`}</span></div><div className="bar-track"><div className="bar-required" style={{width:`${s.required}%`}}/><div className="bar-current" style={{width:`${s.level}%`}}/></div></div>)}</div><div className="skills-insight"><div className="insight-icon"><Lightbulb size={16}/></div><p><b>Insight from Skill Analyst</b><br/>Your {skills.slice().sort((a,b)=>b.level-a.level)[0]?.name || 'core skills'} foundation is a strength. Focus next on <b>{gaps[0]?.name || 'your next advanced skill'}</b> to make the biggest leap.</p></div></div>
        <div className="panel gap-panel"><div className="panel-heading"><div><div className="section-kicker">YOUR NEXT MILESTONES</div><h3>Priority skill gaps</h3><p>Skills to unlock your target role.</p></div><span className="gap-count">{gaps.length} gaps</span></div><div className="gap-list">{gaps.slice(0,4).map((s,i)=><div className="gap-item" key={s.name}><div className={`gap-rank rank-${i+1}`}>{String(i+1).padStart(2,'0')}</div><div className="gap-info"><b>{s.name}</b><small>{s.category} · {s.level===0?'Not started':'In progress'}</small></div><div className="gap-level"><b>{s.level}%</b><small>current</small></div><div className="gap-arrow"><ArrowRight size={16}/></div></div>)}</div><button className="outline-btn full-btn" onClick={()=>setActive('Career path')}>See my full roadmap <ArrowRight size={15}/></button></div></section>
        <section className="lower-grid scroll-reveal"><div className="panel learning-panel"><div className="panel-heading"><div><div className="section-kicker">CURATED FOR YOUR GOAL</div><h3>Picked for your next step</h3><p>Resources selected around your skill gaps.</p></div><button className="text-button" onClick={()=>setActive('Learning hub')}>Learning hub <ArrowRight size={15}/></button></div><div className="course-list">{recommended.slice(0,3).map((c,i)=><div className="course-row" key={c.title}><div className={`course-thumb thumb-${i+1}`}>{c.skill==='JavaScript'?<Code2/>:c.skill==='React'?<Sparkles/>:<BookOpen/>}</div><div className="course-info"><div className="course-type">{c.type} <span>·</span> {c.level}</div><b>{c.title}</b><small>{c.provider} &nbsp;·&nbsp; <Clock3 size={12}/> {c.duration}</small></div><button className={`course-action ${completed.includes(c.title)?'course-done':''}`} onClick={()=>completeCourse(c.title,c.skill)}>{completed.includes(c.title)?<Check size={16}/>:<Play size={15}/>}</button></div>)}</div></div>
        <div className="panel agents-panel"><div className="panel-heading"><div><div className="section-kicker">WORKING BEHIND THE SCENES</div><h3>Your AI team</h3><p>Specialists collaborating on your growth.</p></div><span className="agents-live"><span/> LIVE</span></div><div className="agent-list">{agentDetails.map((a,i)=><div className="agent-row" key={a.name}><div className={`agent-icon ${a.color}`}><a.icon size={17}/></div><div className="agent-info"><b>{a.name}</b><small>{a.role}</small></div><span className="agent-check"><CheckCircle2 size={15}/></span></div>)}</div><button className="mentor-link" onClick={()=>setChatOpen(true)}><span><Bot size={16}/> Ask your AI mentor</span><ArrowRight size={15}/></button></div></section>
        <footer className="footer scroll-reveal"><span>© 2025 skillnest · Built around your potential.</span><span>LEARN WITH PURPOSE <span className="footer-star">✦</span></span></footer>
      </div>
    </main>
    {showGoal&&<div className="modal-backdrop" onClick={()=>setShowGoal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowGoal(false)}><X size={18}/></button><div className="modal-icon"><Target size={21}/></div><div className="section-kicker">CAREER DIRECTION</div><h3>Where do you want to go?</h3><p>Choose a target role. Your skill analysis and learning path will adapt to match.</p><div className="role-options">{roles.map(r=><button key={r} className={role===r?'role-selected':''} onClick={()=>changeRole(r)}><span>{r}</span>{role===r?<CheckCircle2 size={17}/>:<ArrowRight size={15}/>}</button>)}</div></div></div>}
    {showSkill&&<div className="modal-backdrop" onClick={()=>setShowSkill(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowSkill(false)}><X size={18}/></button><div className="modal-icon"><Plus size={21}/></div><h3>Add a skill</h3><p>Add a skill you already know. The Skill Analyst will include it in your profile.</p><input className="modal-input" value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="e.g. Figma, Java, Communication" onKeyDown={e=>e.key==='Enter'&&addSkill()}/><button className="primary-btn modal-submit" onClick={addSkill}>Add to my profile <ArrowRight size={15}/></button></div></div>}
    {active==='My skills'&&<div className="floating-action"><button className="primary-btn" onClick={()=>setShowSkill(true)}><Plus size={16}/> Add a skill</button></div>}
    {active==='Career path'&&<div className="extra-panel scroll-reveal"><div className="panel"><div className="section-kicker">YOUR PERSONALIZED ROADMAP</div><h3>The path to {role}</h3><p className="muted">A flexible sequence based on your current skills. Complete a step to strengthen your readiness.</p><div className="roadmap">{gaps.slice(0,5).map((s,i)=><div className="roadmap-step" key={s.name}><div className={`roadmap-number ${completed.some(c=>c.toLowerCase().includes(s.name.toLowerCase()))?'step-complete':''}`}>{completed.some(c=>c.toLowerCase().includes(s.name.toLowerCase()))?<Check size={16}/>:i+1}</div><div><b>{s.name}</b><p>{i===0?'Start here · Highest impact for your target role':i===1?'Build on your foundation with guided practice':'Apply what you learn in a small project'}</p><small>{s.level}% current proficiency · Target {s.required}%</small></div><span className="roadmap-priority">{i===0?'HIGH PRIORITY':i===1?'NEXT UP':'UP NEXT'}</span></div>)}</div><button className="outline-btn" onClick={()=>setActive('Learning hub')}>Explore recommended resources <ArrowRight size={15}/></button></div></div>}
    {active==='Learning hub'&&<div className="extra-panel scroll-reveal"><div className="panel"><div className="section-kicker">LEARN BY DOING</div><h3>Your recommended resources</h3><p className="muted">Selected to close the gaps between your current profile and {role}.</p><div className="hub-grid">{courseCatalog.filter(c=>gaps.some(g=>g.name===c.skill)).map(c=><div className="hub-course" key={c.title}><div className="course-type">{c.type} · {c.duration}</div><h4>{c.title}</h4><p>{c.provider} · {c.level}</p><button className={completed.includes(c.title)?'completed-resource':''} onClick={()=>completeCourse(c.title,c.skill)}>{completed.includes(c.title)?'Completed ✓':'Mark as completed'} <ArrowRight size={14}/></button></div>)}</div></div></div>}
    {active==='Progress'&&<div className="extra-panel scroll-reveal"><div className="panel"><div className="section-kicker">YOUR GROWTH, OVER TIME</div><h3>Progress & achievements</h3><p className="muted">Every completed lesson contributes to your career readiness.</p><div className="progress-summary"><div><span>Learning plan completed</span><b>{overallProgress}%</b><div className="progress-track"><i style={{width:`${overallProgress}%`}}/></div></div><div><span>Career readiness</span><b>{readiness}%</b><div className="progress-track"><i style={{width:`${readiness}%`}}/></div></div></div><div className="assessment-box"><div className="assessment-icon"><GraduationCap size={23}/></div><div><b>Quick skill check-in</b><p>Take a short self-assessment to help your AI team tune your learning path.</p>{assessmentScore!==null?<strong className="score-result">Assessment recorded: {assessmentScore}% · Your roadmap has been refreshed.</strong>:<button className="text-button" onClick={()=>setAssessment(true)}>Start 1-minute check-in <ArrowRight size={15}/></button>}</div></div><div className="completed-list"><b>Recently completed</b>{completed.map(c=><div key={c}><CheckCircle2 size={15}/>{c}</div>)}</div></div></div>}
    {assessment&&<div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={()=>setAssessment(false)}><X size={18}/></button><div className="modal-icon"><GraduationCap size={21}/></div><div className="section-kicker">QUICK CHECK-IN</div><h3>How confident do you feel about your next skill?</h3><p>Your answer helps the Progress Coach adapt your plan. This is a self-reflection, not a graded exam.</p><div className="assessment-options">{['I’m just getting started','I understand the basics','I can use it with some help','I feel confident applying it'].map((v,i)=><button key={v} onClick={()=>{const score=[25,50,75,90][i];setAssessmentScore(score);setSkills(prev=>prev.map((s,j)=>j===0?{...s,level:Math.min(100,s.level+(i>=2?8:2))}:s));setAssessment(false);notify('Progress Coach updated your learning plan')}}>{v}<ArrowRight size={15}/></button>)}</div></div></div>}
    {chatOpen&&<div className="chat-panel"><div className="chat-head"><div className="chat-avatar"><Bot size={19}/></div><div><b>Your AI Mentor</b><small><span/> 4 agents connected</small></div><button onClick={()=>setChatOpen(false)}><X size={18}/></button></div><div className="chat-context"><Sparkles size={14}/> Context-aware · Knows your skills & career goal</div><div className="chat-messages">{chatMessages.map((m,i)=><div className={i%2===0?'mentor-message':'user-message'} key={i}>{m}</div>)}</div><div className="chat-suggestions"><button onClick={()=>setChatInput('What are my biggest skill gaps?')}>My skill gaps</button><button onClick={()=>setChatInput('What should I learn next?')}>What’s next?</button></div><div className="chat-compose"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask your mentor anything…" onKeyDown={e=>e.key==='Enter'&&sendChat()}/><button onClick={sendChat}><Send size={17}/></button></div></div>}
    {!chatOpen&&<button className="mentor-fab" onClick={()=>setChatOpen(true)}><MessageCircle size={19}/><span>AI Mentor</span><i/></button>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
