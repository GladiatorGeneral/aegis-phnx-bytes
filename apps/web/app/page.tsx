import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 pt-16 md:p-24 md:pt-24 relative overflow-hidden selection:bg-purple-500/30'>
      {/* Background Ambiance */}
      <div className='absolute top-[-10%] left-[-20%] w-125 h-125 bg-purple-900/40 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
      <div className='absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-blue-900/30 rounded-full blur-[140px] pointer-events-none mix-blend-screen' />

      {/* Hero Glass Card */}
      <div className='glass-card p-8 md:p-12 max-w-4xl w-full z-10 flex flex-col items-center text-center border-t border-white/20'>
        <div className='mb-8 inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-[0.2em] text-blue-200 uppercase'>
           PhnxByte Engine v0.1
        </div>
        
        <h1 className='text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-white/50 mb-6 tracking-tight'>
          Type-Safe APIs <br />
          <span className='text-white/30'>Generated Instantly.</span>
        </h1>
        
        <p className='text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed font-light'>
          Transform OpenAPI specs into complete, production-ready TypeScript SDKs, 
          React Hooks, and Zod schemas. The future of API consumption is here.
        </p>

        <div className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
          <Link
            href='/docs'
            className='px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]'
          >
            Get Started
          </Link>
          <Link href="/chat" className='px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm text-white font-medium'>
            Try AI Chat
          </Link>
          <Link href="/construction-agent" className='px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm text-white font-medium'>
            Construction Agent
          </Link>
          <Link
            href='/docs'
            className='px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm text-white font-medium'
          >
            Read the Docs
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full z-10'>
         {[
           { title: 'Type-Safe', desc: 'Interfaces generated directly from your OpenAPI specs.' },
           { title: 'Zod Schemas', desc: 'Runtime validation for all inputs and outputs.' },
           { title: 'React Hooks', desc: 'Plug-and-play TanStack Query hooks ready for Vercel.' }
         ].map((feature, i) => (
           <div key={i} className='glass-panel p-6 hover:bg-white/10 transition-colors duration-300 rounded-xl border-t border-white/5'>
             <h3 className='text-lg font-semibold mb-2 text-white/90'>{feature.title}</h3>
             <p className='text-sm text-white/50 leading-relaxed'>{feature.desc}</p>
           </div>
         ))}
      </div>
    </main>
  );
}
