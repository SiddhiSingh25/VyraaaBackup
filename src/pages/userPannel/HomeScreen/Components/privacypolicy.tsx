import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Header/Navbar';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Navbar />

      {/* Main Content */}
      <main className="  py-6 md:py-8  hidden lg:flex items-center justify-between px-8 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Title Area */}
          <div className="mb-16">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-zinc-500 leading-relaxed">
              Welcome to VYRAAA. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our products.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12 text-zinc-700">

            {/* Section 1 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">1. Information We Collect</h2>
              <p className="mb-3">When you use our website, we may collect the following information:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                <li>Full name</li>
                <li>Email address</li>
                <li>Mobile number</li>
                <li>Billing and shipping address</li>
                <li>Payment details (processed securely through trusted payment gateways; we do not store your card information)</li>
                <li>Order history</li>
                <li>IP address</li>
                <li>Browser and device information</li>
                <li>Cookies and website usage data</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">2. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                <li>Process and deliver your orders</li>
                <li>Provide customer support</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Improve our website, products, and services</li>
                <li>Detect and prevent fraud</li>
                <li>Send promotional offers, newsletters, and marketing communications (only where permitted by law or with your consent)</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">3. Payment Security</h2>
              <p className="leading-relaxed">
                Payments made on our website are processed by secure third-party payment providers. We do not store or have access to your debit card, credit card, or banking credentials.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">4. Sharing of Information</h2>
              <p className="mb-3">
                We do not sell or rent your personal information. We may share your information only with trusted third parties such as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300 mb-4">
                <li>Payment service providers</li>
                <li>Courier and logistics partners</li>
                <li>Website hosting providers</li>
                <li>Analytics and marketing service providers</li>
                <li>Government authorities where required by law</li>
              </ul>
              <p className="leading-relaxed">
                These third parties are required to protect your information.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">5. Cookies</h2>
              <p className="mb-3">Our website uses cookies to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300 mb-4">
                <li>Improve your browsing experience</li>
                <li>Remember your preferences</li>
                <li>Analyze website traffic</li>
                <li>Enhance website performance</li>
              </ul>
              <p className="leading-relaxed">
                You may disable cookies through your browser settings, although some website features may not function properly.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">6. Data Security</h2>
              <p className="leading-relaxed">
                We use reasonable administrative, technical, and physical safeguards to protect your personal information against unauthorized access, misuse, alteration, or disclosure. However, no method of internet transmission or electronic storage is completely secure.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">7. Your Rights</h2>
              <p className="mb-3">You may request to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Update your details</li>
                <li>Delete your personal information, where applicable</li>
                <li>Opt out of promotional emails or messages at any time</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page along with the updated Effective Date.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-lg font-medium text-zinc-900 mb-4">9. Contact Us</h2>
              <p className="mb-4 leading-relaxed">
                If you have any questions or concerns regarding this Privacy Policy, please contact us:
              </p>

              <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-6 mb-8 text-sm">
                <p className="font-medium text-zinc-900 mb-2">VYRAAA</p>
                <div className="space-y-2 text-zinc-600">
                  <p><span className="font-medium text-zinc-800">Email:</span> <a href="mailto:support@vyraaa.com" className="hover:text-zinc-900 hover:underline underline-offset-4 transition-all">support@vyraaa.com</a></p>
                  <p><span className="font-medium text-zinc-800">Website:</span> <a href="https://www.vyraaa.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 hover:underline underline-offset-4 transition-all">www.vyraaa.com</a></p>
                  <p><span className="font-medium text-zinc-800">Customer Support:</span> 8796571232</p>
                </div>
              </div>

              <p className="font-medium text-zinc-900">
                Thank you for choosing VYRAAA. We appreciate your trust and are committed to protecting your privacy.
              </p>
            </section>

          </div>
        </motion.div>
      </main>


      <Footer />
    </>
  );
};

export default PrivacyPolicy;