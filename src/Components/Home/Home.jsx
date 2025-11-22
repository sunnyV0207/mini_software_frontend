import { useEffect, useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {

  // Background Slideshow Images
  const images = [
    "./images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [menuOpen,setMenuOpen]=useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full text-white">

      {/* NAVBAR */}
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-5 
        bg-white/10 backdrop-blur-md shadow-md border-b border-white/10"
      >
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-wide text-blue-100">
          EduNexus
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-lg text-blue-100">
          <a href="#about" className="hover:text-blue-300 transition">About</a>
          <a href="#features" className="hover:text-blue-300 transition">Features</a>
          <a href="#feedback" className="hover:text-blue-300 transition">Feedback</a>
          <a href="#contact" className="hover:text-blue-300 transition">Contact</a>

          <Link to="/login">
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg 
              hover:bg-blue-700 transition hover:shadow-blue-400/40">
              Login
            </button>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-blue-100 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-20 left-0 right-0 z-40 
            bg-[#0f0f1a] text-white py-6 shadow-lg border-b border-white/10"
          >
            <div className="flex flex-col items-center gap-6 text-lg">
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-300 transition"
              >
                About
              </a>

              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-300 transition"
              >
                Features
              </a>

              <a
                href="#feedback"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-300 transition"
              >
                Feedback
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-300 transition"
              >
                Contact
              </a>

              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg 
                  hover:bg-blue-700 transition hover:shadow-blue-400/40">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div className="relative h-screen w-full flex items-center justify-center">

        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt="background"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImage === index ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            The Future of School Management
          </h1>

          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 drop-shadow-md">
            Automate attendance, performance tracking, parent communication,
            and school operations—all in one powerful platform.
          </p>
        </motion.div>
      </div>

      {/* ABOUT SECTION */}
<section
  id="about"
  className="relative py-28 px-8 bg-[#0A0A0F] text-white"
>
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="max-w-6xl mx-auto"
  >
    <div className="flex flex-col md:flex-row items-start gap-12">

      {/* Indigo Vertical Line */}
      <div className="hidden md:block w-2 rounded-full bg-gradient-to-b from-indigo-800 to-indigo-600 h-full shadow-[0_0_15px_rgba(55,48,163,0.7)]"></div>

      {/* Main Content */}
      <div className="flex-1">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-400">
          About EduNexus
        </h2>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          EduNexus is a next-generation school management platform built to simplify 
          and digitize every essential part of school operations. From attendance 
          tracking to student performance monitoring, teacher assignments, 
          and parent communication — everything works seamlessly through one 
          modern, secure, and intuitive system.
          <br /><br />
          Our mission is to help schools run efficiently with technology that is  
          <span className="font-semibold text-indigo-400"> reliable, fast, and incredibly easy to use.</span>
        </p>

        {/* Highlight Box */}
        <div className="bg-[#121222] p-6 rounded-xl shadow-lg border border-indigo-900/40 mb-10">
          <h3 className="text-2xl font-bold text-indigo-300 mb-3">
            Why EduNexus Works Better
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            EduNexus is designed after studying how real schools operate.  
            Every feature solves a practical problem — making daily activities smoother 
            for Principals, Teachers, and Parents. The platform ensures clarity, 
            accountability, and effortless communication across the school.
          </p>
        </div>

        {/* Why Schools Choose Us */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-300">
            Why Schools Trust EduNexus
          </h3>

          <ul className="list-disc list-inside text-lg text-gray-300 space-y-3">
            <li>Clean dashboard with a modern, distraction-free design</li>
            <li>Instant absence alerts directly to parents’ phones</li>
            <li>Well-organized student performance and assessment reports</li>
            <li>Principal-level control for teacher and class management</li>
            <li>Secure login portals for Admin, Teachers, and Parents</li>
            <li>Fully digital — no paperwork, no manual confusion</li>
          </ul>

          <p className="text-gray-300 text-lg leading-relaxed pt-4">
            Whether your institution is traditional or technology-driven,  
            EduNexus brings the power of  
            <span className="text-indigo-400 font-semibold">digital transformation</span>  
            to your school with clarity and confidence.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="#contact"
            className="inline-block bg-indigo-700 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition"
          >
            Contact Us to Get Started
          </a>
        </div>

      </div>
    </div>
  </motion.div>
</section>

{/* FEATURES SECTION */}
<section
  id="features"
  className="relative py-28 px-8 bg-[#141426] text-white"
>

  {/* Decorative Top Divider */}
  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#0A0A0F] to-transparent"></div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="max-w-6xl mx-auto"
  >

    {/* Heading */}
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-300 text-center">
      Powerful Features for Smarter School Management
    </h2>

    <p className="text-gray-300 text-lg leading-relaxed mx-auto text-center max-w-3xl mb-14">
      Designed to bring clarity, speed, and effortless management to your school’s daily workflow.
      Every feature is optimized for real-world usage by Principals, Teachers, and Parents.
    </p>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

      {/* Feature Card */}
      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">Digital Attendance</h3>
        <p className="text-gray-300 text-lg">
          Mark attendance instantly and send real-time absence notifications to parents.
        </p>
      </div>

      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">Performance Tracking</h3>
        <p className="text-gray-300 text-lg">
          Track student marks subject-wise with beautifully organized digital records.
        </p>
      </div>

      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">Principal Control Panel</h3>
        <p className="text-gray-300 text-lg">
          Assign teachers, review classes, and manage the entire school from one dashboard.
        </p>
      </div>

      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">Secure Portals</h3>
        <p className="text-gray-300 text-lg">
          Super Admin, Principal, Teachers, and Parents each get their own secure login area.
        </p>
      </div>

      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">Parent Alerts</h3>
        <p className="text-gray-300 text-lg">
          Automated messages keep parents informed about attendance, performance, and updates.
        </p>
      </div>

      <div className="bg-[#1A1A2F] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition">
        <h3 className="text-2xl font-bold text-indigo-300 mb-3">No More Paperwork</h3>
        <p className="text-gray-300 text-lg">
          All records are digital, secure, and accessible — eliminating manual errors forever.
        </p>
      </div>
    </div>
  </motion.div>
</section>

{/* FEEDBACK SECTION */}
<section id="feedback" className="relative py-28 px-8 bg-[#0C0C16] text-white overflow-hidden">

  {/* Top Divider */}
  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#141426] to-transparent"></div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="max-w-6xl mx-auto text-center mb-14"
  >
    <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-300">
      What Schools Say About Us
    </h2>
    <p className="text-gray-300 text-lg max-w-3xl mx-auto mt-4">
      Real feedback from Principals, Teachers, and Staff who transformed the way their schools operate.
    </p>
  </motion.div>

  {/* Infinite Auto-Moving Testimonials */}
  <div className="relative w-full overflow-hidden">
    
    {/* Motion Row (Infinite loop) */}
    <motion.div
      className="flex gap-8"
      animate={{ x: ["0%", "-100%"] }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 30
      }}
    >

      {/* Create a duplicated row for smooth looping */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-8">

          {/* CARD TEMPLATE */}
          {[
            {
              text: "Attendance is now instant, accurate, and parents love notifications!",
              name: "Principal — Sunrise Public School"
            },
            {
              text: "Marks entry is unbelievably easy. Our workload reduced drastically.",
              name: "Teacher — Bright Minds Academy"
            },
            {
              text: "Parents feel connected and informed — this platform changed everything.",
              name: "Coordinator — Global Scholars School"
            },
            {
              text: "The simplest school software we’ve used. Even non-tech staff uses it.",
              name: "Vice Principal — Horizon School"
            },
            {
              text: "Paperwork reduced by 80%. Everything is digital and fast.",
              name: "Admin — City Model School"
            },
            {
              text: "Teachers save time. Students benefit. Parents stay informed.",
              name: "Senior Teacher — Future Leaders Academy"
            }
          ].map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="min-w-[330px] bg-[#1A1A2B] border border-indigo-900/40 p-8 rounded-2xl shadow-lg hover:shadow-indigo-700/20 transition"
            >
              <p className="text-gray-300 text-lg italic mb-4">
                “{f.text}”
              </p>
              <h4 className="text-indigo-300 font-semibold">{f.name}</h4>
            </motion.div>
          ))}

        </div>
      ))}

    </motion.div>
  </div>
