export const formatDate = (isoString?: string | null): string => {
  if (!isoString) return getLiveFormattedDateTime();
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(date);
  } catch {
    return isoString;
  }
};

export const getLiveFormattedDateTime = (): string => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date());
};

export const formatShortDate = (isoString?: string | null): string => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(date);
  } catch {
    return isoString;
  }
};

export const formatPercent = (val?: number | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  // If val is already a decimal between 0 and 1, multiply by 100
  const normalized = val <= 1 ? val * 100 : val;
  return `${normalized.toFixed(1)}%`;
};

export const getSeverityColor = (severity?: string | null) => {
  const s = (severity || '').toLowerCase();
  if (s.includes('no dr') || s === 'normal') {
    return {
      bg: 'bg-[#EAF8F1]',
      text: 'text-[#249B68]',
      border: 'border-[#A7F3D0]',
      dot: 'bg-[#249B68]',
      label: 'No DR',
    };
  }
  if (s.includes('mild')) {
    return {
      bg: 'bg-[#FFF4E3]',
      text: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
      dot: 'bg-[#F4A340]',
      label: 'Mild DR',
    };
  }
  if (s.includes('moderate')) {
    return {
      bg: 'bg-[#FFF4E3]',
      text: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
      dot: 'bg-[#F4A340]',
      label: 'Moderate DR',
    };
  }
  if (s.includes('severe')) {
    return {
      bg: 'bg-[#FFF0F0]',
      text: 'text-[#D9534F]',
      border: 'border-[#FECACA]',
      dot: 'bg-[#D9534F]',
      label: 'Severe DR',
    };
  }
  if (s.includes('proliferative')) {
    return {
      bg: 'bg-[#FFF0F0]',
      text: 'text-[#D9534F]',
      border: 'border-[#FECACA]',
      dot: 'bg-[#D9534F]',
      label: 'Proliferative DR',
    };
  }
  return {
    bg: 'bg-[#EAF5FF]',
    text: 'text-[#64748B]',
    border: 'border-[#DCE7F2]',
    dot: 'bg-[#64748B]',
    label: severity || 'Pending',
  };
};

export const getQualityBadge = (status?: string | null) => {
  const s = (status || '').toUpperCase();
  if (s === 'GOOD') {
    return {
      bg: 'bg-[#EAF8F1]',
      text: 'text-[#249B68]',
      border: 'border-[#A7F3D0]',
      label: 'GOOD QUALITY',
    };
  }
  return {
    bg: 'bg-[#FFF0F0]',
    text: 'text-[#D9534F]',
    border: 'border-[#FECACA]',
    label: 'POOR QUALITY',
  };
};

export const getPredictionStatusBadge = (status?: string | null) => {
  const s = (status || '').toUpperCase();
  if (s === 'PREDICTED') {
    return {
      bg: 'bg-[#EAF5FF]',
      text: 'text-[#0B4A7A]',
      border: 'border-[#BAE6FD]',
      label: 'PREDICTED',
    };
  }
  if (s === 'UNCERTAIN') {
    return {
      bg: 'bg-[#FFF4E3]',
      text: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
      label: 'UNCERTAIN',
    };
  }
  if (s === 'REJECTED') {
    return {
      bg: 'bg-[#FFF0F0]',
      text: 'text-[#D9534F]',
      border: 'border-[#FECACA]',
      label: 'REJECTED',
    };
  }
  return {
    bg: 'bg-[#EAF5FF]',
    text: 'text-[#64748B]',
    border: 'border-[#DCE7F2]',
    label: status || 'UNKNOWN',
  };
};
