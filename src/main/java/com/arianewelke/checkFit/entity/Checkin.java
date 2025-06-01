package com.arianewelke.checkFit.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "checkin")
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate checkinTime;

    public Checkin() {
    }

    public Checkin(LocalDate checkinTime) {
        this.checkinTime = checkinTime;

    }

    public LocalDate getCheckinTime() {
        return checkinTime;
    }

    public void setCheckinTime(LocalDate checkinTime) {
        this.checkinTime = checkinTime;
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

        Checkin checkin = (Checkin) o;
        return Objects.equals(id, checkin.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}


