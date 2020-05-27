library(tidyverse)
library(jsonlite)
library(bootstrap)
library(brms)

options(mc.cores = parallel::detectCores())
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# LOAD DATA

d <- read.csv("../data/initial_pilot2.csv") %>%
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

# CODE NAME CATEGORY

d$nameCategory <- factor(d$first %in% c("Trevon",
                                 "Tyree",
                                 "Deion",
                                 "Marquis",
                                 "Jermaine",
                                 "Lamont",
                                 "Tyrone",
                                 "Deandre",
                                 "Tremayne",
                                 "Lamar",
                                 "Kareem",
                                 "Hakeem",
                                 "Jamal",
                                 "Rasheed",
                                 "Deshawn"))

# SANITY CHECK: TRUE AND FALSE SHOULD BE EQUAL

d %>%
  filter(type != "exclusion") %>%
  group_by(nameCategory) %>%
  summarize(n = n())

levels(d$nameCategory) <- c("white", "black")

# RENAME COLUMNS

d <- d %>%
  rename(stereotype = tag,
         item = story,
         name = first)

# VISUALIZE RESPONSE BY STEREOTYPE AND NAME

byStereotypeNameCategory <- d %>%
  filter(type == "critical") %>%
  group_by(nameCategory, stereotype) %>%
  summarize(Mean = mean(response), 
            CILow =ci.low(response),
            CIHigh =ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin = Mean - CILow,
         YMax = Mean + CIHigh)

ggplot(byStereotypeNameCategory, aes(x=nameCategory, y=Mean, fill = stereotype)) +
  # facet_wrap(~kind, scales = "free") +
  theme_bw() +
  scale_fill_grey() +
  geom_bar(stat="identity",position = "dodge") +
  theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),size = 0.25,width= 0.025,position = dodge) +  
  labs(x = "Race", y = "Mean rating", fill = "Stereotype") 

# VISUALIZE RESPONSE BY NAME AND ITEM

byNameCategoryItem <- d %>%
  filter(type == "critical") %>%
  group_by(nameCategory, item, stereotype) %>%
  summarize(Mean = mean(response), 
            CILow =ci.low(response),
            CIHigh =ci.high(response)) %>%
  ungroup() %>%
  mutate(YMin = Mean - CILow,
         YMax = Mean + CIHigh)

byNameCategoryItem %>%
  # CAN BE 'evoke' or 'repress'
  filter(stereotype == "repress") %>%
  ggplot(aes(x=item, y=Mean, fill = nameCategory)) +
    theme_bw() +
    scale_fill_grey() +
    geom_bar(stat="identity",position = "dodge") +
    theme(axis.text.x=element_text(angle=90,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=YMin,ymax=YMax),size = 0.25,width= 0.025,position = dodge) +  
    labs(x = "Item", y = "Mean rating", fill = "Name") 

# MEAN CENTERING AND BRMS ANALYSIS

d$response_ctr <- scale(d$response, center = TRUE, scale = FALSE)
d$response_ctr <- d$response_ctr - mean(d$response_ctr)

d$stereotype = relevel(d$stereotype, ref = "repress")

m <- brm(
  response_ctr ~ nameCategory * stereotype + (1 + nameCategory|item) + (1 + stereotype|name) + (1 + nameCategory*stereotype|workerid), 
  data = d %>% filter(type == "critical"),
  # control = list(adapt_delta = 0.99, max_treedepth = 15),
  family = gaussian(),
  seed = 123
)

summary(m)

