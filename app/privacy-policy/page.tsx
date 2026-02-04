export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-slate-500 mb-4">Last Updated: February 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. Information We Collect</h2>
            <p>
              When you create an account on Virtual Solution Path (VSP), we collect your name, email address, phone number, and password. We also store payment transaction IDs for course enrollments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your data to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide access to courses and learning materials.</li>
                <li>Verify your identity and payments.</li>
                <li>Send important updates regarding your courses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">3. Data Security</h2>
            <p>
              We prioritize the security of your data. Your passwords are encrypted, and we do not share your personal information with third parties mostly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}