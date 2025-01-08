#!/usr/bin/env bash
# Update package list and install Chromium and other necessary dependencies
apt-get update && apt-get install -y \
  chromium-browser \
  libatk1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpangoft2-1.0-0 \
  libgtk-3-0 \
  libnss3 \
  libxss1 \
  fonts-liberation \
  libappindicator3-1 \
  xdg-utils \
  lsof