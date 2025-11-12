package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.Package;
import com.booking.demo.booking.repository.PackageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageRepository packageRepository;

    public PackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @GetMapping
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }
    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable Long id, @RequestBody Package updatedPkg) {
        updatedPkg.setPackageKey(id);
        return packageRepository.save(updatedPkg);
    }

}