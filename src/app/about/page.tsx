export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">About Legal India</h1>
          <div className="prose prose-sm sm:prose-base md:prose-lg text-gray-600 max-w-none">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
              Legal India is an AI-powered platform designed specifically for Indian lawyers and legal professionals. 
              Our mission is to streamline legal research and provide intelligent insights to enhance your practice.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed">
              With our advanced AI technology, you can access comprehensive legal research, property opinions, 
              case analysis, and junior AI assistance - all in one integrated platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}