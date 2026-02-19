export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 text-slate-700">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
        <p className="text-slate-500 mt-2">Last Updated: February 2026</p>
      </div>

      {/* Content */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">1. What Are Cookies?</h2>
        <p className="leading-relaxed">
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
          They are widely used to make websites work more efficiently and to provide information to the owners of the site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">2. How We Use Cookies</h2>
        <p className="leading-relaxed">
          We use cookies to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Keep you signed in to your account.</li>
          <li>Understand how you use our website to improve your experience.</li>
          <li>Remember your preferences and settings.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">3. Types of Cookies We Use</h2>
        <div className="space-y-3">
          <div>
            <span className="font-bold text-slate-900 block">Essential Cookies:</span>
            <span className="text-sm">Necessary for the website to function correctly (e.g., login sessions).</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Analytics Cookies:</span>
            <span className="text-sm">Help us analyze visitor traffic and behavior.</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">4. Managing Cookies</h2>
        <p className="leading-relaxed">
          Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, 
          you may worsen your overall user experience, since it will no longer be personalized to you.
        </p>
      </section>

      <section className="space-y-4 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          If you have any questions about our use of cookies, please contact us at <span className="font-bold text-slate-700">support@vsp.com</span>.
        </p>
      </section>

    </div>
  );
}