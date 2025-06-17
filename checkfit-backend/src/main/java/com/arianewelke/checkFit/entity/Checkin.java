package com.arianewelke.checkFit.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Entity
@Table(name = "checkin")
@Getter
@Setter
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "activityId")
    @JsonManagedReference
    private Activity activity;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime checkinTime;

    public Checkin() {
    }

    public Checkin(User user, Activity activity) {
        this.user = user;
        this.activity = activity;
        this.checkinTime = LocalDateTime.now();
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


