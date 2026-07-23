import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Header/Navbar';

const TermsAndConditions: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Replace with actual date when deploying
    const effectiveDate = "[Insert Date]";

    return (
        <>
            <Navbar />
            <main className="px-6 md:px-20 py-8 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Title Area */}
                    <div className="mb-16">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                            Terms & Conditions
                        </h1>
                        <p className="text-sm font-medium text-zinc-500 mb-6">
                            Effective Date: {effectiveDate}
                        </p>
                        <p className="text-zinc-500 leading-relaxed">
                            Welcome to VYRAAA. These Terms & Conditions govern your use of our website and the purchase of our products. By accessing or using our website, you agree to be bound by these Terms & Conditions.
                        </p>
                    </div>

                    {/* Terms Sections */}
                    <div className="space-y-12 text-zinc-700">

                        {/* Section 1 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">1. General</h2>
                            <p className="leading-relaxed">
                                VYRAAA reserves the right to modify these Terms & Conditions at any time without prior notice. Changes will become effective immediately upon being posted on our website.
                            </p>
                        </section>

                        {/* Section 3 (Kept original numbering as requested) */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">3. Products</h2>
                            <p className="mb-3">We strive to ensure that all product descriptions, images, pricing, and specifications are accurate. However:</p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                                <li>Product packaging may vary slightly from the images displayed.</li>
                                <li>Fragrance performance may differ based on skin type, weather, humidity, and application.</li>
                                <li>Minor colour variations in bottles or packaging may occur due to manufacturing processes.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">4. Pricing</h2>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                                <li>All prices are listed in Indian Rupees (INR).</li>
                                <li>Prices are inclusive or exclusive of applicable taxes as displayed during checkout.</li>
                                <li>We reserve the right to change prices without prior notice.</li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">5. Orders</h2>
                            <p className="mb-3">We reserve the right to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300 mb-4">
                                <li>Accept or reject any order.</li>
                                <li>Cancel orders due to pricing errors, stock unavailability, suspected fraud, or unforeseen circumstances.</li>
                                <li>Request additional verification before processing an order.</li>
                            </ul>
                            <p className="leading-relaxed">
                                If your order is cancelled after payment, the applicable refund will be processed to your original payment method.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">6. Payments</h2>
                            <p className="leading-relaxed">
                                We accept payments through secure payment gateways. By placing an order, you confirm that the payment information provided is accurate and that you are authorized to use the selected payment method.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">7. Shipping & Delivery</h2>
                            <p className="leading-relaxed">
                                Delivery timelines are estimates and may vary due to courier operations, weather conditions, public holidays, or other circumstances beyond our control. VYRAAA is not responsible for delays caused by third-party logistics providers after the order has been dispatched.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">8. Returns & Refunds</h2>
                            <p className="leading-relaxed">
                                Returns, exchanges, and refunds are governed by our separate Return & Refund Policy. Products that have been opened, used, damaged by the customer, or purchased during clearance or promotional sales may not be eligible for return unless they arrive damaged or incorrect.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">9. Intellectual Property</h2>
                            <p className="mb-3">All content on this website, including but not limited to:</p>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 list-disc pl-5 text-zinc-600 marker:text-zinc-300 mb-4">
                                <li>Brand name</li>
                                <li>Logo</li>
                                <li>Product names</li>
                                <li>Images</li>
                                <li>Graphics</li>
                                <li>Text</li>
                                <li>Website design</li>
                            </ul>
                            <p className="leading-relaxed">
                                is the exclusive property of VYRAAA and may not be copied, reproduced, distributed, or used without prior written permission.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">10. Limitation of Liability</h2>
                            <p className="leading-relaxed mb-3">
                                To the maximum extent permitted by law, VYRAAA shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of our products or website.
                            </p>
                            <p className="leading-relaxed">
                                Customers should always perform a patch test before applying any cosmetic or fragrance product. VYRAAA shall not be responsible for allergic reactions, skin sensitivities, or misuse of products.
                            </p>
                        </section>

                        {/* Section 11 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">11. User Responsibilities</h2>
                            <p className="mb-3">You agree not to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-zinc-300">
                                <li>Use the website for unlawful purposes.</li>
                                <li>Attempt to gain unauthorized access to the website or its systems.</li>
                                <li>Upload malicious software or harmful content.</li>
                                <li>Misrepresent your identity or provide false information.</li>
                            </ul>
                        </section>

                        {/* Section 12 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">12. Privacy</h2>
                            <p className="leading-relaxed">
                                Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
                            </p>
                        </section>

                        {/* Section 13 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">13. Governing Law</h2>
                            <p className="leading-relaxed">
                                These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts in Delhi, India.
                            </p>
                        </section>

                        {/* Section 14 */}
                        <section>
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">14. Contact Information</h2>
                            <p className="mb-4 leading-relaxed">
                                If you have any questions regarding these Terms & Conditions, please contact us:
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
                                Thank you for choosing VYRAAA. We appreciate your trust and look forward to serving you.
                            </p>
                        </section>

                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
};

export default TermsAndConditions;