"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PhnxAuraPage() {
  const [prompt, setPrompt] = useState("");
  const [namespace, setNamespace] = useState("default");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOrchestrate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-key" // In real app, this should be handled properly
        },
        body: JSON.stringify({
          prompt,
          namespace,
          agents: ["architect", "coder", "reviewer"],
          modelConfig: {
            primary: "deepseek-coder",
            temperature: 0.7
          }
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">PHNXAURA</h1>
        <p className="text-muted-foreground text-lg">
          Multi-AI Orchestration Agency with RAG & Enhanced Security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Orchestration Console</CardTitle>
            <CardDescription>Dispatch tasks to the agent swarm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Namespace</label>
              <Input 
                value={namespace} 
                onChange={(e) => setNamespace(e.target.value)} 
                placeholder="project-namespace"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instruction</label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Describe the feature to build..."
                className="h-32"
              />
            </div>
            <Button onClick={handleOrchestrate} disabled={loading} className="w-full">
              {loading ? "Orchestrating..." : "Execute Swarm"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>Agents Consensus & Code</CardDescription>
            </CardHeader>
            <CardContent>
             <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>{JSON.stringify(result, null, 2)}</pre>
             </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
