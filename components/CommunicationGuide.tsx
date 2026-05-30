 'use client';

 export default function CommunicationGuide() {
   return (
     <section className="mt-10 rounded-3xl border border-border bg-panel p-6 shadow-glow">
       <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
         <div>
           <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Sourcing video</p>
           <h2 className="mt-2 text-2xl font-semibold">How to communicate with Chinese suppliers</h2>
           <p className="mt-3 text-neutral-300">Short video and practical tips to help you introduce your business, ask for MOQ, request samples, and follow up professionally.</p>
           <ul className="mt-4 space-y-2 text-sm text-neutral-300">
             <li>• Start with a short intro: what you sell and target market.</li>
             <li>• Ask clear questions: MOQ, price breaks, lead time, and shipping.</li>
             <li>• Share product references (images, specs) and target order size.</li>
             <li>• Use WhatsApp or WeChat for faster follow-up after initial contact.</li>
           </ul>
         </div>

         <div>
           <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
             <iframe
               title="How to communicate with Chinese suppliers"
               src="https://www.youtube.com/embed/dQw4w9WgXcQ"
               className="h-full w-full"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             />
           </div>
           <p className="mt-3 text-xs text-neutral-400">Video: practical script examples and common phrases to use. Replace with your hosted video when ready.</p>
         </div>
       </div>
     </section>
   );
 }
