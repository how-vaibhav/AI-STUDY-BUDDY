"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { MouseParallax } from "react-just-parallax";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface PlanInterface {
  plan_id: string;
  title: string;
  overview: string;
}

export default function StudyPlans() {
  const { toast } = useToast();

  const [plans, setPlans] = useState<PlanInterface[]>([]);

  useEffect(() => {
    const getPlans = async () => {
      const response = await fetch("api/save-study-plan");

      const data = await response.json();

      if (!data.success) {
        toast({
          title: "error",
          description: data.error || "Internal Server Error",
          variant: "destructive",
        });
      }

      setPlans(data.StudyPlans);
    };
    getPlans();
  }, []);

  useEffect(() => {
    console.log(plans);
  }, [plans]);

  return (
    <div className="relative min-h-screen">
      <DashboardNav />

      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-112 w-md rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-112 w-md rounded-full bg-purple-300/20 blur-3xl" />
      </MouseParallax>

      {plans?.length > 0 ? (
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {plans.map((plan) => (
              <Link
                key={plan.plan_id}
                href={`/plans/${plan.plan_id}`}
                className="h-full"
              >
                <Card className="glass-card h-full border-emerald-200/60 p-4 transition hover:-translate-y-1 hover:shadow-lg">
                  <CardTitle className="text-center text-purple-700 font-bold">
                    {plan.title}
                  </CardTitle>
                  <CardContent className="mt-3 max-h-52 overflow-hidden text-sm text-muted-foreground">
                    <ReactMarkdown>{plan.overview}</ReactMarkdown>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-center px-4 py-16">
          <Card className="glass-card max-w-md border-emerald-200/60 text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              No Plans Yet
            </CardTitle>
            <CardDescription className="mt-2">
              Paste notes and get structured output
            </CardDescription>
          </Card>
        </div>
      )}
    </div>
  );
}
