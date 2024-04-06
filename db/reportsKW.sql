-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 20, 2024 at 11:28 AM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reportsKW`
--

-- --------------------------------------------------------

--
-- Table structure for table `aqiZoneSummary`
--

CREATE TABLE `aqiZoneSummary` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `aqiValue` decimal(8,3) DEFAULT NULL,
  `aqiInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `collectedTime` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestDeviceIncomingData`
--

CREATE TABLE `bumpTestDeviceIncomingData` (
  `id` int NOT NULL,
  `data` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestInfo`
--

CREATE TABLE `bumpTestInfo` (
  `id` int NOT NULL,
  `startTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `testType` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gasPercentage` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestReport`
--

CREATE TABLE `bumpTestReport` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `bumpTestID` int DEFAULT NULL,
  `testType` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deviation` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `result` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resultInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestSensorSegregatedValues`
--

CREATE TABLE `bumpTestSensorSegregatedValues` (
  `id` int NOT NULL,
  `bumpTestID` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `sensorValue` decimal(11,5) DEFAULT NULL,
  `scaledValue` decimal(11,5) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calibrationReport`
--

CREATE TABLE `calibrationReport` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `userEmail` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `calibratedDate` timestamp NULL DEFAULT NULL,
  `result` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nextCalibrationDueDate` timestamp NULL DEFAULT NULL,
  `calibrationDueDate` timestamp NULL DEFAULT NULL,
  `collectedDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensorReportData`
--

CREATE TABLE `sensorReportData` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serverUsageStatitics`
--

CREATE TABLE `serverUsageStatitics` (
  `id` int NOT NULL,
  `percMemoryUsage` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `diskUsage` varchar(256) DEFAULT NULL,
  `avgCpuLoad` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `percServerLoad` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userLogsReport`
--

CREATE TABLE `userLogsReport` (
  `id` int UNSIGNED NOT NULL,
  `userID` int DEFAULT NULL,
  `userEmail` varchar(125) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aqiZoneSummary`
--
ALTER TABLE `aqiZoneSummary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestDeviceIncomingData`
--
ALTER TABLE `bumpTestDeviceIncomingData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestInfo`
--
ALTER TABLE `bumpTestInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestReport`
--
ALTER TABLE `bumpTestReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestSensorSegregatedValues`
--
ALTER TABLE `bumpTestSensorSegregatedValues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calibrationReport`
--
ALTER TABLE `calibrationReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorReportData`
--
ALTER TABLE `sensorReportData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serverUsageStatitics`
--
ALTER TABLE `serverUsageStatitics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userLogsReport`
--
ALTER TABLE `userLogsReport`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aqiZoneSummary`
--
ALTER TABLE `aqiZoneSummary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestDeviceIncomingData`
--
ALTER TABLE `bumpTestDeviceIncomingData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestInfo`
--
ALTER TABLE `bumpTestInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestReport`
--
ALTER TABLE `bumpTestReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestSensorSegregatedValues`
--
ALTER TABLE `bumpTestSensorSegregatedValues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calibrationReport`
--
ALTER TABLE `calibrationReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensorReportData`
--
ALTER TABLE `sensorReportData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `serverUsageStatitics`
--
ALTER TABLE `serverUsageStatitics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userLogsReport`
--
ALTER TABLE `userLogsReport`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
