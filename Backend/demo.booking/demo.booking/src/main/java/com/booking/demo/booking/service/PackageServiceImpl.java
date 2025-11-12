package com.booking.demo.booking.service;

import com.booking.demo.booking.model.Package;
import com.booking.demo.booking.repository.PackageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public class PackageServiceImpl implements PackageService {

    private  PackageRepository packageRepository;
    @Override
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    @Override
    public Optional<Package> getPackageById(Long id) {
        return packageRepository.findById(id);
    }

    @Override
    public Package savePackage(Package pkg) {
        return packageRepository.save(pkg);
    }

    @Override
    public void deletePackage(Long id) {
        packageRepository.deleteById(id);

    }
}

