import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessor } from '@/lib/phnxaura/rag/document-processor';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function PUT(req: NextRequest) {
  const { repoUrl, namespace, branch = 'main' } = await req.json();
  
  // Clone and process repository
  const processor = new DocumentProcessor();
  
  // Create a temporary directory
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'phnxaura-'));
  
  try {
    await simpleGit().clone(repoUrl, tempDir, ['--branch', branch, '--depth', '1']);
    
    await processor.ingestRepository(tempDir, namespace);
    
    // Cleanup
    await fs.promises.rm(tempDir, { recursive: true, force: true });
    
    return NextResponse.json({ 
        message: 'Repository ingested successfully',
        namespace,
        timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
