import { Link } from 'react-router-dom'
import { FileText, BarChart3, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react'

function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get your ATS score and feedback in under 30 seconds with our AI-powered engine.',
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Detailed Scoring',
      description: 'Comprehensive breakdown of your CV\'s performance across multiple criteria.',
      color: 'green'
    },
    {
      icon: FileText,
      title: 'Smart Recommendations',
      description: 'Actionable insights to improve your CV\'s impact and ATS compatibility.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Industry Insights',
      description: 'Tailored advice based on your industry and target job positions.',
      color: 'yellow'
    }
  ]

  const benefits = [
    'AI-powered CV analysis',
    'ATS compatibility scoring',
    'Instant feedback and recommendations',
    'Multiple file format support',
    'Industry-specific insights',
    'Track improvement over time'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Analyze Your CV with
              <span className="text-blue-600"> AI Power</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant ATS compatibility scores, detailed feedback, and actionable 
              recommendations to land your dream job faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/upload" 
                className="btn-primary text-lg px-8 py-4"
              >
                <FileText size={20} />
                Upload Your CV
              </Link>
              <Link 
                to="/dashboard" 
                className="btn-secondary text-lg px-8 py-4"
              >
                <BarChart3 size={20} />
                View Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">CVs Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <div className="text-gray-600">Improvement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">30 sec</div>
                <div className="text-gray-600">Average Analysis Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our CV Analyzer?
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI technology meets recruitment expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="card text-center hover:shadow-xl transition-shadow duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`text-${feature.color}-600`} size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our comprehensive CV analysis platform provides all the tools and insights 
                you need to create a winning resume that stands out to employers.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/register" 
                className="btn-primary mt-8 inline-flex items-center"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">ATS Score</span>
                    <span className="text-2xl font-bold text-green-600">87%</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-progress score-excellent" style={{ width: '87%' }}></div>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Keyword Match</span>
                      <span className="text-sm font-medium text-blue-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Format Score</span>
                      <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Quality</span>
                      <span className="text-sm font-medium text-purple-600">84%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Boost Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've improved their CV with our AI analyzer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Get Started Free
            </Link>
            <Link 
              to="/upload" 
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage