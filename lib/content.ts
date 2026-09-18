/* ==========================================================================
   EDIT THIS FILE — everything guests read lives here.
   Every `L` value is a { vi, en } pair. Change text here, never in components.
   Lines marked TODO are placeholders you must replace with your real details.
   ========================================================================== */

export type Lang = "vi" | "en";
export type L = { vi: string; en: string };

/*
 * Personal fields come from env (see .env.example) so they never sit in git
 * history. Next.js only inlines `process.env.NEXT_PUBLIC_*` when written as a
 * static member access like this — a dynamic `process.env[key]` lookup is
 * invisible to its client-bundle replacement and always reads as undefined.
 */
const GRADUATE_NAME = process.env.NEXT_PUBLIC_GRADUATE_NAME?.trim() || "[YOUR_NAME]";
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER?.trim() || "[PHONE_NUMBER]";
const EMAIL_ADDRESS = process.env.NEXT_PUBLIC_EMAIL_ADDRESS?.trim() || "[EMAIL_ADDRESS]";

/* --- The facts -------------------------------------------------------- */

export const EVENT = {
  /** Set NEXT_PUBLIC_GRADUATE_NAME in .env.local — your name as printed on the pass. */
  graduateName: GRADUATE_NAME,

  /** TODO: ISO 8601 with your real timezone offset. Weekday is derived, never hardcoded. */
  startsAt: "2026-09-27T09:00:00+07:00",

  /** Duration in minutes — used for the calendar file. */
  durationMinutes: 150,

  /** TODO: the venue. `mapsQuery` is what opens in Google Maps. */
  venue: {
    name: { vi: "Hội trường C1 - Đại học Bách Khoa Hà Nội", en: "C1 Grand Hall, Hanoi University of Science and Technology" } as L,
    address: {
      vi: "Số 1 Đại Cồ Việt, P. Bạch Mai, Hà Nội",
      en: "1 Dai Co Viet, Bach Mai Ward, Hanoi",
    } as L,
    mapsQuery: "Đại học Bách khoa Hà Nội",
    /** Embed coordinates for the dark map. */
    lat: 21.0045,
    lng: 105.8435,
  },

  /** Boarding-pass field values. Keep them short — they render in mono caps. */
  pass: {
    flight: "GR-2026",
    gate: "C1",
    seat: "27A",
    from: { code: "HUST", label: { vi: "Giảng Đường", en: "Campus" } as L },
    to: { code: "LIFE", label: { vi: "Chương tiếp theo", en: "Next chapter" } as L },
    /** TODO: your degree / faculty, printed as the fare class. */
    cabin: { vi: "Cử nhân - Kỹ thuật máy tính", en: "Bachelor of Computer Engineering" } as L,
  },

  /** Set NEXT_PUBLIC_PHONE_NUMBER / NEXT_PUBLIC_EMAIL_ADDRESS in .env.local. */
  contact: {
    phone: PHONE_NUMBER,
    email: EMAIL_ADDRESS,
  },
};

/* --- Interface copy ---------------------------------------------------- */

export const UI = {
  langName: { vi: "Tiếng Việt", en: "English" } as L,
  switchLang: { vi: "Chuyển sang English", en: "Switch to Tiếng Việt" } as L,
  skipToContent: { vi: "Tới nội dung chính", en: "Skip to main content" } as L,

  swipeToBoard: { vi: "Vuốt để lên chuyến", en: "Swipe to board" } as L,
  tapToBoard: { vi: "hoặc chạm để mở thiệp", en: "or tap to open" } as L,
  boarded: { vi: "Đã lên chuyến", en: "Boarded" } as L,
  scrollOn: { vi: "Cuộn để đọc tiếp", en: "Scroll to continue" } as L,

  addToCalendar: { vi: "Lưu vào lịch", en: "Add to calendar" } as L,
  calendarTitle: { vi: "Lễ tốt nghiệp", en: "Graduation ceremony" } as L,
  calendarSaved: { vi: "Đã tải file lịch", en: "Calendar file downloaded" } as L,
  getDirections: { vi: "Chỉ đường", en: "Directions" } as L,
  mapActivate: { vi: "Bấm để dùng bản đồ", en: "Click to use the map" } as L,

  passenger: { vi: "Hành khách", en: "Passenger" } as L,
  flightNo: { vi: "Chuyến", en: "Flight" } as L,
  gate: { vi: "Cổng", en: "Gate" } as L,
  seat: { vi: "Chỗ", en: "Seat" } as L,
  boardingTime: { vi: "Khởi hành", en: "Boarding" } as L,
  date: { vi: "Ngày", en: "Date" } as L,
  cabinClass: { vi: "Hạng", en: "Class" } as L,
  honoredGuest: { vi: "KHÁCH MỜI DANH DỰ", en: "HONOURED GUEST" } as L,

  days: { vi: "Ngày", en: "Days" } as L,
  hours: { vi: "Giờ", en: "Hours" } as L,
  minutes: { vi: "Phút", en: "Mins" } as L,
  seconds: { vi: "Giây", en: "Secs" } as L,
  departed: { vi: "Chuyến bay đã cất cánh", en: "This flight has departed" } as L,
  countdownAria: {
    vi: "Thời gian còn lại đến buổi lễ",
    en: "Time remaining until the ceremony",
  } as L,
  daysLeft: { vi: "Còn {n} ngày nữa", en: "{n} days to go" } as L,
};

