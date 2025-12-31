import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />

      {/* Visual divider or additional section if needed */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to boost your productivity?</h2>
          <p className="text-slate-600 mb-10 text-lg">
            Join thousands of users who are already getting more done with TaskHub.
          </p>
          <div className="flex justify-center">
            <a href="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1">
              Create Your Free Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
