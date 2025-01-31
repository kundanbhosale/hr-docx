"use client";
import React from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";

import confetti from "canvas-confetti";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  // Onborda hooks
  const { closeOnborda } = useOnborda();

  function handleConfetti() {
    closeOnborda();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <Card className="border-0 rounded-lg max-w-vw w-[300px]">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <span className="inline-flex gap-1 text-xs font-light text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>
            <CardTitle className="text-lg flex">
              <span className="flex-1">
                {step.icon} {step.title}
              </span>{" "}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>{step.content}</CardContent>
      <CardFooter className="flex justify-between gap-4 ml-auto">
        <Button variant="outline" size="sm" onClick={() => closeOnborda()}>
          Skip Tour
        </Button>
        <div className="flex justify-end gap-4">
          {currentStep !== 0 && (
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => prevStep()}
            >
              <ArrowLeft />
            </Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button
              size={"icon"}
              onClick={() => nextStep()}
              className="ml-auto"
            >
              <ArrowRight />
            </Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button
              size={"sm"}
              onClick={() => handleConfetti()}
              className="ml-auto"
            >
              🎉 Finish!
            </Button>
          )}
        </div>
      </CardFooter>
      {/* <span className="text-card">{arrow}</span> */}
    </Card>
  );
};

export default TourCard;
