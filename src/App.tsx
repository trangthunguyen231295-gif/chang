import React, { useState } from 'react';
import { 
  Phone, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Users,
  Moon,
  Wind,
  Smile,
  Zap,
  Check,
  Instagram,
  Facebook,
  Music2,
  Calendar,
  Settings,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContent } from './contexts/ContentContext';
import { AdminDashboard } from './components/AdminDashboard';

const iconMap: Record<string, any> = {
  Moon, Wind, Heart, Smile, Users, Zap, Check, ShieldCheck, Mail, MapPin, Music2, Calendar
};

const NavLink = ({ children, href = "#" }: { children: React.ReactNode, href?: string, key?: React.Key }) => (
  <a href={href} className="text-sm font-medium text-brand-brown hover:text-brand-pink transition-colors">
    {children}
  </a>
);

const ServiceCard = ({ title, items, image, iconName }: { title: string, items: string[], image: string, iconName: string, key?: React.Key }) => {
  const Icon = iconMap[iconName] || Users;
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-brand-pink/10 hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl text-brand-pink shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold mb-4 text-brand-brown">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-brand-brown/80">
              <Check className="w-4 h-4 text-brand-pink mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatItem = ({ number, label, sublabel }: { number: string, label: string, sublabel?: string, key?: React.Key }) => (
  <div className="bg-brand-pink-light rounded-[32px] p-8 text-center border border-brand-pink/10">
    <div className="text-3xl font-bold text-brand-pink mb-2">{number}</div>
    <div className="text-sm font-bold uppercase tracking-wider text-brand-brown">{label}</div>
    {sublabel && <div className="text-xs text-brand-brown/60 mt-1 uppercase">{sublabel}</div>}
  </div>
);

