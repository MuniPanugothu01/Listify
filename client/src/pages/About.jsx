import React from 'react';

function About() {
  return (
    <div className="bg-[#F3F3F3] text-[#2F3A63]">
      {/* Hero Section */}
      <section className="relative py-2  px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#F8F8F8] via-white to-[#ECEDEE]">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#2F3A63]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2F3A63]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#2F3A63]/10 mb-8">
            <div className="w-2 h-2 bg-[#2F3A63] rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-[#2F3A63]">About Listify</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-[#1F2937] to-[#2F3A63] bg-clip-text text-transparent mb-8 leading-tight">
            LISTIFY
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl text-[#6B7280] font-light leading-relaxed mb-12">
              Where <span className="font-bold text-[#2F3A63]">local connections</span> build stronger communities through meaningful exchanges
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-12 py-4 bg-[#2F3A63] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <span className="relative z-10">Get Started Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#465794] to-[#252e4f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group px-12 py-4 border-2 border-[#2F3A63] text-[#2F3A63] rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-[#2F3A63] hover:text-white hover:shadow-xl">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm border-y border-[#2F3A63]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10M+', label: 'Active Users' },
              { number: '50M+', label: 'Listings Posted' },
              { number: '100+', label: 'Cities Served' },
              { number: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl lg:text-5xl font-black text-[#2F3A63] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-[#6B7280] font-medium text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Community gathering"
                  className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#2F3A63]/10 rounded-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#2F3A63]/5 rounded-2xl -z-10"></div>
            </div>
            
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-[#2F3A63]/10 rounded-full text-[#2F3A63] font-semibold text-sm mb-4">
                Our Journey
              </div>
              
              <h2 className="text-5xl font-black text-[#1F2937] leading-tight">
                Building Communities Through Local Exchange
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  What started as a simple idea in a small town has blossomed into a platform connecting millions. 
                  We believe that real community happens when neighbors help neighbors.
                </p>
                
                <p className="text-lg text-[#6B7280] leading-relaxed">
                  Listify was born from the vision that technology should bring people together, not keep them apart. 
                  Every feature, every update, and every decision is guided by our commitment to local connection.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <div className="flex-1 p-6 bg-white rounded-2xl border border-[#2F3A63]/10 shadow-lg">
                  <div className="text-2xl font-black text-[#2F3A63] mb-2">2018</div>
                  <div className="text-[#6B7280]">Founded with a mission to connect communities</div>
                </div>
                <div className="flex-1 p-6 bg-white rounded-2xl border border-[#2F3A63]/10 shadow-lg">
                  <div className="text-2xl font-black text-[#2F3A63] mb-2">2024</div>
                  <div className="text-[#6B7280]">Serving 100+ cities worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F3A63]/10 mb-6">
              <div className="w-1.5 h-1.5 bg-[#2F3A63] rounded-full"></div>
              <span className="text-lg font-semibold text-[#2F3A63]">Our Values</span>
            </div>
            <h2 className="text-7xl font-black text-[#1F2937] mb-6">
              The Principles That Guide Us
            </h2>
            <p className="text-xl text-[#6B7280] max-w-4xl mx-auto">
              Everything we do is built on these core beliefs about community, trust, and connection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[
              {
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
                title: 'Local Trust & Safety',
                description: 'Building secure environments where neighbors can connect with confidence and peace of mind.'
              },
              {
                image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
                title: 'Community First',
                description: 'Every feature designed to strengthen local bonds and foster genuine relationships.'
              },
              {
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
                title: 'Simple & Intuitive',
                description: 'Technology that serves people, not the other way around. Clean, straightforward, and powerful.'
              },
              {
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
                title: 'Sustainable Growth',
                description: 'Growing responsibly while maintaining our commitment to local communities and values.'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#2F3A63]/10 hover:border-[#2F3A63]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-20 h-20 mb-6 rounded-2xl overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={value.image} 
                    alt={value.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-black text-[#1F2937] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-black mb-6">
            Ready to Join Your Community?
          </h2>
          <p className="text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed">
            Start connecting with neighbors, discovering local opportunities, and building meaningful relationships today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="px-12 py-4 bg-[#2F3A63] text-white rounded-2xl font-bold text-lg hover:bg-[#465794] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105">
              Post Your First Ad
            </button>
            <button className="px-12 py-4 border-2 border-[#2F3A63] text-[#2F3A63] rounded-2xl font-bold text-lg hover:bg-[#2F3A63] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;