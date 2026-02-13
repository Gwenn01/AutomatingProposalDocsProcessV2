import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added for routing
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // To detect active route
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/feature' },
    { name: 'Guidelines', href: '/guidelines' }
  ];

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-2xl py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-slate-100' 
          : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        
        {/* Branding */}
        <Link to="/" className="flex items-center gap-5 group cursor-pointer relative">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="prmsuLogoTransparent.png" 
              alt="PRMSU Logo" 
              className="w-12 h-12 object-contain filter drop-shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          
          <div className="flex flex-col border-l border-slate-200/60 pl-5">
            <h1 className="text-2xl font-black tracking-tight leading-none uppercase">
              <span className="text-slate-900">PRMSU</span> 
              <span className="text-emerald-500 font-light ml-1 lowercase italic font-serif tracking-normal">research</span>
            </h1>
            <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-black mt-1.5 transition-colors group-hover:text-emerald-600">
              Extension & Innovation
            </span>
          </div>
        </Link>

        {/* Navigation: Real Routes */}
        <div className="hidden lg:flex items-center gap-1 p-1.5 bg-slate-900/5 backdrop-blur-md rounded-2xl border border-white/40 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.href} 
              className={`relative px-6 py-2.5 rounded-xl text-[11px] font-black transition-all duration-500 group ${
                isActive(link.href) ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="relative z-10 tracking-[0.2em] uppercase">
                {link.name}
              </span>
              
              {/* Active / Hover Indicator */}
              <div className={`absolute inset-0 bg-white rounded-xl shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isActive(link.href) ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
              }`} />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/support" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            Support
          </Link>
          <button onClick={() => navigate("/auth")} className="group relative overflow-hidden bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-[0.15em] uppercase flex items-center gap-3 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 active:scale-95">
            <div className="absolute inset-0 bg-emerald-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Portal Login
              <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-3 text-slate-900 bg-slate-50 rounded-2xl transition-all"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xl transition-all duration-700 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-screen w-full sm:w-[450px] bg-white p-12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-20">
               <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-400">
                  <User size={28} />
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-4 hover:bg-slate-50 rounded-full transition-colors">
                 <X size={28} />
               </button>
            </div>

            <nav className="flex flex-col gap-6 flex-grow">
              {navLinks.map((item, idx) => (
                <Link 
                  key={item.name}
                  to={item.href} 
                  style={{ transitionDelay: `${idx * 100}ms` }}
                  className={`text-5xl font-black tracking-tighter uppercase transition-all duration-700 ${
                    isActive(item.href) ? 'text-emerald-500' : 'text-slate-900 hover:text-emerald-500'
                  } ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="pt-10 border-t border-slate-100">
               <button className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase shadow-2xl shadow-emerald-900/20 active:scale-95 transition-all">
                Access Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  