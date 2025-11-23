import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";

export async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        <span className="text-xl font-bold">AscendCV</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        {user ? (
                            <form action={signOutAction}>
                                <Button variant="ghost">Sign Out</Button>
                            </form>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
