export const dynamic = 'force-dynamic';

import Link from "next/link";

const LAST_UPDATED = "March 4, 2026";

const TOC = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "eligibility", label: "Eligibility" },
    { id: "accounts", label: "Account Security" },
    { id: "conduct", label: "User Conduct in Peer Forum" },
    { id: "disclaimer", label: "Disclaimer of Medical Advice" },
    { id: "counsellors", label: "Counsellor Guidelines" },
    { id: "content", label: "Your Content" },
    { id: "intellectual", label: "Intellectual Property" },
    { id: "termination", label: "Account Termination" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "governing", label: "Governing Law" },
    { id: "contact", label: "Contact" },
];

export const metadata = {
    title: "Terms of Service — PsyConnect",
    description: "The terms governing your use of the PsyConnect student mental health platform.",
};

export default function TermsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="mb-10 border-b border-gray-200 pb-8">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Legal Document</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
                    Terms of Service
                </h1>
                <p className="text-gray-500 text-base">
                    Last Updated: <span className="font-semibold text-gray-700">{LAST_UPDATED}</span>
                </p>
                <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                    Please read these Terms of Service carefully before using PsyConnect. By creating an account
                    or accessing any feature of this platform, you agree to be bound by these terms.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* ── ToC Sidebar ── */}
                <aside className="lg:w-60 flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contents</p>
                        <nav className="space-y-1">
                            {TOC.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="block text-sm text-gray-600 hover:text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors font-medium"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* ── Content ── */}
                <article className="flex-1 min-w-0 prose prose-gray prose-lg max-w-none">

                    <Section id="acceptance" title="1. Acceptance of Terms">
                        <p>
                            By accessing or using PsyConnect (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you confirm that you are at least 16 years of age, have read and understood these Terms, and agree to be legally bound by them. If you are under 18, you represent that a parent or guardian has reviewed and consented to these Terms on your behalf.
                        </p>
                    </Section>

                    <Section id="eligibility" title="2. Eligibility">
                        <p>PsyConnect is designed primarily for:</p>
                        <ul>
                            <li><strong>Students</strong> currently enrolled at a recognised educational institution.</li>
                            <li><strong>Counsellors</strong> who are licensed or supervised mental health professionals affiliated with a university.</li>
                            <li><strong>Administrators</strong> managing the platform on behalf of an institution.</li>
                        </ul>
                        <p>
                            We reserve the right to verify your eligibility at any time and to suspend accounts that do not meet these criteria without notice.
                        </p>
                    </Section>

                    <Section id="accounts" title="3. Account Security">
                        <ul>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>Do not share your password with anyone, including other PsyConnect users.</li>
                            <li>You must notify us immediately at <a href="mailto:security@psyconnect.edu">security@psyconnect.edu</a> if you suspect unauthorised access to your account.</li>
                            <li>Do not attempt to access another user&apos;s account, messages, or private data by any means.</li>
                            <li>PsyConnect will never ask for your password via email, chat, or phone.</li>
                        </ul>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl not-prose">
                            <p className="text-blue-800 text-sm font-semibold">Security Tip</p>
                            <p className="text-blue-700 text-sm mt-1">Use a unique password for PsyConnect that you don&apos;t use on any other website. Enable two-factor authentication when we launch this feature.</p>
                        </div>
                    </Section>

                    <Section id="conduct" title="4. User Conduct in the Peer Forum">
                        <p>The Peer Forum is a moderated safe space. You agree to the following code of conduct:</p>
                        <h4>You MUST:</h4>
                        <ul>
                            <li>Treat all community members with dignity, empathy, and respect.</li>
                            <li>Disclose if you are sharing personal experience so others can context-switch appropriately.</li>
                            <li>Report posts that violate these Terms using the report button.</li>
                        </ul>
                        <h4>You MUST NOT:</h4>
                        <ul>
                            <li>Share content that is hateful, discriminatory, violent, or sexually explicit.</li>
                            <li>Bully, harass, threaten, or intimidate any other user.</li>
                            <li>Share or solicit personally identifiable information of other users without consent.</li>
                            <li>Impersonate a mental health professional if you are not one.</li>
                            <li>Post spam, advertisements, or unsolicited self-promotion.</li>
                            <li>Share content that glorifies or instructs self-harm or suicide. Refer users in crisis to our <Link href="/crisis" className="text-red-600 font-semibold">Crisis Hotline</Link> instead.</li>
                            <li>Distribute malware, phishing links, or deceptive content.</li>
                        </ul>
                        <p>
                            Violations may result in content removal, temporary suspension, or permanent account termination at our sole discretion. Severe violations involving safety risks may be reported to university administration or law enforcement.
                        </p>
                    </Section>

                    <Section id="disclaimer" title="5. Disclaimer of Medical Advice">
                        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl not-prose mb-4">
                            <p className="text-red-800 font-bold text-base">⚠️ Important Medical Disclaimer</p>
                            <p className="text-red-700 text-sm mt-2 leading-relaxed">
                                PsyConnect is a <strong>peer support and resource platform</strong>. It is <strong>not a medical service</strong> and does not provide medical advice, diagnosis, or treatment.
                            </p>
                        </div>
                        <ul>
                            <li>Content shared by peers, mentors, and even counsellors on this platform does not constitute a clinical diagnosis or treatment plan.</li>
                            <li>The AI mood-detection and stress-prediction features are wellness tools only — they are not diagnostic instruments and should not replace professional clinical assessment.</li>
                            <li>If you are experiencing a mental health emergency, please call emergency services (112 / 911) or visit our <Link href="/crisis" className="text-red-600 font-semibold">Crisis Hotline page</Link> immediately.</li>
                            <li>Always consult a qualified mental health professional for clinical concerns. PsyConnect facilitates access to counsellors but does not guarantee their availability for clinical emergencies.</li>
                        </ul>
                    </Section>

                    <Section id="counsellors" title="6. Counsellor Guidelines">
                        <p>Users with the Counsellor role agree to additional obligations:</p>
                        <ul>
                            <li>You confirm you hold a valid, current practising licence or are under recognised clinical supervision.</li>
                            <li>You will not use PsyConnect to solicit private clients outside the platform.</li>
                            <li>You will maintain appropriate professional boundaries in all student interactions.</li>
                            <li>You will adhere to your professional body&apos;s code of ethics at all times.</li>
                            <li>You will report any safeguarding concern to the relevant institution or authority immediately.</li>
                        </ul>
                    </Section>

                    <Section id="content" title="7. Your Content">
                        <p>
                            By posting content (forum posts, messages, profile information) on PsyConnect, you grant us a non-exclusive, royalty-free licence to store, display, and distribute that content solely for the purposes of operating the platform. You retain full ownership of your content.
                        </p>
                        <p>
                            You represent that you have the right to post all content you submit and that it does not infringe any third-party intellectual property rights.
                        </p>
                    </Section>

                    <Section id="intellectual" title="8. Intellectual Property">
                        <p>
                            All Platform code, design, branding, and original content (excluding user-generated content) is the intellectual property of PsyConnect. You may not reproduce, distribute, or create derivative works from Platform materials without written permission.
                        </p>
                    </Section>

                    <Section id="termination" title="9. Account Termination">
                        <p>
                            You may delete your account at any time from your profile settings. We may suspend or permanently terminate your account for violations of these Terms, with or without notice, depending on severity. Upon termination, your access to the platform ceases immediately, and your data is handled in accordance with our{" "}
                            <Link href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
                        </p>
                    </Section>

                    <Section id="liability" title="10. Limitation of Liability">
                        <p>
                            To the maximum extent permitted by applicable law, PsyConnect and its operators, contributors, and affiliated institutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Platform.
                        </p>
                        <p>
                            Our total liability for any claim arising from these Terms or your use of the Platform shall not exceed the amount you paid to use the Platform in the 12 months prior to the claim (which, for a free platform, is zero).
                        </p>
                    </Section>

                    <Section id="governing" title="11. Governing Law">
                        <p>
                            These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes will be subject to the exclusive jurisdiction of the courts of New Delhi, India.
                        </p>
                    </Section>

                    <Section id="contact" title="12. Contact">
                        <p>For questions about these Terms, contact us at:</p>
                        <ul>
                            <li>Email: <a href="mailto:legal@psyconnect.edu">legal@psyconnect.edu</a></li>
                            <li>Address: PsyConnect Legal Team, c/o Student Welfare Office</li>
                        </ul>
                    </Section>
                </article>
            </div>
        </div>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}
