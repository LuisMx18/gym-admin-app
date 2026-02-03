import { differenceInDays, parseISO, format } from 'date-fns';

export const getMembershipStatus = (endDate) => {
  if (!endDate) return { status: 'inactive', color: '#999', text: 'Sin membresía' };
  
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const today = new Date();
  const daysLeft = differenceInDays(end, today);

  if (daysLeft < 0) {
    return { status: 'expired', color: '#f44336', text: 'Vencida' };
  } else if (daysLeft <= 7) {
    return { status: 'expiring', color: '#ff9800', text: `${daysLeft} días` };
  } else {
    return { status: 'active', color: '#4caf50', text: 'Activa' };
  }
};

export const formatDate = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy');
};
