 'use client';

 export default function FaqsAndGuide() {
   return (
     <section className="mt-8 rounded-3xl border border-border bg-panel p-6 shadow-glow">
       <div>
         <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Guides & FAQs</p>
         <h2 className="mt-2 text-2xl font-semibold">Quick guide & frequently asked questions</h2>
         <div className="mt-4 grid gap-4 md:grid-cols-2">
           <div>
             <h3 className="text-lg font-semibold">Quick start guide</h3>
             <ol className="mt-2 space-y-2 text-sm text-neutral-300 list-decimal pl-5">
               <li>Find suppliers using filters and search.</li>
               <li>Preview supplier details and check MOQ & shipping routes.</li>
               <li>Unlock contact to open WhatsApp and start conversation.</li>
               <li>Record purchases via the payments panel for accounting.</li>
             </ol>
           </div>

           <div>
             <h3 className="text-lg font-semibold">Top FAQs</h3>
             <dl className="mt-2 space-y-3 text-sm text-neutral-300">
               <div>
                 <dt className="font-medium text-white">How do I verify a supplier?</dt>
                 <dd className="mt-1">Check WhatsApp verification badge, MOQ, and request samples before bulk orders.</dd>
               </div>
               <div>
                 <dt className="font-medium text-white">What if the supplier doesn't reply?</dt>
                 <dd className="mt-1">Follow up after 24 hours and try alternate suppliers if unresponsive.</dd>
               </div>
               <div>
                 <dt className="font-medium text-white">How do I handle shipping?</dt>
                 <dd className="mt-1">Get quotes from freight forwarders and check customs rules for your country.</dd>
               </div>
             </dl>
           </div>
         </div>
       </div>
     </section>
   );
 }
