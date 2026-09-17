import { motion } from "framer-motion";
import { Box, Stack, Container, Card, Paper, Grid2 } from "@mui/material";

// Use motion.create to automatically handle ref forwarding
export const MotionBox = motion.create(Box);
export const MotionStack = motion.create(Stack);
export const MotionContainer = motion.create(Container);
export const MotionCard = motion.create(Card);
export const MotionPaper = motion.create(Paper);
export const MotionGrid2 = motion.create(Grid2);

// Set displayName for better debugging
MotionBox.displayName = "MotionBox";
MotionStack.displayName = "MotionStack";
MotionContainer.displayName = "MotionContainer";
MotionCard.displayName = "MotionCard";
MotionPaper.displayName = "MotionPaper";
MotionGrid2.displayName = "MotionGrid2";
