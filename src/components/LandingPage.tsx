import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import libraryHero from "@/assets/library-hero.jpg";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`library-card transition-all duration-700 ${
        isVisible ? "animate-fade-up opacity-100" : "opacity-0 translate-y-8"
      }`}
    >
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleConnectWallet = async () => {
    try {
      if (!window.aptos) {
        alert("Petra Wallet not found. Please install it.");
        return;
      }

      const isConnected = await window.aptos.isConnected();
      if (!isConnected) {
        await window.aptos.connect(); // Triggers Petra popup
      }

      const account = await window.aptos.account();
      console.log("Connected to Aptos account:", account.address);

      // (Optional) Store address for later use
      localStorage.setItem("wallet_address", account.address);

      navigate("/dashboard");
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect to Petra Wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${libraryHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>

        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl">
            <h1
              className={`text-5xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 ${
                isLoaded
                  ? "animate-slide-in-left opacity-100"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              Your Digital
              <span className="text-gradient block">Library Portal</span>
            </h1>

            <p
              className={`text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "animate-slide-in-left opacity-100"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              Access thousands of books, manage your loans, and discover new
              knowledge in our modern digital library ecosystem.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
                isLoaded ? "animate-fade-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                onClick={handleConnectWallet}
                variant="connect"
                size="xl"
                className="group"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button variant="library" size="xl">
                <BookOpen className="w-5 h-5" />
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded ? "animate-fade-up opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Modern Library Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamlessly manage your academic journey with our comprehensive
              digital library platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Digital Collection"
              description="Access thousands of books, journals, and research materials from anywhere, anytime."
              delay={700}
            />

            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Smart Tracking"
              description="Keep track of borrowed books, due dates, and return history with intelligent reminders."
              delay={900}
            />

            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community"
              description="Connect with fellow students, share recommendations, and join study groups."
              delay={1100}
            />

            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Achievements"
              description="Earn badges and track your reading progress with our gamified learning system."
              delay={1300}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                50K+
              </div>
              <div className="text-lg text-muted-foreground">Books Available</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                15K+
              </div>
              <div className="text-lg text-muted-foreground">Active Students</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                99%
              </div>
              <div className="text-lg text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
