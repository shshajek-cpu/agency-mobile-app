import { useState } from 'react';
import './App.css';

const SERVICE_OPTIONS = ['마케팅', '웹 개발', '자동화', '디자인'];
const BUDGET_OPTIONS = ['100만원 미만', '100~300만원', '300~500만원', '500만원 이상', '상담 후 결정'];
const TIMELINE_OPTIONS = ['즉시', '1개월 내', '3개월 내', '미정'];
const CONTACT_OPTIONS = ['전화', '카카오톡', '이메일'];
const UNSURE_OPTION = '잘 모르겠어요';

interface FormData {
  budget: string;
  timeline: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
}

type ErrorMap = Partial<Record<keyof FormData | 'services', string>>;

interface ServiceItem {
  id: number;
  category: string;
  title: string;
  description: string;
  includes: string[];
  process: { step: string; desc: string }[];
  duration: string;
  priceRange: string;
  portfolio?: { title: string; result: string }[];
  review?: { name: string; text: string; result: string };
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1, category: '마케팅',
    title: 'SNS 퍼포먼스 마케팅',
    description: '인스타그램, 페이스북 등 SNS 채널을 활용한 데이터 기반 광고 운영으로 최적의 ROAS를 달성합니다.',
    includes: ['광고 계정 세팅 및 최적화', '타겟 오디언스 분석', '크리에이티브 3종 제작', '월간 성과 리포트', '담당 매니저 1:1 배정'],
    process: [
      { step: '상담', desc: '목표 및 현황 파악' },
      { step: '분석', desc: '시장 및 경쟁사 조사' },
      { step: '전략', desc: '맞춤 전략 수립' },
      { step: '실행', desc: '광고 운영 및 최적화' },
      { step: '리포트', desc: '성과 분석 및 개선' },
    ],
    duration: '월 단위 운영',
    priceRange: '월 50만원~',
    portfolio: [{ title: '패션 브랜드 A', result: 'ROAS 420%' }, { title: '뷰티 브랜드 B', result: '전환율 +180%' }],
    review: { name: '김OO 대표', text: '첫 달부터 ROAS가 3배 이상 나왔어요.', result: 'ROAS 420% 달성' },
  },
  {
    id: 2, category: '마케팅',
    title: 'SEO 검색엔진 최적화',
    description: '웹사이트의 검색 노출을 극대화하여 자연 유입 트래픽을 높이는 전략적 SEO 서비스입니다.',
    includes: ['키워드 리서치 및 전략', '온페이지 SEO 최적화', '콘텐츠 SEO 가이드', '월간 순위 리포트', '기술 SEO 진단'],
    process: [
      { step: '진단', desc: '현재 SEO 상태 분석' },
      { step: '키워드', desc: '타겟 키워드 선정' },
      { step: '최적화', desc: '사이트 구조 개선' },
      { step: '콘텐츠', desc: 'SEO 콘텐츠 제작' },
      { step: '모니터링', desc: '순위 추적 및 개선' },
    ],
    portfolio: [{ title: 'IT 스타트업 C', result: '검색 유입 +250%' }, { title: '교육 플랫폼 D', result: '상위 노출 15개' }],
    review: { name: '박OO 팀장', text: '검색 유입이 2.5배 늘었습니다.', result: '검색 유입 250% 증가' },
    duration: '3개월~',
    priceRange: '월 80만원~',
  },
  {
    id: 3, category: '웹 개발',
    title: '반응형 브랜드 웹사이트',
    description: '브랜드의 가치를 담은 반응형 웹사이트를 기획부터 개발까지 원스톱으로 제작합니다.',
    includes: ['기획 및 와이어프레임', 'UI/UX 디자인', '반응형 퍼블리싱', 'CMS 연동', '도메인/호스팅 세팅'],
    process: [
      { step: '기획', desc: '요구사항 정의' },
      { step: '디자인', desc: 'UI/UX 설계' },
      { step: '개발', desc: '퍼블리싱 및 기능 구현' },
      { step: '검수', desc: 'QA 및 수정' },
      { step: '런칭', desc: '배포 및 운영 가이드' },
    ],
    portfolio: [{ title: 'IT 스타트업 E', result: '문의량 +230%' }, { title: '컨설팅 회사 F', result: '이탈률 -45%' }],
    review: { name: '이OO 팀장', text: '문의량이 2배 넘게 늘었습니다.', result: '문의량 230% 증가' },
    duration: '4~8주',
    priceRange: '200만원~',
  },
  {
    id: 4, category: '웹 개발',
    title: '랜딩페이지 제작',
    description: '전환율에 최적화된 랜딩페이지를 빠르게 제작하여 마케팅 캠페인 효과를 극대화합니다.',
    includes: ['전환 최적화 기획', '디자인 1페이지', '반응형 개발', '폼 연동', 'A/B 테스트 세팅'],
    process: [
      { step: '기획', desc: '전환 구조 설계' },
      { step: '디자인', desc: '시안 제작' },
      { step: '개발', desc: '퍼블리싱' },
      { step: '테스트', desc: '전환 테스트' },
    ],
    portfolio: [{ title: '헬스케어 G', result: '전환율 12.5%' }, { title: 'SaaS H', result: '가입률 +85%' }],
    review: { name: '최OO 마케터', text: '랜딩페이지 전환율이 기대 이상이었어요.', result: '전환율 12.5% 달성' },
    duration: '1~2주',
    priceRange: '80만원~',
  },
  {
    id: 5, category: '자동화',
    title: '업무 프로세스 자동화',
    description: '반복적인 업무를 자동화하여 인력과 시간을 절감하고 업무 효율을 극대화합니다.',
    includes: ['업무 프로세스 분석', '자동화 시나리오 설계', '워크플로우 구축', '테스트 및 안정화', '운영 매뉴얼 제공'],
    process: [
      { step: '분석', desc: '현재 업무 흐름 파악' },
      { step: '설계', desc: '자동화 시나리오 수립' },
      { step: '구축', desc: '워크플로우 개발' },
      { step: '테스트', desc: '시나리오별 검증' },
      { step: '인수', desc: '운영 교육 및 인계' },
    ],
    portfolio: [{ title: '제조업체 I', result: '월 40시간 절감' }, { title: '유통 회사 J', result: '오류율 -90%' }],
    review: { name: '박OO 이사', text: '매달 40시간 이상을 절약하고 있습니다.', result: '월 40시간 절감' },
    duration: '2~6주',
    priceRange: '150만원~',
  },
  {
    id: 6, category: '디자인',
    title: '브랜드 아이덴티티 디자인',
    description: '로고, 컬러, 타이포그래피 등 일관된 브랜드 아이덴티티를 구축하여 브랜드 인지도를 높입니다.',
    includes: ['브랜드 전략 수립', '로고 디자인 (3안)', '브랜드 컬러 및 타이포', '명함/브랜드 키트', '브랜드 가이드라인'],
    process: [
      { step: '리서치', desc: '브랜드 방향성 도출' },
      { step: '컨셉', desc: '디자인 컨셉 제안' },
      { step: '디자인', desc: '시안 제작 및 수정' },
      { step: '확장', desc: '응용 디자인 제작' },
      { step: '전달', desc: '가이드라인 납품' },
    ],
    portfolio: [{ title: '카페 브랜드 K', result: '인지도 +200%' }, { title: '스타트업 L', result: '투자 유치 성공' }],
    review: { name: '정OO 대표', text: '브랜드 리뉴얼 후 고객 반응이 확연히 달라졌어요.', result: '브랜드 인지도 200% 증가' },
    duration: '3~5주',
    priceRange: '200만원~',
  },
];

