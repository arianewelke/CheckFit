package com.arianewelke.checkFit.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name="activity")
public class Activity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime finishTime;
    private String description;
    private int limitPeople;

    public Activity() {
    }

    public Activity(LocalDateTime startTime, LocalDateTime finishTime, String description, int limitPeople) {
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.description = description;
        this.limitPeople = limitPeople;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(LocalDateTime finishTime) {
        this.finishTime = finishTime;
    }

    public int getLimitPeople() {
        return limitPeople;
    }

    public void setLimitPeople(int limitPeople) {
        this.limitPeople = limitPeople;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Activity activity = (Activity) o;
        return Objects.equals(id, activity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public void Validate() {
        if(description == null || description.isEmpty())
            throw new IllegalArgumentException("description is empty");


        if(this.finishTime.isBefore(this.startTime)) {
            throw new IllegalArgumentException("finishTime must be before startTime.");
        }

        if(limitPeople < 1) {
            throw new IllegalArgumentException("limitPeople must be greater than 0");
        }
    }
}
