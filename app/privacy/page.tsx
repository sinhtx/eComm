'use client'

export default function PrivacyPage() {
  return (
    <div className="bg-neutral-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-h1 mb-8 text-neutral-charcoal">Privacy Policy</h1>

        <div className="prose max-w-none space-y-6 text-neutral-charcoal">
          <section>
            <h2 className="text-h2 mb-4">1. Introduction</h2>
            <p>
              {`Mango Tango Farm ("we" or "us" or "our") operates the www.flmango.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.`}
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&quot;Personal Data&quot;). This may include, but is not limited to:
                <ul className="list-circle list-inside space-y-1 ml-8 mt-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 mb-4">3. Use of Data</h2>
            <p>Mango Tango Farm uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 mb-4">4. Security of Data</h2>
            <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>By email: contact@mangotangofarm.com</li>
              <li>By mail: Mango Tango Farm, Pine Island, FL</li>
            </ul>
          </section>

          <section className="mt-12 pt-8 border-t border-neutral-off-white">
            <p className="text-sm text-neutral-gray">Last updated: May 2026</p>
          </section>
        </div>
      </div>
    </div>
  )
}
