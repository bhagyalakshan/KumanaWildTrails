package com.booking.demo.booking.service;

import java.util.List;
import java.util.Optional;
import com.booking.demo.booking.model.Package;

public interface PackageService {
    List<Package> getAllPackages();
    Optional<Package> getPackageById(Long id);
    Package savePackage(Package pkg);
    void deletePackage(Long id);
}
