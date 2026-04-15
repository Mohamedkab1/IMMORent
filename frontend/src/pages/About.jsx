import React from 'react';
import { Link } from 'react-router-dom';
import { HandRaisedIcon, LightBulbIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-hover to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 py-20 px-4 text-center border-b border-primary/20 dark:border-slate-800 relative z-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
           <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
           </svg>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            À propos d'<span className="text-secondary">IMMORent</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-sm">
            La plateforme premium qui révolutionne et simplifie la gestion immobilière partout au Maroc.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 dark:bg-secondary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
              alt="Notre histoire" 
              className="relative rounded-3xl shadow-xl w-full h-auto object-cover z-10 hover:-translate-y-2 transition-transform duration-500" 
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Notre histoire</h2>
            <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            <div className="prose dark:prose-invert prose-lg text-slate-600 dark:text-slate-300">
              <p>
                IMMORent est né d'un constat simple : la gestion immobilière est souvent complexe 
                et chronophage. En 2020, notre fondateur, fort de 15 ans d'expérience dans l'immobilier, 
                a décidé de créer une plateforme qui simplifierait la vie des propriétaires, 
                des agents et des locataires.
              </p>
              <p>
                Aujourd'hui, IMMORent compte plus de 10 000 utilisateurs et 500 biens référencés 
                à travers le Maroc. Notre équipe de passionnés travaille chaque jour pour améliorer 
                nos services et offrir la meilleure expérience possible.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">500+</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Biens</span>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">10k+</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clients</span>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">50+</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Agences</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white inline-block relative mb-16">
            Nos valeurs
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-secondary rounded-full"></div>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HandRaisedIcon, title: 'Confiance', desc: 'Relations durables basées sur la transparence et le respect.', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { icon: LightBulbIcon, title: 'Innovation', desc: 'Technologies avancées pour simplifier la gestion quotidienne.', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
              { icon: StarIcon, title: 'Excellence', desc: 'Service de qualité supérieure à tous nos utilisateurs.', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
              { icon: HeartIcon, title: 'Passion', desc: 'Nous aimons profondément ce que nous faisons chaque jour.', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' }
            ].map((v, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-slate-100 dark:border-slate-700 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 rotate-3 ${v.bg} ${v.color}`}>
                  <v.icon className={`w-8 h-8 ${v.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white inline-block relative mb-16">
            Notre équipe dirigeante
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-secondary rounded-full"></div>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Jean Martin', role: 'Fondateur & CEO' },
              { img: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Sophie Bernard', role: 'Directrice Commerciale' },
              { img: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Pierre Dubois', role: 'Directeur Technique' },
              { img: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Marie Lambert', role: 'Responsable Clientèle' }
            ].map((member, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-slate-100 dark:border-slate-700 transition-all duration-300 group">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/20 dark:bg-secondary/20 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" 
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-primary dark:text-secondary uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">Rejoignez l'aventure IMMORent</h2>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto opacity-90">
              Que vous soyez propriétaire, agent immobilier ou locataire, notre plateforme est conçue sur mesure pour répondre à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-secondary text-primary hover:bg-secondary-hover rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1">
                Créer un compte
              </Link>
              <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-xl font-bold transition-all hover:-translate-y-1">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;