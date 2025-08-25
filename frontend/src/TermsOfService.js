import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service - Wolk</h1>
      <p className="text-gray-600 mb-6">Last updated: March 2025</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>By using Wolk, you agree to these Terms of Service and our Privacy Policy. If you don't agree, please don't use our service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>Wolk is a decentralized job marketplace built on the Pi Network ecosystem. Our service allows users to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Browse job opportunities using a swipe-based interface</li>
            <li>Apply for jobs and make payments using Pi Coin cryptocurrency</li>
            <li>Connect with employers and job seekers globally</li>
            <li>Utilize blockchain technology for secure transactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Pi Network Integration</h2>
          <p>Wolk integrates with Pi Network for user authentication and payments. By using Wolk, you also agree to Pi Network's terms of service. All Pi Coin transactions are processed through Pi Network's secure infrastructure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <p>As a Wolk user, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Provide accurate information when creating job listings or applications</li>
            <li>Use the platform respectfully and professionally</li>
            <li>Complete work as agreed upon when accepting job opportunities</li>
            <li>Pay agreed amounts in Pi Coin for accepted jobs</li>
            <li>Not engage in fraudulent activities or spam</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
          <p>All payments on Wolk are processed in Pi Coin through the Pi Network:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Job payments are processed immediately upon job acceptance</li>
            <li>All transactions are recorded on the blockchain for transparency</li>
            <li>Refunds are subject to Pi Network policies and job completion status</li>
            <li>Wolk does not control Pi Coin exchange rates or availability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
          <p>Users may not:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Create fake job listings or applications</li>
            <li>Attempt to circumvent payment systems</li>
            <li>Harass other users or engage in discriminatory behavior</li>
            <li>Use automated systems to manipulate the platform</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
          <p>Wolk strives for high availability but cannot guarantee uninterrupted service. We may perform maintenance, updates, or experience technical issues that temporarily affect service availability.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p>Wolk provides the platform "as is" and is not responsible for:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Quality of work performed by job seekers</li>
            <li>Accuracy of job listings posted by employers</li>
            <li>Pi Coin value fluctuations or Pi Network issues</li>
            <li>Disputes between users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p>We may update these terms periodically. Continued use of Wolk after changes constitutes acceptance of new terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
          <p>For questions about these terms, contact us at:</p>
          <p className="mt-2">
            Email: support@wolk.work<br/>
            GitHub: https://github.com/saulmartinx/wolk
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;