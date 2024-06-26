"use server";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
// Import everything
import * as webllm from "@mlc-ai/web-llm";
// Or only import what you need
import { CreateMLCEngine } from "@mlc-ai/web-llm";

export default async function LlmRunner() {
  const [subject, setSubject] = useState("");

  // Step 4: Handle input changes
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };
  const initProgressCallback = (initProgress) => {
    console.log(initProgress);
  };
  const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";

  useEffect(() => {
    async function initializeEngine() {
      try {
        const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";
        const engine = await CreateMLCEngine(selectedModel, {
          initProgressCallback: initProgressCallback,
        });
        // Save engine to state if needed
      } catch (error) {
        console.error("Error initializing engine:", error);
        // Handle error
      }
    }
    initializeEngine();
  }, []);
  const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "Hello!" },
  ];

  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleGenerateEmail = useCallback(async () => {
    // const reply = await engine.chat.completions.create({
    //   messages,
    // });
    // const response = reply.choices[0].message;
    // console.log("response: ", response);
    // console.log(reply.usage);
    // setGeneratedEmail(response.content);
  }, [engine, messages]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#4285F4] text-white py-4 px-6 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">✨ Magic Email Composer ✨</h1>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="#" className="hover:text-white/80" prefetch={false}>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80" prefetch={false}>
                  Drafts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80" prefetch={false}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-2 gap-6 p-6 ">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Badge className="bg-[#4285F4]">Template</Badge>

          <div className="flex items-center space-x-4">
            <Label htmlFor="recipient">To:</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="recipient@example.com"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="subject">Subject:</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={handleSubjectChange}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="tone">Tone:</Label>
            <Select id="tone" defaultValue="neutral">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            id="email-content"
            placeholder="Compose your email here..."
            className="w-full h-[300px] resize-none"
          />
          <Button
            className="w-full bg-[#4285F4] text-white hover:bg-[#3367D6]"
            onClick={handleGenerateEmail}
          >
            Generate Email
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Badge className="bg-[#4285F4]">Generated Email</Badge>
          <h2 className="text-2xl font-bold">{subject}</h2>

          <div className="border rounded-lg p-4 text-[#202124]">
            <p>Dear [Recipient],</p>
            <p>
              I hope this email finds you well. I wanted to reach out to discuss
              [topic]. [Provide details and context].
            </p>
            <p>
              Please let me know if you have any questions or if there is
              anything else I can assist with.
            </p>
            <p>Best regards,</p>
            <p>[Your Name]</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              disabled
              className="bg-[#4285F4] text-white hover:bg-[#3367D6]"
            >
              Send
            </Button>
          </div>
        </div>
      </main>
      <footer className="bg-[#4285F4] text-white py-4 px-6 shadow">
        <div className="container mx-auto text-center text-sm">
          &copy; 2023 Email Composer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