/* --- Sections ---------------------------------------------------------- */

export const HERO = {
  eyebrow: { vi: "Thiệp mời tốt nghiệp", en: "Graduation invitation" } as L,
  /* Tiêu đề hai tông: dòng trên trắng, dòng dưới đỏ. Giữ mỗi dòng thật ngắn. */
  headlineTop: { vi: "Một chuyến bay", en: "One flight" } as L,
  headlineBottom: { vi: "sắp cất cánh", en: "about to leave" } as L,
  invite: {
    vi: "Trân trọng mời bạn tới dự lễ tốt nghiệp của",
    en: "You are warmly invited to the graduation of",
  } as L,
  defaultGuest: { vi: "Bạn thân mến", en: "Dear friend" } as L,
};

export const DETAILS = {
  id: "chi-tiet",
  nav: { vi: "Chi tiết", en: "Details" } as L,
  title: { vi: "Thông tin chuyến bay", en: "Flight details" } as L,
  lead: {
    vi: "Bốn năm gói gọn trong một buổi sáng. Mình mong có bạn ở đó.",
    en: "Four years folded into a single morning. I would love you there.",
  } as L,
  countdownLabel: { vi: "Đếm ngược đến giờ cất cánh", en: "Counting down to departure" } as L,
  schedule: [
    {
      time: "08:30",
      title: { vi: "Mở cửa đón khách", en: "Doors open" } as L,
      note: { vi: "Nhận chỗ ngồi tại sảnh chính.", en: "Find your seat in the main hall." } as L,
    },
    {
      time: "09:00",
      title: { vi: "Lễ trao bằng", en: "Degree ceremony" } as L,
      note: { vi: "Phần trang trọng nhất của buổi sáng.", en: "The formal heart of the morning." } as L,
    },
    {
      time: "10:30",
      title: { vi: "Chụp ảnh cùng gia đình", en: "Photos with family" } as L,
      note: { vi: "Ngoài quảng trường, nếu trời đẹp.", en: "Out on the square, weather permitting." } as L,
    },
    {
      time: "11:30",
      title: { vi: "Bữa trưa thân mật", en: "Lunch together" } as L,
      note: { vi: "Địa điểm sẽ nhắn riêng cho bạn.", en: "Venue sent to you separately." } as L,
    },
  ],
  dress: {
    label: { vi: "Trang phục", en: "Dress code" } as L,
    value: { vi: "Lịch sự — tông trung tính hoặc đỏ thẫm", en: "Smart casual — neutrals or deep red" } as L,
  },
};

export const ROUTE = {
  id: "duong-den",
  nav: { vi: "Đường đến", en: "Getting there" } as L,
  title: { vi: "Đường đến cổng C1", en: "Your route to Gate C1" } as L,
  lead: {
    vi: "Khuôn viên khá rộng. Ba bước dưới đây sẽ dẫn bạn thẳng tới cửa hội trường.",
    en: "The campus is large. These three steps take you straight to the hall door.",
  } as L,
  steps: [
    {
      title: { vi: "Vào từ Cổng số 1", en: "Enter through Gate 1" } as L,
      note: {
        vi: "Mặt đường Đại Cồ Việt, có bảo vệ trực và biển chỉ dẫn.",
        en: "On Dai Co Viet street, staffed and signposted.",
      } as L,
    },
    {
      title: { vi: "Gửi xe tại bãi D3", en: "Park at lot D3" } as L,
      note: {
        vi: "Rẽ phải ngay sau cổng. Bãi rộng, miễn phí cho khách mời.",
        en: "First right after the gate. Large, free for guests.",
      } as L,
    },
    {
      title: { vi: "Đi bộ 200m tới sảnh C1", en: "Walk 200m to the C1 lobby" } as L,
      note: {
        vi: "Qua sân thư viện, toà nhà mái vòm ngay trước mặt.",
        en: "Across the library courtyard — the domed building ahead.",
      } as L,
    },
  ],
  helpLabel: { vi: "Lạc đường? Gọi mình", en: "Lost? Call me" } as L,
};

