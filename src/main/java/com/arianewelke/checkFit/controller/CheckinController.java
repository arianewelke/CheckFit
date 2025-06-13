package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.CheckinRequestDTO;
import com.arianewelke.checkFit.dto.CheckinResponseDTO;
import com.arianewelke.checkFit.dto.CheckinWithHistoryDTO;
import com.arianewelke.checkFit.entity.Checkin;
import com.arianewelke.checkFit.service.interfaces.CheckinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/checkin")
public class CheckinController {

    private final CheckinService checkinService;

    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @PostMapping
    public ResponseEntity<CheckinWithHistoryDTO> save(@RequestBody CheckinRequestDTO dto) {
        return ResponseEntity.ok().body(checkinService.save(dto));
    }


    @GetMapping
    public ResponseEntity<List<Checkin>>findAll() {
        return ResponseEntity.ok(checkinService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkin> findById(@PathVariable Long id) {
        return checkinService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Checkin> update(@PathVariable Long id, @RequestBody Checkin checkin) {
        return ResponseEntity.ok(checkinService.update(id, checkin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Checkin> delete(@PathVariable Long id) {
        checkinService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
