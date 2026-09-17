import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid2,
  Stack,
  Typography,
  Chip,
  Button,
  Breadcrumbs,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Link, useParams } from "react-router-dom";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import { fetchBlogPostBySlug } from "../api/blogPosts";
import { nx, fontHeading } from "../theme/nexusHomeTheme";
import NxCtaBanners from "../components/home/nexus/NxCtaBanners";

const slugify = (text) =>
  String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BlogPostDetailView = () => {
  const { slug } = useParams();
  const { content: home } = useHomeContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const data = await fetchBlogPostBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    })();
  }, [slug]);

  const handleWhatsApp = (message) => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: nx.gold }} />
      </Box>
    );
  }

  if (notFound || !post) {
    return (
      <Box sx={{ bgcolor: nx.cream, py: 12, textAlign: "center" }}>
        <Typography sx={{ fontFamily: fontHeading, fontSize: "1.8rem", color: nx.textOnCream, mb: 2 }}>
          Guide not found
        </Typography>
        <Button component={Link} to="/blog" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3 }}>
          Back to Blog
        </Button>
      </Box>
    );
  }

  const headingBlocks = (post.content_blocks || []).filter((b) => b.type === "heading" && b.text);
  const toc = [
    ...headingBlocks.map((b) => ({ label: b.text, anchor: slugify(b.text) })),
    ...(post.checklist_items?.length ? [{ label: "Checklist", anchor: "checklist" }] : []),
    ...(post.faqs?.length ? [{ label: "FAQ", anchor: "faq" }] : []),
  ];

  const titleParts = post.title_highlight && post.title.includes(post.title_highlight)
    ? post.title.split(post.title_highlight)
    : [post.title];

  return (
    <>
      <SEOHead
        title={`${post.title} | ${home.brand_name}`}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
      />

      {/* Hero */}
      <Box sx={{ position: "relative", bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3, "& .MuiBreadcrumbs-separator": { color: nx.textOnDarkMuted } }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", textDecoration: "none" }}>Home</Typography>
            <Typography component={Link} to="/blog" sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", textDecoration: "none" }}>Blog</Typography>
            <Typography sx={{ color: nx.gold, fontSize: "0.78rem" }}>{post.title}</Typography>
          </Breadcrumbs>

          <Grid2 container spacing={{ xs: 4, md: 5 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: post.cover_image ? 7.5 : 12 }}>
              {(post.hero_eyebrow || post.category) && (
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                  <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                    {post.hero_eyebrow || post.category}
                  </Typography>
                </Stack>
              )}
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "2.1rem", md: "2.9rem" }, lineHeight: 1.15, mb: 2 }}>
                {titleParts.length === 2 ? (
                  <>
                    {titleParts[0]}
                    <Box component="span" sx={{ color: nx.gold }}>{post.title_highlight}</Box>
                    {titleParts[1]}
                  </>
                ) : post.title}
              </Typography>
              {post.excerpt && (
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.75, maxWidth: 620, mb: 2.5 }}>
                  {post.excerpt}
                </Typography>
              )}

              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                {(post.tags || []).map((tag, i) => (
                  <Chip key={i} label={tag} size="small" sx={{ bgcolor: "rgba(245,241,230,0.08)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontWeight: 700, fontSize: "0.68rem" }} />
                ))}
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {post.primary_cta_label && (
                  post.primary_cta_url?.startsWith("#") ? (
                    <Button
                      component="a"
                      href={post.primary_cta_url}
                      sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
                    >
                      {post.primary_cta_label}
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to={post.primary_cta_url || "#"}
                      sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
                    >
                      {post.primary_cta_label}
                    </Button>
                  )
                )}
                {post.secondary_cta_label && (
                  <Button
                    onClick={() => handleWhatsApp(`Hello! I'm reading "${post.title}" and I'd like to ask a question.`)}
                    startIcon={<WhatsAppIcon />}
                    sx={{ bgcolor: nx.ink, color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
                  >
                    {post.secondary_cta_label}
                  </Button>
                )}
              </Stack>
            </Grid2>

            {post.cover_image && (
              <Grid2 size={{ xs: 12, md: 4.5 }}>
                <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 1.5 }}>
                  <Box component="img" src={post.cover_image} alt={post.title} sx={{ width: "100%", borderRadius: 2, display: "block" }} />
                </Box>
              </Grid2>
            )}
          </Grid2>

          {!!(post.quick_facts || []).length && (
            <Grid2 container spacing={0} sx={{ mt: 4, bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, overflow: "hidden" }}>
              {post.quick_facts.map((f, i) => (
                <Grid2 key={i} size={{ xs: 6, md: 12 / post.quick_facts.length }} sx={{ p: 2.2, borderLeft: i > 0 ? `1px solid ${nx.panelBorder}` : "none" }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>{f.label}</Typography>
                  <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.9rem" }}>{f.value}</Typography>
                </Grid2>
              ))}
            </Grid2>
          )}
        </Container>
      </Box>

      {/* Body */}
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 5 }}>
            {toc.length > 0 && (
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Box sx={{ position: "sticky", top: 100, bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                  <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1rem", mb: 1.5 }}>In this guide</Typography>
                  <Stack spacing={0}>
                    {toc.map((item, i) => (
                      <Box key={i} component="a" href={`#${item.anchor}`}
                        sx={{ display: "block", color: nx.textOnCreamMuted, fontSize: "0.82rem", textDecoration: "none", py: 1, borderTop: i > 0 ? "1px solid rgba(25,21,16,0.06)" : "none", "&:hover": { color: nx.gold } }}>
                        {item.label}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid2>
            )}

            <Grid2 size={{ xs: 12, md: toc.length > 0 ? 9 : 12 }}>
              <Stack spacing={3}>
                {(post.content_blocks || []).map((block, i) => {
                  if (!block.text) return null;
                  if (block.type === "heading") {
                    return (
                      <Typography key={i} id={slugify(block.text)} sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.4rem", md: "1.7rem" }, lineHeight: 1.25, pt: 1 }}>
                        {block.text}
                      </Typography>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <Box key={i} sx={{ bgcolor: nx.creamPaper, borderRadius: 2, p: 2.5, borderLeft: `3px solid ${nx.gold}` }}>
                        <Typography sx={{ color: nx.textOnCream, fontSize: "0.92rem", lineHeight: 1.8, fontStyle: "italic" }}>{block.text}</Typography>
                      </Box>
                    );
                  }
                  if (block.type === "callout") {
                    return (
                      <Box key={i} sx={{ bgcolor: nx.ink, borderRadius: 2, p: 2.5 }}>
                        <Typography sx={{ color: nx.goldLight, fontWeight: 600, fontSize: "0.92rem", lineHeight: 1.8, mb: 1 }}>{block.text}</Typography>
                        <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {home.brand_name} Insight
                        </Typography>
                      </Box>
                    );
                  }
                  if (block.type === "table") {
                    const rows = block.text.split("\n").map((r) => r.split("|").map((c) => c.trim())).filter((r) => r.length && r.some(Boolean));
                    if (!rows.length) return null;
                    const [header, ...body] = rows;
                    return (
                      <Box key={i} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${nx.panelBorder}` }}>
                        <Box sx={{ overflowX: "auto" }}>
                          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
                            <Box component="thead">
                              <Box component="tr" sx={{ bgcolor: nx.ink }}>
                                {header.map((cell, ci) => (
                                  <Box component="th" key={ci} sx={{ textAlign: "left", color: nx.gold, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.04em", textTransform: "uppercase", p: 1.4 }}>
                                    {cell}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                            <Box component="tbody">
                              {body.map((row, ri) => (
                                <Box component="tr" key={ri} sx={{ bgcolor: ri % 2 ? nx.creamPaper : "transparent" }}>
                                  {row.map((cell, ci) => (
                                    <Box component="td" key={ci} sx={{ p: 1.4, fontSize: "0.82rem", lineHeight: 1.6, color: ci === 0 ? nx.textOnCream : nx.textOnCreamMuted, fontWeight: ci === 0 ? 700 : 400, borderTop: `1px solid ${nx.panelBorder}` }}>
                                      {cell}
                                    </Box>
                                  ))}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }
                  return (
                    <Typography key={i} sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", lineHeight: 1.85 }}>
                      {block.text}
                    </Typography>
                  );
                })}

                {!!(post.benefit_cards || []).length && (
                  <Grid2 container spacing={2}>
                    {post.benefit_cards.map((card, i) => (
                      <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%" }}>
                          <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: nx.ink, color: nx.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.72rem", mb: 1.5 }}>
                            {String(i + 1).padStart(2, "0")}
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.9rem", mb: 0.5 }}>{card.title}</Typography>
                          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.6 }}>{card.description}</Typography>
                        </Box>
                      </Grid2>
                    ))}
                  </Grid2>
                )}

                {!!(post.checklist_items || []).length && (
                  <Box id="checklist">
                    <Stack spacing={1}>
                      {post.checklist_items.map((item, i) => (
                        <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                          <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.3 }} />
                          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.7 }}>{item}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                )}

                {post.disclaimer && (
                  <Box sx={{ bgcolor: "rgba(201,162,75,0.08)", border: "1px solid rgba(201,162,75,0.25)", borderRadius: 2, p: 2.2 }}>
                    <Typography sx={{ color: nx.textOnCream, fontSize: "0.82rem", lineHeight: 1.7 }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>Important: </Box>
                      {post.disclaimer}
                    </Typography>
                  </Box>
                )}

                {!!(post.gallery || []).length && (
                  <Box sx={{ pt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                      <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em" }}>PHOTO STORY</Typography>
                    </Stack>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 7 }}>
                        <GalleryImage item={post.gallery[0]} height={{ xs: 220, sm: "100%" }} minHeight={320} />
                      </Grid2>
                      {post.gallery.length > 1 && (
                        <Grid2 size={{ xs: 12, sm: 5 }}>
                          <Stack spacing={2}>
                            {post.gallery.slice(1, 3).map((g, i) => (
                              <GalleryImage key={i} item={g} height={150} />
                            ))}
                          </Stack>
                        </Grid2>
                      )}
                    </Grid2>
                  </Box>
                )}

                {!!(post.faqs || []).length && (
                  <Box id="faq" sx={{ pt: 2 }}>
                    <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.4rem", mb: 2 }}>
                      Questions buyers may ask
                    </Typography>
                    <Stack spacing={1.5}>
                      {post.faqs.map((f, i) => (
                        <Accordion key={i} disableGutters elevation={0} sx={{ bgcolor: nx.creamPaper, borderRadius: 2, "&:before": { display: "none" } }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.88rem" }}>{f.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7 }}>{f.answer}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Consultation CTA panel */}
      <Box sx={{ bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 85% 20%, rgba(201,162,75,0.1), transparent 45%)`, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em" }}>PROPERTY BUYER SUPPORT</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.5rem", md: "1.8rem" }, lineHeight: 1.25, mb: 1.5 }}>
              Planning to buy property in Hurghada or the Red Sea?
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", lineHeight: 1.7, mb: 3 }}>
              Ask {home.brand_name} for a buyer-friendly checklist covering area choice, available projects, reservation steps, viewing options, payment plans, and document questions to raise before you travel.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                onClick={() => handleWhatsApp(`Hello! I'd like a buyer checklist after reading "${post.title}".`)}
                startIcon={<WhatsAppIcon />}
                sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
              >
                WHATSAPP BUYER CHECKLIST
              </Button>
              <Button
                onClick={() => handleWhatsApp(`Hello! I'd like to speak with an advisor after reading "${post.title}".`)}
                sx={{ bgcolor: "transparent", border: `1px solid ${nx.panelBorder}`, color: nx.textOnDark, fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem" }}
              >
                CALL ADVISOR
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Useful next pages */}
      <Box sx={{ bgcolor: nx.cream, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em" }}>CONTINUE READING</Typography>
          </Stack>
          <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.5rem", md: "1.8rem" }, mb: 3 }}>
            Useful next pages for Red Sea buyers
          </Typography>
          <Grid2 container spacing={2}>
            {[
              { label: "BROWSE", title: "Buy a Home", desc: "Explore apartments, studios, villas, and beachfront homes across Hurghada and the Red Sea.", to: "/buy" },
              { label: "COMPARE", title: "Developer Projects", desc: "Request current availability, floor plans, price lists, and payment-plan details for active projects.", to: "/projects" },
              { label: "SPEAK", title: "Contact Advisor", desc: "Book a quick consultation and receive a curated Red Sea property shortlist based on your budget and goal.", to: "/contact" },
            ].map((item, i) => (
              <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
                <Box component={Link} to={item.to} sx={{ display: "block", textDecoration: "none", bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%" }}>
                  <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.08em", mb: 1 }}>{item.label}</Typography>
                  <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.05rem", mb: 1 }}>{item.title}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.6 }}>{item.desc}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      <NxCtaBanners content={home} whatsappNumber={whatsappNumber} />
    </>
  );
};

const GalleryImage = ({ item, height, minHeight }) => (
  <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", height, minHeight }}>
    <Box component="img" src={item.image} alt={item.caption || ""} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    {item.caption && (
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, bgcolor: "rgba(10,12,16,0.65)", px: 1.5, py: 0.8 }}>
        <Typography sx={{ color: "#fff", fontSize: "0.7rem" }}>{item.caption}</Typography>
      </Box>
    )}
  </Box>
);

export default BlogPostDetailView;
