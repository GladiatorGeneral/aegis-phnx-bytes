import Link from 'next/link';

const codeBlock =
  'mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 overflow-x-auto';

export default function DocsPage() {
  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-10'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Docs</h1>
        <p className='text-white/60 mt-2 max-w-2xl'>
          PhnxByte generates TypeScript types and Zod schemas directly from an OpenAPI spec
          (JSON or YAML).
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <section className='glass-panel rounded-2xl p-6 lg:col-span-2'>
          <h2 className='text-xl font-semibold text-white/90'>Quick Start</h2>

          <div className='mt-6'>
            <h3 className='text-sm font-semibold text-white/80'>1) Run the generator</h3>
            <p className='text-sm text-white/55 mt-2'>
              Provide an OpenAPI file with <span className='text-white/80'>-i</span> and an output
              directory with <span className='text-white/80'>-o</span>.
            </p>
            <pre className={codeBlock}>{`npx phnxbyte generate -i ./openapi.yaml -o ./generated`}</pre>
          </div>

          <div className='mt-6'>
            <h3 className='text-sm font-semibold text-white/80'>2) What you get</h3>
            <p className='text-sm text-white/55 mt-2'>
              Two files are emitted:
              <span className='text-white/80'> types.ts</span> and <span className='text-white/80'>schemas.ts</span>.
            </p>
            <pre className={codeBlock}>{`generated/
  types.ts
  schemas.ts`}</pre>
          </div>

          <div className='mt-6'>
            <h3 className='text-sm font-semibold text-white/80'>3) Add to your app</h3>
            <p className='text-sm text-white/55 mt-2'>
              Import types and schemas wherever you validate inputs/outputs.
            </p>
            <pre className={codeBlock}>{`import * as Types from './generated/types';
import * as Schemas from './generated/schemas';`}</pre>
          </div>
        </section>

        <aside className='glass-panel rounded-2xl p-6'>
          <h2 className='text-xl font-semibold text-white/90'>Site Map</h2>
          <div className='mt-4 flex flex-col gap-2 text-sm'>
            <Link className='text-white/70 hover:text-white transition-colors' href='/'>
              Home
            </Link>
            <Link className='text-white/70 hover:text-white transition-colors' href='/generate'>
              Generate (Upload Spec)
            </Link>
            <Link className='text-white/70 hover:text-white transition-colors' href='/chat'>
              AI Chat
            </Link>
            <Link className='text-white/70 hover:text-white transition-colors' href='/vscode'>
              VS Code Sidebar (Preview)
            </Link>
          </div>

          <div className='mt-8'>
            <h3 className='text-sm font-semibold text-white/80'>Need help?</h3>
            <p className='text-sm text-white/55 mt-2'>
              Try the <Link className='text-white/80 hover:text-white underline' href='/chat'>AI Chat</Link>{' '}
              and paste your spec snippet.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
