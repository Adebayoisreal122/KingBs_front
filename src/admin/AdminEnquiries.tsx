import { useState, useEffect } from 'react';
import { fetchEnquiries, markEnquiryRead, deleteEnquiry } from '../services/api';
import { MessageSquare, Trash2, CheckCheck, Loader2, Mail, Phone, Car } from 'lucide-react';
import type { Enquiry } from '../types';

const typeColors: Record<string, string> = {
  'General': 'bg-blue-500/15 text-blue-400',
  'Test Drive': 'bg-green-500/15 text-green-400',
  'Finance': 'bg-yellow-500/15 text-yellow-400',
  'Trade-in': 'bg-purple-500/15 text-purple-400',
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchEnquiries()
      .then(r => { setEnquiries(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    setActionId(id);
    try {
      await markEnquiryRead(id);
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, isRead: true } : e));
    } catch (error: unknown) {
  console.error(error);

  alert(
    error instanceof Error
      ? error.message
      : 'Failed'
  );
}
    finally { setActionId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    setActionId(id + '-d');
    try {
      await deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } catch (error: unknown) {
  console.error(error);

  alert(
    error instanceof Error
      ? error.message
      : 'Failed'
  );
}
    finally { setActionId(null); }
  };

  const displayed = enquiries.filter(e =>
    filter === 'all' ? true : filter === 'unread' ? !e.isRead : e.isRead
  );

  const unreadCount = enquiries.filter(e => !e.isRead).length;
  const card = 'glass rounded-2xl border border-white/8';

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={28} className="animate-spin text-brand-400" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-black text-white">Enquiries</h2>
        <p className="text-sm text-gray-400 mt-1">{enquiries.length} total · {unreadCount} unread</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {([
          { label: `All (${enquiries.length})`, value: 'all' },
          { label: `Unread (${unreadCount})`, value: 'unread' },
          { label: `Read (${enquiries.length - unreadCount})`, value: 'read' },
        ] as const).map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${filter === tab.value ? 'btn-brand' : 'border border-white/15 text-gray-400 hover:border-brand-500/40 hover:text-brand-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className={`${card} p-6 text-center py-16`}>
          <MessageSquare size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No enquiries here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(e => (
            <div key={e._id} className={`${card} p-5 transition-colors
              ${!e.isRead ? 'border-brand-500/20 bg-brand-500/3' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Unread dot */}
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!e.isRead ? 'bg-brand-400' : 'bg-transparent'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold text-white text-sm">{e.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[e.type] || 'bg-gray-500/15 text-gray-400'}`}>
                        {e.type}
                      </span>
                      {!e.isRead && <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full">New</span>}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Car size={11} className= "text-brand-400" /> {e.type}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                      {e.email && <span className="flex items-center gap-1"><Mail size={11} className="text-brand-400" />{e.email}</span>}
                      {e.phone && <span className="flex items-center gap-1"><Phone size={11} className="text-brand-400" />{e.phone}</span>}
                      <span className="ml-auto">{new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {e.message && (
                      <p className="text-sm text-gray-300 leading-relaxed bg-white/3 rounded-xl px-3 py-2.5">
                        {e.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!e.isRead && (
                    <button onClick={() => handleMarkRead(e._id)} disabled={actionId === e._id}
                      className="p-2 rounded-xl text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40" title="Mark as read">
                      {actionId === e._id ? <Loader2 size={15} className="animate-spin" /> : <CheckCheck size={15} />}
                    </button>
                  )}
                  <a href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.carTitle)}`}
                    className="p-2 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors" title="Reply via email">
                    <Mail size={15} />
                  </a>
                  <button onClick={() => handleDelete(e._id)} disabled={actionId === e._id + '-d'}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40" title="Delete">
                    {actionId === e._id + '-d' ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scripture-style footer for the dealer */}
      <div className="p-5 rounded-2xl border border-brand-500/15 bg-brand-500/5">
        <p className="text-sm italic text-gray-400">
          💡 <strong className="text-gray-300">Tip:</strong> Click the mail icon to reply directly to a customer's email. Always respond within 24 hours to maximise conversion.
        </p>
      </div>
    </div>
  );
}
