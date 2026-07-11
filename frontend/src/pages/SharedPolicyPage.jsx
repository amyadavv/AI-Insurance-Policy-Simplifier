// frontend/src/pages/SharedPolicyPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiDocumentText, HiShieldCheck, HiOutlineMail, HiOutlinePhone, HiDownload, HiExclamationCircle, HiCheckCircle, HiLightBulb } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const SharedPolicyPage = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSharedPolicy = async () => {
    setLoading(true);
    try {
      // Access the public shared endpoint
      const { data } = await axiosInstance.get(`/policy/shared/${id}`);
      if (data.success) {
        setPolicy(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load shared policy details. It may not exist or be private.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedPolicy();
  }, [id]);

  const handleDownloadPDF = () => {
    if (!policy) return;

    const doc = new jsPDF();
    const primaryColor = policy.user?.agencyProfile?.primaryColor || '#3b82f6';
    const agencyName = policy.user?.agencyProfile?.agencyName || 'AIPolicySimplifier Agent';

    // Rgb converter
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 59, g: 130, b: 246 };
    };
    const rgb = hexToRgb(primaryColor);

    // Document styling
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(0, 0, 210, 8, 'F'); // Accent Top Bar

    // Agency Header info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Presented by: ${agencyName}`, 15, 20);
    if (policy.user?.agencyProfile?.email) {
      doc.text(`Contact: ${policy.user.agencyProfile.email} | ${policy.user.agencyProfile.phone || ''}`, 15, 25);
    }

    doc.setDrawColor(226, 232, 240); // border line
    doc.line(15, 28, 195, 28);

    // Title info
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.text(policy.simplifiedSummary?.policyType || 'Insurance Policy Summary', 15, 40);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`File analyzed: ${policy.originalFileName}`, 15, 46);
    if (policy.clientName) {
      doc.text(`Prepared for: ${policy.clientName}`, 15, 52);
    }

    // 1. Overview
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text('Policy Overview', 15, 62);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const overviewLines = doc.splitTextToSize(policy.simplifiedSummary?.overview || 'No overview available.', 180);
    doc.text(overviewLines, 15, 68);

    let yPosition = 68 + (overviewLines.length * 5) + 10;

    // Helper for page breaks
    const checkPageBreak = (needed) => {
      if (yPosition + needed > 275) {
        doc.addPage();
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(0, 0, 210, 8, 'F');
        yPosition = 20;
      }
    };

    // 2. Coverages
    if (policy.simplifiedSummary?.coverage?.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.text('Key Coverages', 15, yPosition);
      yPosition += 8;

      policy.simplifiedSummary.coverage.forEach((cov) => {
        const text = `- ${cov.item}: ${cov.description} ${cov.limit ? `[Limit: ${cov.limit}]` : ''}`;
        const lines = doc.splitTextToSize(text, 180);
        checkPageBreak(lines.length * 5);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(lines, 15, yPosition);
        yPosition += (lines.length * 5) + 2;
      });
      yPosition += 6;
    }

    // 3. Exclusions
    if (policy.simplifiedSummary?.exclusions?.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.text('Important Exclusions', 15, yPosition);
      yPosition += 8;

      policy.simplifiedSummary.exclusions.forEach((excl) => {
        const text = `- ${excl.item}: ${excl.description} [Impact: ${excl.impact}]`;
        const lines = doc.splitTextToSize(text, 180);
        checkPageBreak(lines.length * 5);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(lines, 15, yPosition);
        yPosition += (lines.length * 5) + 2;
      });
      yPosition += 6;
    }

    // 4. Warnings
    if (policy.simplifiedSummary?.warnings?.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68); // Red for warnings
      doc.text('Critical Warnings & Red Flags', 15, yPosition);
      yPosition += 8;

      policy.simplifiedSummary.warnings.forEach((warn) => {
        const text = `- ${warn}`;
        const lines = doc.splitTextToSize(text, 180);
        checkPageBreak(lines.length * 5);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(127, 29, 29); // Dark red
        doc.text(lines, 15, yPosition);
        yPosition += (lines.length * 5) + 2;
      });
    }

    doc.save(`Branded_Summary_${policy.simplifiedSummary?.policyType || 'Report'}.pdf`);
    toast.success('Branded summary PDF downloaded!');
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-theme">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading shared report...</p>
      </div>
    );
  }

  if (!policy || policy.status !== 'completed') {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <HiExclamationCircle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-primary-theme">Summary Unavailable</h2>
        <p className="text-sm text-muted-theme mt-2">
          This policy summary could not be found or is not yet processed by the agent.
        </p>
      </div>
    );
  }

  const agency = policy.user?.agencyProfile || {};
  const primaryColor = agency.primaryColor || '#3b82f6';
  const agencyName = agency.agencyName || 'Insurance Specialist Portal';

  return (
    <div className="min-h-screen bg-page text-primary-theme pb-12">
      {/* Accent Header Line */}
      <div className="h-2 w-full" style={{ backgroundColor: primaryColor }} />

      {/* Agency Branded Hero Bar */}
      <div className="border-b" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            {agency.logoUrl ? (
              <img src={agency.logoUrl} alt={agencyName} className="h-10 max-w-32 object-contain bg-white rounded-lg p-1.5 border" style={{ borderColor: 'var(--border)' }} />
            ) : (
              <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-lg" style={{ backgroundColor: primaryColor }}>
                {agencyName[0]}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-primary-theme leading-none">{agencyName}</h2>
              <p className="text-xs text-muted-theme mt-1">Exclusive Client Consultation Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="smooth-btn inline-flex items-center space-x-1.5 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <HiDownload className="h-4 w-4" />
              <span>Download Branded PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Summary Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        
        {/* Intro */}
        <div className="rounded-2xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <span className="text-xs uppercase font-bold tracking-wide" style={{ color: primaryColor }}>
            Simplified Coverage Summary
          </span>
          <h1 className="text-3xl font-extrabold text-primary-theme mt-1">
            {policy.simplifiedSummary?.policyType || 'Insurance Policy Summary'}
          </h1>
          <p className="text-xs text-subtle-theme mt-1">Report ID: #{policy._id}</p>
          {policy.clientName && (
            <div className="mt-4 p-3.5 rounded-xl bg-primary-500/5 border border-primary-500/10 text-xs">
              <span className="font-semibold text-primary-theme">Prepared For:</span>{' '}
              <span className="font-bold text-primary-theme">{policy.clientName}</span>
              {policy.clientEmail && <span className="text-muted-theme"> ({policy.clientEmail})</span>}
            </div>
          )}
        </div>

        {/* Overview Details */}
        <div className="rounded-2xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold mb-3 flex items-center space-x-2" style={{ color: primaryColor }}>
            <HiLightBulb className="h-5 w-5" />
            <span>AI Overview Analysis</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-theme">
            {policy.simplifiedSummary?.overview || 'No overview available.'}
          </p>
        </div>

        {/* Dynamic Grid: Coverage & Exclusions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coverage */}
          <div className="rounded-2xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-green-500">
              <HiCheckCircle className="h-5 w-5" />
              <span>What is Covered</span>
            </h2>
            <div className="space-y-3.5">
              {policy.simplifiedSummary?.coverage?.map((cov, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
                  <p className="font-semibold text-primary-theme">{cov.item}</p>
                  <p className="text-xs text-muted-theme mt-1 leading-relaxed">{cov.description}</p>
                  {cov.limit && (
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                      Limit: {cov.limit}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="rounded-2xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-red-400">
              <HiExclamationCircle className="h-5 w-5" />
              <span>What is NOT Covered</span>
            </h2>
            <div className="space-y-3.5">
              {policy.simplifiedSummary?.exclusions?.map((excl, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
                  <p className="font-semibold text-primary-theme">{excl.item}</p>
                  <p className="text-xs text-muted-theme mt-1 leading-relaxed">{excl.description}</p>
                  {excl.impact && (
                    <p className="text-[10px] text-red-400 mt-2 font-medium">
                      ⚠️ Claims Warning: {excl.impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warnings & Recommendations */}
        {policy.simplifiedSummary?.warnings?.length > 0 && (
          <div className="rounded-2xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold mb-3 text-red-500 flex items-center space-x-2">
              <HiExclamationCircle className="h-5 w-5" />
              <span>Important Policy Red Flags & Warnings</span>
            </h2>
            <div className="space-y-2">
              {policy.simplifiedSummary.warnings.map((warn, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  <span className="font-bold flex-shrink-0 mt-0.5">•</span>
                  <p className="leading-relaxed">{warn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agency consultation card footer */}
        <div
          className="rounded-2xl p-8 border shadow-md text-center space-y-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div>
            <h2 className="text-xl font-bold text-primary-theme">Questions About Your Summary?</h2>
            <p className="text-sm text-muted-theme mt-1">Get in touch directly with our agency specialists.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-primary-theme">
            {agency.phone && (
              <a href={`tel:${agency.phone}`} className="flex items-center space-x-2 hover:opacity-85 transition-opacity">
                <div className="p-2.5 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <HiOutlinePhone className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <span className="font-semibold">{agency.phone}</span>
              </a>
            )}
            {agency.email && (
              <a href={`mailto:${agency.email}`} className="flex items-center space-x-2 hover:opacity-85 transition-opacity">
                <div className="p-2.5 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <HiOutlineMail className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <span className="font-semibold">{agency.email}</span>
              </a>
            )}
          </div>
          
          <div className="pt-2 text-xs text-subtle-theme">
            © {new Date().getFullYear()} {agencyName}. Securely processed by AIPolicySimplifier.
          </div>
        </div>

      </div>
    </div>
  );
};

export default SharedPolicyPage;
