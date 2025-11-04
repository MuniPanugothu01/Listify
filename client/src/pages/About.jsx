import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CountUp = ({ end, suffix, duration = 2500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const stats = [
    { end: 10, suffix: 'M+', label: 'Active Users' },
    { end: 50, suffix: 'M+', label: 'Listings Posted' },
    { end: 100, suffix: '+', label: 'Cities Served' },
    { end: 99, suffix: '%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="bg-[#F3F3F3] text-[#2F3A63]">
      {/* Hero Section */}
      <section className="relative py-2 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#F8F8F8] via-white to-[#ECEDEE]">
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-[#2F3A63]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#2F3A63]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        
        <motion.div 
          className="relative max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#2F3A63]/10 mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="w-2 h-2 bg-[#2F3A63] rounded-full animate-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <span className="text-lg font-semibold text-[#2F3A63]">About Listify</span>
          </motion.div>
          
          <motion.h1 
            className="text-7xl md:text-9xl font-black bg-gradient-to-r from-[#1F2937] to-[#2F3A63] bg-clip-text text-transparent mb-8 leading-tight"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            LISTIFY
          </motion.h1>
          
          <motion.div className="max-w-2xl mx-auto" variants={itemVariants}>
            <motion.p 
              className="text-2xl md:text-3xl text-[#6B7280] font-light leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Where <span className="font-bold text-[#2F3A63]">local connections</span> build stronger communities through meaningful exchanges
            </motion.p>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={itemVariants}>
            <motion.button 
              className="group relative px-12 py-4 bg-[#2F3A63] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get Started Today</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#465794] to-[#252e4f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.button>
            
            <motion.button 
              className="group px-12 py-4 border-2 border-[#2F3A63] text-[#2F3A63] rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-[#2F3A63] hover:text-white hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm border-y border-[#2F3A63]/10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl lg:text-5xl font-black text-[#2F3A63] mb-2  transition-transform duration-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </motion.div>
                <div className="text-[#6B7280] font-medium text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <motion.div 
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <motion.img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Community gathering"
                  className="w-full h-[500px] object-cover transform hover: transition-transform duration-700"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#2F3A63]/10 rounded-3xl -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <motion.div 
                className="absolute -top-6 -left-6 w-32 h-32 bg-[#2F3A63]/5 rounded-2xl -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>
            
            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div 
                className="inline-block px-4 py-2 bg-[#2F3A63]/10 rounded-full text-[#2F3A63] font-semibold text-sm mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Journey
              </motion.div>
              
              <motion.h2 
                className="text-5xl font-black text-[#1F2937] leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Building Communities Through Local Exchange
              </motion.h2>
              
              <div className="space-y-6">
                <motion.p 
                  className="text-lg text-[#6B7280] leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  What started as a simple idea in a small town has blossomed into a platform connecting millions. 
                  We believe that real community happens when neighbors help neighbors.
                </motion.p>
                
                <motion.p 
                  className="text-lg text-[#6B7280] leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Listify was born from the vision that technology should bring people together, not keep them apart. 
                  Every feature, every update, and every decision is guided by our commitment to local connection.
                </motion.p>
              </div>

              <motion.div 
                className="flex gap-4 pt-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div 
                  className="flex-1 p-6 bg-white rounded-2xl border border-[#2F3A63]/10 shadow-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-2xl font-black text-[#2F3A63] mb-2">2018</div>
                  <div className="text-[#6B7280]">Founded with a mission to connect communities</div>
                </motion.div>
                <motion.div 
                  className="flex-1 p-6 bg-white rounded-2xl border border-[#2F3A63]/10 shadow-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-2xl font-black text-[#2F3A63] mb-2">2024</div>
                  <div className="text-[#6B7280]">Serving 100+ cities worldwide</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F8F8F8]">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-20" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F3A63]/10 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-1.5 h-1.5 bg-[#2F3A63] rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-[#2F3A63]">Our Values</span>
            </motion.div>
            <motion.h2 
              className="text-7xl font-black text-[#1F2937] mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The Principles That Guide Us
            </motion.h2>
            <motion.p 
              className="text-xl text-[#6B7280] max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything we do is built on these core beliefs about community, trust, and connection
            </motion.p>
          </motion.div>

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
              <motion.div
                key={index}
                className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#2F3A63]/10 hover:border-[#2F3A63]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-20 h-20 mb-6 rounded-2xl overflow-hidden transform  transition-transform duration-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.img 
                    src={value.image} 
                    alt={value.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-black text-[#1F2937] mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {value.title}
                </motion.h3>
                <motion.p 
                  className="text-[#6B7280] leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {value.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </motion.div>
        
        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-5xl font-black text-black mb-6"
            variants={itemVariants}
          >
            Ready to Join Your Community?
          </motion.h2>
          <motion.p 
            className="text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Start connecting with neighbors, discovering local opportunities, and building meaningful relationships today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            
            
            <motion.button 
              className="px-12 py-4 bg-[#2F3A63] text-white rounded-2xl font-bold text-lg hover:bg-[#465794] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post Your First Ad
            </motion.button>
            <motion.button 
              className="px-12 py-4 border-2 border-[#2F3A63] text-[#2F3A63] rounded-2xl font-bold text-lg hover:bg-[#2F3A63] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Listings
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default About;