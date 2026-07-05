// frontend/src/pages/AgentSettingsPage.jsx
import { useState, useEffect } from 'react';
import { HiShieldCheck, HiOutlineMail, HiOutlinePhone, HiSparkles, HiCloudUpload, HiX, HiCheck } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const colorPresets = [
  { hex: '#3b82f6', name: 'Vibrant Blue' },
  { hex: '#10b981', name: 'Emerald Green' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#ec4899', name: 'Rose Pink' },
  { hex: '#f59e0b', name: 'Amber Gold' },
  { hex: '#14b8a6', name: 'Teal' },
  { hex: '#8b5cf6', name: 'Purple' },
  { hex: '#0f172a', name: 'Slate Gray' },
];

const AgentSettingsPage = () => {
  const { user, fetchProfile } = useAuth();
  
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.agencyProfile) {
      setAgencyName(user.agencyProfile.agencyName || '');
      setPhone(user.agencyProfile.phone || '');
      setEmail(user.agencyProfile.email || '');
      setPrimaryColor(user.agencyProfile.primaryColor || '#3b82f6');
      setLogoPreview(user.agencyProfile.logoUrl || '');
    }
  }, [user]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('agencyName', agencyName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('primaryColor', primaryColor);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const { data } = await axiosInstance.put('/auth/agency', formData);

      if (data.success) {
        toast.success('Agency branding settings saved!');
        fetchProfile(); // Refresh global user context
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-theme flex items-center space-x-2">
          <HiShieldCheck className="text-primary-500 h-8 w-8" />
          <span>Agency Branding & White-Label Setup</span>
        </h1>
        <p className="mt-1 text-muted-theme">
          Configure custom branding for all simplified summaries you share with your clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl p-6 border shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Branding Configuration</h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Agency Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-label-theme">
                  Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  placeholder="e.g. Elite Premium Insurance Brokers"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-label-theme">
                  Agency Logo (.PNG, .JPG)
                </label>
                <div className="flex items-center space-x-4">
                  {logoPreview && (
                    <div className="w-16 h-16 rounded-xl border flex items-center justify-center p-2 bg-white flex-shrink-0">
                      <img src={logoPreview} alt="Agency Logo Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <div
                    onClick={() => document.getElementById('logo-file-input').click()}
                    className="border border-dashed rounded-xl px-4 py-3 text-center cursor-pointer hover:border-primary-500/50 transition-all flex-1"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  >
                    <HiCloudUpload className="h-6 w-6 text-subtle-theme mx-auto mb-1" />
                    <span className="text-xs text-muted-theme">
                      {logoFile ? logoFile.name : 'Upload custom logo'}
                    </span>
                    <input
                      id="logo-file-input"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-label-theme">
                    Support Email
                  </label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-theme h-5 w-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 text-primary-theme"
                      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                      placeholder="claims@youragency.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-label-theme">
                    Business Phone
                  </label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-theme h-5 w-5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 text-primary-theme"
                      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Accent Color */}
              <div>
                <label className="block text-sm font-medium mb-2 text-label-theme flex items-center space-x-1">
                  <HiSparkles className="h-4 w-4" />
                  <span>Primary Branding Color</span>
                </label>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setPrimaryColor(preset.hex)}
                      className="w-8 h-8 rounded-full flex items-center justify-center border hover:scale-110 transition-transform cursor-pointer relative"
                      style={{ backgroundColor: preset.hex, borderColor: 'var(--border)' }}
                      title={preset.name}
                    >
                      {primaryColor === preset.hex && (
                        <HiCheck className="text-white h-4 w-4 drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border rounded-xl cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <input
                    type="text"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="border rounded-xl px-3 py-1.5 focus:outline-none text-xs w-28 text-primary-theme"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="smooth-btn bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                {saving ? 'Saving Config...' : 'Save Branding Settings'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Mock Preview */}
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 border shadow-sm sticky top-24"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6 text-primary-theme">Live Client View Preview</h2>

            <div
              className="rounded-xl border p-5 space-y-4 shadow-md bg-white text-slate-800 text-xs overflow-hidden"
              style={{ borderColor: '#e2e8f0' }}
            >
              {/* Agent Branded Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Mock Logo" className="h-7 max-w-20 object-contain" />
                  ) : (
                    <div className="h-6 w-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                      L
                    </div>
                  )}
                  <span className="font-bold text-slate-900 truncate max-w-[120px]">
                    {agencyName || 'Your Agency Name'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  Exclusive Client Portal
                </span>
              </div>

              {/* Policy mock summary */}
              <div>
                <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wide">Client Summary Report</p>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">Family Health Shield Plus</h3>
                <p className="text-slate-500 text-[10px] mt-0.5">Prepared for: John Doe</p>
              </div>

              {/* Theme highlight test */}
              <div className="p-3.5 rounded-lg border-l-2 space-y-1.5 bg-slate-50" style={{ borderLeftColor: primaryColor }}>
                <p className="font-semibold text-slate-800">1. Coverage Highlight</p>
                <p className="text-slate-500 text-[10px]">Hospitalization charges are 100% covered up to the sum insured limit.</p>
              </div>

              {/* Action Buttons Mock */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button type="button" className="py-2 rounded-lg text-center font-semibold text-white cursor-default" style={{ backgroundColor: primaryColor }}>
                  Download PDF
                </button>
                <div className="py-2 border border-slate-200 rounded-lg text-center font-semibold text-slate-600">
                  Help Desk
                </div>
              </div>

              {/* Contact footer mock */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[9px] text-slate-400">
                <div className="flex items-center space-x-1">
                  <HiOutlinePhone className="flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{phone || 'Phone number'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HiOutlineMail className="flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{email || 'Support Email'}</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-subtle-theme mt-4 leading-relaxed">
              This preview shows how shared summaries appear to clients. Your custom accent color will be applied dynamically to the buttons, alerts, and contact details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
