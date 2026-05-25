'use client'

export default function TermsPage() {
  return (
    <div className="bg-neutral-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-h1 mb-8 text-neutral-charcoal">Terms of Service</h1>

        <div className="prose max-w-none space-y-6 text-neutral-charcoal">
          <section>
            <h2 className="text-h2 mb-4">1. Agreement to Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">2. Use License</h2>
            <p>{`Permission is granted to temporarily download one copy of the materials (information or software) on Mango Tango Farm's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:`}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 mb-4">3. Disclaimer</h2>
            <p>{`The materials on Mango Tango Farm's website are provided on an 'as is' basis. Mango Tango Farm makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`}</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">4. Limitations</h2>
            <p>{`In no event shall Mango Tango Farm or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mango Tango Farm's website.`}</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">5. Accuracy of Materials</h2>
            <p>{`The materials appearing on Mango Tango Farm's website could include technical, typographical, or photographic errors. Mango Tango Farm does not warrant that any of the materials on its website are accurate, complete, or current.`}</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">6. Links</h2>
            <p>{`Mango Tango Farm has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Mango Tango Farm of the site. Use of any such linked website is at the user's own risk.`}</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">7. Modifications</h2>
            <p>Mango Tango Farm may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
          </section>

          <section>
            <h2 className="text-h2 mb-4">8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Florida, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </section>

          <section className="mt-12 pt-8 border-t border-neutral-off-white">
            <p className="text-sm text-neutral-gray">Last updated: May 2026</p>
          </section>
        </div>
      </div>
    </div>
  )
}
