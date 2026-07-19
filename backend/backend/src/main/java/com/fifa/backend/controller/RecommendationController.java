package com.fifa.backend.controller;

import com.fifa.backend.entity.Recommendation;
import com.fifa.backend.repository.RecommendationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins="http://localhost:5173")
public class RecommendationController {

    private final RecommendationRepository repository;

    public RecommendationController(RecommendationRepository repository){
        this.repository=repository;
    }

    @GetMapping
    public List<Recommendation> getAll(){
        return repository.findAll();
    }
}