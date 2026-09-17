import slider1 from "../assets/images/slider_1.jpg";
import slider2 from "../assets/images/slider_2.jpg";
import slider3 from "../assets/images/slider_3.jpg";

// Hero slides with translation keys
// Use with: t(`hero.slides.${slide.id}.title`)
export const heroSlides = [
  {
    id: 1,
    titleKey: "hero.slides.1.title",
    subtitleKey: "hero.slides.1.subtitle",
    cityKey: "hero.slides.1.city",
    media: slider1,
  },
  {
    id: 2,
    titleKey: "hero.slides.2.title",
    subtitleKey: "hero.slides.2.subtitle",
    cityKey: "hero.slides.2.city",
    media: slider2,
  },
  {
    id: 3,
    titleKey: "hero.slides.3.title",
    subtitleKey: "hero.slides.3.subtitle",
    cityKey: "hero.slides.3.city",
    media: slider3,
  },
];

export const stats = [
  { id: "s1", label: "Homes curated", value: "500+" },
  { id: "s2", label: "Cities covered", value: "2" },
  { id: "s3", label: "Happy buyers", value: "7.2K" },
  { id: "s4", label: "Partner agents", value: "22" },
];

export const testimonials = [
  {
    id: "t1",
    quote:
      "They decoded our lifestyle instantly and found us a perfectly staged penthouse overlooking the Gulf.",
    author: "Yasmin Al Qassimi",
    title: "Design Director, Muse Atelier",
  },
  {
    id: "t2",
    quote:
      "Nexus Capital owns the premium experience end-to-end. Transparent, human and visionary.",
    author: "Mohamed Sharif",
    title: "VC Partner, Sama Capital",
  },
];

export const partners = [
  "Orascom Development ",
  "SOMA Bay Development",
  "Tatweer Misr",
  "Aldar",
  "Home Town Development",
  "TMG Holdings",
];
