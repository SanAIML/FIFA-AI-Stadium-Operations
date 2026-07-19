package com.fifa.backend.controller;

import com.fifa.backend.entity.OperationalMemory;
import com.fifa.backend.repository.OperationalMemoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memory")
@CrossOrigin(origins="http://localhost:5173")
public class OperationalMemoryController {

    private final OperationalMemoryRepository repository;

    public OperationalMemoryController(OperationalMemoryRepository repository){
        this.repository=repository;
    }

    @GetMapping
    public List<OperationalMemory> getAll(){
        return repository.findAll();
    }
}