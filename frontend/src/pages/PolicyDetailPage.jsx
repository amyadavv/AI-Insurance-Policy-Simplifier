// frontend/src/pages/PolicyDetailPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamation,
  HiArrowLeft,
  HiBookmark,
  HiTrash,
  HiLightBulb,
  HiShieldCheck,
  HiClipboardList,
  HiPrinter,
  HiShare,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import toast from 'react-hot-toast';

const SectionTitle = ({ icon, title, color }) => (
  <div className="flex items-center space-x-3 mb-4">
    <div className={`${color} p-2 rounded-lg`}>{icon}</div>
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

const PolicyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPolicy, fetchPolicyById, loading, deletePolicy, toggleBookmark } =
    usePolicy();
  const { user } = useAuth();
  const [whiteLabelPreview, setWhiteLabelPreview] = useState(false);

  useEffect(() => {
    fetchPolicyById(id);
  }, [id]);

  const handleDownloadPDF = async () => {
    toast.loading('Generating PDF report...', { id: 'pdf-toast' });
    try {
      // Lazy load jsPDF to prevent bloat on initial page load
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pageHeight = 297;
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;

      const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = 20;
          return true;
        }
        return false;
      };

      // Styling parameters
      const isBranded = whiteLabelPreview && user?.agencyProfile;
      const agency = user?.agencyProfile || {};
      const primaryHex = isBranded ? agency.primaryColor : '#3b82f6';
      
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [59, 130, 246];
      };
      const rgb = hexToRgb(primaryHex);

      const titleColor = [30, 41, 59]; // Slate 800
      const textColor = [51, 65, 85]; // Slate 700
      const lightGray = [241, 245, 249]; // Slate 100

      // Accent Top Bar
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.rect(0, 0, pageWidth, 6, 'F');

      // Branded Header block
      if (isBranded) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Presented by: ${agency.agencyName || 'Insurance Agent'}`, margin, y);
        if (agency.email || agency.phone) {
          doc.text(`Contact: ${agency.email || ''} | ${agency.phone || ''}`, margin, y + 5);
        }
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 8, pageWidth - margin, y + 8);
        y += 16;
      }

      // Title Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
      
      const titleLines = doc.splitTextToSize(selectedPolicy.originalFileName || 'Insurance Policy', contentWidth);
      doc.text(titleLines, margin, y);
      y += (titleLines.length * 8) + 2;

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`${summary?.policyType || 'Insurance Policy'} • ${isBranded ? 'Branded Client Report' : `Generated on ${new Date().toLocaleDateString()}`}`, margin, y);
      y += 8;

      // Divider
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // 1. Overview Section
      if (summary?.overview) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.text('Policy Overview', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        
        const overviewLines = doc.splitTextToSize(summary.overview, contentWidth);
        doc.text(overviewLines, margin, y);
        y += (overviewLines.length * 5.5) + 8;
      }

      // 2. Key Numbers (Grid box style)
      const hasKeyNumbers = summary?.keyNumbers && Object.values(summary.keyNumbers).some(
        val => val && val !== 'Not specified in the document'
      );

      if (hasKeyNumbers) {
        checkPageBreak(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.text('Key Numbers', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        const colWidth = contentWidth / 4;
        const boxHeight = 15;
        let x = margin;
        
        Object.entries(summary.keyNumbers).forEach(([key, value]) => {
          if (value && value !== 'Not specified in the document') {
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
            doc.rect(x, y, colWidth - 2, boxHeight, 'F');
            
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(148, 163, 184); // Slate 400
            const cleanKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
            doc.text(cleanKey, x + 3, y + 5);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(value.toString(), x + 3, y + 11);
            
            x += colWidth;
          }
        });
        y += boxHeight + 10;
      }

      // 3. What's Covered Section
      if (summary?.coverage?.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(34, 197, 94); // Green 500
        doc.text("What's Covered", margin, y);
        y += 6;

        summary.coverage.forEach((item) => {
          const itemTitle = `${item.item}${item.limit ? ` (Limit: ${item.limit})` : ''}`;
          const titleLines = doc.splitTextToSize(itemTitle, contentWidth - 5);
          const descLines = doc.splitTextToSize(item.description || '', contentWidth - 5);
          const blockHeight = (titleLines.length * 5) + (descLines.length * 4.5) + 6;

          checkPageBreak(blockHeight);

          doc.setFillColor(34, 197, 94);
          doc.rect(margin, y + 1, 2, 2, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
          doc.text(titleLines, margin + 5, y + 3);
          y += (titleLines.length * 5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(descLines, margin + 5, y + 1.5);
          y += (descLines.length * 4.5) + 4;
        });
        y += 4;
      }

      // 4. Exclusions Section
      if (summary?.exclusions?.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(239, 68, 68); // Red 500
        doc.text("What's NOT Covered", margin, y);
        y += 6;

        summary.exclusions.forEach((item) => {
          const itemTitle = item.item || '';
          const descText = `${item.description || ''}${item.impact ? ` (Impact: ${item.impact})` : ''}`;
          
          const titleLines = doc.splitTextToSize(itemTitle, contentWidth - 5);
          const descLines = doc.splitTextToSize(descText, contentWidth - 5);
          const blockHeight = (titleLines.length * 5) + (descLines.length * 4.5) + 6;

          checkPageBreak(blockHeight);

          doc.setFillColor(239, 68, 68);
          doc.rect(margin, y + 1, 2, 2, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
          doc.text(titleLines, margin + 5, y + 3);
          y += (titleLines.length * 5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(descLines, margin + 5, y + 1.5);
          y += (descLines.length * 4.5) + 4;
        });
        y += 4;
      }

      // 5. Conditions Section
      if (summary?.conditions?.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(234, 179, 8); // Yellow 500
        doc.text("Key Conditions", margin, y);
        y += 6;

        summary.conditions.forEach((item) => {
          const itemTitle = `${item.condition || ''} [Importance: ${item.importance || 'medium'}]`;
          const titleLines = doc.splitTextToSize(itemTitle, contentWidth - 5);
          const descLines = doc.splitTextToSize(item.explanation || '', contentWidth - 5);
          const blockHeight = (titleLines.length * 5) + (descLines.length * 4.5) + 6;

          checkPageBreak(blockHeight);

          doc.setFillColor(234, 179, 8);
          doc.rect(margin, y + 1, 2, 2, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
          doc.text(titleLines, margin + 5, y + 3);
          y += (titleLines.length * 5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(descLines, margin + 5, y + 1.5);
          y += (descLines.length * 4.5) + 4;
        });
        y += 4;
      }

      // 6. Claim Process Section
      if (summary?.claimProcess) {
        const claimLines = doc.splitTextToSize(summary.claimProcess, contentWidth);
        const blockHeight = (claimLines.length * 5.5) + 15;

        checkPageBreak(blockHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(14, 165, 233); // Sky 500
        doc.text('Claim Filing Process', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(claimLines, margin, y);
        y += (claimLines.length * 5.5) + 8;
      }

      // 7. Warnings
      if (summary?.warnings?.length > 0) {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(239, 68, 68); // Red 500
        doc.text('Important Warnings', margin, y);
        y += 6;

        summary.warnings.forEach((warning) => {
          const bulletWarning = `- ${warning}`;
          const lines = doc.splitTextToSize(bulletWarning, contentWidth);
          checkPageBreak((lines.length * 5) + 3);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(185, 28, 28);
          doc.text(lines, margin, y);
          y += (lines.length * 5) + 2;
        });
        y += 4;
      }

      // 8. AI Recommendations
      if (summary?.recommendations?.length > 0) {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(14, 165, 233); // Sky 500
        doc.text('AI Recommendations', margin, y);
        y += 6;

        summary.recommendations.forEach((rec) => {
          const bulletRec = `- ${rec}`;
          const lines = doc.splitTextToSize(bulletRec, contentWidth);
          checkPageBreak((lines.length * 5) + 3);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(lines, margin, y);
          y += (lines.length * 5) + 2;
        });
        y += 4;
      }

      // Save PDF document
      const cleanFileName = selectedPolicy.originalFileName.replace(/\.[^/.]+$/, "");
      doc.save(`${cleanFileName}_Simplified_Summary.pdf`);
      toast.success('PDF report downloaded successfully!', { id: 'pdf-toast' });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-toast' });
    }
  };

  const handleShareLink = () => {
    if (!selectedPolicy) return;
    const shareUrl = `${window.location.origin}/shared/policy/${selectedPolicy._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Branded public shared client link copied!');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      const success = await deletePolicy(id);
      if (success) navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!selectedPolicy) {
    return (
      <div className="text-center py-20 text-slate-400">Policy not found</div>
    );
  }

  const summary = selectedPolicy.simplifiedSummary;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <HiArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {selectedPolicy.originalFileName}
            </h1>
            <p className="text-slate-400 text-sm">
              {summary?.policyType || 'Insurance Policy'} •{' '}
              {new Date(selectedPolicy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Share branded link (only if white-labeled) */}
          {selectedPolicy.isWhiteLabeled && (
            <button
              onClick={handleShareLink}
              className="smooth-btn p-2 rounded-lg bg-dark-100 text-slate-400 hover:text-green-400 transition-colors cursor-pointer border border-transparent"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              title="Copy Client Sharing Link"
            >
              <HiShare className="h-5 w-5" />
            </button>
          )}

          {/* Toggle brand preview (only for agents) */}
          {user?.isAgent && (
            <button
              onClick={() => setWhiteLabelPreview(!whiteLabelPreview)}
              className={`smooth-btn p-2 rounded-lg transition-colors cursor-pointer border ${
                whiteLabelPreview 
                  ? 'bg-primary-600/10 text-primary-400 border-primary-500/30' 
                  : 'bg-dark-100 text-slate-400 hover:text-primary-400 border-transparent'
              }`}
              style={!whiteLabelPreview ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' } : {}}
              title={whiteLabelPreview ? 'Disable Branding View' : 'Preview Client Branding'}
            >
              {whiteLabelPreview ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="smooth-btn p-2 rounded-lg bg-dark-100 text-slate-400 hover:text-primary-400 transition-colors cursor-pointer border border-transparent"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            title="Download PDF Summary"
          >
            <HiPrinter className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleBookmark(id)}
            className={`smooth-btn p-2 rounded-lg transition-colors cursor-pointer border border-transparent ${
              selectedPolicy.isBookmarked
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-dark-100 text-slate-400 hover:text-yellow-400'
            }`}
            style={!selectedPolicy.isBookmarked ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' } : {}}
          >
            <HiBookmark className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="smooth-btn p-2 rounded-lg bg-dark-100 text-slate-400 hover:text-red-400 transition-colors cursor-pointer border border-transparent"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* White Label Banner */}
      {whiteLabelPreview && user?.agencyProfile && (
        <div
          className="rounded-2xl p-5 mb-6 border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-3 text-center sm:text-left">
            {user.agencyProfile.logoUrl ? (
              <img
                src={user.agencyProfile.logoUrl}
                alt={user.agencyProfile.agencyName}
                className="h-9 max-w-24 object-contain bg-white rounded p-1 border"
                style={{ borderColor: 'var(--border)' }}
              />
            ) : (
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: user.agencyProfile.primaryColor || '#3b82f6' }}
              >
                {user.agencyProfile.agencyName?.[0] || 'A'}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-primary-theme">
                {user.agencyProfile.agencyName || 'Your Agency Name'}
              </p>
              <p className="text-xs text-muted-theme mt-0.5">Exclusive Agent White-Label Preview Mode</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-white px-3 py-1 rounded-full" style={{ backgroundColor: user.agencyProfile.primaryColor || '#3b82f6' }}>
            Branded Link Sharing Active
          </div>
        </div>
      )}

      {/* Overview */}
      {summary?.overview && (
        <div className="bg-gradient-to-br from-primary-900/30 to-dark-100 border border-primary-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiShieldCheck className="h-5 w-5 text-primary-400" />}
            title="Policy Overview"
            color="bg-primary-500/10"
          />
          <p className="text-slate-300 leading-relaxed">{summary.overview}</p>
        </div>
      )}

      {/* Key Numbers */}
      {summary?.keyNumbers && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(summary.keyNumbers).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="bg-dark-100 border border-slate-800 rounded-xl p-4 text-center"
                >
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                </div>
              )
          )}
        </div>
      )}

      {/* Coverage */}
      {summary?.coverage?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiCheckCircle className="h-5 w-5 text-green-400" />}
            title="What's Covered"
            color="bg-green-500/10"
          />
          <div className="space-y-4">
            {summary.coverage.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-green-500/50 pl-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-green-400">{item.item}</h3>
                  {item.limit && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
                      {item.limit}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exclusions */}
      {summary?.exclusions?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiXCircle className="h-5 w-5 text-red-400" />}
            title="What's NOT Covered"
            color="bg-red-500/10"
          />
          <div className="space-y-4">
            {summary.exclusions.map((item, index) => (
              <div key={index} className="border-l-2 border-red-500/50 pl-4">
                <h3 className="font-semibold text-red-400">{item.item}</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {item.description}
                </p>
                {item.impact && (
                  <p className="text-red-400/70 text-xs mt-1 italic">
                    ⚠️ Impact: {item.impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions */}
      {summary?.conditions?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={
              <HiExclamation className="h-5 w-5 text-yellow-400" />
            }
            title="Key Conditions"
            color="bg-yellow-500/10"
          />
          <div className="space-y-4">
            {summary.conditions.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-yellow-500/50 pl-4"
              >
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-yellow-400">
                    {item.condition}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      item.importance === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : item.importance === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : item.importance === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Process */}
      {summary?.claimProcess && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiClipboardList className="h-5 w-5 text-blue-400" />}
            title="How to File a Claim"
            color="bg-blue-500/10"
          />
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {summary.claimProcess}
          </p>
        </div>
      )}

      {/* Warnings */}
      {summary?.warnings?.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={
              <HiExclamation className="h-5 w-5 text-red-400" />
            }
            title="⚠️ Important Warnings"
            color="bg-red-500/10"
          />
          <ul className="space-y-2">
            {summary.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-red-300 text-sm"
              >
                <span className="mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {summary?.recommendations?.length > 0 && (
        <div className="bg-accent-700/5 border border-accent-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiLightBulb className="h-5 w-5 text-accent-400" />}
            title="💡 AI Recommendations"
            color="bg-accent-500/10"
          />
          <ul className="space-y-2">
            {summary.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-accent-300 text-sm"
              >
                <span className="mt-1">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PolicyDetailPage;