</section>

      {/* CONTACT SECTION */}
<section
  id="contact"
  className="relative pt-36 pb-28 px-8 bg-[#111225] text-white"
>

  {/* STRONG SECTION BREAK: WAVE DIVIDER */}
  <div className="absolute -top-1 left-0 w-full overflow-hidden leading-none">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-28 fill-[#0C0C16]"
    >
      <path d="M0 0L1200 0 1200 120 0 0z"></path>
    </svg>
  </div>

  {/* Gradient glow to enhance separation */}
  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#0C0C16] to-transparent opacity-70"></div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="max-w-6xl mx-auto"
  >
    {/* Heading */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-300 text-center mb-6">
      Get in Touch With Us
    </h2>

    <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto mb-14">
      Have questions? Want your school to get onboard?  
      Reach out anytime — we’re happy to assist and set everything up smoothly.
    </p>

    {/* Contact Form + Info */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#191A2F] p-10 rounded-2xl shadow-xl border border-indigo-900/40"
      >
        <h3 className="text-2xl font-bold text-indigo-300 mb-6">Send a Message</h3>

        <form className="space-y-6">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Your Name"
            className="w-full p-4 rounded-lg bg-[#232441] border border-indigo-900/40 text-white placeholder-gray-400 focus:outline-none"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Your Email"
            className="w-full p-4 rounded-lg bg-[#232441] border border-indigo-900/40 text-white placeholder-gray-400 focus:outline-none"
          />

          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            placeholder="Your Message"
            rows="5"
            className="w-full p-4 rounded-lg bg-[#232441] border border-indigo-900/40 text-white placeholder-gray-400 focus:outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold shadow-lg"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>

      {/* Side Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center"
      >
        <h3 className="text-2xl font-bold text-indigo-300 mb-6">Contact Details</h3>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          I'm <span className="text-white font-semibold">Sunny Verma</span>, the creator of this school management software.
          Contact me anytime for onboarding, support, or demos.
        </p>

        <div className="space-y-5 text-gray-300 text-lg">
          <p>📍 <span className="ml-2">Ghaziabad</span></p>
          <p>📧 <span className="ml-2">sunnyvermaverma2005@gmail.com</span></p>
          <p>📞 <span className="ml-2">+91 9027259417</span></p>

          <p>
            💬  
            <button
              className="ml-2 text-indigo-400 underline hover:text-indigo-300 transition"
              onClick={() => window.open("https://wa.me/919027259417", "_blank")}
            >
              Chat with us on WhatsApp
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  </motion.div>
</section>


{/* FOOTER */}
<footer className="relative bg-[#080810] text-gray-300 py-16 px-8">

  {/* Top Divider Wave */}
  <div className="absolute -top-1 left-0 w-full overflow-hidden leading-none">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-24 fill-[#111225]"
    >
      <path d="M0 0L1200 0 1200 120 0 0z"></path>
    </svg>
  </div>

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

    {/* Brand Section */}
    <div>
      <h3 className="text-3xl font-extrabold text-indigo-400 mb-4">
        SmartSchool Hub
      </h3>
      <p className="text-gray-400 text-lg leading-relaxed">
        A complete digital platform for Schools — built to make management effortless,
        organized and truly modern.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-xl font-semibold text-indigo-300 mb-4">Quick Links</h4>
      <ul className="space-y-3 text-lg">
        <li>
          <a href="#about" className="hover:text-indigo-400 transition">About Us</a>
        </li>
        <li>
          <a href="#features" className="hover:text-indigo-400 transition">Features</a>
        </li>
        <li>
          <a href="#feedback" className="hover:text-indigo-400 transition">Feedback</a>
        </li>
        <li>
          <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
        </li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h4 className="text-xl font-semibold text-indigo-300 mb-4">Connect With Me</h4>
      <p className="text-gray-400 mb-4 text-lg">
        Reach out anytime through my social platforms.
      </p>

      <div className="flex items-center gap-5">

        {/* Instagram */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://www.instagram.com/anurag_verma_0207/"
          target="_blank"
          className="text-pink-400 hover:text-pink-300 transition text-3xl"
        >
          <i className="ri-instagram-line"></i>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://www.linkedin.com/in/sunny-verma-604519302"
          target="_blank"
          className="text-blue-400 hover:text-blue-300 transition text-3xl"
        >
          <i className="ri-linkedin-box-line"></i>
        </motion.a>

        {/* GitHub */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://github.com/sunnyV0207"
          target="_blank"
          className="text-gray-300 hover:text-white transition text-3xl"
        >
          <i className="ri-github-line"></i>
        </motion.a>

        {/* WhatsApp */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://wa.me/919027259417"
          target="_blank"
          className="text-green-400 hover:text-green-300 transition text-3xl"
        >
          <i className="ri-whatsapp-line"></i>
        </motion.a>

      </div>
    </div>
  </div>

  {/* Bottom Line */}
  <div className="text-center text-gray-500 mt-14 border-t border-gray-700 pt-6 text-sm">
    © {new Date().getFullYear()} SmartSchool Hub — All Rights Reserved.  
    <br />
    Built & Maintained by <span className="text-indigo-400 font-semibold">Sunny Verma</span>
  </div>

</footer>


    </div>
  );
}
