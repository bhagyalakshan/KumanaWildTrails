package com.booking.demo.booking.dto;

import java.util.List;

public class TodayStatResponse {
    private List<SafariDTO> safaris;
    private QuickStatsDTO quickStats;

    public TodayStatResponse() {}

    public TodayStatResponse(List<SafariDTO> safaris, QuickStatsDTO quickStats) {
        this.safaris = safaris;
        this.quickStats = quickStats;
    }

    public List<SafariDTO> getSafaris() {
        return safaris;
    }

    public void setSafaris(List<SafariDTO> safaris) {
        this.safaris = safaris;
    }

    public QuickStatsDTO getQuickStats() {
        return quickStats;
    }

    public void setQuickStats(QuickStatsDTO quickStats) {
        this.quickStats = quickStats;
    }
}