package com.arianewelke.checkFit.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="activity")
@Getter
@Setter
public class Activity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "dd-MM-yyy HH:mm")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "dd-MM-yyy HH:mm")
    private LocalDateTime finishTime;
    private String description;
    private int limitPeople;

    @OneToMany(mappedBy = "activity")
    private List<Checkin> checkins;

    public Activity() {
    }

    public Activity(LocalDateTime startTime, LocalDateTime finishTime, String description, int limitPeople) {
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.description = description;
        this.limitPeople = limitPeople;
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
            throw new IllegalArgumentException("finish Time must be before start Time.");
        }

        if(limitPeople < 1) {
            throw new IllegalArgumentException("limit People must be greater than 0");
        }
    }
}
