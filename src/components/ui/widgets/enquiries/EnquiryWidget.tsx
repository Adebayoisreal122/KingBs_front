import { Link } from 'react-router-dom';
import Widget from '../Widget';
import type { Enquiry } from '@types';

export default function EnquiryWidget({
  enquiries,
}: {
  enquiries: Enquiry[];
}) {
  return (
    <Widget
      title="Enquiry Stream"
      action={
        <Link
          to="/admin/enquiries"
          className="text-brand-400 text-xs"
        >
          Open
        </Link>
      }
    >
      <div className="space-y-3">
        {enquiries.slice(0, 5).map((e) => (
          <div
            key={e._id}
            className="p-3 rounded-xl bg-white/5"
          >
            <div className="text-sm text-white">
              {e.name}
            </div>

            <div className="text-xs text-gray-400">
              {e.carTitle}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}