const categoryGradient = (category: string) => {
  if (category === '마케팅') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  if (category === '웹 개발') return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
  if (category === '자동화') return 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)';
  if (category === '디자인') return 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)';
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
};

interface CategoryInfo {
  name: string;
  headline: string;
  description: string;
  highlights: string[];
  stats: { label: string; value: string }[];
}

const CATEGORY_DATA: CategoryInfo[] = [
  {
    name: '마케팅',
    headline: '데이터로 증명하는\n마케팅 성과',
    description: 'SNS 광고, 검색엔진 최적화 등 디지털 마케팅 전 영역을 데이터 기반으로 운영합니다.',
    highlights: ['퍼포먼스 마케팅', 'SEO 최적화', '콘텐츠 마케팅', '브랜드 전략'],
    stats: [{ label: '평균 ROAS', value: '380%' }, { label: '운영 브랜드', value: '80+' }],
  },
  {
    name: '웹 개발',
    headline: '비즈니스를 담는\n웹사이트 제작',
    description: '반응형 웹사이트부터 랜딩페이지까지, 전환율에 최적화된 웹 경험을 설계합니다.',
    highlights: ['브랜드 웹사이트', '랜딩페이지', '쇼핑몰 구축', '웹 앱 개발'],
    stats: [{ label: '제작 사이트', value: '120+' }, { label: '평균 전환율', value: '+180%' }],
  },
  {
    name: '자동화',
    headline: '반복 업무를\n자동으로 처리',
    description: '수작업을 자동화하여 시간과 비용을 절감하고, 핵심 업무에 집중할 수 있게 합니다.',
    highlights: ['업무 프로세스 자동화', '챗봇/CS 자동화', '데이터 연동', 'API 통합'],
    stats: [{ label: '평균 절감 시간', value: '월 40h' }, { label: '오류 감소', value: '-90%' }],
  },
  {
    name: '디자인',
    headline: '브랜드의 첫인상을\n디자인합니다',
    description: '로고, 브랜드 아이덴티티부터 UI/UX까지, 일관된 브랜드 경험을 구축합니다.',
    highlights: ['브랜드 아이덴티티', 'UI/UX 디자인', '콘텐츠 디자인', '패키지 디자인'],
    stats: [{ label: '완료 프로젝트', value: '90+' }, { label: '고객 만족도', value: '98%' }],
  },
];

