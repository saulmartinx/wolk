import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy - Wolk</h1>
      <p className="text-gray-600 mb-6">Last updated: March 2025</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">When you use Wolk, we collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pi Network Account Information:</strong> Your Pi Network username, user ID, and authentication tokens when you connect your Pi Wallet</li>
            <li><strong>Job Interaction Data:</strong> Your swipe actions, job preferences, and application history</li>
            <li><strong>Payment Information:</strong> Pi Coin transaction IDs and payment amounts (processed securely through Pi Network)</li>
            <li><strong>Device Information:</strong> Browser type, device type, and IP address for security and optimization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve the Wolk job marketplace service</li>
            <li>Process Pi Coin payments securely through Pi Network</li>
            <li>Match you with relevant job opportunities</li>
            <li>Communicate about job applications and platform updates</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="mb-4">We do not sell your personal information. We may share information only:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With Pi Network for authentication and payment processing</li>
            <li>With job providers when you apply for positions (limited to necessary information)</li>
            <li>When required by law or to protect our rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Pi Network Integration</h2>
          <p>Wolk integrates with Pi Network for user authentication and payments. Your Pi Network data is handled according to Pi Network's privacy policy and our commitment to data protection.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>We use industry-standard security measures to protect your information, including encryption for sensitive data and secure communication with Pi Network APIs.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>For questions about this privacy policy, contact us at:</p>
          <p className="mt-2">
            Email: privacy@wolk.work<br/>
            GitHub: https://github.com/saulmartinx/wolk
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;