/**
 * Flip to `true` once your photos are sitting in /public/places/ with the
 * filenames listed below. Until then the grid renders sized placeholders, so
 * the layout is already final and nothing 404s.
 */
export const PHOTOS_READY = false;

export const PLACES = {
  id: "noi-chon",
  nav: { vi: "Nơi chốn", en: "Places" } as L,
  swipeHint: { vi: "Vuốt ngang để xem thêm", en: "Swipe for more" } as L,
  title: { vi: "Bốn năm đi qua chừng đó lối", en: "Four years, and these few paths" } as L,
  lead: {
    vi: "Những chỗ mình đi qua mỗi ngày mà chẳng nghĩ sẽ có ngày phải nhớ.",
    en: "Places I walked past daily, never thinking I would one day miss them.",
  } as L,
  /* TODO: swap `src` for your own photos in /public/places/. Any ratio works — the grid crops. */
  items: [
    {
      src: "/places/gate.webp",
      name: { vi: "Cổng Parabol", en: "The Parabola Gate" } as L,
      note: { vi: "Lối vào đầu tiên, năm 2022.", en: "The first way in, back in 2022." } as L,
    },
    {
      src: "/places/library.webp",
      name: { vi: "Thư viện Tạ Quang Bửu", en: "Ta Quang Buu Library" } as L,
      note: { vi: "Những đêm ôn thi sáng đèn.", en: "Every lamp-lit night before an exam." } as L,
    },
    {
      src: "/places/road.webp",
      name: { vi: "Con đường tình yêu", en: "Lovers' Lane" } as L,
      note: { vi: "Rợp bóng cây, đi mãi không chán.", en: "Shaded, and never once dull." } as L,
    },
    {
      src: "/places/lake.webp",
      name: { vi: "Hồ Tiền", en: "Tien Lake" } as L,
      note: { vi: "Chỗ ngồi kể chuyện với bạn bè.", en: "Where the long conversations happened." } as L,
    },
    {
      src: "/places/square.webp",
      name: { vi: "Quảng trường C1", en: "C1 Square" } as L,
      note: { vi: "Và là nơi mình gặp bạn hôm ấy.", en: "And where I will see you that day." } as L,
    },
  ],
};

export const JOURNEY = {
  id: "hanh-trinh",
  nav: { vi: "Hành trình", en: "Journey" } as L,
  title: { vi: "Nhật ký hành trình", en: "The flight log" } as L,
  lead: {
    vi: "Từ buổi nhập học lạ lẫm đến buổi sáng cầm tấm bằng trên tay.",
    en: "From a bewildering first week to a morning holding the degree.",
  } as L,
  /* TODO: rewrite these with what actually happened to you. */
  years: [
    {
      year: "2022",
      title: { vi: "Cất cánh", en: "Take-off" } as L,
      note: {
        vi: "Nhập trường, ở trọ lần đầu, và học cách tự xoay xở với mọi thứ.",
        en: "Moved in, rented my first room, learned to handle things alone.",
      } as L,
    },
    {
      year: "2023",
      title: { vi: "Bay ổn định", en: "Cruising" } as L,
      note: {
        vi: "Vào câu lạc bộ, thi khởi nghiệp, lần đầu tiên được đi máy bay thật.",
        en: "Joined a club, entered a startup contest, took my first real flight.",
      } as L,
    },
    {
      year: "2024",
      title: { vi: "Vùng nhiễu động", en: "Turbulence" } as L,
      note: {
        vi: "Những đêm không ngủ vì đồ án, và vài lần muốn bỏ cuộc.",
        en: "Sleepless nights over projects, and a few thoughts of quitting.",
      } as L,
    },
    {
      year: "2026",
      title: { vi: "Hạ cánh", en: "Landing" } as L,
      note: {
        vi: "Bảo vệ đồ án tốt nghiệp, khép lại quãng thời gian đẹp nhất.",
        en: "Defended my thesis, and closed the best chapter so far.",
      } as L,
    },
  ],
  /* Scrolling marquee of small moments. */
  marquee: {
    vi: [
      "Lần đầu tự nấu cơm",
      "Lần đầu thức trắng vì deadline",
      "Lần đầu đứng thuyết trình run tay",
      "Lần đầu nhận lương",
      "Lần đầu đi máy bay",
      "Lần đầu thấy tên mình trên bảng tốt nghiệp",
    ],
    en: [
      "First meal I cooked myself",
      "First all-nighter for a deadline",
      "First presentation with shaking hands",
      "First paycheque",
      "First time on a plane",
      "First time seeing my name on the graduation list",
    ],
  },
};

