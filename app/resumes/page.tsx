import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Calendar } from "lucide-react";
import { getUserResumesAction } from "./actions";

export default async function ResumesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await getUserResumesAction();

  if (result.error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const resumes = result.resumes || [];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and create your professional resumes
            </p>
          </div>
          <Link href="/resumes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No resumes yet</h3>
                <p className="text-muted-foreground mt-1">
                  Get started by creating your first resume
                </p>
              </div>
              <Link href="/resumes/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Link key={resume.id} href={`/resumes/${resume.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-1">{resume.title}</span>
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resume.full_name} • {resume.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    {resume.professional_summary && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {resume.professional_summary}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

