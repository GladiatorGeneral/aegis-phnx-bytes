// lib/phnxaura/rag/document-processor.ts
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import ignore from 'ignore';
import { VectorStore } from './vector-store';
import { DocumentChunk } from '@/types/phnxaura';
import path from 'path';

export class DocumentProcessor {
  private vectorStore: VectorStore;
  private chunkSize = 1000;
  private chunkOverlap = 200;

  constructor() {
    this.vectorStore = new VectorStore();
  }

  async ingestRepository(repoPath: string, namespace: string) {
    const gitignore = await this.loadGitignore(repoPath);
    // Use glob properly with ignore option if possible, or filter manually. 
    // glob supports 'ignore' option.
    const files = await glob('**/*.{ts,tsx,js,jsx,md,json}', {
      cwd: repoPath,
      ignore: gitignore,
      nodir: true
    });

    const chunks: DocumentChunk[] = [];
    
    for (const file of files) {
        const fullPath = path.join(repoPath, file);
        try {
            const content = await readFile(fullPath, 'utf-8');
            const fileChunks = this.chunkDocument(content, file);
            chunks.push(...fileChunks);
        } catch (e) {
            console.error(`Error reading file ${file}`, e);
        }
    }

    // Ingest dependencies documentation
    const packageJson = await this.readPackageJson(repoPath);
    if (packageJson) {
      const depDocs = await this.fetchDependencyDocs(packageJson.dependencies);
      chunks.push(...depDocs);
    }

    await this.vectorStore.embedAndStore(chunks, namespace);
  }

  private chunkDocument(content: string, source: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let start = 0;
    
    while (start < content.length) {
      const end = start + this.chunkSize;
      const chunk = content.slice(start, end);
      
      chunks.push({
        content: chunk,
        source,
        type: source.endsWith('.md') ? 'documentation' : 'code',
        metadata: { lineStart: start, lineEnd: end }
      });
      
      start = end - this.chunkOverlap;
    }
    
    return chunks;
  }

  private async fetchDependencyDocs(dependencies: Record<string, string>): Promise<DocumentChunk[]> {
    // Fetch READMEs from npm for context
    const docs: DocumentChunk[] = [];
    
    for (const [pkg, version] of Object.entries(dependencies || {})) {
      try {
        const response = await fetch(`https://registry.npmjs.org/${pkg}`);
        const data: any = await response.json();
        docs.push({
          content: data.readme || '',
          source: `npm:${pkg}@${version}`,
          type: 'dependency',
          metadata: { version }
        });
      } catch (e) {
        console.warn(`Failed to fetch docs for ${pkg}`);
      }
    }
    
    return docs;
  }

  private async loadGitignore(repoPath: string): Promise<string[]> {
    try {
      const content = await readFile(path.join(repoPath, '.gitignore'), 'utf-8');
      return content.split('\n').filter(line => line && !line.startsWith('#'));
    } catch {
      return ['node_modules/**', '.git/**', 'dist/**', 'build/**'];
    }
  }

  private async readPackageJson(repoPath: string): Promise<any> {
    try {
      const content = await readFile(path.join(repoPath, 'package.json'), 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
}