export const THANKS = {
  id: "loi-cam-on",
  nav: { vi: "Lời cảm ơn", en: "Thank you" } as L,
  title: { vi: "Cảm ơn", en: "Thank you" } as L,
  /* TODO: this is the part guests will remember. Make it yours. */
  body: {
    vi: [
      "Gửi bố mẹ — người chưa từng hỏi con học ngành gì có dễ xin việc không, chỉ hỏi con ăn cơm chưa.",
      "Gửi thầy cô — những người kiên nhẫn với một đứa sinh viên hay hỏi những câu chẳng liên quan.",
      "Gửi bạn bè — cảm ơn vì đã ngồi lại đủ lâu để bốn năm này có chuyện để kể.",
      "Và gửi bạn, người đang đọc tới dòng này: sự có mặt của bạn hôm ấy là món quà lớn nhất.",
    ],
    en: [
      "To my parents — who never asked whether my degree would land me a job, only whether I had eaten.",
      "To my teachers — patient with a student who asked a great many tangential questions.",
      "To my friends — thank you for staying long enough to give these four years a story.",
      "And to you, reading this far: your being there is the whole gift.",
    ],
  },
  signoff: { vi: "Hẹn gặp bạn ở cổng C1", en: "See you at Gate C1" } as L,
};

/* --- Guestbook (its own section, last in the one-page scroll flow) ----- */

export const GUESTBOOK = {
  id: "luu-but",
  linkLabel: { vi: "Viết lưu bút cho mình", en: "Sign my guestbook" } as L,
  eyebrow: { vi: "Trang lưu bút", en: "Guestbook" } as L,
  title: { vi: "Để lại vài dòng cho mình", en: "Leave a few lines for me" } as L,
  lead: {
    vi: "Một lời nhắn, một tấm ảnh — mình sẽ giữ lại tất cả sau buổi lễ.",
    en: "A message, a photo — I will keep every bit of it after the ceremony.",
  } as L,
  fields: {
    name: { vi: "Tên của bạn", en: "Your name" } as L,
    message: { vi: "Lời nhắn / cảm nghĩ", en: "Your message" } as L,
    messagePlaceholder: {
      vi: "Viết gì đó cho mình đọc lại sau này…",
      en: "Write something for me to read back later…",
    } as L,
    photo: { vi: "Ảnh & lưu niệm", en: "Photo & keepsake" } as L,
    photoHint: { vi: "Không bắt buộc — JPG/PNG, tối đa 8MB", en: "Optional — JPG/PNG, up to 8MB" } as L,
  },
  submit: { vi: "Gửi lưu bút", en: "Send" } as L,
  sending: { vi: "Đang gửi…", en: "Sending…" } as L,
  sent: { vi: "Đã nhận được lời nhắn của bạn, cảm ơn nhiều!", en: "Got your message — thank you!" } as L,
  notConfigured: {
    vi: "Nơi lưu trữ lời nhắn chưa được nối — form đã sẵn sàng, chỉ đợi bạn Huy chọn nơi gửi về.",
    en: "Storage isn't wired up yet — the form is ready, just waiting on where to send it.",
  } as L,
  turnstileMissing: {
    vi: "Thiếu Site Key của Cloudflare Turnstile — đặt NEXT_PUBLIC_TURNSTILE_SITE_KEY trong .env.local.",
    en: "Missing Cloudflare Turnstile site key — set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local.",
  } as L,
  photoTooLarge: { vi: "Ảnh vượt quá 8MB, chọn ảnh nhẹ hơn nhé.", en: "That photo is over 8MB — pick a smaller one." } as L,
};

export const SECTIONS = [DETAILS, ROUTE, PLACES, JOURNEY, THANKS, GUESTBOOK];
