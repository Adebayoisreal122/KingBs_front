import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AxiosError } from 'axios';
import { submitEnquiry } from '../services/api';

type EnquiryType =
  | 'General'
  | 'Test Drive'
  | 'Finance'
  | 'Trade-in';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: EnquiryType;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'General',
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setError('');

    try {
      await submitEnquiry({
        ...form,
        carTitle: 'General Enquiry',
      });

      setSent(true);

      setForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        type: 'General',
      });
    } catch (err: unknown) {
  console.log('Enquiry Error:', err);

  if (err instanceof AxiosError) {
    setError(
      err.response?.data?.message ||
      'Failed to send. Please try again.'
    );
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Failed to send. Please try again.');
  }
    } finally {
      setSending(false);
    }
  };

  const input = 'w-full px-4 py-3 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400';

  const contacts = [
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: '+234 9023 4567 89',
      sub: 'Mon–Fri 8am–7pm',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'kingbsauto@gmail.com',
      sub: 'We reply within 24hrs',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Water cooperation ijora GRA, Lagos',
      sub: 'Visit our showroom',
    },
    {
      icon: <Clock size={20} />,
      label: 'Hours',
      value: 'Mon–Fri: 8am–7pm',
      sub: 'Sat: 9am–6pm · Sun: Closed',
    },
  ];
  const handleTypeChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setForm((prev) => ({
    ...prev,
    type: e.target.value as EnquiryType,
  }));
};

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4" aria-hidden="true">
            <span className="w-6 h-[3px] rounded-full bg-amber-400" />
            <span className="w-6 h-[3px] rounded-full bg-brand-600" />
            <span className="w-2.5 h-[3px] rounded-full bg-slate-300" />
          </div>

          <h1 className="font-display text-5xl font-black text-slate-900 mb-3">
            Get In <span className="text-brand-600">Touch</span>
          </h1>

          <p className="text-slate-500 max-w-xl mx-auto">
            Have a question about a vehicle or need help with financing?
            Our team is ready to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Left */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-black text-slate-900 mb-2">
                We're Here to Help
              </h2>

              <p className="text-slate-500 leading-relaxed">
                Whether you're looking for your first car or upgrading
                to something premium, our experienced team will guide
                you every step of the way.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-brand-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
                    {c.icon}
                  </div>

                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    {c.label}
                  </div>

                  <div className="text-sm font-medium text-slate-900">
                    {c.value}
                  </div>

                  <div className="text-xs text-slate-400 mt-0.5">
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin
                  size={32}
                  className="text-brand-300 mx-auto mb-2"
                />

                <p className="text-slate-500 text-sm">
                  Water cooperation ijora GRA, Lagos
                </p>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 mt-1 inline-block font-semibold"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-display text-2xl font-black text-slate-900 mb-1">
              Send Us a Message
            </h3>

            <p className="text-slate-400 text-sm mb-6">
              We'll respond within 24 hours.
            </p>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2
                    size={32}
                    className="text-emerald-500"
                  />
                </div>

                <h4 className="font-display text-2xl font-black text-slate-900 mb-2">
                  Message Sent!
                </h4>

                <p className="text-slate-400 text-sm mb-6">
                  Our team will be in touch with you soon.
                </p>

                <button
                  onClick={() => {
                    setSent(false);

                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      message: '',
                      type: 'General',
                    });
                  }}
                  className="border border-brand-300 text-brand-600 hover:bg-brand-50 transition-colors px-6 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          name: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      required
                      className={input}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+234..."
                      className={input}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        email: e.target.value,
                      }))
                    }
                    placeholder="john@example.com"
                    required
                    className={input}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                    Enquiry Type
                  </label>

   <select
  value={form.type}
  onChange={handleTypeChange}
  className={input}
>
  <option value="General">General Enquiry</option>
  <option value="Test Drive">Book a Test Drive</option>
  <option value="Finance">Finance Options</option>
  <option value="Trade-in">Trade-In Valuation</option>
</select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Tell us what you're looking for..."
                    required
                    rows={5}
                    className={`${input} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="bg-brand-600 hover:bg-brand-700 transition-colors text-white w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}