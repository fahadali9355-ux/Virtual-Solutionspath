export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing Virtual Solution Path (VSP), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. Course Enrollment & Lifetime Access</h2>
            <p>
              When you purchase a course, you get lifetime access to the materials. However, sharing your account credentials with others is strictly prohibited and may result in a ban.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">3. Payments & Refunds</h2>
            <p>
              All payments are verified by our admin team. Once a course is accessed, fees are generally non-refundable unless stated otherwise.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}