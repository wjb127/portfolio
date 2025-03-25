"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// 포트폴리오 데이터 확장
const portfolioItems = [
  {
    id: "premium-landing",
    title: "프리미엄 랜딩페이지",
    fullTitle: "럭셔리 브랜드 프리미엄 랜딩페이지",
    description: "럭셔리 미니멀리즘을 적용한 고급스러운 브랜드 경험을 제공하는 랜딩페이지입니다. GSAP 애니메이션과 세련된 타이포그래피로 프리미엄 브랜드 가치를 효과적으로 전달합니다.",
    imageUrl: "/portfolio/landing-page-1.jpg",
    link: "https://premium-landing-ab3z55jxe-seungbeen-wis-projects.vercel.app/",
    tags: ["Next.js", "GSAP", "ScrollTrigger", "Google Fonts"]
  },
  {
    id: "travel-landing",
    title: "다이나믹 랜딩페이지",
    fullTitle: "인터랙티브 스토리텔링 랜딩페이지",
    description: "Three.js를 활용한 몰입감 있는 3D 그래픽과 GSAP 애니메이션으로 구현된 인터랙티브 스토리텔링 경험을 제공합니다. Framer Motion을 통한 부드러운 전환 효과로 사용자 경험을 극대화했습니다.",
    imageUrl: "/portfolio/landing-page-2.jpg",
    link: "https://travel-landing-eosin.vercel.app/",
    tags: ["Next.js", "Three.js", "GSAP", "Framer Motion"]
  },
  {
    id: "sales-funnel",
    title: "세일즈퍼널 랜딩페이지",
    fullTitle: "고성능 세일즈퍼널 랜딩페이지",
    description: "Next.js와 GSAP의 ScrollTrigger를 통한 인터랙티브한 스크롤 경험을 제공합니다. Tailwind CSS로 세련된 디자인을 구현했습니다.",
    imageUrl: "/portfolio/landing-page-3.jpg",
    link: "https://ebook-landing-drab.vercel.app/",
    tags: ["Next.js", "GSAP", "ScrollTrigger", "Tailwind CSS"]
  },
  {
    id: "analytics-dashboard",
    title: "사용자 분석 대시보드",
    fullTitle: "실시간 사용자 분석 대시보드",
    description: "Next.js와 Supabase를 활용한 풀스택 대시보드 솔루션입니다. Tailwind CSS의 고급 기능을 활용하여 반응형 레이아웃과 다크모드를 구현했으며, 실시간 데이터 시각화를 제공합니다.",
    imageUrl: "/portfolio/analytics-dashboard.jpg",
    link: "https://ebook-landing-bh81r2n5q-seungbeen-wis-projects.vercel.app/dashboard",
    tags: ["Next.js", "Supabase", "Tailwind CSS", "Real-time Data"]
  }
];

