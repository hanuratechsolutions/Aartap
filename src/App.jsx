import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCircle2, ChevronRight, Clock3, FlaskConical, Heart, Home, MapPin,
  MessageCircle, Package, Phone, Pill, Plus, Search, ShieldCheck, ShoppingBag,
  ShoppingCart, SlidersHorizontal, Sparkles, Stethoscope, Truck, UserRound,
  Video, X, LogOut, Upload, Star, Mic, ClipboardList,
} from "lucide-react";
import { doctors, pharmacies, labs, medicines, tests, initialAppointments, completedAppointments } from "./data.js";
import artapLogo from "../assets/artap-logo.jpeg";

const SESSION_KEY = "aartap-demo-user";
const pharmacyCatalogs = {
  "Apollo Pharmacy": medicines,
  "MedPlus Pharmacy": medicines.filter((item) => item.name !== "Vicks VapoRub"),
  "Netmeds Pharmacy": medicines.filter((item) => item.name !== "ORS Powder"),
};
const formatInputDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const today = new Date();
const todayInputDate = formatInputDate(today);
const readSession = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return saved && /^[6-9]\d{9}$/.test(saved.phone) ? saved : null;
  } catch {
    return null;
  }
};

function Logo({ compact = false }) {
  return <a className={`logo ${compact ? "logo-compact" : ""}`} href="#" aria-label="Aartap">
    <img src={artapLogo} alt="Aartap" />
  </a>;
}

function CompletedAppointmentCard({ appointment, onToast }) {
  return <article className="appointment-card completed-appointment-card"><Avatar initials={appointment.doctor.initials} color={appointment.doctor.color} size="xl" /><div className="appointment-info"><div className="appointment-title-row"><div><h3>{appointment.doctor.name}</h3><p>{appointment.doctor.specialty}</p></div><span className="status-pill"><CheckCircle2 size={14} /> Completed</span></div><div className="appointment-details"><span><CalendarDays size={14} /> {appointment.date}</span><span><Clock3 size={14} /> {appointment.time}</span><span><Video size={14} /> {appointment.mode}</span></div></div><Button variant="outline" onClick={() => onToast(`Consultation with ${appointment.doctor.name} · ${appointment.date} at ${appointment.time}`)}>View details <ChevronRight size={14} /></Button></article>;
}

function Avatar({ initials, color = "sage", size = "md" }) {
  return <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function Login({ onLogin }) {
  const [step, setStep] = useState("welcome");
  const [authMode, setAuthMode] = useState("login");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const beginLogin = () => {
    setAuthMode("login");
    setError("");
    setOtp("");
    setStep("phone");
  };
  const beginRegistration = () => {
    setAuthMode("register");
    setError("");
    setOtp("");
    setStep("phone");
  };
  const sendCode = (event) => {
    event.preventDefault();
    if (authMode === "register" && (!firstName.trim() || !lastName.trim())) {
      setError("Enter your first and last name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setError("");
    setStep("otp");
  };
  const verify = (event) => {
    event.preventDefault();
    if (otp !== "123456") {
      setError("That code doesn’t look right. Try the demo code shown below.");
      return;
    }
    const user = {
      phone,
      signedInAt: new Date().toISOString(),
      ...(authMode === "register" ? { firstName: firstName.trim(), lastName: lastName.trim() } : {}),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    onLogin(user);
  };

  return <main className="login-page">
    <section className="login-art">
      <Logo />
      <div className="login-art-copy">
        <span className="eyebrow"><i /> REDEFINING HEALTHCARE</span>
        <h1>Care that fits<br />your <em>pocket</em></h1>
      </div>
      <div className="login-highlights">
        <div><Video /><b>₹1,500 consult</b><small>medicines included</small></div>
        <div><Truck /><b>30-min delivery</b><small>after your consult</small></div>
        <div><Clock3 /><b>9 AM to 9 PM</b><small>online consultations</small></div>
      </div>
    </section>
    <section className="login-form-side">
      <div className="login-form-wrap">
        <div className="login-mobile-logo"><Logo compact /></div>
        {step === "welcome" ? <>
          <h2>Welcome</h2>
          <Button type="button" className="login-method" onClick={beginLogin}><Phone size={18} /><span>Continue with Phone</span><ChevronRight size={18} /></Button>
          <div className="login-register-cta"><span>New to Aartap?</span><button type="button" onClick={beginRegistration}>Register</button></div>
          <p className="login-terms">By continuing, you agree to our <a href="#terms">Terms &amp; Conditions</a>, <a href="#privacy">Privacy Policy</a> and Cancellation, Replacement &amp; Refund Policy.</p>
        </> : <>
          <button className="login-back" type="button" onClick={() => { setStep("welcome"); setError(""); }}>← Back to options</button>
          <div className="login-steps"><i className={step === "phone" ? "active" : ""} /><i className={step === "otp" ? "active" : ""} /><span>{step === "phone" ? (authMode === "register" ? "CREATE YOUR ACCOUNT" : "SIGN IN WITH PHONE") : "VERIFY YOUR NUMBER"}</span></div>
          <h2>{step === "phone" ? (authMode === "register" ? <>Create your<br /><em>account.</em></> : <>Continue with<br /><em>your phone.</em></>) : <>A little check-in,<br /><em>then you’re in.</em></>}</h2>
          <p className="login-subtitle">{step === "phone" ? (authMode === "register" ? "Enter your details to get started." : "Sign in or create an account with your mobile number.") : `Enter the 6-digit code sent to +91 ${phone.slice(0, 2)}•••••${phone.slice(-3)}.`}</p>
        </>}
        {step === "phone" && <form onSubmit={sendCode} noValidate>
          {authMode === "register" && <div className="register-name-fields">
            <div><label className="form-label" htmlFor="register-first-name">First name</label><input className={`register-name-input ${error && !firstName.trim() ? "input-error" : ""}`} id="register-first-name" autoComplete="given-name" placeholder="First name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(""); }} required /></div>
            <div><label className="form-label" htmlFor="register-last-name">Last name</label><input className={`register-name-input ${error && !lastName.trim() ? "input-error" : ""}`} id="register-last-name" autoComplete="family-name" placeholder="Last name" value={lastName} onChange={(e) => { setLastName(e.target.value); setError(""); }} required /></div>
          </div>}
          <label className="form-label" htmlFor="login-phone">Mobile number</label>
          <div className={`login-phone ${error && !/^[6-9]\d{9}$/.test(phone) ? "input-error" : ""}`}><span>🇮🇳 &nbsp;+91</span><i /><input id="login-phone" autoComplete="tel-national" inputMode="numeric" maxLength={10} placeholder="Enter 10-digit number" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }} required /></div>
          <small className="form-hint">We’ll send a one-time password to verify it’s you.</small>
          {error && <p className="validation-error">{error}</p>}
          <Button type="submit" className="login-submit">{authMode === "register" ? "Register with mobile" : "Continue with phone"} <ArrowRight size={18} /></Button>
        </form>}
        {step === "otp" && <form onSubmit={verify} noValidate>
          <label className="form-label" htmlFor="login-otp">Verification code</label>
          <input className={`otp-input ${error ? "input-error" : ""}`} id="login-otp" autoFocus autoComplete="one-time-code" inputMode="numeric" maxLength={6} placeholder="• • • • • •" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} required />
          <small className="form-hint">Demo code: <strong>123456</strong></small>
          {error && <p className="validation-error">{error}</p>}
          <Button type="submit" className="login-submit">{authMode === "register" ? "Verify & register" : "Verify & sign in"} <ArrowRight size={18} /></Button>
          <div className="otp-links"><button type="button" onClick={() => { setStep("phone"); setError(""); }}>← Change number</button><button type="button" onClick={() => setError("Your new demo code is 123456.")}>Resend code</button></div>
        </form>}
      </div>
    </section>
  </main>;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "labs", label: "Lab Tests", icon: FlaskConical },
  { id: "orders", label: "Orders", icon: Package },
  { id: "profile", label: "Profile", icon: UserRound },
];

