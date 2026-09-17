import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useProjectsContent from "../hooks/useProjectsContent";
import NxProjectsHero from "../components/projects/nexus/NxProjectsHero";
import NxProjectsCarousel from "../components/projects/nexus/NxProjectsCarousel";
import NxProjectsBrowser from "../components/projects/nexus/NxProjectsBrowser";
import NxProjectsStrategy from "../components/projects/nexus/NxProjectsStrategy";
import NxProjectsPackage from "../components/projects/nexus/NxProjectsPackage";
import NxProjectsFaqCta from "../components/projects/nexus/NxProjectsFaqCta";

const ProjectsView = () => {
  const { content: home } = useHomeContent();
  const { content: projects } = useProjectsContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`Red Sea Development Projects | ${home.brand_name} | Hurghada & Sahl Hasheesh`}
        description={projects.hero?.subtitle}
        keywords={`${home.brand_name}, Red Sea projects, Hurghada developer projects, Sahl Hasheesh projects, Soma Bay projects, Makadi projects, off-plan property Egypt`}
        url="/projects"
      />
      <Box>
        <NxProjectsHero content={projects} whatsappNumber={whatsappNumber} />
        <NxProjectsCarousel />
        <NxProjectsBrowser content={projects} whatsappNumber={whatsappNumber} />
        <NxProjectsStrategy content={projects} />
        <NxProjectsPackage content={projects} whatsappNumber={whatsappNumber} />
        <NxProjectsFaqCta content={projects} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default ProjectsView;
