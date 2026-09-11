import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/actions/auth";

export const metadata = {
  title: "Register | Backcountry Light",
  description: "Create your Backcountry Light account.",
};

export default async function RegisterPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-[70vh] py-12">
      <div className="mx-auto w-full max-w-[450px] space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-heading font-medium tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details below to create your account
          </p>
        </div>
        
        {searchParams?.error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 rounded-md">
            {searchParams.error}
          </div>
        )}
        
        <form action={signup} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" name="first-name" placeholder="John" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" name="last-name" placeholder="Doe" required className="bg-background" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="hello@example.com" required className="bg-background" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} className="bg-background" />
            </div>
          </div>
          
          <Button type="submit" size="lg" className="w-full rounded-none">
            Create Account
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </form>
        
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
