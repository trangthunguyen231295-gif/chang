import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Type, 
  Image as ImageIcon, 
  Layout, 
  Phone, 
  Mail, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const Input = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-xs font-bold text-brand-brown uppercase tracking-wider">{label}</label>
    <input 
      className="w-full bg-white border border-brand-pink/20 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const TextArea = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-xs font-bold text-brand-brown uppercase tracking-wider">{label}</label>
    <textarea 
      className="w-full bg-white border border-brand-pink/20 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all min-h-[100px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SectionWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-brand-pink-light/30 border border-brand-pink/10 rounded-2xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-pink-light/50 transition-colors"
      >
        <span className="font-bold text-brand-brown">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-brand-pink" /> : <ChevronDown className="w-5 h-5 text-brand-pink" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-brand-pink/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminDashboard = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { content, updateContent, user, isAdmin, login } = useContent();
  const [localContent, setLocalContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/popup-blocked') {
        alert('Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép hiện pop-up và thử lại.');
      } else if (e.code === 'auth/unauthorized-domain') {
        alert('Lỗi: Tên miền này chưa được ủy quyền trong Firebase. \n\nVui lòng truy cập Firebase Console > Authentication > Settings > Authorized domains và thêm tên miền hiện tại vào danh sách.');
      } else {
        alert('Đã xảy ra lỗi khi đăng nhập: ' + (e.message || 'Lỗi không xác định'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent(localContent);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save. Check your permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdminSetup = async () => {
      if (!user) return;
      if (user.email === 'trangthunguyen231295@gmail.com') {
          await setDoc(doc(db, 'admins', user.uid), {
             email: user.email,
             grantedAt: new Date().toISOString()
          });
          window.location.reload();
      }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-brand-brown/40 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-brand-pink-light rounded-2xl flex items-center justify-center text-brand-pink mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
          <p className="text-brand-brown/60 mb-8">Please sign in with Google to access the management panel.</p>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-pink/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign in with Google'}
          </button>
          <button onClick={onClose} className="mt-4 text-sm font-bold text-brand-brown/60 hover:text-brand-brown underline uppercase tracking-widest">
            Back to site
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="fixed inset-0 z-[100] bg-brand-brown/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-brand-brown/60 mb-8">
                Your account ({user.email}) does not have administrator privileges.
            </p>
            {user.email === 'trangthunguyen231295@gmail.com' && (
                <button 
                    onClick={handleAdminSetup}
                    className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-amber-700 transition-all mb-4"
                >
                    Enable Admin Access (First time setup)
                </button>
            )}
            <button onClick={onClose} className="text-sm font-bold text-brand-brown/60 hover:text-brand-brown underline uppercase tracking-widest">
              Back to site
            </button>
          </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-brand-brown/40 backdrop-blur-sm flex items-center justify-end">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="px-8 py-6 border-b border-brand-pink/10 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-pink-light rounded-xl flex items-center justify-center text-brand-pink">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quản lý nội dung</h2>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Admin Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-brand-pink text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-brand-pink/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-brand-pink-light rounded-xl text-brand-brown/40 hover:text-brand-pink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <SectionWrapper title="Header & Liên hệ">
            <Input label="Số điện thoại" value={localContent.header.phone} onChange={(v) => setLocalContent({ ...localContent, header: { ...localContent.header, phone: v } })} />
            <Input label="Logo URL" value={localContent.header.logo} onChange={(v) => setLocalContent({ ...localContent, header: { ...localContent.header, logo: v } })} />
          </SectionWrapper>

          <SectionWrapper title="Hero Section">
            <Input label="Badge" value={localContent.hero.badge} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, badge: v } })} />
            <Input label="Tiêu đề chính" value={localContent.hero.title} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, title: v } })} />
            <Input label="Nút chính" value={localContent.hero.primaryBtn} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, primaryBtn: v } })} />
            <Input label="Nút phụ" value={localContent.hero.secondaryBtn} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, secondaryBtn: v } })} />
            <Input label="Ảnh Hero URL" value={localContent.hero.image} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, image: v } })} />
            <Input label="Năm kinh nghiệm" value={localContent.hero.experienceYears} onChange={(v) => setLocalContent({ ...localContent, hero: { ...localContent.hero, experienceYears: v } })} />
          </SectionWrapper>

          <SectionWrapper title="Vấn đề của mẹ (Pain Points)">
            <Input label="Badge" value={localContent.painPoints.badge} onChange={(v) => setLocalContent({ ...localContent, painPoints: { ...localContent.painPoints, badge: v } })} />
            <Input label="Tiêu đề" value={localContent.painPoints.title} onChange={(v) => setLocalContent({ ...localContent, painPoints: { ...localContent.painPoints, title: v } })} />
            <TextArea label="Trích dẫn (Quote)" value={localContent.painPoints.quote} onChange={(v) => setLocalContent({ ...localContent, painPoints: { ...localContent.painPoints, quote: v } })} />
            <Input label="Nút CTA" value={localContent.painPoints.cta} onChange={(v) => setLocalContent({ ...localContent, painPoints: { ...localContent.painPoints, cta: v } })} />
          </SectionWrapper>

          <SectionWrapper title="Dịch vụ (Services)">
            <Input label="Tiêu đề section" value={localContent.services.title} onChange={(v) => setLocalContent({ ...localContent, services: { ...localContent.services, title: v } })} />
            {localContent.services.items.map((item, i) => (
              <div key={i} className="mb-6 p-4 bg-white border border-brand-pink/10 rounded-xl">
                <Input label={`Dịch vụ ${i+1} Title`} value={item.title} onChange={(v) => {
                  const newItems = [...localContent.services.items];
                  newItems[i] = { ...newItems[i], title: v };
                  setLocalContent({ ...localContent, services: { ...localContent.services, items: newItems } });
                }} />
                <Input label="Image URL" value={item.image} onChange={(v) => {
                  const newItems = [...localContent.services.items];
                  newItems[i] = { ...newItems[i], image: v };
                  setLocalContent({ ...localContent, services: { ...localContent.services, items: newItems } });
                }} />
              </div>
            ))}
          </SectionWrapper>

          <SectionWrapper title="Footer">
            <TextArea label="Mô tả footer" value={localContent.footer.description} onChange={(v) => setLocalContent({ ...localContent, footer: { ...localContent.footer, description: v } })} />
            <Input label="Email" value={localContent.footer.email} onChange={(v) => setLocalContent({ ...localContent, footer: { ...localContent.footer, email: v } })} />
            <Input label="Địa chỉ" value={localContent.footer.address} onChange={(v) => setLocalContent({ ...localContent, footer: { ...localContent.footer, address: v } })} />
          </SectionWrapper>
        </div>

        {/* Sidebar Footer */}
        <div className="px-8 py-6 border-t border-brand-pink/10 bg-brand-pink-light/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-brand-pink" alt="" />
            <div className="flex flex-col">
              <span className="text-xs font-bold">{user.displayName}</span>
              <span className="text-[10px] text-brand-brown/60">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </motion.div>
    </div>
  );
};
