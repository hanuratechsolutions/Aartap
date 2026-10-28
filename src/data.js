export const doctors = [
  { name: "Dr. Rohan Verma", specialty: "Dermatologist", category: "Skin & Hair", rating: "4.9", experience: "8+ yrs", color: "sage", initials: "RV", next: "Today, 4:30 PM", price: 1500, credentials: "MBBS, MD Dermatology", registration: "TS-MC-XXXXX", languages: "English, Hindi", availability: "9 AM – 2 PM" },
  { name: "Dr. Ananya Sharma", specialty: "Cardiologist", category: "General Homeopathy", rating: "4.8", experience: "10+ yrs", color: "rose", initials: "AS", next: "Tomorrow, 10:00 AM", price: 1500, credentials: "BHMS, MD (Hom)", registration: "TS-HOM-XXXXX", languages: "English, Hindi", availability: "9 AM – 2 PM" },
  { name: "Dr. Amit Patel", specialty: "General Physician", category: "Digestive Health", rating: "4.7", experience: "6+ yrs", color: "blue", initials: "AP", next: "Today, 6:15 PM", price: 1500, credentials: "MBBS, General Medicine", registration: "TS-MC-XXXXX", languages: "English, Hindi", availability: "10 AM – 6 PM" },
  { name: "Dr. Karthik Menon", specialty: "Skin & Hair", category: "Skin & Hair", rating: "4.8", experience: "9+ yrs", color: "sage", initials: "KM", next: "Tomorrow, 2:00 PM", price: 1500, credentials: "BHMS, MD (Hom) Materia Medica", registration: "KL-HOM-XXXXX", languages: "English, Malayalam", availability: "2 PM – 9 PM" },
  { name: "Dr. Farhan Siddiqui", specialty: "General Homeopathy", category: "General Homeopathy", rating: "4.7", experience: "7+ yrs", color: "blue", initials: "FS", next: "Tomorrow, 12:00 PM", price: 1500, credentials: "BHMS", registration: "TS-HOM-XXXXX", languages: "English, Hindi, Urdu", availability: "12 PM – 9 PM" },
  { name: "Dr. Meera Nair", specialty: "Pediatrician", category: "Child Health", rating: "4.9", experience: "8+ yrs", color: "rose", initials: "MN", next: "Tomorrow, 11:00 AM", price: 1500, credentials: "MBBS, MD Pediatrics", registration: "TS-MC-XXXXX", languages: "English, Hindi, Malayalam", availability: "9 AM – 5 PM" },
  { name: "Dr. Kavya Reddy", specialty: "Women's Health", category: "Women's Health", rating: "4.8", experience: "11+ yrs", color: "rose", initials: "KR", next: "Tomorrow, 9:45 AM", price: 1500, credentials: "MBBS, DGO", registration: "TS-MC-XXXXX", languages: "English, Telugu, Hindi", availability: "9 AM – 4 PM" },
  { name: "Dr. Sameer Khan", specialty: "Allergy & Respiratory", category: "Allergy & Respiratory", rating: "4.7", experience: "7+ yrs", color: "blue", initials: "SK", next: "Tomorrow, 1:00 PM", price: 1500, credentials: "MBBS, MD Respiratory Medicine", registration: "TS-MC-XXXXX", languages: "English, Hindi, Urdu", availability: "10 AM – 6 PM" },
];

export const pharmacies = [
  { name: "Apollo Pharmacy", rating: "4.8", distance: "0.8 km", delivery: "20–30 min", offer: "20% OFF", color: "mint", initials: "A+" },
  { name: "MedPlus Pharmacy", rating: "4.7", distance: "1.2 km", delivery: "25–35 min", offer: "15% OFF", color: "lilac", initials: "M+" },
  { name: "Netmeds Pharmacy", rating: "4.6", distance: "1.5 km", delivery: "30–40 min", offer: "10% OFF", color: "peach", initials: "N" },
];

export const labs = [
  { name: "MedLab Diagnostics", rating: "4.8", distance: "0.8 km", delivery: "20–30 min", initials: "M", color: "mint" },
  { name: "Dr. Rao’s Laboratory", rating: "4.7", distance: "1.2 km", delivery: "15–25 min", initials: "R", color: "lilac" },
  { name: "City Care Labs", rating: "4.6", distance: "1.5 km", delivery: "20–30 min", initials: "C", color: "peach" },
];

export const medicines = [
  { name: "Paracetamol 650mg", category: "Pain relief", price: 32, note: "Strip of 15 tablets", pack: "PARA", packNote: "Tablets IP", packColor: "blue" },
  { name: "ORS Powder", category: "Hydration", price: 22, note: "Lemon · 21.8 g", pack: "ORS", packNote: "Oral salts", packColor: "green" },
  { name: "Himalaya Liv.52 DS", category: "Digestive care", price: 129, note: "Tablets · 60 count", pack: "HIMALAYA", packNote: "Liv.52 DS", packColor: "teal" },
  { name: "Dolo 650mg Tablet", category: "Pain relief", price: 30, note: "Strip of 15 tablets", pack: "Dolo", packNote: "650 mg", packColor: "red" },
  { name: "Zyrtec 10mg Tablet", category: "Allergy care", price: 45, note: "Strip of 10 tablets", pack: "Zyrtec", packNote: "10 mg", packColor: "blue" },
  { name: "Vicks VapoRub", category: "Cold & cough", price: 75, note: "Soothing balm · 25 g", pack: "Vicks", packNote: "VapoRub", packColor: "navy" },
];

export const tests = [
  { name: "Complete Blood Count", short: "CBP", category: "Blood", price: 399, oldPrice: 650, detail: "Complete Blood Picture", glyph: "🩸" },
  { name: "C-Reactive Protein", short: "CRP", category: "Blood", price: 550, oldPrice: 800, detail: "C-Reactive Protein", glyph: "🧪" },
  { name: "Fasting Blood Sugar", short: "FBS", category: "Diabetes", price: 199, oldPrice: 300, detail: "Fasting Blood Sugar", glyph: "🩸" },
  { name: "Post Prandial Blood Sugar", short: "PPBS", category: "Diabetes", price: 199, oldPrice: 300, detail: "Post Prandial Blood Sugar", glyph: "🧪" },
  { name: "HbA1c", short: "HbA1c", category: "Diabetes", price: 499, oldPrice: 700, detail: "Glycated Hemoglobin", glyph: "🩸" },
  { name: "Thyroid Profile", short: "Thyroid Profile", category: "Thyroid", price: 699, oldPrice: 950, detail: "T3, T4, TSH", glyph: "🦋" },
  { name: "Vitamin D", short: "25-OH Vitamin D", category: "Vitamins", price: 799, oldPrice: 1200, detail: "Vitamin D total", glyph: "☀️" },
];

export const initialAppointments = [
  { id: "apt-1", doctor: doctors[1], date: "21 Oct 2026", time: "10:00 AM", mode: "Video consultation", status: "Confirmed" },
  { id: "apt-2", doctor: doctors[0], date: "24 Oct 2026", time: "4:30 PM", mode: "In-clinic visit", status: "Confirmed" },
];

export const completedAppointments = [
  { id: "apt-done-1", doctor: doctors[2], date: "10 Oct 2026", time: "11:30 AM", mode: "Video consultation", status: "Completed" },
];
