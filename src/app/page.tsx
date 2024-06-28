"use client";
import { FaGithub } from "react-icons/fa";
import { Label } from "@/components/ui/label";
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
import {
  ChangeEventHandler,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
// Import everything
import * as webllm from "@mlc-ai/web-llm";
// Or only import what you need
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { Box } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ThreeDots } from "react-loader-spinner";
// $c-black: #000000;
// $c-white: #FFFFFF;
// $c-primary: #EFE5FC;
// $c-primary-strong: #6101EA;
export default function Component() {
  const [generatedEmail, setGeneratedEmail] = useState(
    "Click 'Generate' to get started!"
  );
  const [body, setBody] = useState("");
  const [tone, setTone] = useState("neutral");

  const handleBodyChange = (e: any) => {
    e && setBody(e.target.value);
  };

  const handleOnToneChange = (value: any) => {
    console.log("Handle tone change: ", value);
    setTone(value);
  };
  const initProgressCallback = (initProgres: any) => {
    console.log(initProgres);
  };
  const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";

  const [engine, setEngine] = useState<webllm.MLCEngine>();

  const [progress, setProgress] = useState(13);

  const [hasWebGPU, setHasWebGPU] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function initializeEngine() {
      try {
        // Initialize engine
        const engine = await CreateMLCEngine(selectedModel, {
          initProgressCallback: initProgressCallback,
        });
        // Save engine to state if needed
        setEngine(engine);
        setHasWebGPU(true);
      } catch (error) {
        console.error("Error initializing engine:", error);
        setHasWebGPU(false);
        // Handle error
      }
    }
    initializeEngine();
  }, []);

  const [loadingGeneration, setLoadingGeneration] = useState(false);

  const handleGenerateEmail = useCallback(async () => {
    if (engine) {
      setLoadingGeneration(true);
      const messages: webllm.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are a Email Composer. You only respond with the composed email, nothing else.`,
        },
        {
          role: "user",
          content: `Write a concise email (add a break line between Subject and Body) using in ${tone} tone based on the following: ${body} `,
        },
      ];

      const reply = await engine.chat.completions.create({
        messages: messages,
      });
      setLoadingGeneration(false);

      const response = reply.choices[0].message;
      setGeneratedEmail(response.content ?? "");
      console.log(`response from input ${body} `, response);
      console.log(reply.usage);
      // setGeneratedEmail(response.content);
    } else {
      console.log("Engine not ready");
    }
  }, [engine, body, tone]);

  const headColour = "#F875AA";

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b-4  bg-[#FFB0FE] text-black py-4 px-1 shadow">
        <div className="container mx-auto flex items-center justify-between justify-center">
          <h1 className="text-xl  md:text-2xl font-bold">
            ✨ Magic Email Composer ✨
          </h1>
          <nav>
            <ul className="flex items-center space-x-4">
              {" "}
              <a
                href="https://github.com/paualarco/magic-email-composer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </a>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#ECF2FF]">
        <div className="border-l-2 border-t-2 border-b-4 border-r-4 bg-[#D0BFFF] rounded-lg shadow p-6 space-y-4">
          <Badge className="bg-[#836FFF] text-white">Template ✏️</Badge>
          <div className="flex items-center space-x-4">
            <Label htmlFor="tone">Tone</Label>
            <div className="border rounded-lg">
              <Select defaultValue="neutral" onValueChange={handleOnToneChange}>
                <SelectTrigger className="w-40 bg-[#FBFACD] rounded-lg">
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
          </div>

          <div className="gap-4">
            <Label htmlFor="tone">Content</Label>

            <div className="border rounded-lg">
              <Textarea
                id="email-content"
                placeholder="Compose your email or explain what you need..."
                className="w-full h-[120px] resize-none bg-[#FBFACD] rounded-lg "
                onChange={handleBodyChange}
              />
            </div>
          </div>
          {!engine ? (
            hasWebGPU ? (
              <div className="flex flex-col items-center justify-center">
                <Progress
                  className={"bg-gray-50 h-2 w-1/3"}
                  value={progress}
                  fill="black"
                />
                <div className="flex flex-row items-end gap-1">
                  <div>Loading model... </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col font-bold items-center justify-center text-red-500">
                WebLLMs are not supported in this device.
              </div>
            )
          ) : (
            <Button
              className="border w-full bg-[#15F5BA] text-black hover:bg-[#91DDCF]"
              onClick={handleGenerateEmail}
              disabled={loadingGeneration}
            >
              Generate 🪄
            </Button>
          )}
        </div>
        <div className="border-l-2 border-t-2 border-b-4 border-r-4 bg-[#D0BFFF] rounded-lg shadow p-6 space-y-4">
          <Badge className="bg-[#836FFF]"> Email ✉️ </Badge>

          <div className="border rounded-lg p-4 text-[#202124] bg-[#FBFACD]">
            {loadingGeneration || !engine ? (
              <ThreeDots
                visible={true}
                height="20"
                width="20"
                color="black"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              generatedEmail
            )}
          </div>
        </div>
      </main>
      <footer className="border-t-2 border-black bg-[#836FFF] text-white py-4 px-6 shadow">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Magic Email Composer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
