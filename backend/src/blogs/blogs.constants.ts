/**
 * 블로그 피드 소스 목록
 * @description RSS 연동 대상 기술 블로그 초기 소스
 * { name: ' ', domain: ' ', feedUrl: ' ' },
 *
 */
export const BLOG_FEED_SOURCES = [
  // 네카라쿠베-당토
  { name: '네이버', domain: 'https://www.naver.com/', feedUrl: 'https://d2.naver.com/d2.atom' },
  { name: '카카오', domain: 'https://tech.kakao.com', feedUrl: 'https://tech.kakao.com/feed/' },
  { name: '카카오페이', domain: 'https://tech.kakaopay.com', feedUrl: 'https://tech.kakaopay.com/rss' },
  // { name: '카카오뱅크', domain: 'https://tech.kakaobank.com', feedUrl: 'https://tech.kakaobank.com/rss' }, - RSS 차단
  { name: '라인', domain: 'https://line.me', feedUrl: 'https://techblog.lycorp.co.jp/ko/feed/index.xml' },
  // 쿠팡 활동없음
  { name: '우아한형제들', domain: 'https://techblog.woowahan.com', feedUrl: 'https://techblog.woowahan.com/feed/' },
  { name: '당근마켓', domain: 'https://daangn.com', feedUrl: 'https://medium.com/feed/daangn' },
  { name: '토스', domain: 'https://toss.tech', feedUrl: 'https://toss.tech/rss.xml' },

  // 대기업/글로벌
  {
    name: 'AWS',
    domain: 'https://aws.amazon.com/ko/blogs/tech/feed/',
    feedUrl: 'https://aws.amazon.com/ko/blogs/tech/feed/',
  },
  { name: '삼성전자', domain: 'https://techblog.samsung.com', feedUrl: 'https://techblog.samsung.com/rss' },
  {
    name: '구글디벨로퍼스',
    domain: 'https://developers-kr.googleblog.com',
    feedUrl: 'https://developers-kr.googleblog.com/feeds/posts/default?alt=rss',
  },
  { name: 'NHN', domain: 'https://meetup.nhncloud.com', feedUrl: 'https://meetup.nhncloud.com/rss' },
  {
    name: '데보션',
    domain: 'https://devocean.sk.com',
    feedUrl: 'https://devocean.sk.com/blog/rss.do',
  },
  { name: '넷마블', domain: 'https://netmarble.engineering', feedUrl: 'https://netmarble.engineering/feed/' },
  {
    name: 'SK플래닛',
    domain: 'https://techtopic.skplanet.com/',
    feedUrl: 'https://techtopic.skplanet.com/rss.xml',
  },

  // 유통/커머스
  { name: '무신사', domain: 'https://newsroom.musinsa.com', feedUrl: 'https://techblog.musinsa.com/feed' },
  { name: '컬리', domain: 'https://helloworld.kurly.com', feedUrl: 'https://helloworld.kurly.com/feed.xml' },
  { name: '올리브영', domain: 'https://oliveyoung.tech', feedUrl: 'https://oliveyoung.tech/rss.xml' },
  { name: '11번가', domain: 'https://11st-tech.github.io/', feedUrl: 'https://11st-tech.github.io/rss' },
  { name: '지마켓', domain: 'https://gmarket.co.kr', feedUrl: 'https://dev.gmarket.com/rss' },
  { name: '29CM', domain: 'https://29cm.co.kr', feedUrl: 'https://medium.com/feed/29cm' },
  { name: '롯데ON', domain: 'https://www.lotteon.com', feedUrl: 'https://techblog.lotteon.com/feed' },
  { name: 'CJ온스타일', domain: 'https://cjonstyle.com', feedUrl: 'https://medium.com/feed/cj-onstyle' },
  { name: '다나와', domain: 'https://danawalab.github.io', feedUrl: 'https://danawalab.github.io/feed' },
  { name: '트렌비', domain: 'https://tech.trenbe.com', feedUrl: 'https://tech.trenbe.com/feed' },

  // 모빌리티/여행
  { name: '쏘카', domain: 'https://tech.socarcorp.kr', feedUrl: 'https://tech.socarcorp.kr/feed.xml' },
  { name: '마이리얼트립', domain: 'https://myrealtrip.com', feedUrl: 'https://medium.com/feed/myrealtrip-product' },
  { name: '티몬', domain: 'https://tmon.co.kr', feedUrl: 'https://rss.blog.naver.com/tmondev.xml' },
  { name: '더스윙', domain: 'https://theswing.tech', feedUrl: 'https://www.theswing.tech/rss' },
  { name: '티맵모빌리티', domain: 'https://tmapmobility.com', feedUrl: 'https://brunch.co.kr/rss/@@dsaj' },
  {
    name: '카카오모빌리티',
    domain: 'https://developers.kakaomobility.com/techblogs',
    feedUrl: 'https://developers.kakaomobility.com/techblogs.xml',
  },
  { name: '티빙', domain: 'https://nol.yanolja.com', feedUrl: 'https://medium.com/feed/tving-team' },

  // 금융/핀테크
  { name: '뱅크샐러드', domain: 'https://blog.banksalad.com', feedUrl: 'https://blog.banksalad.com/rss.xml' },
  { name: '8퍼센트', domain: 'https://8percent.github.io', feedUrl: 'https://8percent.github.io/feed.xml' },
  { name: '핀다', domain: 'https://finda.co.kr', feedUrl: 'https://medium.com/feed/finda-tech' },
  { name: '코인원', domain: 'https://coinone.co.kr', feedUrl: 'https://medium.com/feed/coinone-official' },
  { name: '쿼타랩', domain: 'https://quotabook.com', feedUrl: 'https://rss.mgmt.quotalab.com/tech.rss' },

  // 부동산/생활
  { name: '직방', domain: 'https://zigbang.com', feedUrl: 'https://medium.com/feed/zigbang' },
  { name: '요기요', domain: 'https://yogiyo.co.kr', feedUrl: 'https://techblog.yogiyo.co.kr/feed' },
  { name: '여기어때', domain: 'https://yeogi.com', feedUrl: 'https://techblog.gccompany.co.kr/feed' },
  {
    name: '펫프렌즈',
    domain: 'https://m.pet-friends.co.kr',
    feedUrl: 'https://techblog.pet-friends.co.kr/feed',
  },
  { name: '테이블링', domain: 'https://tabling.co.kr', feedUrl: 'https://medium.com/feed/tabling-tech' },

  // 카카오 계열
  {
    name: '카카오스타일',
    domain: 'https://devblog.kakaostyle.com',
    feedUrl: 'https://devblog.kakaostyle.com/ko/index.xml',
  },
  {
    name: '카카오엔터프라이즈',
    domain: 'https://tech.kakaoenterprise.com',
    feedUrl: 'https://tech.kakaoenterprise.com/rss',
  },
  { name: '카카오엔터테이먼트FE', domain: 'https://tech.kakaoent.com', feedUrl: 'https://tech.kakaoent.com/rss.xml' },

  // 네이버 계열
  { name: '네이버플레이스', domain: 'https://naver.com', feedUrl: 'https://medium.com/feed/naver-place-dev' },
  {
    name: '네이버 D&A팀',
    domain: 'https://naver-career.gitbook.io/',
    feedUrl: 'https://medium.com/feed/naver-dna-tech-blog',
  },
  {
    name: '네이버클라우드플랫폼',
    domain: 'https://ncloud.com',
    feedUrl: 'https://rss.blog.naver.com/n_cloudplatform.xml',
  },

  // 채용/HR
  { name: '원티드', domain: 'https://wanted.co.kr', feedUrl: 'https://medium.com/feed/wantedjobs' },
  { name: '사람인', domain: 'https://www.saramin.co.kr/', feedUrl: 'https://saramin.github.io/feed.xml' },

  // 클라우드/인프라
  { name: '베스핀글로벌', domain: 'https://bespinglobal.com', feedUrl: 'https://blog.bespinglobal.com/feed' },
  { name: 'NTS', domain: 'https://wit.nts-corp.com', feedUrl: 'https://wit.nts-corp.com/feed' },
  {
    name: '클라우드메이트',
    domain: 'https://ahnlabcloudmate.com',
    feedUrl: 'https://techblog.ahnlabcloudmate.com/rss/',
  },
  { name: '가비아', domain: 'https://library.gabia.com', feedUrl: 'https://library.gabia.com/feed' },
  {
    name: '농심데이터시스템',
    domain: 'https://tech.cloud.nongshim.co.kr',
    feedUrl: 'https://tech.cloud.nongshim.co.kr/feed/',
  },

  // 게임
  { name: '데브시스터즈', domain: 'https://tech.devsisters.com', feedUrl: 'https://tech.devsisters.com/rss.xml' },
  {
    name: '플라네타리움',
    domain: 'https://snack.planetarium.dev',
    feedUrl: 'https://snack.planetarium.dev/kor/index.xml',
  },

  // AI/데이터
  { name: '스캐터랩', domain: 'https://tech.scatterlab.co.kr', feedUrl: 'https://tech.scatterlab.co.kr/rss' },
  { name: '루닛', domain: 'https://lunit.io', feedUrl: 'https://medium.com/feed/lunit' },
  { name: '뤼이드', domain: 'https://riiid.co', feedUrl: 'https://medium.com/feed/@riiidtechblog' },
  { name: '마키나락스', domain: 'https://makinarocks.github.io', feedUrl: 'https://makinarocks.github.io/feed' },
  { name: '빅웨이브에이아이', domain: 'https://bigwaveai.com', feedUrl: 'https://bigwaveai.tistory.com/rss' },
  { name: '엔카닷컴 AI', domain: 'https://encar.com', feedUrl: 'https://medium.com/feed/@encar-ai' },
  { name: '하이퍼엑셀', domain: 'https://hyperaccel.ai', feedUrl: 'https://hyper-accel.github.io/index.xml' },
  { name: '이스트소프트', domain: 'https://estsoft.ai/', feedUrl: 'https://blog.est.ai/feed.xml' },

  // 커뮤니케이션/SaaS
  { name: '모두싸인', domain: 'https://modusign.co.kr/', feedUrl: 'https://team.modusign.co.kr/feed' },
  { name: 'PRND', domain: 'https://www.prnd.co.kr/ko/home', feedUrl: 'https://medium.com/feed/prnd' },
  {
    name: '하이퍼커넥트',
    domain: 'https://hyperconnect.github.io',
    feedUrl: 'https://hyperconnect.github.io/feed.xml',
  },

  // 콘텐츠/미디어
  { name: '왓챠', domain: 'https://watcha.com', feedUrl: 'https://medium.com/feed/watcha' },
  { name: '리디', domain: 'https://ridicorp.com', feedUrl: 'https://ridicorp.com/story-category/tech-blog/feed/' },
  { name: '포스타입', domain: 'https://postype.com', feedUrl: 'https://medium.com/feed/postype' },
  { name: '더핑크퐁컴퍼니', domain: 'https://pinkfong.com', feedUrl: 'https://medium.com/feed/pinkfong' },
  { name: 'ZUM', domain: 'https://zuminternet.github.io', feedUrl: 'https://zuminternet.github.io/feed.xml' },

  // 뷰티/헬스케어
  { name: '바비톡', domain: 'https://babitalk.com', feedUrl: 'https://medium.com/feed/babitalk-blog' },
  { name: '토니모리', domain: 'https://tonymoly.com', feedUrl: 'https://tonymoly-tech.medium.com/feed' },
  { name: '휴먼스케이프', domain: 'https://humanscape.io', feedUrl: 'https://medium.com/feed/humanscape-tech' },

  // 개발도구/기술
  { name: 'TOAST_UI', domain: 'https://ui.toast.com', feedUrl: 'https://ui.toast.com/rss.xml' },
  { name: '스포카', domain: 'https://spoqa.github.io', feedUrl: 'https://spoqa.github.io/atom.xml' },
  { name: '무스마', domain: 'https://musma.net', feedUrl: 'https://musma.github.io/feed' },
  { name: '비브로스', domain: 'https://boostbrothers.github.io', feedUrl: 'https://boostbrothers.github.io/rss' },
  { name: '한글과컴퓨터', domain: 'https://hancom.com', feedUrl: 'https://tech.hancom.com/feed/' },

  // 마케팅/광고
  {
    name: 'AB180',
    domain: 'https://engineering.ab180.co',
    feedUrl: 'https://raw.githubusercontent.com/ab180/engineering-blog-rss-scheduler/main/rss.xml',
  },
  { name: '뷰저블', domain: 'https://beusable.net', feedUrl: 'https://brunch.co.kr/rss/@@30Rl' },
  { name: '매드업', domain: 'https://tech.madup.com', feedUrl: 'https://tech.madup.com/feed' },
] as const;

export const BLOGS_CONFIG = {
  FETCH_CRON: '*/30 * * * *',
  FETCH_TIMEOUT_MS: 10_000,
  PAGE_SIZE: 15,
  RETENTION_DAYS: 365,
} as const;