function App() {
  const [user, setUser] = useState(readSession);
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [favorites, setFavorites] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [demoTrackingStatus, setDemoTrackingStatus] = useState("Out for delivery");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("All");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!modal && !checkoutOpen && !cartOpen) return undefined;
    const scrollY = window.scrollY;
    const bodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const rootOverflow = document.documentElement.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      Object.assign(document.body.style, bodyStyles);
      document.documentElement.style.overflow = rootOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [modal, checkoutOpen, cartOpen]);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  const go = (next) => { setPage(next); setQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setPage("home");
    setCart([]);
  };
  const addToCart = (item, pharmacyName) => {
    const hasDifferentOrderType = cart.some((entry) => entry.pharmacyName !== pharmacyName);
    if (cart.length && hasDifferentOrderType) {
      const currentPharmacy = cart.find((entry) => entry.pharmacyName)?.pharmacyName;
      setToast(currentPharmacy
        ? `Your bag has items from ${currentPharmacy}. Place that order before switching pharmacies or order types.`
        : "Your bag has a different order type. Place that order before starting a pharmacy order.");
      return;
    }
    setCart((current) => {
      const found = current.find((entry) => entry.name === item.name && entry.pharmacyName === pharmacyName);
      return found
        ? current.map((entry) => entry.name === item.name && entry.pharmacyName === pharmacyName ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...current, { ...item, ...(pharmacyName ? { pharmacyName } : {}), quantity: 1 }];
    });
    setCartOpen(true);
    setToast(`${item.name} added to your bag`);
  };
  const placeOrder = (address, paymentMethod) => {
    const pharmacyName = cart.find((item) => item.pharmacyName)?.pharmacyName;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      id: `AAR-${Math.floor(2000 + Math.random() * 7000)}`,
      title: cart.map((item) => `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`).join(", "),
      kind: pharmacyName ? `Pharmacy · ${pharmacyName}` : "Healthcare",
      date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
      amount: total,
      status: "Processing",
      icon: pharmacyName ? Pill : ShoppingBag,
      address,
      paymentMethod,
    };
    setPlacedOrders((current) => [order, ...current]);
    setCart([]);
    setCheckoutOpen(false);
    go("orders");
    setToast("Your order has been placed successfully.");
  };
  const toggleFavorite = (name) => setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const bookAppointment = (doctor, date, time, patient, paymentMethod) => {
    const [year, month, day] = date.split("-");
    const monthName = new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const appointmentDate = `${Number(day)} ${monthName} ${year}`;
    setAppointments((current) => [{ id: `apt-${Date.now()}`, doctor, date: appointmentDate, time, mode: "Video consultation", status: "Confirmed", patient, paymentMethod }, ...current]);
    setToast(`Appointment booked with ${doctor.name}. Payment completed successfully (demo).`);
    setModal(null);
    go("appointments");
  };
  if (!user) return <Login onLogin={setUser} />;

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Aartap member";
  const userInitials = user.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase() : "A";
  const heading = {
    home: [`Welcome back${user.firstName ? `, ${user.firstName}` : ""}`, "Your health, in good hands."],
    doctors: ["Find your doctor", "Thoughtful care from trusted specialists."],
    appointments: ["Appointments", "Manage your bookings and consultations."],
    pharmacy: ["Pharmacy", "Everyday essentials, delivered with care."],
    labs: ["Lab Tests", "Reliable testing, from the comfort of home."],
    wishlist: ["My Wishlist", "Your saved medicines, tests, pharmacies and labs."],
    tracking: ["Track Order", "Follow your delivery from dispatch to your door."],
    orders: ["Your Orders", "Keep track of your healthcare essentials."],
    profile: ["Profile", "Your details, preferences and care history."],
  }[page];
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <div className="sidebar-caption">YOUR HEALTH, CONNECTED</div>
      <nav className="side-nav" aria-label="Main navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? "selected" : ""} onClick={() => go(id)}><Icon size={19} strokeWidth={1.8} /><span>{label}</span>{page === id && <i />}</button>)}</nav>
      <div className="sidebar-help"><span><Sparkles size={17} /></span><b>Here for your health</b><small>Need a hand? We’re just a call away.</small><button onClick={() => setToast("Our care team will be in touch soon.")}>Talk to care team <ArrowRight size={14} /></button></div>
    </aside>
    <main className="workspace">
      <header className="topbar">
        <div className="mobile-logo"><Logo compact /></div>
        <div className="breadcrumb"><span>Aartap</span><ChevronRight size={14} /><b>{heading[0]}</b></div>
        <div className="top-actions">
          <span className="location-chip"><MapPin size={15} /> Hyderabad <ChevronRight size={13} /></span>
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You’re all caught up on notifications.")}><Bell size={18} /><i /></button>
          <div className="profile-menu" ref={profileMenuRef}>
            <button className="top-user" aria-label="Open account menu" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}><Avatar initials={userInitials} size="sm" /></button>
            {profileMenuOpen && <div className="profile-menu-dropdown" role="menu">
              <div className="profile-menu-user"><Avatar initials={userInitials} size="sm" /><span><b>{displayName}</b><small>+91 {user.phone.slice(0, 2)}•••••{user.phone.slice(-3)}</small></span></div>
              <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); go("profile"); }}><UserRound size={17} />My profile</button>
              <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); signOut(); }}><LogOut size={17} />Log out</button>
            </div>}
          </div>
        </div>
      </header>
      <div className="page-content">
        <section className={`page-heading ${page === "home" ? "home-page-heading" : ""} ${page === "pharmacy" ? "pharmacy-page-heading" : ""}`}>
          <div><span className="eyebrow"><i /> AARTAP HEALTHCARE</span><h1>{heading[0]}<span className="heading-period">.</span></h1><p>{heading[1]}</p></div>
          {page === "home" && <div className="date-chip"><CalendarDays size={15} /> {new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</div>}
        </section>
        {["home", "doctors", "appointments", "pharmacy", "labs"].includes(page) && <SearchBar value={query} onChange={setQuery} placeholder={page === "appointments" ? "Search doctors, appointments, clinics..." : page === "pharmacy" ? "Search medicines, health products..." : page === "labs" ? "Search tests, packages, labs..." : page === "doctors" ? "Search doctors, specialties..." : "Search doctors, medicines, labs..."} onFilter={() => setModal({ type: "filters" })} onToast={setToast} showFilter={page !== "home" && page !== "doctors"} filterInline={page === "appointments"} />}
        {page === "home" && <HomePage query={query} onNavigate={go} onBook={(doctor) => setModal({ type: "booking", doctor })} onAdd={addToCart} favorites={favorites} onFavorite={toggleFavorite} onToast={setToast} />}
        {page === "doctors" && <DoctorsPage query={query} onBook={(doctor) => setModal({ type: "slots", doctor })} favorites={favorites} onFavorite={toggleFavorite} />}
        {page === "appointments" && <AppointmentsPage appointments={appointments} favorites={favorites} onFavorite={toggleFavorite} query={query} onToast={setToast} onMyData={() => go("profile")} onCancel={(id) => { setAppointments((current) => current.filter((item) => item.id !== id)); setToast("Appointment cancelled."); }} onBook={(doctor) => setModal({ type: "booking", doctor })} />}
        {page === "pharmacy" && <PharmacyPage query={query} onAdd={addToCart} favorites={favorites} onFavorite={toggleFavorite} onNavigate={go} onToast={setToast} />}
        {page === "labs" && <LabsPage query={query} onAdd={addToCart} favorites={favorites} onFavorite={toggleFavorite} onNavigate={go} onToast={setToast} />}
        {page === "wishlist" && <WishlistPage favorites={favorites} onFavorite={toggleFavorite} onAdd={addToCart} onNavigate={go} />}
        {page === "tracking" && <TrackingPage orders={placedOrders} selectedOrder={trackingOrder} demoStatus={demoTrackingStatus} onDemoStatus={setDemoTrackingStatus} />}
        {page === "orders" && <OrdersPage cart={cart} setCart={setCart} placed={placedOrders} status={orderStatus} setStatus={setOrderStatus} onCheckout={() => setCheckoutOpen(true)} onTrack={(order) => { setTrackingOrder(order); go("tracking"); }} />}
        {page === "profile" && <ProfilePage user={user} onSignOut={signOut} onToast={setToast} />}
      </div>
      <footer className="app-footer"><span>© 2026 Aartap Healthcare</span><span><ShieldCheck size={14} /> Your health information is private &amp; secure</span></footer>
    </main>
    <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? "selected" : ""} onClick={() => go(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
    <button className="cart-fab" aria-label={`Open your bag, ${itemCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={19} />{itemCount > 0 && <b>{itemCount}</b>}</button>
    {toast && <div className="toast"><CheckCircle2 size={18} />{toast}<button aria-label="Dismiss message" onClick={() => setToast("")}><X size={15} /></button></div>}
    {modal && <Modal key={`${modal.type}-${modal.doctor?.name || "dialog"}`} modal={modal} user={user} onClose={() => setModal(null)} onBook={bookAppointment} onToast={setToast} onPickAnotherDate={() => setModal({ type: "booking", doctor: modal.doctor })} onBookSelectedSlot={(doctor, date, time) => setModal({ type: "booking", doctor, step: 1, selectedDate: date, selectedTime: time })} />}
    {cartOpen && <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
    {checkoutOpen && <PharmacyCheckoutModal user={user} cart={cart} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
  </div>;
}

function SearchBar({ value, onChange, placeholder, onFilter, onToast, showFilter = true, filterInline = false }) {
  return <div className={`search-row ${showFilter ? "" : "search-row-home"} ${filterInline ? "search-row-inline-filter" : ""}`}><div className="search-box"><Search size={18} /><input aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />{filterInline ? <button type="button" className="search-filter-inline" aria-label="Filters" onClick={onFilter}><SlidersHorizontal size={18} /></button> : <button type="button" className="mic-button" aria-label="Voice search" onClick={() => onToast("Voice search is not enabled in this demo. You can type in the search field.")}><Mic size={17} /></button>}</div>{showFilter && !filterInline && <button className="filter-button" onClick={onFilter}><SlidersHorizontal size={17} /><span>Filters</span></button>}</div>;
}

function SectionTitle({ title, action, onAction }) {
  return <div className="section-title"><h2>{title}</h2>{action && <button onClick={onAction}>{action}<ArrowRight size={15} /></button>}</div>;
}

function HomePage({ query, onNavigate, onBook, onAdd, favorites, onFavorite, onToast }) {
  const q = query.toLowerCase();
  const filteredDoctors = doctors.filter((d) => `${d.name} ${d.specialty}`.toLowerCase().includes(q)).slice(0, 3);
  const filteredPharmacies = pharmacies.filter((p) => p.name.toLowerCase().includes(q));
  const filteredLabs = labs.filter((lab) => lab.name.toLowerCase().includes(q));
  return <div className="home-page">
    {/* <section className="welcome-banner">
      <div className="banner-copy"><span className="banner-kicker"><Sparkles size={14} /> YOUR WELLNESS, REIMAGINED</span><h2>A healthier you<br />starts <em>today.</em></h2><p>Thoughtful care, right when you need it.</p><Button onClick={() => onNavigate("appointments")}>Find your doctor <ArrowRight size={16} /></Button></div>
      <div className="banner-art" aria-hidden="true"><span className="art-sun" /><div className="art-cross">+</div><span className="art-leaf leaf-one">⌁</span><span className="art-leaf leaf-two">⌁</span><div className="art-ring" /></div>
      <div className="banner-note"><span>✦</span><div><b>Care that fits your pocket</b><small>One place for all your health needs</small></div></div>
    </section> */}
    <section className="quick-services"><QuickCard icon={Stethoscope} title="Doctor Consultation" note="Care from experts" action="Consult now" onClick={() => onNavigate("appointments")} tone="green" /><QuickCard icon={Pill} title="Pharmacy" note="Medicines" action="Order now" onClick={() => onNavigate("pharmacy")} tone="gold" /><QuickCard icon={FlaskConical} title="Lab Tests" note="Test from home" action="Book now" onClick={() => onNavigate("labs")} tone="purple" /><QuickCard icon={Truck} title="Track Order" note="Track delivery" action="Track now" onClick={() => onNavigate("orders")} tone="blue" /></section>
    {/* <section className="assistant-banner"><span className="assistant-icon"><Sparkles size={24} /></span><div><span className="assistant-label">AARTAP AI ASSISTANT ✨</span><h3>Your smart health companion</h3><p>Ask anything. Get clarity. Stay healthy.</p></div><button aria-label="Ask Aartap Assistant" onClick={() => onToast("Aartap AI Assistant is coming soon.")}><ChevronRight size={19} /></button></section> */}
    <section className="content-section home-content-section"><SectionTitle title="Top Doctors" action="See all" onAction={() => onNavigate("doctors")} /><div className="doctor-grid home-doctor-grid">{filteredDoctors.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} onBook={() => onBook(doctor)} favorite={favorites.includes(doctor.name)} onFavorite={() => onFavorite(doctor.name)} />)}</div></section>
    <section className="content-section home-content-section"><SectionTitle title="Top Pharmacies" action="See all" onAction={() => onNavigate("pharmacy")} /><div className="mini-card-grid home-store-grid">{filteredPharmacies.map((store) => <StoreMini key={store.name} store={store} type="pharmacy" onClick={() => onNavigate("pharmacy")} />)}</div></section>
    <section className="content-section home-content-section"><SectionTitle title="Top Labs" action="See all" onAction={() => onNavigate("labs")} /><div className="mini-card-grid home-store-grid">{filteredLabs.map((store) => <StoreMini key={store.name} store={store} type="lab" onClick={() => onNavigate("labs")} />)}</div></section>
  </div>;
}

function QuickCard({ icon: Icon, title, note, action, onClick, tone }) {
  return <button className={`quick-card quick-card-${tone}`} onClick={onClick}><span className={`quick-icon tone-${tone}`}><Icon size={22} strokeWidth={1.7} /></span><span className="quick-title">{title}</span><small>{note}</small><span className="quick-action">{action}<ArrowRight size={13} /></span></button>;
}

function DoctorCard({ doctor, onBook, favorite, onFavorite }) {
  return <article className="doctor-card"><div className="doctor-card-top"><Avatar initials={doctor.initials} color={doctor.color} size="lg" /><button className={`favorite-button ${favorite ? "is-favorite" : ""}`} aria-label={favorite ? `Remove ${doctor.name} from wishlist` : `Add ${doctor.name} to wishlist`} onClick={onFavorite}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button></div><div className="doctor-main-row"><div><div className="doctor-name">{doctor.name}</div><small className="doctor-specialty">{doctor.specialty}</small></div><div className="doctor-card-highlights"><span className="doctor-rating"><Star size={13} fill="currentColor" /> {doctor.rating}</span><span className="doctor-price">₹{doctor.price.toLocaleString("en-IN")}</span></div></div><div className="doctor-meta"><span>{doctor.experience}</span><span>Experience</span></div><div className="doctor-next"><Clock3 size={13} /> Next: {doctor.next}</div><Button variant="outline" onClick={onBook}>Book appointment</Button></article>;
}

const doctorCategories = ["All", "General Homeopathy", "Skin & Hair", "Child Health", "Women's Health", "Allergy & Respiratory", "Digestive Health"];

function DoctorsPage({ query, onBook, favorites, onFavorite }) {
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("Any time");
  const [sortBy, setSortBy] = useState("Recommended");
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesCategory = category === "All" || doctor.category === category;
    const matchesQuery = `${doctor.name} ${doctor.specialty} ${doctor.category} ${doctor.languages}`.toLowerCase().includes(query.toLowerCase());
    const matchesAvailability = availability === "Any time" || doctor.next.toLowerCase().startsWith(availability.toLowerCase());
    return matchesCategory && matchesQuery && matchesAvailability;
  }).sort((a, b) => sortBy === "Rating" ? Number(b.rating) - Number(a.rating) : 0);

  return <section className="doctors-page">
    <div className="doctor-filter-bar" role="group" aria-label="Filter doctors by specialty">{doctorCategories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="doctor-results-toolbar"><div><h2>Our doctors</h2><p>{filteredDoctors.length} trusted specialists available for online consultation</p></div><div className="doctor-select-filters"><label>Availability<select value={availability} onChange={(event) => setAvailability(event.target.value)}><option>Any time</option><option>Today</option><option>Tomorrow</option></select></label><label>Sort by<select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option>Recommended</option><option>Rating</option></select></label></div></div>
    {filteredDoctors.length ? <div className="directory-doctor-grid">{filteredDoctors.map((doctor) => <DoctorDirectoryCard key={doctor.name} doctor={doctor} onBook={() => onBook(doctor)} favorite={favorites.includes(doctor.name)} onFavorite={() => onFavorite(doctor.name)} />)}</div> : <div className="empty-state"><span><Search size={22} /></span><h3>No doctors found</h3><p>Try another specialty, search term, or availability filter.</p><button className="button button-outline" onClick={() => { setCategory("All"); setAvailability("Any time"); }}>Clear filters</button></div>}
  </section>;
}

function DoctorDirectoryCard({ doctor, onBook, favorite, onFavorite }) {
  return <article className="directory-doctor-card">
    <div className="directory-doctor-head"><Avatar initials={doctor.initials} color={doctor.color} size="xl" /><div className="directory-doctor-info"><h3>{doctor.name}</h3><b>{doctor.category}</b><p>{doctor.credentials}</p></div><button className={`favorite-button ${favorite ? "is-favorite" : ""}`} aria-label={favorite ? `Remove ${doctor.name} from wishlist` : `Add ${doctor.name} to wishlist`} onClick={onFavorite}><Heart size={18} fill={favorite ? "currentColor" : "none"} /></button></div>
    <p className="doctor-registration"><ShieldCheck size={15} /> Reg. no. {doctor.registration}</p>
    <div className="directory-doctor-stats"><div><small>EXPERIENCE</small><b>{doctor.experience.replace("+", "")} years</b></div><div><small>RATING</small><b><Star size={15} fill="currentColor" /> {doctor.rating}</b></div></div>
    <p className="doctor-language-line">Available {doctor.availability} · {doctor.languages}</p>
    <p className="doctor-next-line">Next: <b>{doctor.next}</b></p>
    <div className="directory-doctor-footer"><div><strong>₹{doctor.price.toLocaleString("en-IN")}</strong><small>Medicines included</small></div><Button onClick={onBook}>Book online slot</Button></div>
  </article>;
}

function StoreMini({ store, type, onClick }) {
  return <button className={`store-mini ${type === "lab" ? "store-mini-lab" : "store-mini-pharmacy"}`} onClick={onClick}><span className={`store-logo tone-${store.color}`}>{store.initials}</span><span className="store-info"><b>{store.name}</b><small><MapPin size={12} /> {store.distance} <i>·</i> <Star size={12} fill="currentColor" /> {store.rating}</small></span><ChevronRight size={16} /><small className="store-service">{type === "lab" ? "Home collection" : store.delivery}</small></button>;
}

function AppointmentsPage({ appointments, favorites, onFavorite, query, onCancel, onBook, onToast, onMyData }) {
  const [tab, setTab] = useState("Upcoming");
  const [activeShortcut, setActiveShortcut] = useState("All doctors");
  const doctorSectionRef = useRef(null);
  const matchesQuery = (item) => `${item.doctor.name} ${item.doctor.specialty}`.toLowerCase().includes(query.toLowerCase());
  const filteredAppointments = appointments.filter(matchesQuery);
  const filteredCompleted = completedAppointments.filter(matchesQuery);
  const savedDoctors = doctors.filter((doctor) => favorites.includes(doctor.name));
  const consultations = [
    ...filteredAppointments.filter((item) => item.mode.toLowerCase().includes("consultation")),
    ...filteredCompleted.filter((item) => item.mode.toLowerCase().includes("consultation")),
  ];
  const showDoctorSuggestions = () => doctorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <div className="page-section appointments-page">
    <div className="appointment-shortcuts">
      <Shortcut icon={Stethoscope} label="All doctors" selected={activeShortcut === "All doctors"} onClick={() => { setActiveShortcut("All doctors"); showDoctorSuggestions(); }} />
      <Shortcut icon={MessageCircle} label="My consultations" selected={activeShortcut === "My consultations"} onClick={() => { setActiveShortcut("My consultations"); setTab("Consultations"); }} />
      <Shortcut icon={Heart} label="My wish" selected={activeShortcut === "My wish"} onClick={() => { setActiveShortcut("My wish"); setTab("Wishlist"); }} />
      <Shortcut icon={ClipboardList} label="My data" onClick={onMyData} />
    </div>
    <div className="tabs appointment-tabs" role="tablist" aria-label="Appointment status">
      <button className={tab === "Upcoming" ? "active" : ""} role="tab" aria-selected={tab === "Upcoming"} onClick={() => { setTab("Upcoming"); setActiveShortcut(""); }}><CalendarDays size={16} /> Upcoming <span>{appointments.length}</span></button>
      <button className={tab === "Completed" ? "active" : ""} role="tab" aria-selected={tab === "Completed"} onClick={() => { setTab("Completed"); setActiveShortcut(""); }}><CheckCircle2 size={16} /> Completed <span>{completedAppointments.length}</span></button>
      <button className={tab === "Consultations" ? "active" : ""} role="tab" aria-selected={tab === "Consultations"} onClick={() => { setTab("Consultations"); setActiveShortcut("My consultations"); }}><Video size={16} /> Consult <span>{consultations.length}</span></button>
    </div>
    {tab === "Upcoming" && <div className="appointment-list">{filteredAppointments.length ? filteredAppointments.map((item) => <AppointmentCard key={item.id} appointment={item} onToast={onToast} onCancel={() => onCancel(item.id)} />) : <EmptyState title="No upcoming appointments" text="Your booked doctor appointments will appear here." action="Find a doctor" onAction={() => onBook(doctors[0])} />}</div>}
    {tab === "Completed" && <div className="appointment-list">{filteredCompleted.length ? filteredCompleted.map((item) => <CompletedAppointmentCard key={item.id} appointment={item} onToast={onToast} />) : <EmptyState title="No completed appointments" text="Completed appointments will appear here." />}</div>}
    {tab === "Consultations" && <div className="appointment-list">{consultations.length ? consultations.map((item) => item.status === "Completed"
      ? <CompletedAppointmentCard key={item.id} appointment={item} onToast={onToast} />
      : <AppointmentCard key={item.id} appointment={item} onToast={onToast} onCancel={() => onCancel(item.id)} />) : <EmptyState title="No consultations found" text="Video consultations with your doctors will appear here." action="Find a doctor" onAction={() => onBook(doctors[0])} />}</div>}
    {tab === "Wishlist" && (savedDoctors.length
      ? <div className="doctor-grid">{savedDoctors.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} onBook={() => onBook(doctor)} favorite onFavorite={() => onFavorite(doctor.name)} />)}</div>
      : <EmptyState title="Your wishlist is waiting" text="Save doctors you’d like to visit and find them here." action="Explore doctors" onAction={() => onBook(doctors[1])} />)}
    <section className="content-section doctor-suggestions" ref={doctorSectionRef}><SectionTitle title="Find the right doctor" action="See all" onAction={() => setTab("Upcoming")} /><div className="doctor-grid">{doctors.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} onBook={() => onBook(doctor)} favorite={favorites.includes(doctor.name)} onFavorite={() => onFavorite(doctor.name)} />)}</div></section>
  </div>;
}

function Shortcut({ icon: Icon, label, onClick, selected = false }) {
  return <button className={`shortcut-card ${selected ? "selected" : ""}`} onClick={onClick}><Icon size={20} /><span>{label}</span><ChevronRight size={15} /></button>;
}

function AppointmentCard({ appointment, onCancel, onToast }) {
  return <article className="appointment-card"><Avatar initials={appointment.doctor.initials} color={appointment.doctor.color} size="xl" /><div className="appointment-info"><div className="appointment-title-row"><div><h3>{appointment.doctor.name}</h3><p>{appointment.doctor.specialty}</p></div><span className="status-pill"><CheckCircle2 size={14} /> {appointment.status}</span></div><div className="appointment-details"><span><CalendarDays size={14} /> {appointment.date}</span><span><Clock3 size={14} /> {appointment.time}</span><span><Video size={14} /> {appointment.mode}</span></div><div className="appointment-actions"><button className="small-action danger" onClick={onCancel}><X size={15} /> Cancel</button><button className="small-action" onClick={() => onToast("Chat opens when your consultation starts.")}><MessageCircle size={15} /> Chat</button><button className="small-action" onClick={() => onToast("Call access is available at your appointment time.")}><Phone size={15} /> Call</button><Button className="join-button" onClick={() => onToast("Your video visit will be available at the appointment time.")}><Video size={16} /> Join video call</Button></div></div></article>;
}

function PharmacyPage({ query, onAdd, favorites, onFavorite, onNavigate, onToast }) {
  const nearbyPharmaciesRef = useRef(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const catalog = selectedPharmacy ? pharmacyCatalogs[selectedPharmacy.name] : medicines;
  const filtered = catalog.filter((item) => `${item.name} ${item.category} ${item.note}`.toLowerCase().includes(query.toLowerCase()));
  const pharmacyFavorites = favorites.filter((name) => medicines.some((item) => item.name === name)
    || pharmacies.some((item) => item.name === name));
  const showNearbyPharmacies = () => nearbyPharmaciesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const choosePharmacy = (store) => {
    setSelectedPharmacy(store);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <div className="page-section pharmacy-page">
    <ScheduledBanner type="pharmacy" onClick={() => onToast("Your next pharmacy delivery is on its way.")} />
    <div className="shortcut-grid pharmacy-shortcuts">
      <button className="pharmacy-shortcut" onClick={showNearbyPharmacies}><span className="pharmacy-shortcut-icon"><MapPin size={22} /><i><Plus size={12} /></i></span><b>Nearby<br />Pharmacies</b><small>Find pharmacies near you <ChevronRight size={14} /></small></button>
      <button className="pharmacy-shortcut" onClick={() => onNavigate("wishlist")}><Heart className="pharmacy-shortcut-large-icon" size={27} /><b>My Wishlist</b><small>{pharmacyFavorites.length} saved items <ChevronRight size={14} /></small></button>
      <button className="pharmacy-shortcut" onClick={() => onNavigate("orders")}><span className="pharmacy-shortcut-icon"><ClipboardList size={25} /><Heart className="shortcut-heart" size={11} /></span><b>My Orders</b><small>View your orders <ChevronRight size={14} /></small></button>
      <button className="pharmacy-shortcut" onClick={() => onNavigate("tracking")}><Truck className="pharmacy-shortcut-large-icon" size={27} /><b>Track Order</b><small>Track in real-time <ChevronRight size={14} /></small></button>
    </div>
    <PrescriptionUpload onToast={onToast} description="Get accurate medicine suggestions from your prescription" />
    <section className="pharmacy-products-section">
      <SectionTitle
        title={selectedPharmacy ? `Medicines at ${selectedPharmacy.name}` : "Over the Counter Medicines (OTC)"}
        action={selectedPharmacy ? "Change pharmacy" : "See all"}
        onAction={() => selectedPharmacy ? showNearbyPharmacies() : onToast("Showing all available over-the-counter medicines.")}
      />
      {selectedPharmacy && <div className="selected-pharmacy-note"><span className={`store-logo tone-${selectedPharmacy.color}`}>{selectedPharmacy.initials}</span><span><b>{selectedPharmacy.name}</b><small><Clock3 size={13} /> Delivered in {selectedPharmacy.delivery}</small></span><button type="button" onClick={() => setSelectedPharmacy(null)}>Back to all medicines</button></div>}
      <div className="product-list pharmacy-product-list">{filtered.length ? filtered.map((item) => <article className="product-row pharmacy-product-row" key={item.name}>
        <span className={`medicine-pack pack-${item.packColor}`} aria-label={`${item.pack} ${item.packNote}`}><b>{item.pack}</b><small>{item.packNote}</small></span>
        <div className="product-details"><b>{item.name}</b><small>₹{item.price} · {item.note}</small></div>
        <button className={`favorite-button ${favorites.includes(item.name) ? "is-favorite" : ""}`} aria-label={`Save ${item.name}`} onClick={() => onFavorite(item.name)}><Heart size={17} fill={favorites.includes(item.name) ? "currentColor" : "none"} /></button>
        <button className="pharmacy-add-button" aria-label={`Add ${item.name} to your bag`} onClick={() => onAdd(item, selectedPharmacy?.name || pharmacies[0].name)}><ShoppingCart size={17} /></button>
        <Button variant="outline" className="pharmacy-buy-button" onClick={() => { onAdd(item, selectedPharmacy?.name || pharmacies[0].name); onNavigate("orders"); }}>Buy Now</Button>
      </article>) : <EmptyState title="No medicines found" text="Try another search term." />}</div>
    </section>
    <section className="content-section pharmacy-nearby-section" ref={nearbyPharmaciesRef}><SectionTitle title="Popular Pharmacies Near You" action="See all" onAction={() => onToast("Showing the closest pharmacies.")} /><div className="pharmacy-store-grid">{pharmacies.map((store) => <article className="pharmacy-store-card" key={store.name}>
      <span className={`store-logo tone-${store.color}`}>{store.initials}</span>
      <button className={`favorite-button ${favorites.includes(store.name) ? "is-favorite" : ""}`} aria-label={`${favorites.includes(store.name) ? "Remove" : "Save"} ${store.name}`} onClick={() => onFavorite(store.name)}><Heart size={17} fill={favorites.includes(store.name) ? "currentColor" : "none"} /></button>
      <b className="pharmacy-store-name">{store.name}</b>
      <div className="pharmacy-store-meta"><span><Star size={13} fill="currentColor" /> {store.rating}</span><span><MapPin size={13} /> {store.distance}</span></div>
      <small className="pharmacy-delivery-time"><Clock3 size={13} /> {store.delivery}</small>
      <Button variant="outline" onClick={() => choosePharmacy(store)}>Order medicines <ArrowRight size={14} /></Button>
    </article>)}</div></section>
  </div>;
}

function LabsPage({ query, onAdd, favorites, onFavorite, onNavigate, onToast }) {
  const nearbyLabsRef = useRef(null);
  const filteredTests = tests.filter((item) => `${item.name} ${item.short} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));
  const filteredLabs = labs;
  const orderTest = (item, lab, collection) => onAdd({
    ...item,
    name: `${item.short} · ${lab.name} (${collection})`,
    category: "Lab test",
    note: `${lab.name} · ${collection}`,
  });
  return <div className="page-section lab-page">
    <ScheduledBanner type="lab" onClick={() => onToast("Your upcoming MedLab Diagnostics collection is scheduled.")} />
    <div className="shortcut-grid"><Shortcut icon={MapPin} label="Nearby labs" onClick={() => nearbyLabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} /><Shortcut icon={Heart} label="My wishlist" onClick={() => onNavigate("wishlist")} /><Shortcut icon={ClipboardList} label="My lab orders" onClick={() => onNavigate("orders")} /><Shortcut icon={Truck} label="Track collection" onClick={() => onNavigate("tracking")} /></div>
    <PrescriptionUpload onToast={onToast} description="Get accurate test suggestions from your prescription" />
    <section className="lab-popular-section">
      <div className="section-heading-row  popular-lab-tests-heading"><SectionTitle title="Popular Tests" action="See all" onAction={() => onToast(`${filteredTests.length} lab tests available.`)} /></div>
      <div className="lab-feature">
        <div className="lab-feature-art"><span>LAB</span><b>TESTS</b><div className="lab-tubes"><i /><i /><i /></div></div>
        <div className="lab-feature-list">{filteredTests.length ? filteredTests.map((item) => <article className="featured-test" key={item.short}>
          <span className="featured-test-icon">{item.glyph}</span>
          <b>{item.short}<small>{item.detail}</small></b>
          <div className="featured-test-order"><button type="button" onClick={() => orderTest(item, labs[0], "Home Sample Collection")}><b>Order Now</b><small>(Home Sample Collection)</small></button><button type="button" onClick={() => orderTest(item, labs[0], "Walk-in")}><b>Order Now</b><small>(Walk-in)</small></button></div>
          <button type="button" className={`featured-test-favorite ${favorites.includes(item.name) ? "is-favorite" : ""}`} aria-label={favorites.includes(item.name) ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`} onClick={() => onFavorite(item.name)}><Heart size={16} fill={favorites.includes(item.name) ? "currentColor" : "none"} /></button>
          <ChevronRight size={16} />
        </article>) : <EmptyState title="No tests found" text="Try another test name or package." />}</div>
      </div>
    </section>
    <section className="content-section lab-nearby-section" ref={nearbyLabsRef}><SectionTitle title="Popular Labs Nearby You" action="See all" onAction={() => onToast("Showing all nearby labs.")} /><div className="mini-card-grid lab-nearby-grid">{filteredLabs.map((store) => <article className="lab-nearby-card" key={store.name}>
      <div className="lab-nearby-heading"><span className={`store-logo tone-${store.color}`}>{store.initials}</span><b>{store.name}</b><button className={`favorite-button ${favorites.includes(store.name) ? "is-favorite" : ""}`} aria-label={`Save ${store.name}`} onClick={() => onFavorite(store.name)}><Heart size={17} fill={favorites.includes(store.name) ? "currentColor" : "none"} /></button></div>
      <div className="lab-nearby-details"><span><Star size={14} fill="currentColor" /> {store.rating}</span><span><MapPin size={14} /> {store.distance}</span><span><Clock3 size={14} /> {store.delivery}</span><span><Home size={14} /> Home Collection</span></div>
      <div className="lab-nearby-actions"><button type="button" onClick={() => orderTest(filteredTests[0] || tests[0], store, "Home Sample Collection")}>Order Now<small>(Home Sample Collection)</small></button><button type="button" onClick={() => orderTest(filteredTests[0] || tests[0], store, "Walk-in")}>Order Now<small>(Walk-in)</small></button></div>
    </article>)}</div></section>
  </div>;
}

function PrescriptionUpload({ onToast, description }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const maxFileSize = 10 * 1024 * 1024;
  const chooseFile = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    const validType = ["application/pdf", "image/jpeg", "image/png"].includes(nextFile.type)
      || /\.(pdf|jpe?g|png)$/i.test(nextFile.name);
    if (!validType) {
      setFile(null);
      setUploaded(false);
      setError("Choose a PDF, JPG or PNG file.");
      event.target.value = "";
      return;
    }
    if (nextFile.size > maxFileSize) {
      setFile(null);
      setUploaded(false);
      setError("The prescription must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }
    setFile(nextFile);
    setUploaded(false);
    setError("");
  };
  const uploadFile = () => {
    if (!file) return;
    setUploaded(true);
    onToast("Prescription saved for this demo session. No file was sent to a server.");
  };
  const clearFile = () => {
    setFile(null);
    setUploaded(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };
  return <section className={`prescription-upload ${file ? "has-prescription" : ""}`}>
    <input ref={inputRef} className="prescription-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={chooseFile} aria-label="Choose prescription file" />
    {!file ? <button type="button" className="upload-banner" onClick={() => inputRef.current?.click()}><span><Upload size={23} /></span><div><b>Upload a prescription</b><small>{description}</small></div><ChevronRight size={20} /></button>
      : <div className="prescription-file-card">
        <span className={`prescription-upload-icon ${uploaded ? "is-uploaded" : ""}`}>{uploaded ? <CheckCircle2 size={20} /> : <Upload size={20} />}</span>
        <div className="prescription-file-info"><b>{uploaded ? "Prescription ready" : file.name}</b><small>{uploaded ? `${file.name} · Saved locally for this demo session` : `${(file.size / (1024 * 1024)).toFixed(2)} MB · PDF or image`}</small></div>
        {uploaded ? <button type="button" className="prescription-change-button" onClick={() => inputRef.current?.click()}>Upload another</button> : <Button className="prescription-submit" onClick={uploadFile}>Upload file <ArrowRight size={14} /></Button>}
        <button type="button" className="prescription-remove-button" onClick={clearFile} aria-label="Remove selected prescription"><X size={16} /></button>
      </div>}
    {error && <p className="prescription-error" role="alert">{error}</p>}
    {!file && <small className="prescription-file-hint">PDF, JPG or PNG · Max 10 MB</small>}
  </section>;
}

function WishlistPage({ favorites, onFavorite, onAdd, onNavigate }) {
  const savedMedicines = medicines.filter((item) => favorites.includes(item.name));
  const savedTests = tests.filter((item) => favorites.includes(item.name));
  const savedPharmacies = pharmacies.filter((item) => favorites.includes(item.name));
  const savedLabs = labs.filter((item) => favorites.includes(item.name));
  const hasSavedItems = savedMedicines.length + savedTests.length + savedPharmacies.length + savedLabs.length > 0;
  return <div className="page-section wishlist-page">
    {!hasSavedItems ? <EmptyState title="Your wishlist is empty" text="Save medicines, lab tests or care providers with the heart button and they’ll appear here." action="Browse pharmacy" onAction={() => onNavigate("pharmacy")} /> : <>
      {!!savedMedicines.length && <section className="wishlist-section"><SectionTitle title="Saved medicines" /><div className="wishlist-grid">{savedMedicines.map((item) => <article className="wishlist-card" key={item.name}>
        <span className={`medicine-pack pack-${item.packColor}`}><b>{item.pack}</b><small>{item.packNote}</small></span><div className="wishlist-card-info"><b>{item.name}</b><small>{item.category} · {item.note}</small><strong>₹{item.price}</strong></div>
        <button type="button" className="favorite-button is-favorite" aria-label={`Remove ${item.name} from wishlist`} onClick={() => onFavorite(item.name)}><Heart size={17} fill="currentColor" /></button><Button variant="outline" onClick={() => onAdd(item)}>Add to bag</Button>
      </article>)}</div></section>}
      {!!savedTests.length && <section className="wishlist-section"><SectionTitle title="Saved lab tests" /><div className="wishlist-grid">{savedTests.map((item) => <article className="wishlist-card" key={item.name}>
        <span className="wishlist-item-icon"><FlaskConical size={20} /></span><div className="wishlist-card-info"><b>{item.name}</b><small>{item.detail} · {item.category}</small><strong>₹{item.price}</strong></div>
        <button type="button" className="favorite-button is-favorite" aria-label={`Remove ${item.name} from wishlist`} onClick={() => onFavorite(item.name)}><Heart size={17} fill="currentColor" /></button><Button variant="outline" onClick={() => onAdd({ ...item, note: item.detail, glyph: item.glyph })}>Add test</Button>
      </article>)}</div></section>}
      {!!savedPharmacies.length && <WishlistStoreSection title="Saved pharmacies" items={savedPharmacies} onFavorite={onFavorite} />}
      {!!savedLabs.length && <WishlistStoreSection title="Saved labs" items={savedLabs} onFavorite={onFavorite} />}
    </>}
  </div>;
}

function WishlistStoreSection({ title, items, onFavorite }) {
  return <section className="wishlist-section"><SectionTitle title={title} /><div className="wishlist-grid">{items.map((item) => <article className="wishlist-card wishlist-store-card" key={item.name}>
    <span className={`store-logo tone-${item.color}`}>{item.initials}</span><div className="wishlist-card-info"><b>{item.name}</b><small><Star size={13} fill="currentColor" /> {item.rating} · <MapPin size={13} /> {item.distance}</small><strong>{item.delivery}</strong></div>
    <button type="button" className="favorite-button is-favorite" aria-label={`Remove ${item.name} from wishlist`} onClick={() => onFavorite(item.name)}><Heart size={17} fill="currentColor" /></button>
  </article>)}</div></section>;
}

function TrackingPage({ orders, selectedOrder, demoStatus, onDemoStatus }) {
  const activeOrders = orders.filter((order) => order.status !== "Delivered" && order.status !== "Completed");
  const demoSteps = ["Order confirmed", "Packed by pharmacy", "Out for delivery", "Delivered"];
  const demoCurrentStep = demoStatus === "Delivered" ? 3 : 2;
  const trackedOrders = selectedOrder ? [selectedOrder] : activeOrders;
  const activeDeliveryCount = selectedOrder
    ? (selectedOrder.status === "Delivered" || selectedOrder.status === "Completed" ? 0 : 1)
    : activeOrders.length || (demoStatus === "Delivered" ? 0 : 1);
  return <div className="page-section tracking-page">
    <section className="tracking-overview"><span className="tracking-overview-icon"><Truck size={22} /></span><div><small>LIVE DELIVERY UPDATES</small><b>{selectedOrder ? `Order ${selectedOrder.id}` : `${activeDeliveryCount} active ${activeDeliveryCount === 1 ? "delivery" : "deliveries"}`}</b><span>{selectedOrder ? "Order status and delivery details." : "Track your pharmacy orders and lab collections."}</span></div></section>
    {trackedOrders.map((order) => <TrackingCard key={order.id} order={order} status={order.status} />)}
    {!selectedOrder && !activeOrders.length && <article className="tracking-card">
      <div className="tracking-card-header"><span className="tracking-card-icon"><Pill size={19} /></span><div><small>ORDER AAR-2052 · PHARMACY</small><h2>Paracetamol 650mg · Wellness essentials</h2></div><span className={`tracking-status ${demoStatus === "Delivered" ? "tracking-delivered" : ""}`}>{demoStatus}</span></div>
      <div className="tracking-meta"><span><MapPin size={15} /> Delivering to Hyderabad</span><span><Clock3 size={15} /> {demoStatus === "Delivered" ? "Delivered just now" : "Arriving today, 3:30–4:00 PM"}</span></div>
      <TrackingSteps steps={demoSteps} currentStep={demoCurrentStep} />
      <div className="tracking-card-footer"><span><Phone size={15} /> Delivery partner: Demo rider · 98765 43210</span>{demoStatus !== "Delivered" && <Button variant="outline" onClick={() => onDemoStatus("Delivered")}>Mark as delivered <Check size={15} /></Button>}</div>
    </article>}
    {!selectedOrder && !activeOrders.length && <p className="tracking-demo-note">Showing a sample delivery so you can preview order tracking. Place an order to see it listed here.</p>}
  </div>;
}

function TrackingCard({ order, status }) {
  const isDelivered = status === "Delivered";
  const step = isDelivered || status === "Completed" ? 3 : status === "Out for delivery" ? 2 : 1;
  const steps = ["Order confirmed", "Preparing your order", "Out for delivery", "Delivered"];
  return <article className="tracking-card">
    <div className="tracking-card-header"><span className="tracking-card-icon"><ShoppingBag size={19} /></span><div><small>ORDER {order.id} · {order.kind.toUpperCase()}</small><h2>{order.title}</h2></div><span className={`tracking-status ${isDelivered ? "tracking-delivered" : ""}`}>{status}</span></div>
    <div className="tracking-meta"><span><Package size={15} /> Order total ₹{order.amount}</span><span><Clock3 size={15} /> {isDelivered ? order.date : "Estimated today, 3:30–4:00 PM"}</span>{order.address && <span><MapPin size={15} /> {order.address.address}, {order.address.city} {order.address.pincode}</span>}</div>
    <TrackingSteps steps={steps} currentStep={step} />
  </article>;
}

function CartDrawer({ cart, setCart, onClose, onCheckout }) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pharmacyName = cart.find((item) => item.pharmacyName)?.pharmacyName;
  const updateQuantity = (name, itemPharmacyName, delta) => setCart((current) => current
    .map((item) => item.name === name && item.pharmacyName === itemPharmacyName ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0));
  const removeItem = (item) => setCart((current) => current.filter((entry) => entry.name !== item.name || entry.pharmacyName !== item.pharmacyName));
  return <div className="cart-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
      <header className="cart-drawer-header"><div><small>YOUR ORDER</small><h2 id="cart-drawer-title">Your bag <span>{count}</span></h2></div><button type="button" className="cart-drawer-close" aria-label="Close your bag" onClick={onClose}><X size={19} /></button></header>
      {pharmacyName && <div className="cart-drawer-store"><Pill size={17} /><span>Ordering from <b>{pharmacyName}</b></span></div>}
      {cart.length ? <>
        <div className="cart-drawer-items">{cart.map((item) => <article className="cart-drawer-item" key={`${item.pharmacyName || "other"}-${item.name}`}>
          <span className="cart-drawer-item-icon">{item.glyph || <Pill size={19} />}</span>
          <div className="cart-drawer-item-info"><b>{item.name}</b><small>₹{item.price} each</small><strong>₹{item.price * item.quantity}</strong></div>
          <div className="cart-drawer-controls"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.name, item.pharmacyName, -1)}>−</button><b>{item.quantity}</b><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.name, item.pharmacyName, 1)}>+</button></div>
          <button type="button" className="cart-drawer-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item)}><X size={15} /></button>
        </article>)}</div>
        <footer className="cart-drawer-footer"><div><span>Subtotal</span><b>₹{total}</b></div><small>Delivery and payment options at checkout.</small><button className="button button-primary" type="button" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button></footer>
      </> : <div className="cart-drawer-empty"><ShoppingCart size={30} /><b>Your bag is empty</b><small>Add medicines to get started.</small><button type="button" onClick={onClose}>Continue shopping</button></div>}
    </aside>
  </div>;
}

function PharmacyCheckoutModal({ user, cart, onClose, onPlaceOrder }) {
  const [name, setName] = useState([user?.firstName, user?.lastName].filter(Boolean).join(" "));
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !/^[6-9]\d{9}$/.test(phone) || !address.trim() || !city.trim() || !/^\d{6}$/.test(pincode)) {
      setError("Enter your name, valid mobile number, full address, city and 6-digit pincode.");
      return;
    }
    if (paymentMethod === "UPI" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      setError("Enter a valid UPI ID, such as name@bank.");
      return;
    }
    if (paymentMethod === "Card" && (
      cardDetails.name.trim().length < 2
      || cardDetails.number.replace(/\s/g, "").length !== 16
      || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)
      || cardDetails.cvv.length < 3
    )) {
      setError("Enter valid cardholder name, 16-digit card number, expiry date and CVV.");
      return;
    }
    onPlaceOrder({ name: name.trim(), phone, address: address.trim(), city: city.trim(), pincode }, paymentMethod);
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
    <button type="button" className="modal-close" onClick={onClose} aria-label="Close checkout"><X size={18} /></button>
    <span className="modal-kicker">DELIVERY & PAYMENT</span><h2 id="checkout-title">Complete your order</h2>
    <p className="checkout-subtitle">{cart.length} item{cart.length === 1 ? "" : "s"} · Total ₹{total}</p>
    <form onSubmit={submit}>
      <div className="checkout-layout">
        <section className="checkout-delivery">
          <h3>Delivery details</h3>
          <div className="checkout-fields">
            <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label>Mobile number<input autoComplete="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} required /></label>
            <label className="checkout-address">Delivery address<textarea autoComplete="street-address" rows={2} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House / flat, street, landmark" required /></label>
            <label>City<input autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} required /></label>
            <label>Pincode<input autoComplete="postal-code" inputMode="numeric" maxLength={6} value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))} required /></label>
          </div>
        </section>
        <section className="checkout-payment-panel">
          <h3>Payment options</h3>
          <fieldset className="checkout-payment"><legend>Choose a payment method</legend>{["UPI", "Card", "Cash on delivery"].map((method) => <label key={method}><input type="radio" name="payment-method" value={method} checked={paymentMethod === method} onChange={() => { setPaymentMethod(method); setError(""); }} />{method}</label>)}</fieldset>
          {paymentMethod === "UPI" && <label className="checkout-payment-entry">UPI ID<input autoComplete="off" inputMode="email" value={upiId} onChange={(event) => setUpiId(event.target.value.replace(/\s/g, ""))} placeholder="name@bank" aria-describedby="checkout-upi-note" /><small id="checkout-upi-note">Demo checkout only. No payment will be sent.</small></label>}
          {paymentMethod === "Card" && <div className="checkout-card-fields">
            <label className="checkout-card-wide">Name on card<input autoComplete="cc-name" value={cardDetails.name} onChange={(event) => setCardDetails((current) => ({ ...current, name: event.target.value }))} placeholder="Name as shown on card" /></label>
            <label className="checkout-card-wide">Card number<input inputMode="numeric" autoComplete="cc-number" maxLength={19} value={cardDetails.number} onChange={(event) => setCardDetails((current) => ({ ...current, number: event.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") }))} placeholder="1234 5678 9012 3456" /></label>
            <label>Expiry<input inputMode="numeric" autoComplete="cc-exp" maxLength={5} value={cardDetails.expiry} onChange={(event) => { const digits = event.target.value.replace(/\D/g, "").slice(0, 4); setCardDetails((current) => ({ ...current, expiry: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits })); }} placeholder="MM/YY" /></label>
            <label>CVV<input inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={cardDetails.cvv} onChange={(event) => setCardDetails((current) => ({ ...current, cvv: event.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" /></label>
            <small className="checkout-card-note">Demo checkout only. Card details are not stored or charged.</small>
          </div>}
          {paymentMethod === "Cash on delivery" && <p className="checkout-cod-note">Pay with cash when your order is delivered.</p>}
        </section>
        <footer className="checkout-actions">
          <small className="checkout-demo-note">Demo checkout — no real payment will be collected.</small>
          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button className="button button-primary checkout-submit" type="submit">Place order · ₹{total} <ArrowRight size={16} /></button>
        </footer>
      </div>
    </form>
  </section></div>;
}

function TrackingSteps({ steps, currentStep }) {
  return <ol className="tracking-steps">{steps.map((label, index) => <li className={index < currentStep ? "complete" : index === currentStep ? "current" : ""} key={label}><span>{index < currentStep ? <Check size={13} /> : index + 1}</span><small>{label}</small></li>)}</ol>;
}

function ScheduledBanner({ type, onClick }) {
  const pharmacy = type === "pharmacy";
  return <button className="scheduled-banner" onClick={onClick}><span className={`scheduled-art ${pharmacy ? "delivery-art" : "lab-art"}`} aria-hidden="true">{pharmacy ? <Truck size={45} /> : <FlaskConical size={42} />}</span><span className="scheduled-copy"><small>{pharmacy ? "YOUR NEXT DELIVERY" : "YOUR NEXT COLLECTION"}</small><b>{pharmacy ? "Order scheduled" : "Sample collection scheduled"}</b><span>{pharmacy ? "MedPlus Pharmacy" : "MedLab Diagnostics"}</span><small><CalendarDays size={13} /> 20 Oct 2026, 7:00 AM</small></span><ChevronRight size={21} /></button>;
}

function OrdersPage({ cart, setCart, placed, status, setStatus, onCheckout, onTrack }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pharmacyName = cart.find((item) => item.pharmacyName)?.pharmacyName;
  const orders = [...placed, { id: "AAR-2048", title: "Vitamin D + CBC panel", kind: "Lab tests", date: "12 Jul 2026", amount: 1098, status: "Completed", icon: FlaskConical }, { id: "AAR-2041", title: "Everyday wellness essentials", kind: "Pharmacy", date: "10 Jul 2026", amount: 429, status: "Delivered", icon: Pill }];
  const visible = status === "All" ? orders : orders.filter((order) => order.status === status);
  const changeQuantity = (name, itemPharmacyName, delta) => setCart((current) => current
    .map((item) => item.name === name && item.pharmacyName === itemPharmacyName ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0));
  return <div className="page-section orders-page">
    <section className="order-overview"><div><span className="overview-icon"><Package size={20} /></span><div><small>YOUR HEALTHCARE JOURNEY</small><b>Orders &amp; bookings</b><span>Your recent activity, all in one place.</span></div></div><div className="overview-number"><strong>{orders.length}</strong><small>total orders</small></div></section>
    <div className="order-layout"><section className="order-history"><div className="section-heading-row"><SectionTitle title="Order history" /><label className="select-wrap"><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter orders"><option>All</option><option>Processing</option><option>Completed</option><option>Delivered</option></select><SlidersHorizontal size={14} /></label></div>
      {visible.length ? <div className="order-list">{visible.map((order) => <OrderCard key={order.id} order={order} onTrack={() => onTrack(order)} />)}</div> : <EmptyState title="No orders in this category" text="Your bookings and orders will show up here." />}
    </section>
    <aside className="bag-card"><div className="bag-heading"><span><ShoppingBag size={19} /></span><h3>Your bag</h3><b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b></div>{cart.length ? <><div className="bag-items">{pharmacyName && <div className="bag-store"><Pill size={14} /> Ordering from <b>{pharmacyName}</b></div>}{cart.map((item) => <div className="bag-item" key={`${item.pharmacyName || "other"}-${item.name}`}><span>{item.glyph || <Pill size={17} />}</span><div><b>{item.name}</b><small>₹{item.price} each · ₹{item.price * item.quantity}</small></div><div className="bag-quantity"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item.name, item.pharmacyName, -1)}>−</button><b>{item.quantity}</b><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.name, item.pharmacyName, 1)}>+</button></div><button type="button" className="bag-remove" aria-label={`Remove ${item.name}`} onClick={() => setCart((current) => current.filter((entry) => entry.name !== item.name || entry.pharmacyName !== item.pharmacyName))}><X size={15} /></button></div>)}</div><div className="bag-total"><span>Subtotal</span><b>₹{total}</b></div><Button onClick={onCheckout}>Checkout <ArrowRight size={16} /></Button><small className="bag-note"><ShieldCheck size={13} /> Secure checkout · Free delivery</small></> : <div className="empty-bag"><ShoppingCart size={24} /><b>Your bag is empty</b><small>Add a test or medicine to place an order.</small></div>}</aside></div>
  </div>;
}

function OrderCard({ order, onTrack }) {
  const Icon = order.icon || Package;
  return <article className="order-card"><span className="order-icon"><Icon size={19} /></span><div className="order-card-info"><small>{order.id} · {order.date}</small><b>{order.title}</b><span>{order.kind} · ₹{order.amount}</span></div><span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span><button className="order-track-button" type="button" onClick={onTrack}>Track order <ChevronRight size={15} /></button></article>;
}

function ProfilePage({ user, onSignOut, onToast }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState([user.firstName, user.lastName].filter(Boolean).join(" ") || "Aartap Member");
  const [email, setEmail] = useState("member@example.com");
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return <div className="page-section profile-page">
    <section className="profile-hero"><div className="profile-avatar"><span>{initials}</span><i><Check size={11} /></i></div><div><span className="profile-member-tag"><ShieldCheck size={13} /> VERIFIED MEMBER</span><h2>{name}</h2><p>Member since October 2026 · Hyderabad, India</p></div><Button variant="outline" onClick={() => setEditing((value) => !value)}>{editing ? "Done editing" : "Edit profile"}</Button></section>
    {editing && <section className="profile-edit"><label>Full name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><Button onClick={() => { setEditing(false); onToast("Your profile has been updated."); }}>Save changes <Check size={15} /></Button></section>}
    <div className="profile-layout"><div className="profile-main"><section className="profile-card"><div className="section-title"><h2>Personal information</h2><button onClick={() => setEditing((value) => !value)}>Edit <ArrowUpRight size={14} /></button></div><div className="detail-grid"><ProfileDetail icon={Phone} label="Mobile number" value={`+91 ${user.phone.slice(0, 2)}•••••${user.phone.slice(-3)}`} verified /><ProfileDetail icon={MessageCircle} label="Email address" value={email} /><ProfileDetail icon={MapPin} label="Location" value="Hyderabad, Telangana" /><ProfileDetail icon={CalendarDays} label="Date of birth" value="Not added yet" /></div></section><section className="profile-card"><div className="section-title"><h2>Health &amp; preferences</h2><button onClick={() => onToast("Health preferences updated.")}>Manage <ArrowUpRight size={14} /></button></div><div className="preferences-list"><button onClick={() => onToast("No health documents have been added yet.")}><span><ClipboardList size={18} /></span><div><b>Health records</b><small>Your reports, prescriptions and care notes</small></div><ChevronRight size={17} /></button><button onClick={() => onToast("Notification preferences opened.")}><span><Bell size={18} /></span><div><b>Notifications</b><small>Reminders and updates from Aartap</small></div><ChevronRight size={17} /></button><button onClick={() => onToast("Privacy and security settings are up to date.")}><span><ShieldCheck size={18} /></span><div><b>Privacy &amp; security</b><small>Your information is encrypted and private</small></div><ChevronRight size={17} /></button></div></section></div><aside className="profile-side"><div className="care-support-card"><Sparkles size={22} /><h3>Care, whenever<br />you need it.</h3><p>Questions about your care? Our team is here to help.</p><Button variant="outline" onClick={() => onToast("Our care team will be in touch soon.")}>Contact support <ArrowRight size={15} /></Button></div><button className="signout-button" onClick={onSignOut}><LogOut size={17} /> Sign out of Aartap <ChevronRight size={16} /></button></aside></div>
  </div>;
}

function ProfileDetail({ icon: Icon, label, value, verified }) {
  return <div className="profile-detail"><span><Icon size={16} /></span><small>{label}</small><b>{value}{verified && <CheckCircle2 className="verified-icon" size={13} />}</b></div>;
}

function Modal({ modal, user, onClose, onBook, onToast, onPickAnotherDate, onBookSelectedSlot }) {
  const [bookingStep, setBookingStep] = useState(modal.step || 0);
  const [selectedTime, setSelectedTime] = useState(modal.selectedTime || "");
  const [selectedDate, setSelectedDate] = useState(modal.selectedDate || "");
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [quickDate, setQuickDate] = useState(() => {
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    return formatInputDate(tomorrow);
  });
  const [quickTime, setQuickTime] = useState("");
  const [patient, setPatient] = useState({
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    age: "",
    gender: "",
    notes: "",
    deliveryPincode: "500081",
  });
  const [patientType, setPatientType] = useState("myself");
  const [reportFile, setReportFile] = useState(null);
  const [reportInputKey, setReportInputKey] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" });
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  if (modal.type === "slots") {
    const quickDays = Array.from({ length: 3 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
      return { date: formatInputDate(date), label: ["Today", "Tomorrow", "Day After"][index], short: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }), available: index > 0 && date.getDay() !== 0 };
    });
    const slots = ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM"];
    const selectedDay = quickDays.find((day) => day.date === quickDate);
    return <div className="modal-backdrop booking-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card quick-slots-modal" role="dialog" aria-modal="true" aria-labelledby="quick-slots-title">
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <span className="modal-kicker">BOOK ONLINE SLOT</span><h2 id="quick-slots-title">{modal.doctor.name}</h2>
      <div className="quick-day-options">{quickDays.map((day) => <button type="button" key={day.date} disabled={!day.available} className={quickDate === day.date ? "selected" : ""} onClick={() => { setQuickDate(day.date); setQuickTime(""); }}><b>{day.label}</b><small>{day.available ? day.short : "Full"}</small></button>)}</div>
      <h3 className="quick-slots-heading">Video slots (IST) · 9 AM – 2 PM</h3>
      <div className="quick-time-options">{slots.map((time) => <button type="button" key={time} className={quickTime === time ? "selected" : ""} onClick={() => setQuickTime(time)}>{time}</button>)}</div>
      <div className="quick-slots-actions"><span>{quickTime ? `${selectedDay?.label}, ${quickTime}` : "Select a time slot"}<b>₹{modal.doctor.price.toLocaleString("en-IN")}</b></span><Button disabled={!quickTime} onClick={() => onBookSelectedSlot(modal.doctor, quickDate, quickTime)}>Book Online Consultation <ArrowRight size={16} /></Button><Button type="button" variant="outline" onClick={onPickAnotherDate}><CalendarDays size={16} /> Pick another date</Button></div>
    </section></div>;
  }
  if (modal.type === "booking") {
    const lastBookableDate = new Date(today);
    lastBookableDate.setDate(lastBookableDate.getDate() + 60);
    const lastBookableMonth = new Date(lastBookableDate.getFullYear(), lastBookableDate.getMonth(), 1);
    const nextAvailableDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (nextAvailableDate.getDay() === 0) nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
    const monthDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const firstWeekday = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
    const calendarDays = [...Array(firstWeekday).fill(null), ...Array.from({ length: monthDays }, (_, index) => index + 1)];
    const isBookable = (day) => {
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
      return date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
        && date <= lastBookableDate
        && date.getDay() !== 0;
    };
    const moveMonth = (offset) => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
    const chooseDate = (day) => {
      if (!isBookable(day)) return;
      setSelectedDate(formatInputDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)));
      setSelectedTime("");
    };
    const jumpToNextAvailable = () => {
      setVisibleMonth(new Date(nextAvailableDate.getFullYear(), nextAvailableDate.getMonth(), 1));
      setSelectedDate(formatInputDate(nextAvailableDate));
      setSelectedTime("09:00 AM");
    };
    const formattedSelectedDate = selectedDate
      ? new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedDate}T00:00:00`))
      : "";
    const steps = ["Date & time", "Patient details", "Review & pay"];
    const slots = ["09:00 AM", "09:45 AM", "11:15 AM", "12:00 PM", "12:45 PM"];
    const updatePatient = (key, value) => setPatient((current) => ({ ...current, [key]: value }));
    return <div className="modal-backdrop booking-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="modal-card booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <header className="booking-header"><Avatar initials={modal.doctor.initials} color={modal.doctor.color} /><div><span className="booking-price-kicker">BOOK ONLINE CONSULTATION · ₹{modal.doctor.price.toLocaleString("en-IN")}</span><h2 id="booking-title">{modal.doctor.name}</h2><p>{modal.doctor.specialty} · Available 9 AM – 2 PM · Not available on Sundays</p></div></header>
      <div className="booking-steps" aria-label="Booking progress">{steps.map((step, index) => <div className={`booking-step ${bookingStep === index ? "active" : ""} ${bookingStep > index ? "complete" : ""}`} key={step}><span>{bookingStep > index ? <Check size={14} /> : index + 1}</span>{step}</div>)}</div>
      {bookingStep === 0 && <div className="booking-date-layout">
        <div className="booking-calendar">
          <div className="calendar-heading"><button aria-label="Previous month" disabled={visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth()} onClick={() => moveMonth(-1)}><ArrowLeft size={17} /></button><h3>{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3><button aria-label="Next month" disabled={visibleMonth >= lastBookableMonth} onClick={() => moveMonth(1)}><ChevronRight size={17} /></button></div>
          <div className="calendar-grid calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">{calendarDays.map((day, index) => {
            if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
            const dateValue = formatInputDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
            const isSelected = dateValue === selectedDate;
            const isToday = dateValue === todayInputDate;
            return <button key={day} className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`} disabled={!isBookable(day)} aria-pressed={isSelected} onClick={() => chooseDate(day)}>{day}{isBookable(day) && <i />}</button>;
          })}</div>
          <div className="calendar-legend"><span><i /> Slots available</span><span><i /> Today</span><span>Booking open up to 60 days ahead</span></div>
          <button className="next-available-button" onClick={jumpToNextAvailable}>Jump to next available: {nextAvailableDate.toLocaleDateString("en-IN", { weekday: "long" })}, 09:00 AM</button>
        </div>
        <section className="booking-slots"><h3>Available times</h3>{selectedDate ? <><h4>{formattedSelectedDate}</h4><span className="slot-period">MORNING</span><div className="slot-list">{slots.slice(0, 3).map((time) => <button key={time} className={selectedTime === time ? "selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div><span className="slot-period">AFTERNOON</span><div className="slot-list">{slots.slice(3).map((time) => <button key={time} className={selectedTime === time ? "selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div>{selectedTime && <p className="selected-slot"><CheckCircle2 size={16} /> Selected: {formattedSelectedDate} at {selectedTime} (IST)</p>}</> : <p className="slot-placeholder">Pick a date on the calendar to see this doctor’s open video slots.</p>}</section>
      </div>}
      {bookingStep === 1 && <form className="patient-details-form" onSubmit={(event) => { event.preventDefault(); setBookingStep(2); }}>
        <div className="booking-step-content patient-step-content">
          <div className="booking-section-heading"><h3>Patient details</h3><p>Tell us a little about the patient before the consultation.</p></div>
          <div className="patient-type-picker"><b>Who is this consultation for?</b><div role="group" aria-label="Who is this consultation for?"><button type="button" className={patientType === "myself" ? "selected" : ""} onClick={() => { setPatientType("myself"); updatePatient("name", [user?.firstName, user?.lastName].filter(Boolean).join(" ")); }}>Myself</button><button type="button" className={patientType === "someone-else" ? "selected" : ""} onClick={() => { setPatientType("someone-else"); updatePatient("name", ""); }}>Someone else</button></div></div>
          <div className="patient-fields"><label>Patient’s full name<input autoComplete="name" value={patient.name} onChange={(event) => updatePatient("name", event.target.value)} required /></label><label>Age<input type="number" min="1" max="120" value={patient.age} onChange={(event) => updatePatient("age", event.target.value)} required /></label><label>Gender<select value={patient.gender} onChange={(event) => updatePatient("gender", event.target.value)} required><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label className="patient-notes">What would you like to discuss?<textarea value={patient.notes} onChange={(event) => updatePatient("notes", event.target.value)} rows="3" placeholder="Symptoms, how long you’ve had them, current medicines" /></label><label className="patient-pincode">Delivery pincode for medicines<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={patient.deliveryPincode} onChange={(event) => updatePatient("deliveryPincode", event.target.value.replace(/\D/g, "").slice(0, 6))} required /></label><label className="report-upload-field">Reports or old prescriptions <span>(optional)</span><input key={reportInputKey} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => setReportFile(event.target.files?.[0] || null)} /><span className="report-upload-control">{reportFile ? reportFile.name : "Attach a file"}{reportFile && <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setReportFile(null); setReportInputKey((key) => key + 1); }}>Remove</button>}</span></label></div>
          {patient.deliveryPincode.length === 6 && <p className="delivery-estimate"><MapPin size={14} /> Madhapur · delivery within 30 minutes · delivery ₹34</p>}
        </div>
        <div className="booking-footer-actions"><Button type="button" variant="outline" onClick={() => setBookingStep(0)}><ArrowLeft size={15} /> Back</Button><Button type="submit">Review booking <ArrowRight size={16} /></Button></div>
      </form>}
      {bookingStep === 2 && <div className="booking-review">
        <div className="booking-step-content review-step-content">
          <div className="booking-section-heading"><h3>Review &amp; pay</h3><p>Your appointment details and payment summary.</p></div>
          <div className="review-card"><div className="review-doctor"><Avatar initials={modal.doctor.initials} color={modal.doctor.color} /><span><span>DOCTOR</span><b>{modal.doctor.name}</b><small>{modal.doctor.specialty} · Video consultation</small></span><button className="review-change-button" type="button" onClick={() => setBookingStep(0)}>Change</button></div><div><span>APPOINTMENT</span><b>{formattedSelectedDate} · {selectedTime} (IST)</b></div><div><span>PATIENT</span><b>{patient.name} · {patient.age} years · {patient.gender}</b><small>{patient.notes}</small></div>{patient.deliveryPincode && <div><span>DELIVERY PINCODE</span><b>{patient.deliveryPincode}</b></div>}{reportFile && <div><span>ATTACHMENT</span><b>{reportFile.name}</b></div>}</div>
          <div className="payment-layout"><div className="payment-methods"><h4>Choose payment method</h4><div>{["UPI", "Card"].map((method) => <button type="button" key={method} className={paymentMethod === method ? "selected" : ""} onClick={() => setPaymentMethod(method)}><span className="payment-radio">{paymentMethod === method && <i />}</span>{method === "UPI" ? "UPI" : "Credit / debit card"}</button>)}</div>
            {paymentMethod === "UPI" ? <label className="payment-entry-field">UPI ID<input autoComplete="off" inputMode="email" value={upiId} onChange={(event) => setUpiId(event.target.value.replace(/\s/g, ""))} placeholder="name@bank" aria-describedby="upi-demo-note" /><small id="upi-demo-note">Demo checkout only. No payment will be sent.</small></label>
              : <div className="card-entry-fields"><label className="card-entry-wide">Name on card<input autoComplete="cc-name" value={cardDetails.name} onChange={(event) => setCardDetails((current) => ({ ...current, name: event.target.value }))} placeholder="Name as shown on card" /></label><label className="card-entry-wide">Card number<input inputMode="numeric" autoComplete="cc-number" maxLength={19} value={cardDetails.number} onChange={(event) => setCardDetails((current) => ({ ...current, number: event.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") }))} placeholder="1234 5678 9012 3456" /></label><label>Expiry<input inputMode="numeric" autoComplete="cc-exp" maxLength={5} value={cardDetails.expiry} onChange={(event) => { const digits = event.target.value.replace(/\D/g, "").slice(0, 4); setCardDetails((current) => ({ ...current, expiry: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits })); }} placeholder="MM/YY" /></label><label>CVV<input inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={cardDetails.cvv} onChange={(event) => setCardDetails((current) => ({ ...current, cvv: event.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" /></label><small className="card-demo-note">Demo checkout only. Card details are not stored or charged.</small></div>}
          </div><div className="payment-total"><h4>Payment summary</h4><span>Consultation fee <b>₹{modal.doctor.price.toLocaleString("en-IN")}</b></span><span>Platform fee <b>₹0</b></span><strong>Total payable <b>₹{modal.doctor.price.toLocaleString("en-IN")}</b></strong></div></div>
        </div>
        <div className="booking-footer-actions"><Button type="button" variant="outline" onClick={() => setBookingStep(1)}><ArrowLeft size={15} /> Back</Button><Button type="button" disabled={paymentMethod === "UPI" ? !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId) : (cardDetails.name.trim().length < 2 || cardDetails.number.replace(/\s/g, "").length !== 16 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry) || cardDetails.cvv.length < 3)} onClick={() => onBook(modal.doctor, selectedDate, selectedTime, patient, paymentMethod)}>Pay ₹{modal.doctor.price.toLocaleString("en-IN")} <ArrowRight size={16} /></Button></div>
        <small className="modal-terms">Secure demo checkout · Your payment details are not stored</small>
      </div>}
      {bookingStep === 0 && <div className="booking-footer-actions booking-date-footer"><span>{selectedDate && selectedTime ? `Selected: ${formattedSelectedDate} at ${selectedTime}` : "Choose a date and time to continue"}</span><Button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(1)}>Continue <ArrowRight size={16} /></Button></div>}
    </section></div>;
  }
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="modal-card filter-modal" role="dialog" aria-modal="true" aria-labelledby="filter-title"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><span className="modal-kicker"><SlidersHorizontal size={14} /> PERSONALIZE YOUR SEARCH</span><h2 id="filter-title">Filters</h2><p className="modal-subtitle">Choose what matters most to you.</p><div className="filter-options"><label><input type="checkbox" /> Available today</label><label><input type="checkbox" /> Home service available</label><label><input type="checkbox" /> Top rated (4.5+)</label></div><Button className="modal-submit" onClick={() => { onClose(); onToast("Filters applied to your results."); }}>Show results <ArrowRight size={16} /></Button></section></div>;
}

function EmptyState({ title, text, action, onAction }) {
  return <div className="empty-state"><span><Search size={22} /></span><h3>{title}</h3><p>{text}</p>{action && <Button variant="outline" onClick={onAction}>{action} <ArrowRight size={15} /></Button>}</div>;
}

export default App;
