import Link from "next/link";

const LAST_UPDATED = "March 4, 2026";

const TOC = [
    { id: "overview", label: "Overview" },
    { id: "collection", label: "Data We Collect" },
    { id: "mental-health", label: "Mental Health Data" },
    { id: "ai-usage", label: "AI & ML Data Usage" },
    { id: "security", label: "Encryption & Security" },
    { id: "peer-forum", label: "Peer Forum Privacy" },
    { id: "user-rights", label: "Your Rights (GDPR / HIPAA)" },
    { id: "retention", label: "Data Retention" },
    { id: "cookies", label: "Cookies" },
    { id: "changes", label: "Changes to this Policy" },
    { id: "contact", label: "Contact Us" },
];

export const metadata = {
    title: "Privacy Policy — PsyConnect",
    description: "How PsyConnect collects, stores, and protects your personal and mental health data.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="mb-10 border-b border-gray-200 pb-8">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Legal Document</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 text-base">
                    Last Updated: <span className="font-semibold text-gray-700">{LAST_UPDATED}</span>
                </p>
                <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                    PsyConnect (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy,
                    especially given the sensitive nature of mental health data. This policy explains exactly
                    what we collect, why we collect it, and how you can exercise your rights.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* ── Table of Contents Sidebar ── */}
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

                    <Section id="overview" title="1. Overview">
                        <p>
                            PsyConnect is a student mental health platform designed to connect college students with peer mentors and qualified counsellors. We process personal data only to the extent necessary to provide this service and to keep our community safe. We do not sell your data. We do not share your data with advertisers.
                        </p>
                    </Section>

                    <Section id="collection" title="2. Data We Collect">
                        <h4>Account Data</h4>
                        <ul>
                            <li><strong>Email address</strong> — used as your unique identifier and for account recovery.</li>
                            <li><strong>Full name</strong> — displayed in your profile and in forum posts.</li>
                            <li><strong>Role</strong> (Student, Counsellor, or Admin) — determines your access level.</li>
                            <li><strong>Password hash</strong> — your password is hashed using bcrypt (10 rounds) before storage. We never store plaintext passwords.</li>
                        </ul>
                        <h4>Usage Data</h4>
                        <ul>
                            <li><strong>Forum posts and peer messages</strong> — content you create on the platform.</li>
                            <li><strong>Booking records</strong> — appointment times and counsellor assignments.</li>
                            <li><strong>Session tokens</strong> — short-lived JWT tokens stored in HTTPOnly cookies for authentication.</li>
                            <li><strong>Login timestamps</strong> — for security auditing purposes only.</li>
                        </ul>
                        <h4>Data We Do NOT Collect</h4>
                        <ul>
                            <li>We do not collect payment information.</li>
                            <li>We do not track your activity across other websites.</li>
                            <li>We do not use third-party advertising trackers.</li>
                        </ul>
                    </Section>

                    <Section id="mental-health" title="3. Mental Health Data">
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl not-prose mb-4">
                            <p className="text-amber-800 text-sm font-semibold">Sensitive Data Notice</p>
                            <p className="text-amber-700 text-sm mt-1">Mental health check-ins and mood logs are classified as sensitive personal data and receive the highest level of protection on our platform.</p>
                        </div>
                        <p>
                            Each mood log entry stores: a numeric mood score (1–10 scale), optional free-text notes you choose to add, the timestamp of the entry, and your user ID. This data is:
                        </p>
                        <ul>
                            <li>Stored in an encrypted MySQL database accessible only to you and your assigned counsellor.</li>
                            <li>Never shared with third parties, including universities or employers.</li>
                            <li>Used in aggregate, anonymised form only when training our ML stress-prediction models — your name and identifiable information are stripped before any ML processing.</li>
                            <li>Deletable at any time by submitting a request to our support team.</li>
                        </ul>
                        <p>
                            Peer forum posts are visible to the community by design. Do not share information in the forum that you wish to keep private. Direct peer messages are visible only to you and the message recipient.
                        </p>
                    </Section>

                    <Section id="ai-usage" title="4. AI & ML Data Usage">
                        <p>
                            PsyConnect includes a Flask-based ML microservice bridge for stress prediction and mood pattern detection. Here is how your data interacts with these systems:
                        </p>
                        <ul>
                            <li><strong>Stress Prediction Model</strong> — analyses anonymised patterns in your mood log history to generate a personal wellness insight. Raw data is processed in-memory and not stored by the ML service.</li>
                            <li><strong>Mood Detection</strong> — sentiment analysis may be optionally applied to anonymised journal notes if you opt in. This feature is disabled by default.</li>
                            <li><strong>No third-party AI</strong> — we do not send your data to OpenAI, Google AI, or any third-party LLM API. All ML inference happens locally on PsyConnect servers.</li>
                            <li><strong>Model training</strong> — if your anonymised, aggregated data is ever used to improve our models, you will be notified in advance and can opt out.</li>
                        </ul>
                    </Section>

                    <Section id="security" title="5. Encryption & Security">
                        <ul>
                            <li><strong>Passwords</strong> — hashed with bcrypt (cost factor 10) before being stored in MySQL. Your plaintext password is never persisted.</li>
                            <li><strong>Session tokens</strong> — signed with a 256-bit <code>AUTH_SECRET</code> using the NextAuth.js v5 JWT implementation. Tokens expire after 30 days.</li>
                            <li><strong>Database</strong> — all connections to MySQL use TLS encryption in transit.</li>
                            <li><strong>Environment variables</strong> — secrets such as <code>AUTH_SECRET</code> and <code>DATABASE_URL</code> are stored as environment variables and are never committed to version control.</li>
                            <li><strong>Principle of least privilege</strong> — the database user used by the application has only SELECT, INSERT, UPDATE, and DELETE permissions on the <code>psyconnect</code> database.</li>
                        </ul>
                        <p>
                            Despite these measures, no system is 100% secure. If you discover a security vulnerability, please report it responsibly to our team immediately.
                        </p>
                    </Section>

                    <Section id="peer-forum" title="6. Peer Forum Privacy">
                        <p>
                            Content posted to the public Peer Forum is visible to all authenticated PsyConnect users. Please treat the forum like a community space — do not post personally identifiable information about yourself or others.
                        </p>
                        <p>Direct peer messages are end-to-end encrypted at the application layer and are only accessible to the sender and recipient. Counsellors do not have access to private peer messages without explicit consent from both parties in a crisis situation.</p>
                    </Section>

                    <Section id="user-rights" title="7. Your Rights (GDPR / HIPAA Alignment)">
                        <p>We align our data practices with GDPR principles and HIPAA-adjacent best practices for student health data. You have the following rights:</p>
                        <ul>
                            <li><strong>Right to Access</strong> — request a full export of all data we hold about you.</li>
                            <li><strong>Right to Rectification</strong> — correct inaccurate personal data at any time from your profile settings.</li>
                            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;)</strong> — request complete deletion of your account and all associated data.</li>
                            <li><strong>Right to Restrict Processing</strong> — ask us to pause processing your data while a dispute is resolved.</li>
                            <li><strong>Right to Data Portability</strong> — receive your data in a machine-readable format (JSON/CSV).</li>
                            <li><strong>Right to Object</strong> — object to processing your data for any purpose, including ML model training.</li>
                        </ul>
                        <p>To exercise any of these rights, contact us at <strong>privacy@psyconnect.edu</strong>. We will respond within 30 days.</p>
                    </Section>

                    <Section id="retention" title="8. Data Retention">
                        <ul>
                            <li>Active account data is retained for as long as your account exists.</li>
                            <li>Mood logs and check-in records are retained for 2 years, then anonymised.</li>
                            <li>Forum posts are retained indefinitely unless you request deletion.</li>
                            <li>Session tokens expire and are invalidated after 30 days of inactivity.</li>
                            <li>Deleted accounts are purged within 30 days. Anonymised, non-identifying usage statistics may be retained for research.</li>
                        </ul>
                    </Section>

                    <Section id="cookies" title="9. Cookies">
                        <p>We use only essential cookies necessary for the platform to function:</p>
                        <ul>
                            <li><strong>next-auth.session-token</strong> — a secure, HTTPOnly JWT cookie for authentication. Expires after 30 days.</li>
                            <li><strong>next-auth.csrf-token</strong> — a CSRF protection token. Session-scoped.</li>
                        </ul>
                        <p>We do not use analytics cookies, advertising cookies, or any third-party tracking cookies.</p>
                    </Section>

                    <Section id="changes" title="10. Changes to this Policy">
                        <p>
                            We may update this Privacy Policy periodically. When we do, we will update the &ldquo;Last Updated&rdquo; date at the top of this page and, for material changes, notify you via an in-app banner or email. Continued use of PsyConnect after the change date constitutes your acceptance of the updated policy.
                        </p>
                    </Section>

                    <Section id="contact" title="11. Contact Us">
                        <p>If you have questions about this Privacy Policy or how we handle your data:</p>
                        <ul>
                            <li>Email: <a href="mailto:privacy@psyconnect.edu">privacy@psyconnect.edu</a></li>
                            <li>Address: PsyConnect Data Privacy Team, c/o Student Wellness Centre</li>
                        </ul>
                        <p>For urgent mental health support, please visit our{" "}
                            <Link href="/crisis" className="text-red-600 font-semibold hover:underline">Crisis Hotline page</Link>.
                        </p>
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