// 패턴 타입 정의
interface Pattern {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

// 새로운 CSS 애니메이션을 위한 스타일 추가
const floatAnimation = `
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
`;

// 배경 패턴 컴포넌트 - 클라이언트에서만 렌더링
function BackgroundPattern({ isDarkMode }: { isDarkMode: boolean }) {
  const [patterns, setPatterns] = useState<Pattern[]>([]); // any 대신 Pattern[] 사용
  
  useEffect(() => {
    // 클라이언트에서만 패턴 생성
    const newPatterns = Array(15).fill(0).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setPatterns(newPatterns);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {patterns.map((el) => (
        <div
          key={el.id}
          className={`absolute rounded-full ${isDarkMode ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}
          style={{
            width: `${el.size}px`,
            height: `${el.size}px`,
            left: `${el.x}%`,
            top: `${el.y}%`,
            animation: `float ${el.duration}s infinite ease-in-out ${el.delay}s`
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  // 스크롤 기능 구현
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 활성화된 섹션 추적
  const [activeSection, setActiveSection] = useState("");
  
  // 네비게이션 표시 상태
  const [isNavVisible, setIsNavVisible] = useState(true);
  
  // 다크모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 확장된 카드 상태
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // 페이지 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 스크롤 진행 상태
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // 애니메이션 관찰자 설정
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // 스크롤 스냅 섹션 설정
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // 카드 호버 상태
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // 네비게이션 토글 함수
  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };
  
  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // HTML 요소에 다크모드 클래스 추가/제거
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 로컬 스토리지에 설정 저장
    localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
  };
  
  // 카드 확장 토글 함수
  const toggleCardExpand = (id: string) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      // 활성 섹션 추적
      const sections = portfolioItems.map((item) => item.id);
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      // 스크롤 진행 상태 계산
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 로드 시 실행
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // 애니메이션 효과를 위한 Intersection Observer 설정
  useEffect(() => {
    // 이전 옵저버 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // 새 옵저버 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 요소가 화면에 나타날 때 애니메이션 클래스 추가
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    
    // 애니메이션 적용할 요소들 선택 및 초기 상태 설정
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
      // 초기 상태 설정 - 투명하게
      el.classList.add('opacity-0');
      // 옵저버에 등록
      observerRef.current?.observe(el);
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // 다크모드 초기 설정
  useEffect(() => {
    // 로컬 스토리지에서 다크모드 설정 확인
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // 저장된 설정이 있으면 그 설정 사용, 없으면 시스템 설정 사용
    const prefersDark = savedDarkMode 
      ? savedDarkMode === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // 페이지 로딩 효과
  useEffect(() => {
    // 페이지 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 스타일 태그 추가 */}
      <style jsx global>{floatAnimation}</style>
      
      {/* 로딩 화면 - 개선된 애니메이션 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="text-white text-4xl font-black relative">
            <div className="flex flex-col items-center">
              <span className="mb-4 relative">
                개발자 포트폴리오
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-white"></span>
              </span>
              <div className="w-48 h-1 bg-white/30 rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full"
                  style={{
                    width: '60%',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                ></div>
              </div>
              <div className="mt-8 text-sm font-light">환영합니다</div>
            </div>
          </div>
        </div>
      )}
      
      {/* 배경 패턴 - 클라이언트 컴포넌트로 교체 */}
      {!isLoading && <BackgroundPattern isDarkMode={isDarkMode} />}
      
      {/* 스크롤 진행 표시기 */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <div className={`flex min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* 왼쪽 네비게이션 */}
        <nav className={`fixed w-64 h-screen bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg dark:shadow-gray-900/30 p-6 overflow-auto transition-all duration-300 ease-in-out ${
          isNavVisible ? 'translate-x-0' : '-translate-x-full'
        } z-40`}>
          <div className="mb-10">
            {/* 상단 여백 추가 */}
            <div className="h-10"></div>
            
            {/* 제목 */}
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight text-center mb-4">
              개발자 포트폴리오
            </h1>
            
            {/* 네비게이션 메뉴 */}
            <ul className="space-y-4 mt-8">
              {portfolioItems.map((item) => (
                <li key={item.id} className="relative">
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg -z-10"></div>
                  )}
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      activeSection === item.id
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        activeSection === item.id 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}></span>
                      {item.title}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Next.js, Vercel, Supabase를 활용한 웹 개발 서비스를 제공합니다.
              </p>
              <div className="mt-4 flex space-x-3">
                <a 
                  href="https://github.com/wjb127" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        {/* 네비게이션 토글 버튼 */}
        <button 
          onClick={toggleNav}
          className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label={isNavVisible ? "네비게이션 숨기기" : "네비게이션 보이기"}
        >
          {isNavVisible ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
        
        {/* 다크모드 토글 버튼 */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          )}
        </button>

        {/* 메인 콘텐츠 */}
        <main className={`w-full transition-all duration-300 ease-in-out ${
          isNavVisible ? 'ml-64' : 'ml-0'
        } snap-y snap-mandatory`}>
          {/* 헤더 섹션 */}
          <section className="h-screen flex flex-col items-center justify-center px-8 snap-start relative overflow-hidden">
            <div className="text-center z-10 animate-on-scroll">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight leading-tight mb-4">
                웹 개발 포트폴리오
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
              <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                Next.js와 Supabase를 활용한 풀스택 웹 개발 서비스를 제공합니다.
                크몽에서 다양한 웹 개발 프로젝트를 진행하고 있습니다.
              </p>
              
              <div className="mt-10">
                <button
                  onClick={() => scrollToSection(portfolioItems[0].id)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium group"
                >
                  프로젝트 보기
                  <svg className="w-5 h-5 ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 3D 효과 배경 요소 */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            {/* 스크롤 유도 아이콘 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </section>

          {/* 포트폴리오 아이템 */}
          <div className="px-8 py-20 space-y-40">
            {portfolioItems.map((item, index) => (
              <section 
                key={item.id} 
                id={item.id} 
                ref={(el) => { sectionRefs.current[index] = el; }}
                className={`scroll-mt-20 snap-start min-h-[80vh] flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div 
                  className={`w-full max-w-5xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-on-scroll transition-all duration-500 ${
                    expandedCard === item.id 
                      ? 'scale-105 shadow-2xl z-20' 
                      : hoveredCard === item.id 
                        ? 'shadow-xl -translate-y-2' 
                        : ''
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => toggleCardExpand(item.id)}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`${expandedCard === item.id ? 'block' : 'md:flex'}`}>
                    <div className={`${expandedCard === item.id ? 'w-full h-80' : 'md:w-1/2'} relative h-64 md:h-auto overflow-hidden group`}>
                      {/* 이미지 로딩 실패시 보여줄 백업 UI */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
                      
                      {/* 실제 이미지 */}
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="p-8 md:w-1/2">
                      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 pb-2 relative group">
                        {item.fullTitle || item.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 font-light leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* 확장된 카드일 때만 보이는 추가 정보 */}
                      {expandedCard === item.id && (
                        <div className="mb-6 text-gray-600 dark:text-gray-300 font-light animate-fadeIn">
                          <p className="mb-4">
                            이 프로젝트는 사용자 경험을 최우선으로 고려하여 개발되었습니다. 
                            반응형 디자인과 최적화된 성능으로 모든 디바이스에서 원활하게 작동합니다.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>사용자 중심 UI/UX 디자인</li>
                            <li>SEO 최적화 및 성능 개선</li>
                            <li>데이터 시각화 및 분석 기능</li>
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags.map((tag, tagIndex) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                            style={{ transitionDelay: `${tagIndex * 50}ms` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          프로젝트 보기
                          <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                        </a>
                        
                        {expandedCard === item.id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(null);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                          >
                            접기
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(item.id);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                          >
                            더 보기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* 푸터 */}
          <footer className="py-20 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 animate-on-scroll snap-start">
            <div className="max-w-4xl mx-auto px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                  함께 일해보세요
                </h2>
                <p className="text-gray-600 dark:text-gray-300 font-light max-w-xl mx-auto">
                  새로운 프로젝트를 시작하거나 기존 프로젝트를 개선하고 싶으신가요? 
                  언제든지 연락주세요.
                </p>
              </div>
              
              <div className="flex justify-center space-x-6 mb-8">
                <a href="mailto:contact@example.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </a>
                <a 
                  href="https://github.com/wjb127" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="font-light">© 2023 웹 개발 포트폴리오. All rights reserved.</p>
                <p className="mt-2 text-sm tracking-wide">Next.js, Vercel, Supabase로 구현되었습니다.</p>
                
                {/* 개인 서명 */}
                <div className="mt-6 inline-block">
                  <svg width="80" height="30" viewBox="0 0 80 30" className="text-gray-400 dark:text-gray-600">
                    <path d="M10,15 Q20,5 30,15 T50,15 T70,15" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
