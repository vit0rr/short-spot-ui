"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useClipboard } from "@/hooks/use-clipboard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const { copied, copy } = useClipboard();

  const handleSubmit = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      new URL(url);

      const response = await fetch("https://short-spot.fly.dev/short-url/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      setShortenedUrl(data.shortenedUrl);
    } catch (err) {
      setError("Failed to shorten URL. Check the URL and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Short Spot
          </CardTitle>
          <CardDescription className="text-center">
            Shorten your URL with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter the URL you want to shorten"
              className="w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {shortenedUrl && (
              <Alert className="mt-4 p-4 bg-gray-100 rounded-md flex justify-between items-center">
                <div>
                  <AlertTitle className="text-sm font-medium">Shortened URL:</AlertTitle>
                  <AlertDescription className="text-sm font-normal break-all">
                    <a
                      href={shortenedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {shortenedUrl}
                    </a>
                  </AlertDescription>
                </div>
                <Button
                  className="ml-4"
                  variant="outline"
                  onClick={() => copy(shortenedUrl)}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Shortening..." : "Shorten"}
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-4 text-sm text-gray-500">
        Built with ♥ by{" "}
        <a
          href="https://github.com/vit0rr/"
          className="hover:text-gray-800 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vitor S. Almeida
        </a>
      </p>
    </div>
  );
}
