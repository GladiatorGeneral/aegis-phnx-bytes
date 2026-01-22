import VSCodeSidebar from '@/components/VSCodeSidebar';

export default function VSCodePreviewPage() {
  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-6'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>VS Code Sidebar UI</h1>
        <p className='text-white/60 mt-2 max-w-2xl'>
          This is a web preview of the extension sidebar layout. The next step is wiring it to a
          VS Code Webview + command handlers.
        </p>
      </div>

      <div className='flex justify-center md:justify-start'>
        <VSCodeSidebar />
      </div>
    </main>
  );
}
