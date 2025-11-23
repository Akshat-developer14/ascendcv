import { Button } from "@/components/ui/button";
import { Sparkles, Download, Zap } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Build Your Perfect Resume in Minutes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create professional, ATS-friendly resumes with our intuitive builder. Stand out and land your dream job.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Start Building Free</Button>
            <Button size="lg" variant="outline">View Templates</Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Smart suggestions to enhance your resume content</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast & Easy</h3>
              <p className="text-muted-foreground">Build your resume in minutes with our intuitive interface</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Export Anywhere</h3>
              <p className="text-muted-foreground">Download as PDF or share with a custom link</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ascend Your Career?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who have landed their dream jobs with AscendCV
          </p>
          <Button size="lg">Create Your Resume Now</Button>
        </div>
      </section>
    </>
  );
}
