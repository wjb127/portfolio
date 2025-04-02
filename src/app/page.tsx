"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// 포트폴리오 데이터 확장
const portfolioItems = [
  {
    id: "premium-landing",
    title: "프리미엄 랜딩페이지",
    fullTitle: "럭셔리 브랜드 랜딩페이지",
    description: "럭셔리 미니멀리즘을 적용한 고급스러운 브랜드 경험을 제공하는 랜딩페이지입니다. GSAP 애니메이션과 세련된 타이포그래피로 프리미엄 브랜드 가치를 효과적으로 전달합니다.",
    imageUrl: "/portfolio/landing-page-1.jpg",
    link: "https://premium-landing-ab3z55jxe-seungbeen-wis-projects.vercel.app/",
    tags: ["Next.js", "GSAP", "ScrollTrigger", "Google Fonts"]
  },
  {
    id: "travel-landing",
    title: "인터랙티브 랜딩페이지",
    fullTitle: "인터랙티브 랜딩페이지",
    description: "Three.js를 활용한 몰입감 있는 3D 그래픽과 GSAP 애니메이션으로 구현된 인터랙티브 스토리텔링 경험을 제공합니다. Framer Motion을 통한 부드러운 전환 효과로 사용자 경험을 극대화했습니다.",
    imageUrl: "/portfolio/landing-page-2.jpg",
    link: "https://travel-landing-eosin.vercel.app/",
    tags: ["Next.js", "Three.js", "GSAP", "Framer Motion"]
  },
  {
    id: "sales-funnel",
    title: "세일즈퍼널 랜딩페이지",
    fullTitle: "세일즈퍼널 랜딩페이지",
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
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  
  useEffect(() => {
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
          className={`absolute rounded-full ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-800/10'}`}
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
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 활성화된 섹션 추적
  const [activeSection, setActiveSection] = useState("");
  
  // 네비게이션 표시 상태
  const [isNavVisible, setIsNavVisible] = useState(false);
  
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
      const sections = [
        ...portfolioItems.map((item) => item.id),
        'pricing-section',
        'contact-section'
      ];
      
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
    handleScroll();
    
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-950">
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
      {!isLoading && <BackgroundPattern isDarkMode={false} />}
      
      {/* 스크롤 진행 표시기 */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <div className={`flex min-h-screen font-sans transition-colors duration-300 ${
        false ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* 왼쪽 네비게이션 */}
        <nav className={`fixed w-64 h-screen bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg dark:shadow-gray-900/30 flex flex-col transition-all duration-300 ease-in-out ${
          isNavVisible ? 'translate-x-0' : '-translate-x-full'
        } z-40 px-6 py-8`}>
          {/* 로고 섹션 */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative w-32 h-32">
              <Image
                src="/portfolio/logo.jpg"
                alt="DEV1L Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-center">
              데브원엘 포트폴리오
            </h1>
          </div>
          
          {/* 네비게이션 메뉴 */}
          <ul className="space-y-3">
            {portfolioItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsNavVisible(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? "text-blue-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      activeSection === item.id 
                        ? "bg-gradient-to-r from-blue-800 to-blue-950"
                        : "bg-gray-300"
                    }`}></span>
                    {item.title}
                  </div>
                </button>
              </li>
            ))}
            
            {/* 서비스 요금 안내 메뉴 추가 */}
            <li className="relative">
              <button
                onClick={() => {
                  scrollToSection('pricing-section');
                  setIsNavVisible(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'pricing-section'
                    ? "text-blue-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    activeSection === 'pricing-section'
                      ? "bg-gradient-to-r from-blue-800 to-blue-950"
                      : "bg-gray-300"
                  }`}></span>
                  서비스 요금
                </div>
              </button>
            </li>
            
            {/* 연락처 메뉴 */}
            <li className="relative">
              <button
                onClick={() => {
                  scrollToSection('contact-section');
                  setIsNavVisible(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'contact-section'
                    ? "text-blue-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    activeSection === 'contact-section'
                      ? "bg-gradient-to-r from-blue-800 to-blue-950"
                      : "bg-gray-300"
                  }`}></span>
                  연락처
                </div>
              </button>
            </li>
          </ul>
          
          {/* 소셜 링크 - 하단에 고정 */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* GitHub 링크 */}
              <a 
                href="https://github.com/wjb127" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm font-light">GitHub</span>
              </a>

              {/* 이메일 링크 */}
              <a 
                href="mailto:wjb127@naver.com" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
                <span className="ml-2 text-sm font-light">wjb127@naver.com</span>
              </a>
            </div>
          </div>
        </nav>
        
        {/* 네비게이션 토글 버튼 - 스타일 수정 */}
        <button 
          onClick={toggleNav}
          className="fixed top-4 left-4 z-[60] p-2 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-full shadow-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
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

        {/* 메인 콘텐츠 */}
        <main className={`w-full transition-all duration-300 ease-in-out ${
          isNavVisible ? 'ml-64' : 'mx-auto max-w-5xl'
        } snap-y snap-mandatory`}>
          {/* 헤더 섹션 */}
          <section className="h-screen flex flex-col items-center justify-center px-8 snap-start relative overflow-hidden">
            <div className="text-center z-10 animate-on-scroll mb-24">
              {/* 로고 추가 */}
              <div className="relative w-40 h-40 mx-auto mb-8 animate-float">
                <Image
                  src="/portfolio/logo.jpg"
                  alt="DEV1L Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-950 dark:from-blue-700 dark:to-blue-900 tracking-tight leading-tight mb-8">
                웹개발 외주 맡기기 불안하신가요?
              </h1>
              
              {/* 핵심 메시지 3줄 */}
              <div className="space-y-6 mb-8">
                <p className="text-2xl md:text-3xl text-gray-800 font-bold">
                  결과물 먼저 보고 결제하세요
                  <span className="text-blue-600"> - 100% 환불 보장</span>
                </p>
                
                <p className="text-xl md:text-2xl text-gray-700">
                  3일 만에 확인하는 웹사이트 결과물
                </p>
                
                <p className="text-xl md:text-2xl text-gray-600 font-semibold">
                  사업 아이디어, 랜딩페이지로 테스트하고 시작하세요
                </p>
              </div>


            </div>

            {/* 스크롤 다운 버튼 - 위치 조정 */}
            <button
              onClick={() => scrollToSection(portfolioItems[0].id)}
              className="absolute bottom-16 md:bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-full shadow-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>샘플 보기</span>
              <svg 
                className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* 3D 효과 배경 요소 */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-800/10 dark:bg-blue-800/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-900/10 dark:bg-blue-900/20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>
          </section>

          {/* 포트폴리오 아이템 */}
          <div className="px-8 py-20 space-y-40">
            {portfolioItems.map((item, index) => (
              <section 
                key={item.id} 
                id={item.id} 
                ref={(el) => { sectionRefs.current[index] = el; }}
                className="scroll-mt-20 snap-start min-h-[80vh] flex flex-col justify-start md:justify-center relative pt-10 md:pt-0 pb-24 md:pb-32"
              >
                <div 
                  className={`w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-on-scroll transition-all duration-500 ${
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
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                      
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
                      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-950 mb-4 pb-2 relative group">
                        {item.fullTitle || item.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                      </h2>
                      
                      <p className={`${expandedCard === item.id ? 'block' : 'hidden md:block'} text-gray-600 mb-6 font-light leading-relaxed`}>
                        {item.description}
                      </p>
                      
                      {/* 확장된 카드일 때만 보이는 추가 정보 */}
                      {expandedCard === item.id && (
                        <div className={`${expandedCard === item.id ? 'block' : 'hidden md:block'} mb-6 text-gray-600 font-light animate-fadeIn`}>
                          <p className="mb-4">
                            이 프로젝트는 사용자 경험을 최우선으로 고려하여 개발되었습니다. 
                            반응형 디자인과 최적화된 성능으로 모든 디바이스에서 원활하게 작동합니다.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>사용자 중심 UI/UX 디자인</li>
                            <li>신속한 구현 및 배포</li>
                            <li>데이터 시각화 및 분석 기능</li>
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className={`${expandedCard === item.id ? 'block' : 'hidden md:block'}`}>
                          {item.tags.map((tag, tagIndex) => (
                            <span 
                              key={tag} 
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 text-sm rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                              style={{ transitionDelay: `${tagIndex * 50}ms` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium group"
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
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-100 font-medium"
                          >
                            접기
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(item.id);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-100 font-medium"
                          >
                            더 보기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 다음 섹션으로 이동하는 버튼 - 조건문 수정 */}
                {index < portfolioItems.length - 1 ? (
                  <button
                    onClick={() => scrollToSection(portfolioItems[index + 1].id)}
                    className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-full shadow-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 flex items-center space-x-2 group whitespace-nowrap"
                  >
                    <span>다음 프로젝트</span>
                    <svg 
                      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                ) : (
                  // 마지막 포트폴리오 아이템의 버튼을 서비스 요금 버튼으로 변경
                  <button
                    onClick={() => scrollToSection('pricing-section')}
                    className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-full shadow-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 flex items-center space-x-2 group whitespace-nowrap"
                  >
                    <span>서비스 요금 안내</span>
                    <svg 
                      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                )}
              </section>
            ))}
          </div>

          {/* 포트폴리오 아이템 섹션 다음에 추가 */}
          <section id="pricing-section" className="py-24 px-8 bg-gradient-to-b from-white to-gray-50 relative">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-950">
                  서비스 요금 안내
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  비즈니스 성장 단계에 맞는 최적의 웹 솔루션을 제공합니다. 
                  모든 패키지는 고객 맞춤형으로 디테일 조정이 가능합니다.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* 비즈니스 랜딩 패키지 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
                  <div className="space-y-4 flex-grow">
                    <div className="h-16 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">비즈니스 랜딩 패키지</h3>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-gray-500 line-through text-lg mr-2">149,000원</span>
                        <span className="text-3xl font-bold text-red-600">99,000</span>
                        <span className="text-gray-600">원</span>
                      </div>
                      <p className="mt-1 text-xs text-red-600 font-medium">* 첫 구매 할인 (33% 할인)</p>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full">일시불</span>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        3일 이내 빠른 구현
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        모던한 디자인 적용
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        반응형 모바일 지원
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        맞춤형 UI/UX 설계
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">3일 내 결과물 확인</p>
                  </div>
                </div>

                {/* 비즈니스 인사이트 패키지를 BEST로 처리 */}
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                    BEST
                  </div>
                  <div className="space-y-4 flex-grow">
                    <div className="h-16 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white text-center">비즈니스 인사이트 패키지</h3>
                    <div className="text-center text-white">
                      <span className="text-3xl font-bold">299,000</span>
                      <span>원</span>
                      <p className="mt-1 text-sm text-gray-300">+ 유지보수 월 29,000원</p>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="px-3 py-1 bg-yellow-400 text-blue-900 text-xs rounded-full font-bold">데이터 시각화</span>
                    </div>
                    <ul className="space-y-3 text-gray-200">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        랜딩페이지 포함
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        사용자 관리 기능
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        데이터 시각화
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        기본 백엔드 기능
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-800 text-center">
                    <p className="text-sm text-gray-300">1주일 내 결과물 확인</p>
                  </div>
                </div>

                {/* 엔터프라이즈 호스팅 패키지는 BEST 제거하고 일반 스타일로 변경 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
                  <div className="space-y-4 flex-grow">
                    <div className="h-16 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">엔터프라이즈 호스팅 패키지</h3>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-800">499,000</span>
                      <span className="text-gray-600">원</span>
                      <p className="mt-1 text-sm text-gray-600">+ 유지보수 월 39,000원</p>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">AWS 배포</span>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        대시보드 기능 포함
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        AWS 서버 배포
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        CDN 최적화
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        도메인 설정 지원
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">프로젝트 복잡도에 따라 일정 협의</p>
                  </div>
                </div>

                {/* 소유권 이전 패키지 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
                  <div className="space-y-4 flex-grow">
                    <div className="h-16 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">소유권 이전 패키지</h3>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-800">699,000</span>
                      <span className="text-gray-600">원</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">일시불, 이후 유지비 없음</span>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        전체 소스코드
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        데이터베이스 스키마
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        기술 문서 제공
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        설정 가이드
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">프로젝트 완료 후 제공</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-600 mb-16">
                <p>모든 패키지는 2회 무료 수정을 포함합니다</p>
                <p className="mt-2 text-sm">* 추가 기능 및 요청은 별도 협의 가능합니다</p>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('contact-section')}
              className="absolute bottom-16 md:bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-full shadow-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>문의하기</span>
              <svg 
                className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </section>

          {/* footer 부분만 교체 */}
          <footer id="contact-section" className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center space-y-8 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  웹사이트 개발이 필요하신가요?
                </h2>
                <p className="hidden md:block text-xl text-gray-700 font-medium leading-relaxed">
                  랜딩페이지부터 데이터 대시보드까지, <br/>
                  개발자 고용 없이 시작하는 웹 서비스
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 문자 카드 */}
                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">문자 문의</h3>
                    <a
                      href="sms:010-5056-8463"
                      className="block text-lg text-blue-500 hover:text-blue-600 font-medium"
                    >
                      010-5056-8463
                    </a>
                    <p className="text-gray-600">문자로 연락 부탁드립니다</p>
                  </div>
                </div>

                {/* 이메일 카드 */}
                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">이메일 문의</h3>
                    <a
                      href="mailto:wjb127@naver.com"
                      className="block text-lg text-purple-500 hover:text-purple-600 font-medium"
                    >
                      wjb127@naver.com
                    </a>
                    <p className="text-gray-600">24시간 이내 답변 드리겠습니다</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* 로고 플로팅 애니메이션 추가 */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