const FAQ_DATA = [
  { q: '상담은 무료인가요?', a: '네, 초기 상담은 완전 무료입니다. 프로젝트 범위와 요구사항을 파악한 후 맞춤 견적을 안내해드립니다.' },
  { q: '프로젝트 기간은 얼마나 걸리나요?', a: '프로젝트 유형에 따라 다릅니다. 랜딩페이지는 1~2주, 브랜드 웹사이트는 4~8주, 마케팅 운영은 월 단위로 진행됩니다.' },
  { q: '수정은 몇 번까지 가능한가요?', a: '기본 2회의 수정을 포함하며, 추가 수정이 필요한 경우 상담을 통해 유연하게 조율합니다.' },
  { q: '계약 전에 포트폴리오를 볼 수 있나요?', a: '물론입니다. 상담 시 관련 업종의 포트폴리오와 성과 데이터를 함께 공유해드립니다.' },
  { q: '중간에 프로젝트를 취소할 수 있나요?', a: '진행 단계에 따라 환불 정책이 달라집니다. 착수 전이라면 전액 환불이 가능하며, 상세한 내용은 계약 시 안내드립니다.' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'list' | 'detail' | 'consultation'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [consultationStep, setConsultationStep] = useState(1);
  const [consultationDone, setConsultationDone] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    budget: '', timeline: '', description: '', name: '', phone: '', email: '', contactMethod: '전화',
  });
  const [errors, setErrors] = useState<ErrorMap>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView('category');
    setActiveTab('list');
  };

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedCategory(service.category);
    setCurrentView('detail');
  };

  const handleBack = () => {
    if (currentView === 'consultation') {
      if (consultationDone) {
        setCurrentView('home');
        setActiveTab('home');
        setConsultationStep(1);
        setConsultationDone(false);
        setSelectedServices([]);
        setFormData({ budget: '', timeline: '', description: '', name: '', phone: '', email: '', contactMethod: '전화' });
        setErrors({});
      } else if (consultationStep > 1) {
        setConsultationStep(s => s - 1);
        setErrors({});
      } else {
        setCurrentView('home');
        setActiveTab('home');
        setConsultationStep(1);
        setSelectedServices([]);
        setFormData({ budget: '', timeline: '', description: '', name: '', phone: '', email: '', contactMethod: '전화' });
        setErrors({});
      }
    } else if (currentView === 'detail') {
      setCurrentView('category');
      setActiveTab('home');
    } else if (currentView === 'category') {
      setCurrentView('home');
      setActiveTab('home');
    } else {
      setCurrentView('home');
      setActiveTab('home');
    }
  };

  const goToConsultation = (preselectedService?: string) => {
    setConsultationStep(1);
    setConsultationDone(false);
    setErrors({});
    setFormData({ budget: '', timeline: '', description: '', name: '', phone: '', email: '', contactMethod: '전화' });
    setSelectedServices(preselectedService ? [preselectedService] : []);
    setCurrentView('consultation');
    setActiveTab('consultation');
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const filtered = prev.filter((s) => s !== UNSURE_OPTION);
      return filtered.includes(service) ? filtered.filter((s) => s !== service) : [...filtered, service];
    });
    setErrors((prev) => ({ ...prev, services: undefined }));
  };

  const handleUnsure = () => {
    setSelectedServices([UNSURE_OPTION]);
    setErrors((prev) => ({ ...prev, services: undefined }));
  };

  const goNextStep = () => {
    if (consultationStep === 1) {
      if (selectedServices.length === 0) { setErrors({ services: '서비스를 하나 이상 선택해주세요.' }); return; }
      setErrors({}); setConsultationStep(2);
    } else if (consultationStep === 2) {
      const e: ErrorMap = {};
      if (!formData.budget) e.budget = '예산 범위를 선택해주세요.';
      if (!formData.timeline) e.timeline = '희망 일정을 선택해주세요.';
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({}); setConsultationStep(3);
    } else if (consultationStep === 3) {
      const e: ErrorMap = {};
      if (!formData.name.trim()) e.name = '이름을 입력해주세요.';
      if (!formData.phone.trim()) e.phone = '연락처를 입력해주세요.';
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({}); setConsultationDone(true);
    }
  };

  const goPrevStep = () => { if (consultationStep > 1) { setConsultationStep((s) => s - 1); setErrors({}); } };

  const serviceIcon = (s: string) =>
    s === '마케팅' ? '📣' : s === '웹 개발' ? '💻' : s === '자동화' ? '⚙️' : s === '디자인' ? '🎨' : '';

  const renderHomeView = () => (
    <main className="main-content flex-col">
      {/* Banner */}
      <section className="banner-section">
        <div className="banner flex-col" style={{ position: 'relative', overflow: 'hidden' }}>
          <h2 className="banner-title" style={{ position: 'relative', zIndex: 1 }}>비즈니스의 성장을<br />디자인합니다</h2>
          <div className="banner-action flex-row justify-between" style={{ position: 'relative', zIndex: 1 }}>
            <span className="banner-subtitle">무료 컨설팅 신청하기</span>
            <button className="banner-btn flex-row justify-center" onClick={() => goToConsultation()}>
              신청
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Service Navigation */}
      <section className="search-section flex-col">
        <div style={{ padding: '20px 20px 12px' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>서비스 찾기</span>
        </div>
        <div className="search-cards flex-col" style={{ padding: '0 20px', gap: 10 }}>
          <div className="search-card flex-row items-center" onClick={() => handleCategoryClick('마케팅')}>
            <div className="search-card-icon" style={{ background: '#111' }}>
              <img src="/icon-marketing.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div className="flex-col" style={{ flex: 1, gap: 2 }}>
              <span className="search-card-title">마케팅</span>
              <span className="search-card-desc">SNS 광고, SEO, 콘텐츠 마케팅</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div className="search-card flex-row items-center" onClick={() => handleCategoryClick('웹 개발')}>
            <div className="search-card-icon" style={{ background: '#111' }}>
              <img src="/icon-webdev.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div className="flex-col" style={{ flex: 1, gap: 2 }}>
              <span className="search-card-title">웹 개발</span>
              <span className="search-card-desc">웹사이트, 랜딩페이지, 쇼핑몰</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div className="search-card flex-row items-center" onClick={() => handleCategoryClick('자동화')}>
            <div className="search-card-icon" style={{ background: '#111' }}>
              <img src="/icon-automation.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div className="flex-col" style={{ flex: 1, gap: 2 }}>
              <span className="search-card-title">자동화</span>
              <span className="search-card-desc">업무 자동화, 챗봇, 데이터 연동</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div className="search-card flex-row items-center" onClick={() => handleCategoryClick('디자인')}>
            <div className="search-card-icon" style={{ background: '#111' }}>
              <img src="/icon-design.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div className="flex-col" style={{ flex: 1, gap: 2 }}>
              <span className="search-card-title">디자인</span>
              <span className="search-card-desc">브랜딩, UI/UX, 콘텐츠 디자인</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="trust-stats flex-row" style={{ marginTop: 24 }}>
        <div className="stat-item flex-col">
          <span className="stat-number">150+</span>
          <span className="stat-label">완료 프로젝트</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item flex-col">
          <span className="stat-number">98%</span>
          <span className="stat-label">고객 만족도</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item flex-col">
          <span className="stat-number">4.9</span>
          <span className="stat-label">평균 평점</span>
        </div>
      </section>

      {/* Free Benefits Carousel */}
      <section className="free-benefit-section" style={{ paddingTop: 24 }}>
        <h3 className="section-title">무료혜택 경험하기</h3>
        <div className="h-scroll flex-row no-scrollbar" style={{ padding: '0 20px' }}>
          <div className="free-benefit-card" style={{ background: '#000' }}>
            <div className="free-benefit-overlay" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <div className="free-benefit-content">
              <span className="free-benefit-tag" style={{ background: 'rgba(255,255,255,0.15)' }}>FREE</span>
              <span className="free-benefit-title">무료 마케팅 진단</span>
              <span className="free-benefit-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>현재 마케팅 상태를 무료로 분석해드려요</span>
              <button className="free-benefit-btn" onClick={() => goToConsultation('마케팅')}>체험하기</button>
            </div>
          </div>
          <div className="free-benefit-card" style={{ background: '#000' }}>
            <div className="free-benefit-overlay" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <div className="free-benefit-content">
              <span className="free-benefit-tag" style={{ background: 'rgba(255,255,255,0.15)' }}>FREE</span>
              <span className="free-benefit-title">웹사이트 성능 리포트</span>
              <span className="free-benefit-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>사이트 속도와 SEO 점수를 확인하세요</span>
              <button className="free-benefit-btn" onClick={() => goToConsultation('웹 개발')}>체험하기</button>
            </div>
          </div>
          <div className="free-benefit-card" style={{ background: '#000' }}>
            <div className="free-benefit-overlay" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <div className="free-benefit-content">
              <span className="free-benefit-tag" style={{ background: 'rgba(255,255,255,0.15)' }}>FREE</span>
              <span className="free-benefit-title">자동화 컨설팅</span>
              <span className="free-benefit-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>업무 자동화 가능성을 무료로 상담받으세요</span>
              <button className="free-benefit-btn" onClick={() => goToConsultation('자동화')}>체험하기</button>
            </div>
          </div>
          <div className="free-benefit-card spacer" />
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section flex-col">
        <h3 className="section-title">고객 후기</h3>
        <div className="h-scroll flex-row no-scrollbar" style={{ padding: '0 20px' }}>
          <div className="review-card flex-col">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"SNS 광고를 직접 해보다가 의뢰했는데, 첫 달부터 ROAS가 3배 이상 나왔어요."</p>
            <div className="review-author flex-row items-center">
              <div className="author-avatar">K</div>
              <div className="author-info flex-col">
                <span className="author-name">김OO 대표</span>
                <span className="author-company">패션 브랜드</span>
              </div>
            </div>
            <div className="review-result flex-row justify-between items-center">
              <span className="result-label">성과</span>
              <span className="result-value">ROAS 420% 달성</span>
            </div>
          </div>
          <div className="review-card flex-col">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"웹사이트 리뉴얼 후 문의량이 2배 넘게 늘었습니다. 디자인도 만족스럽고 소통이 빨라서 좋았어요."</p>
            <div className="review-author flex-row items-center">
              <div className="author-avatar">이</div>
              <div className="author-info flex-col">
                <span className="author-name">이OO 팀장</span>
                <span className="author-company">IT 스타트업</span>
              </div>
            </div>
            <div className="review-result flex-row justify-between items-center">
              <span className="result-label">성과</span>
              <span className="result-value">문의량 230% 증가</span>
            </div>
          </div>
          <div className="review-card flex-col">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"반복 업무 자동화로 매달 40시간 이상을 절약하고 있습니다. 투자 대비 효과가 확실해요."</p>
            <div className="review-author flex-row items-center">
              <div className="author-avatar">박</div>
              <div className="author-info flex-col">
                <span className="author-name">박OO 이사</span>
                <span className="author-company">제조업체</span>
              </div>
            </div>
            <div className="review-result flex-row justify-between items-center">
              <span className="result-label">성과</span>
              <span className="result-value">월 40시간 절감</span>
            </div>
          </div>
          <div className="review-card spacer" />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta-section">
        <div className="bottom-cta-card flex-col">
          <img src="/mascot-thinking.png" alt="" style={{ height: 70, width: 'auto', marginBottom: 8 }} />
          <h3 className="bottom-cta-title">어떤 서비스가 필요한지<br/>모르겠다면?</h3>
          <p className="bottom-cta-desc">전문 매니저가 무료로 상담해드립니다</p>
          <button className="bottom-cta-btn" onClick={() => goToConsultation()}>무료 상담 받기</button>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section flex-col">
        <h3 className="section-title">자주 묻는 질문</h3>
        <div className="faq-list">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className={`faq-item${openFaqIndex === i ? ' open' : ''}`} onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}>
              <div className="faq-question flex-row justify-between items-center">
                <span>{faq.q}</span>
                <svg className={`faq-chevron${openFaqIndex === i ? ' rotated' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openFaqIndex === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );

  const renderDetailView = () => {
    if (!selectedService) return null;
    const service = selectedService;

    return (
      <div className="detail-container flex-col">
        {/* Hero */}
        <div
          className="detail-hero"
          style={{ background: categoryGradient(service.category) }}
        >
          <div className="detail-hero-overlay" />
          <span className="detail-category-tag">{service.category}</span>
        </div>

        {/* Scrollable content */}
        <div className="detail-content flex-col">
          {/* Title + Description */}
          <div className="detail-section">
            <h1 className="detail-title">{service.title}</h1>
            <p className="detail-desc">{service.description}</p>
          </div>

          {/* Includes */}
          <div className="detail-section">
            <h2 className="detail-section-title">이런 것들이 포함돼요</h2>
            <ul className="checklist">
              {service.includes.map((item, i) => (
                <li key={i} className="checklist-item">
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#22c55e" />
                    <polyline points="7 12 10 15 17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="detail-section">
            <div className="flex-row items-center justify-between">
              <h2 className="detail-section-title" style={{ marginBottom: 0 }}>이렇게 진행됩니다</h2>
              <img src="/mascot-detail-explain.png" alt="" style={{ height: 64, width: 'auto' }} />
            </div>
            <div className="process-timeline">
              {service.process.map((p, i) => (
                <div key={i} className="process-step-wrap">
                  <div className="process-step flex-col">
                    <div className="process-number">{i + 1}</div>
                    <span className="process-step-name">{p.step}</span>
                    <span className="process-step-desc">{p.desc}</span>
                  </div>
                  {i < service.process.length - 1 && (
                    <div className="process-connector" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Duration & Price Range */}
          <div className="detail-section">
            <h2 className="detail-section-title">예상 범위</h2>
            <div className="detail-range-card">
              <div className="detail-range-row">
                <span className="detail-range-label">기간</span>
                <span className="detail-range-value">{service.duration}</span>
              </div>
              <div className="detail-range-divider" />
              <div className="detail-range-row">
                <span className="detail-range-label">금액</span>
                <span className="detail-range-value">{service.priceRange}</span>
              </div>
              <p className="detail-range-note">프로젝트 규모에 따라 달라질 수 있습니다</p>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        {service.portfolio && service.portfolio.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-title">관련 프로젝트</h3>
            <div className="portfolio-list">
              {service.portfolio.map((p, i) => (
                <div key={i} className="portfolio-item flex-row justify-between items-center">
                  <span className="portfolio-name">{p.title}</span>
                  <span className="portfolio-result">{p.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review */}
        {service.review && (
          <div className="detail-section">
            <h3 className="detail-section-title">고객 후기</h3>
            <div className="detail-review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{service.review.text}"</p>
              <div className="detail-review-footer flex-row justify-between items-center">
                <span className="detail-review-author">{service.review.name}</span>
                <span className="detail-review-result">{service.review.result}</span>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Bottom CTA */}
        <div className="detail-bottom-cta">
          <button
            className="detail-cta-btn"
            onClick={() => goToConsultation(service.category)}
          >
            이 서비스 상담 신청하기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderConsultationView = () => {
    if (consultationDone) {
      return (
        <div className="consultation-container flex-col">
          <div className="completion-screen flex-col">
            <img src="/mascot-celebrate.png" alt="" className="completion-icon" style={{ width: 'auto', height: 140, borderRadius: 0, background: 'none', marginBottom: 24 }} />
            <h2 className="completion-title">상담 신청이<br />완료되었습니다!</h2>
            <p className="completion-desc">담당자가 영업일 기준 1일 이내에<br />연락드립니다.</p>
            <button className="primary-btn" style={{ marginTop: '32px' }} onClick={handleBack}>홈으로 돌아가기</button>
          </div>
        </div>
      );
    }

    return (
      <div className="consultation-container flex-col">
        {/* Step progress dots */}
        <div className="step-progress flex-row">
          {[1, 2, 3].map((step) => (
            <div key={step} className="step-progress-item flex-row">
              <div className={`step-dot${consultationStep >= step ? ' active' : ''}${consultationStep === step ? ' current' : ''}`} />
              {step < 3 && <div className={`step-line${consultationStep > step ? ' active' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {consultationStep === 1 && (
          <div className="step-body flex-col">
            <img src="/mascot-listening.png" alt="" style={{ height: 72, width: 'auto', marginBottom: 8 }} />
            <h2 className="step-title">어떤 서비스에<br />관심이 있으신가요?</h2>
            <p className="step-subtitle">복수 선택 가능합니다</p>
            <div className="service-select-grid">
              {SERVICE_OPTIONS.map((service) => (
                <button
                  key={service}
                  className={`service-select-item${selectedServices.includes(service) ? ' selected' : ''}`}
                  onClick={() => toggleService(service)}
                >
                  <span className="service-select-icon">{serviceIcon(service)}</span>
                  <span className="service-select-label">{service}</span>
                </button>
              ))}
            </div>
            <button
              className={`unsure-btn${selectedServices.includes(UNSURE_OPTION) ? ' selected' : ''}`}
              onClick={handleUnsure}
            >
              잘 모르겠어요 (상담 시 안내)
            </button>
            {errors.services && <span className="field-error">{errors.services}</span>}
          </div>
        )}

        {/* Step 2 */}
        {consultationStep === 2 && (
          <div className="step-body flex-col">
            <h2 className="step-title">프로젝트 정보를<br />알려주세요</h2>
            <div className="form-group">
              <label className="form-label">예산 범위</label>
              <div className="radio-group">
                {BUDGET_OPTIONS.map((opt) => (
                  <label key={opt} className={`radio-item${formData.budget === opt ? ' selected' : ''}`}>
                    <input type="radio" name="budget" value={opt} checked={formData.budget === opt}
                      onChange={() => { setFormData((f) => ({ ...f, budget: opt })); setErrors((e) => ({ ...e, budget: undefined })); }} />
                    <span className="radio-circle" />
                    <span className="radio-label">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.budget && <span className="field-error">{errors.budget}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">희망 일정</label>
              <div className="radio-group">
                {TIMELINE_OPTIONS.map((opt) => (
                  <label key={opt} className={`radio-item${formData.timeline === opt ? ' selected' : ''}`}>
                    <input type="radio" name="timeline" value={opt} checked={formData.timeline === opt}
                      onChange={() => { setFormData((f) => ({ ...f, timeline: opt })); setErrors((e) => ({ ...e, timeline: undefined })); }} />
                    <span className="radio-circle" />
                    <span className="radio-label">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.timeline && <span className="field-error">{errors.timeline}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">프로젝트 설명 <span className="form-label-optional">(선택)</span></label>
              <textarea className="form-textarea" placeholder="프로젝트에 대해 간단히 알려주세요"
                value={formData.description} rows={4}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {consultationStep === 3 && (
          <div className="step-body flex-col">
            <h2 className="step-title">연락처를<br />입력해주세요</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="input-name">이름</label>
              <input id="input-name" type="text" className={`form-input${errors.name ? ' error' : ''}`} placeholder="홍길동"
                value={formData.name}
                onChange={(e) => { setFormData((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: undefined })); }} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-phone">연락처</label>
              <input id="input-phone" type="tel" className={`form-input${errors.phone ? ' error' : ''}`} placeholder="010-0000-0000"
                value={formData.phone}
                onChange={(e) => { setFormData((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: undefined })); }} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-email">이메일 <span className="form-label-optional">(선택)</span></label>
              <input id="input-email" type="email" className="form-input" placeholder="example@email.com"
                value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">선호 연락 방법</label>
              <div className="radio-group">
                {CONTACT_OPTIONS.map((opt) => (
                  <label key={opt} className={`radio-item${formData.contactMethod === opt ? ' selected' : ''}`}>
                    <input type="radio" name="contactMethod" value={opt} checked={formData.contactMethod === opt}
                      onChange={() => setFormData((f) => ({ ...f, contactMethod: opt }))} />
                    <span className="radio-circle" />
                    <span className="radio-label">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="step-nav flex-row">
          {consultationStep > 1 && (
            <button className="step-nav-prev" onClick={goPrevStep}>이전</button>
          )}
          <button className="step-nav-next" style={{ flex: consultationStep === 1 ? 1 : undefined }} onClick={goNextStep}>
            {consultationStep === 3 ? '상담 신청하기' : '다음'}
          </button>
        </div>
      </div>
    );
  };

  const renderCategoryView = () => {
    const catInfo = CATEGORY_DATA.find(c => c.name === selectedCategory);
    const catServices = SERVICES_DATA.filter(s => s.category === selectedCategory);
    if (!catInfo) return null;

    return (
      <div className="category-detail-container">
        {/* Hero */}
        <div className="category-hero" style={{ background: categoryGradient(selectedCategory) }}>
          <div className="category-hero-overlay" />
          <div className="category-hero-content" style={{ position: 'relative', zIndex: 1 }}>
            <span className="category-hero-tag">{catInfo.name}</span>
            <h2 className="category-hero-title">{catInfo.headline}</h2>
            <p className="category-hero-desc">{catInfo.description}</p>
          </div>
          <img src="/mascot-pointing.png" alt="" style={{ position: 'absolute', right: 12, bottom: 0, height: 110, width: 'auto', pointerEvents: 'none', zIndex: 0 }} />
        </div>

        {/* Stats */}
        <div className="category-stats flex-row">
          {catInfo.stats.map((s, i) => (
            <div key={i} className="category-stat-item flex-col">
              <span className="category-stat-value">{s.value}</span>
              <span className="category-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* What we do */}
        <div className="category-section">
          <h3 className="detail-section-title">이런 것들을 합니다</h3>
          <div className="category-highlights">
            {catInfo.highlights.map((h, i) => (
              <div key={i} className="category-highlight-item flex-row items-center">
                <span className="category-check">✓</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services in this category */}
        <div className="category-section">
          <h3 className="detail-section-title">서비스 목록</h3>
          <div className="category-service-list">
            {catServices.map(service => (
              <div key={service.id} className="category-service-card" onClick={() => handleServiceClick(service)}>
                <div className="category-service-info flex-col">
                  <span className="category-service-title">{service.title}</span>
                  <span className="category-service-desc">{service.description}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="category-cta-section">
          <button className="detail-cta-btn" style={{ width: '100%' }} onClick={() => {
            setConsultationStep(2);
            setConsultationDone(false);
            setErrors({});
            setFormData({ budget: '', timeline: '', description: '', name: '', phone: '', email: '', contactMethod: '전화' });
            setSelectedServices([selectedCategory]);
            setCurrentView('consultation');
            setActiveTab('consultation');
          }}>
            {selectedCategory} 상담 신청하기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    if (currentView === 'consultation') return renderConsultationView();
    if (currentView === 'detail') return renderDetailView();
    if (currentView === 'category') return renderCategoryView();
    return renderHomeView();
  };

  const headerTitle = () => {
    if (currentView === 'consultation') return '무료 상담 신청';
    if (currentView === 'detail') return selectedService?.title ?? '';
    return selectedCategory;
  };

  return (
    <div className="app-container">
      {/* Header varies based on view */}
      <header className="header flex-row justify-between">
        {currentView === 'home' ? (
          <>
            <div className="logo">AGENCY</div>
            <button className="icon-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
          </>
        ) : (
          <div className="flex-row items-center" style={{ gap: '12px' }}>
            <button className="icon-btn flex-row items-center" onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <span className="page-title">{headerTitle()}</span>
          </div>
        )}
      </header>

      {/* Dynamic Main Body Content */}
      {renderCurrentView()}

      {/* Floating CTA removed from home per design decision */}

      {/* Bottom Nav - visible on all views except consultation */}
      {currentView !== 'consultation' && (
        <nav className="bottom-nav flex-row justify-between">
          <button
            className={`nav-item flex-col ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setCurrentView('home'); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>홈</span>
          </button>
          <button
            className={`nav-item flex-col ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setCurrentView('home'); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            <span>서비스</span>
          </button>
          <button
            className={`nav-item flex-col ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => goToConsultation()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>상담</span>
          </button>
          <button
            className={`nav-item flex-col ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => { setActiveTab('my'); setCurrentView('home'); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>마이</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;
