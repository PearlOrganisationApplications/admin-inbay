import {
  FaHardHat,
  FaUserShield,
  FaBuilding,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">

      {/* Page Title */}
      <h1 className="flex items-center gap-3 text-4xl font-bold text-gray-800">
        <FaShieldAlt className="text-purple-600 text-3xl" />
        Privacy Policy
      </h1>

      {/* Intro */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Triveni Connect
        </h2>

        <p className="text-lg text-gray-500 leading-8">
          Triveni Connect is a smart workforce management app designed for
          businesses to track and manage their field workers and clients in real-time.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Workers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-600 mb-4">
            <FaHardHat />
            For Workers
          </h3>

          <ul className="text-lg text-gray-600 space-y-3 leading-7">
            <li>• Share live location with manager</li>
            <li>• Submit daily work reports</li>
            <li>• Stay connected with your team</li>
          </ul>
        </div>

        {/* Managers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-600 mb-4">
            <FaUserShield />
            For Managers
          </h3>

          <ul className="text-lg text-gray-600 space-y-3 leading-7">
            <li>• Monitor worker activity in real-time</li>
            <li>• Access and review reports</li>
            <li>• Verify client visits</li>
            <li>• Manage entire field team</li>
          </ul>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-600 mb-4">
            <FaBuilding />
            For Clients
          </h3>

          <ul className="text-lg text-gray-600 space-y-3 leading-7">
            <li>• Receive service updates</li>
            <li>• Track assigned worker</li>
          </ul>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-gray-100 p-8 space-y-4">
        <p className="text-lg text-gray-600 leading-8">
          Whether you're managing a small team or a large field workforce,
          Triveni Connect keeps everyone connected, accountable, and productive.
        </p>

        <p className="text-lg font-semibold text-gray-800">
          Track & manage field workers with real-time location and reports.
        </p>
      </div>

      {/* Get In Touch */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        <h2 className="text-2xl font-semibold text-gray-800">
          Get In Touch
        </h2>

        <p className="text-lg text-gray-500 leading-8">
          Reach out to the Triveni team for personalized support, product inquiries,
          or partnership opportunities.
        </p>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">

          <div className="flex items-start gap-3">
            <FaPhone className="text-purple-600 mt-1" />
            <span>+91-9216139713</span>
          </div>

          <div className="flex items-start gap-3">
            <FaEnvelope className="text-purple-600 mt-1" />
            <span>info@trivenichemicals.co.in</span>
          </div>

          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-purple-600 mt-1" />
            <span>Head Office, New Delhi, INDIA</span>
          </div>
        </div>

        {/* Offices */}
        <div className="text-lg text-gray-600 space-y-3 leading-8">

          <p><strong>Head Office:</strong> 401-B, IV th Floor, Usha Kiran Building, Azadpur Commercial Complex, New Delhi-110033 INDIA</p>

          <p><strong>Admin Office:</strong> SCO-3, Sector-60, Mohali-160059 INDIA</p>

          <p><strong>Unit 1:</strong> C-63 to 65, Industrial Area, Kotlapura-151204 (Punjab) INDIA</p>

          <p><strong>Unit 2:</strong> IGC Phase-1, Samba-184121 (J&K) INDIA</p>
        </div>

        {/* 🌐 Website CTA */}
        <div className="pt-4">
          <a
            href="https://trivenichemicals.co.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold text-lg hover:underline"
          >
            Visit Official Website →
          </a>
        </div>
      </div>

    </div>
  );
}