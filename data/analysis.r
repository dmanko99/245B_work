library(tidyverse)
library(jsonlite)
library(bootstrap)
library(brms)

options(mc.cores = parallel::detectCores())
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# LOAD DATA

d <- read.csv("ssi-trials.csv") %>%
  filter(slide_type != "bot_check")

d$response <- as.numeric(d$response)

# DETERMINE MEAN COMPLETION TIME

mean(d$Answer.time_in_minutes)

# HELPER SCRIPTS

dodge = position_dodge(.9)

theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}

ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

# MAKE EXCLUSIONS

wrong_responses <- d %>%
  filter((tag == "exclusion_wrong" & response > 50) | (tag == "exclusion_right" && response < 50))

blacklist <- unique(wrong_responses$workerid)

d <- d %>%
  filter(!(workerid %in% blacklist))

# VISUALIZE RESPONSE BY STEREOTYPE AND NAME

byStereotypeName <- d %>%
  filter(type == "critical") %>%
  group_by(first, tag) %>%
  summarize(Mean = mean(response), 
            CILow =ci.low(response),
            CIHigh =ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin = Mean - CILow,
         YMax = Mean + CIHigh)

ggplot(byStereotypeName, aes(x=first, y=Mean, fill = tag)) +
  # facet_wrap(~kind, scales = "free") +
  theme_bw() +
  scale_fill_grey() +
  geom_bar(stat="identity",position = "dodge") +
  theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),size = 0.25,width= 0.025,position = dodge) +  
  labs(x = "Name", y = "Mean rating", fill = "Stereotype") 

# VISUALIZE RESPONSE BY NAME AND ITEM

byNameItem <- d %>%
  filter(type == "critical") %>%
  group_by(first, story) %>%
  summarize(Mean = mean(response), 
            CILow =ci.low(response),
            CIHigh =ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin = Mean - CILow,
         YMax = Mean + CIHigh)

ggplot(byNameItem, aes(x=story, y=Mean, fill = first)) +
  # facet_wrap(~kind, scales = "free") +
  theme_bw() +
  scale_fill_grey() +
  geom_bar(stat="identity",position = "dodge") +
  theme(axis.text.x=element_text(angle=90,hjust=1,vjust=1)) +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),size = 0.25,width= 0.025,position = dodge) +  
  labs(x = "Item", y = "Mean rating", fill = "Name") 

# MEAN CENTERING AND BRMS ANALYSIS

d$response_ctr <- scale(d$response, center = TRUE, scale = FALSE)
d$response_ctr <- d$response_ctr - mean(d$response_ctr)

d$first = relevel(d$first, ref = "Conner")
d$tag = relevel(d$tag, ref = "repress")

m <- brm(
  response_ctr ~ first + tag + first * tag + (1 + first|story) + (1 + (first + tag + first * tag)|workerid), 
  data = d %>% filter(type == "critical"),
  control = list(adapt_delta = 0.99, max_treedepth = 15),
  family = gaussian(),
  seed = 123
)

summary(m)

