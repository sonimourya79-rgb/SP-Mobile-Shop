const STYLES = {
  // repair statuses
  received: 'bg-navy-100 text-navy-700',
  diagnosing: 'bg-gold-100 text-gold-700',
  'in-progress': 'bg-gold-200 text-gold-700',
  completed: 'bg-green-100 text-green-700',
  delivered: 'bg-green-200 text-green-800',
  // sell-request statuses
  pending: 'bg-navy-100 text-navy-700',
  contacted: 'bg-gold-100 text-gold-700',
  'offer-made': 'bg-gold-200 text-gold-700',
  purchased: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  // order statuses
  confirmed: 'bg-gold-100 text-gold-700',
  ready: 'bg-gold-200 text-gold-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-navy-100 text-navy-700';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
      {status}
    </span>
  );
}