export default function App() {
  const { content, loading } = useContent();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '/admin') {
      setIsAdminOpen(true);
    }
  }, [location.pathname]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-pink-light">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-pink" />
          <p className="font-serif text-xl text-brand-brown font-medium animate-pulse">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminDashboard isOpen={isAdminOpen} onClose={closeAdmin} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-pink/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-brand-pink-light rounded-full flex items-center justify-center p-2 cursor-pointer" onClick={() => setIsAdminOpen(true)}>
              <img src={content.header.logo} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-brand-pink leading-none">Cô Chan</span>
              <span className="text-[10px] uppercase font-bold text-brand-brown/60 tracking-widest">Chăm sóc mẹ & bé</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {content.header.navLinks.map((link, i) => <NavLink key={i}>{link}</NavLink>)}
          </nav>

          <button className="flex items-center gap-2 bg-brand-brown text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-brown/90 transition-all shadow-lg hover:shadow-brand-brown/20">
            <Phone className="w-4 h-4" />
            {content.header.phone}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-12 lg:py-24 bg-brand-pink-light overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 text-brand-pink font-bold text-sm tracking-wide uppercase">
              <span className="w-12 h-[2px] bg-brand-pink"></span>
              {content.hero.badge}
            </div>
            <h1 className="text-4xl lg:text-7xl font-bold leading-tight text-brand-brown">
              {content.hero.title}
            </h1>
            <ul className="space-y-4">
              {content.hero.listItems.map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-brand-brown">
                  <div className="w-5 h-5 rounded-full bg-brand-pink text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="bg-brand-pink text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-brand-pink/90 transition-all hover:translate-y-[-2px] flex items-center gap-2">
                {content.hero.primaryBtn} <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white border border-brand-pink text-brand-pink px-8 py-4 rounded-full font-bold hover:bg-brand-pink-light transition-all">
                {content.hero.secondaryBtn}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={content.hero.image} 
                alt="Mother and baby" 
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[32px] shadow-xl border border-brand-pink/10 flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink font-bold text-2xl border-2 border-brand-pink border-dashed">
                {content.hero.experienceYears}
              </div>
              <div>
                <div className="font-bold text-brand-brown">NĂM</div>
                <div className="text-xs uppercase font-bold text-brand-brown/60 tracking-wider">Kinh nghiệm</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-pink/5 skew-x-[-15deg] translate-x-1/2"></div>
      </section>

      {/* Trust Stats Bar */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.stats.map((stat, i) => {
              const Icon = i === 0 ? Users : i === 1 ? Heart : ShieldCheck;
              return (
                  <div key={i} className="flex items-center gap-4 p-8 bg-white border border-brand-pink/10 rounded-[32px] shadow-sm">
                    <div className="w-14 h-14 bg-brand-pink-light rounded-2xl flex items-center justify-center text-brand-pink">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-sm font-bold text-brand-brown/60 uppercase">{stat.label}</div>
                    </div>
                  </div>
              );
          })}
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="px-6 py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <span className="text-brand-pink font-bold uppercase tracking-widest text-sm">{content.painPoints.badge}</span>
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: content.painPoints.title }} />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full mt-12">
            {content.painPoints.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Heart;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-3xl bg-brand-pink-light flex items-center justify-center text-brand-pink transition-transform hover:scale-110">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-brand-brown/80">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-brand-pink-light p-10 rounded-[40px] border border-brand-pink/5 relative text-left">
            <div className="absolute top-6 left-6 text-brand-pink opacity-20 transform -translate-y-4">
              <Music2 className="w-12 h-12" />
            </div>
            <p className="text-xl italic text-brand-brown leading-relaxed relative z-10">
              "{content.painPoints.quote}"
            </p>
            <button className="mt-8 bg-brand-pink text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brand-pink/90 transition-all flex items-center gap-2 group">
              {content.painPoints.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20 bg-brand-pink-light text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-pink font-bold uppercase tracking-widest text-sm">{content.about.badge}</span>
          <h2 className="text-4xl lg:text-5xl font-bold my-6">{content.about.title}</h2>
          <p className="max-w-3xl mx-auto text-brand-brown/70 mb-12">
            {content.about.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.stats.map((stat, i) => (
              <StatItem key={i} number={stat.number} label={stat.label} sublabel={stat.sublabel} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-pink font-bold uppercase tracking-widest text-sm">{content.services.badge}</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-4" dangerouslySetInnerHTML={{ __html: content.services.title }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.services.items.map((service, i) => (
              <ServiceCard 
                key={i}
                title={service.title}
                iconName={service.icon}
                image={service.image}
                items={service.details}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="bg-brand-pink text-white px-10 py-5 rounded-full font-bold shadow-xl hover:bg-brand-pink/90 transition-all flex items-center gap-2 mx-auto">
              {content.services.cta} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-6 py-20 bg-brand-pink-light">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-pink font-bold uppercase tracking-widest text-sm">{content.whyChoose.badge}</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-8" dangerouslySetInnerHTML={{ __html: content.whyChoose.title }} />
            
            <div className="space-y-8">
              {content.whyChoose.features.map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center text-brand-pink border border-brand-pink/10 shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                    <p className="text-brand-brown/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={content.whyChoose.image} 
                alt="Happy mother" 
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute top-10 -right-10 bg-white p-8 rounded-[32px] shadow-xl max-w-[280px] border border-brand-pink/10">
              <div className="text-brand-pink mb-4">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-sm italic font-medium">"{content.whyChoose.testimonial.text}"</p>
              <div className="mt-4 font-bold text-xs uppercase tracking-widest text-brand-pink">— {content.whyChoose.testimonial.author}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-6 py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-pink font-bold uppercase tracking-widest text-sm">{content.steps.badge}</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-20">{content.steps.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-brand-pink/10 -z-10"></div>
            {content.steps.items.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-6 group">
                <div className="w-24 h-24 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink font-bold text-2xl border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                  {step.id}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-brand-brown/60 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto rounded-[48px] overflow-hidden bg-brand-brown text-white relative">
          <img 
            src={content.ctaSection.image} 
            alt="CTA background" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 p-12 lg:p-24 text-center max-w-4xl mx-auto translate-y-[-10px]">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">{content.ctaSection.title}</h2>
            <p className="text-lg lg:text-xl text-white/80 mb-12 font-medium">
              {content.ctaSection.description}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-brand-pink text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-brand-pink/90 transition-all hover:scale-105">
                {content.ctaSection.primaryBtn}
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all">
                {content.ctaSection.secondaryBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-pink-light/50 pt-20 pb-10 px-6 border-t border-brand-pink/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-brand-pink">Cô Chan</span>
            </div>
            <p className="text-sm text-brand-brown/60 leading-relaxed">
              {content.footer.description}
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-brand-pink/10 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-brand-pink/10 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-brand-pink/10 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-colors cursor-pointer">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Liên kết</h4>
            <ul className="space-y-4">
              {["Trang chủ", "Giới thiệu", "Hành trình", "Feedback", "Liên hệ"].map((item, i) => (
                <li key={i}><a href="#" className="text-sm text-brand-brown/60 hover:text-brand-pink transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Dịch vụ</h4>
            <ul className="space-y-4">
              {["Chăm sóc sau sinh", "Massage mẹ & bé", "Tư vấn sữa mẹ", "Đồng hành tinh thần"].map((item, i) => (
                <li key={i}><a href="#" className="text-sm text-brand-brown/60 hover:text-brand-pink transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-brand-brown/60">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-pink" />
                {content.footer.phone}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 text-brand-pink flex items-center justify-center text-[10px] font-bold">@</div>
                {content.footer.email}
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-pink mt-1" />
                {content.footer.address}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-brand-pink/10 flex flex-col md:row items-center justify-between gap-4 text-xs text-brand-brown/40 font-medium">
          <p>© 2024 Cô Chan Care. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-pink">Chính sách bảo mật</a>
            <a href="#" className="hover:text-brand-pink">Điều khoản sử dụng</a>
          </div>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 hover:text-brand-pink transition-colors"
          >
            <Settings className="w-3 h-3" />
            Admin Panel
          </button>
        </div>
      </footer>
    </div>
  );
}
