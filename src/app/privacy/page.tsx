import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft, Mail, Lock, Database, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Smart Value",
  description:
    "Smart Value privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <Shield size={24} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: March 2026
          </p>
        </div>
      </div>

      <div className="prose-dark space-y-8">
        <section>
          <h2 className="section-heading">
            <Mail size={18} className="text-teal-600" />
            Information We Collect
          </h2>
          <p>
            When you use Smart Value&apos;s AI home valuation service, we may
            collect the following information:
          </p>
          <ul>
            <li>
              <strong>Contact Information:</strong> Your email address, phone
              number, and name (if provided) when you request a valuation
              report.
            </li>
            <li>
              <strong>Property Address:</strong> The property address you enter
              for valuation purposes.
            </li>
            <li>
              <strong>Usage Data:</strong> Anonymous analytics data including
              page views, interactions, and device information.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-heading">
            <Database size={18} className="text-teal-600" />
            How We Use Your Information
          </h2>
          <ul>
            <li>
              <strong>Deliver Valuation Reports:</strong> We use your contact
              information to deliver and follow up on your home valuation
              report.
            </li>
            <li>
              <strong>Connect You with Agents:</strong> If an agent referred
              you to this tool (via a unique URL), your information may be
              shared with that specific agent to provide you with personalized
              real estate services.
            </li>
            <li>
              <strong>Service Improvement:</strong> Anonymized usage data helps
              us improve the accuracy and experience of our valuation tool.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-heading">
            <Share2 size={18} className="text-teal-600" />
            Information Sharing
          </h2>
          <p>We do not sell your personal information to third parties.</p>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>
              The referring real estate agent (if you accessed the tool via an
              agent&apos;s referral link).
            </li>
            <li>
              Service providers who help us operate the platform (e.g., email
              delivery, database hosting).
            </li>
            <li>
              Legal authorities when required by law or to protect our rights.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-heading">
            <Lock size={18} className="text-teal-600" />
            Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information, including encrypted data transmission (HTTPS),
            secure database storage, and access controls. However, no method of
            electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="section-heading">Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:privacy@kevv.ai"
              className="text-teal-600 hover:text-teal-700"
            >
              privacy@kevv.ai
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="section-heading">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="border-t border-slate-200 pt-6">
          <p className="text-slate-500 text-sm">
            Smart Value is operated by Kevv AI Inc.
            <br />
            Contact:{" "}
            <a
              href="mailto:privacy@kevv.ai"
              className="text-teal-600 hover:text-teal-700"
            >
              privacy@kevv.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
