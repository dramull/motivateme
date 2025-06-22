"use client";

import { useState, useRef, useEffect } from "react";
import { generateMotivationalMessage, type GenerateMotivationalMessageOutput } from "@/ai/flows/generate-motivational-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Users, Users2, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { name: "School", icon: BookOpen },
  { name: "Parents", icon: Users },
  { name: "Friends", icon: Users2 },
  { name: "Sports", icon: Dumbbell },
];

export function MotivationalQuote() {
  const [motivation, setMotivation] = useState<GenerateMotivationalMessageOutput | null>(null);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGetMotivation = async (category: string) => {
    setLoadingCategory(category);
    setMotivation(null);
    try {
      const result = await generateMotivationalMessage({ category });
      setMotivation(result);
    } catch (error) {
      console.error("Failed to get motivation:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't generate a motivational message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategory(null);
    }
  };

  useEffect(() => {
    if (motivation?.audio && audioRef.current) {
      audioRef.current.src = motivation.audio;
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
      });
    }
  }, [motivation]);

  const isLoading = loadingCategory !== null;

  return (
    <>
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl border-2 border-primary/20 bg-card">
        <CardHeader className="text-center p-8">
          <CardTitle className="font-headline text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MotivateMe</CardTitle>
          <CardDescription className="pt-2 text-md text-muted-foreground">AI-powered inspiration for a late teen.</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <div className="flex items-center justify-center min-h-[150px] rounded-lg bg-muted/50 p-6 text-center border">
            {motivation?.message ? (
              <blockquote className="text-lg font-medium text-foreground italic animate-in fade-in-0 duration-1000">
                <p>&ldquo;{motivation.message}&rdquo;</p>
              </blockquote>
            ) : (
              <p className="text-muted-foreground">
                {isLoading ? `Brewing some motivation for ${loadingCategory}...` : "What do you need motivation for today?"}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-8 pt-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            {categories.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                className="w-full font-bold text-md shadow-lg hover:shadow-xl transition-shadow"
                size="lg"
                onClick={() => handleGetMotivation(name)}
                disabled={isLoading}
              >
                {loadingCategory === name ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-5 w-5" />
                )}
                {name}
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
      <audio ref={audioRef} className="hidden" />
    </>
  );
}
