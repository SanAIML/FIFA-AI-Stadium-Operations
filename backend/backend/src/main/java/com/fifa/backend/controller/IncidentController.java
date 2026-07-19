package com.fifa.backend.controller;

import com.fifa.backend.entity.Incident;
import com.fifa.backend.repository.IncidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {

    private final IncidentRepository repository;

    public IncidentController(IncidentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return repository.findAll();
    }
}