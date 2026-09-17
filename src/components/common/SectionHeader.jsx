import { Stack, Typography } from "@mui/material";

const SectionHeader = ({ eyebrow, title, description, align = "center" }) => (
  <Stack spacing={1.5} textAlign={align} alignItems={align === "center" ? "center" : "flex-start"}>
    {eyebrow && (
      <Typography
        variant="overline"
        sx={{
          letterSpacing: 6,
          color: "#6b6558",
        }}
      >
        {eyebrow}
      </Typography>
    )}
    <Typography variant="h3">{title}</Typography>
    {description && (
      <Typography color="#6b6558" maxWidth={640}>
        {description}
      </Typography>
    )}
  </Stack>
);

export default SectionHeader;


